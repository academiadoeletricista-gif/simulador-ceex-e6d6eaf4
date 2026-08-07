import { DiagnosticCase } from "@/types/diagnosis";
import { 
  ScenarioState, 
  ScenarioStatus, 
  DiagnosticAction, 
  ActionRecord, 
  Evidence, 
  Measurement,
  RepairRecord,
  Symptom
} from "./ScenarioState";
import { EvidenceEngine } from "./EvidenceEngine";
import { HypothesisEngine } from "./HypothesisEngine";
import { MeasurementEngine, MeasurementMode } from "./MeasurementEngine";

export class ScenarioRuntime {
  private state: ScenarioState;
  private currentCase: DiagnosticCase | null = null;
  private isFaultActive: boolean = true;

  constructor(sessionId: string, caseId: string) {
    this.state = this.createInitialState(sessionId, caseId);
  }

  private createInitialState(sessionId: string, caseId: string): ScenarioState {
    return {
      sessionId,
      caseId,
      status: "READY",
      currentStepId: "OBSERVE",
      symptoms: [],
      observations: [],
      hypotheses: [],
      evidence: [],
      measurements: [],
      actions: [],
      repairs: [],
      confirmedFault: null,
      availableActions: this.getDefaultActions(),
      availableTools: [
        { id: 'multimeter', label: 'Multímetro', type: 'measurement' },
        { id: 'flashlight', label: 'Lanterna', type: 'inspection' }
      ],
      score: 100,
      xp: 0,
      mistakes: 0,
      startedAt: new Date().toISOString(),
    };
  }

  private getDefaultActions(): DiagnosticAction[] {
    return [
      { id: 'inspect_visual', label: 'Inspeção Visual', type: 'INSPECT', enabled: true },
      { id: 'measure_voltage', label: 'Medir Tensão', type: 'MEASURE', enabled: true },
      { id: 'test_operation', label: 'Testar Operação', type: 'TEST', enabled: true },
      { id: 'perform_repair', label: 'Realizar Reparo', type: 'REPAIR', enabled: false },
    ];
  }

  public loadCase(caseData: DiagnosticCase) {
    this.currentCase = caseData;
    this.state.status = "INVESTIGATING";
    this.isFaultActive = true;
    
    if (caseData.workOrder) {
      this.state.symptoms = [{
        id: 'symptom_primary',
        label: 'Sintoma Reportado',
        description: caseData.workOrder.symptoms,
        severity: 'high'
      }];
    }

    if (caseData.hypotheses) {
      this.state.hypotheses = caseData.hypotheses.map(h => ({
        id: h.id,
        title: h.title,
        description: h.description,
        status: 'PENDING',
        isCorrect: h.isCorrect,
        isRootCause: h.isRootCause,
        validationLogic: h.validationLogic,
        confidence: 0
      } as any));
    }

    this.addActionRecord('LOAD_CASE', `Iniciando caso: ${caseData.code}`);
  }

  public performAction(actionId: string, params: any = {}) {
    if (this.state.status === 'COMPLETED' || this.state.status === 'ERROR') return;

    const action = this.state.availableActions.find(a => a.id === actionId) || 
                   (actionId === 'inspect_visual' ? { id: 'inspect_visual', label: 'Inspeção Visual', type: 'INSPECT', enabled: true } : null);
    
    if (!action) {
      console.warn(`Action ${actionId} not found`);
      return;
    }

    switch (action.type) {
      case 'MEASURE':
        this.handleMeasurement(params);
        break;
      case 'REPAIR':
        this.handleRepair(params);
        break;
      case 'INSPECT':
        this.handleInspection(params);
        break;
      case 'TEST':
        this.handleTest(params);
        break;
    }

    this.evaluateScenarioProgress();
  }

  private handleMeasurement(params: any) {
    const { pointA, pointB, mode = 'VOLTAGE_AC' } = params;
    if (!pointA) return;

    if (!this.currentCase) return;

    const result = MeasurementEngine.calculate(
      { instrument: 'multimeter', mode: mode as MeasurementMode, pointA, pointB },
      this.currentCase,
      this.isFaultActive
    );

    const pointLabel = pointB ? `${pointA}-${pointB}` : pointA;
    const measurement: Measurement = {
      id: `m_${Date.now()}`,
      point: pointLabel,
      value: result.value,
      unit: result.unit,
      timestamp: new Date().toISOString()
    };

    this.state.measurements.push(measurement);
    
    // Create evidence
    const evidence = EvidenceEngine.createEvidence(
      { actionId: 'measure_voltage', point: pointLabel },
      'MEASUREMENT',
      `Medição em ${pointLabel}`,
      `${result.value}${result.unit}`
    );
    this.state.evidence.push(evidence);

    // Update Hypotheses
    this.state.hypotheses = this.state.hypotheses.map(h => 
      HypothesisEngine.updateHypothesis(h, { point: pointLabel, value: result.value })
    );

    const confirmed = this.state.hypotheses.find(h => h.status === 'CONFIRMED');
    const desc = confirmed 
      ? `Medição em ${pointLabel}: ${result.value}${result.unit} (Confirma: ${confirmed.title})`
      : `Medição em ${pointLabel}: ${result.value}${result.unit}`;

    this.addActionRecord('MEASURE', desc, 20);

    // Check for root cause confirmation to enable repair
    const rootCauseConfirmed = this.state.hypotheses.some(h => h.isRootCause && h.status === 'CONFIRMED');
    if (rootCauseConfirmed) {
      const repairAction = this.state.availableActions.find(a => a.type === 'REPAIR');
      if (repairAction) repairAction.enabled = true;
      this.state.status = 'DIAGNOSING';
    }
  }

  private handleRepair(params: any) {
    const { componentId = 'F1' } = params; // Default for PD-001
    
    const rootCauseConfirmed = this.state.hypotheses.some(h => h.isRootCause && h.status === 'CONFIRMED');
    
    if (!rootCauseConfirmed) {
      this.state.mistakes += 1;
      this.state.score -= 20;
      this.addActionRecord('REPAIR_ERROR', `Diagnóstico Prematuro: Tente confirmar a causa raiz antes de reparar.`, -20);
      return;
    }

    // Success logic for PD-001
    const isCorrectComponent = componentId === 'F1';
    
    if (isCorrectComponent) {
      this.isFaultActive = false;
      this.state.status = 'VALIDATING';
      this.addActionRecord('REPAIR', `Componente ${componentId} substituído. Realize o teste funcional.`, 50);
      
      const repairRecord: RepairRecord = {
        id: `r_${Date.now()}`,
        componentId,
        action: 'REPLACE',
        timestamp: new Date().toISOString(),
        success: true
      };
      this.state.repairs.push(repairRecord);
    } else {
      this.state.mistakes += 1;
      this.state.score -= 50;
      this.addActionRecord('REPAIR_ERROR', `Componente incorreto: ${componentId} não é a causa raiz.`, -50);
    }
  }

  private handleInspection(params: any) {
    const target = params.target || 'Painel';
    this.addActionRecord('INSPECT', `Inspeção visual em ${target} realizada.`, 5);
  }

  private handleTest(params: any) {
    const desc = this.isFaultActive 
      ? "O motor não parte. Contator K1 não atracou." 
      : "O motor partiu normalmente. K1 atracou e M1 está girando.";
    
    this.addActionRecord('TEST', `Teste funcional: ${desc}`, 10);

    if (!this.isFaultActive && this.state.status === 'VALIDATING') {
      this.completeScenario();
    }
  }

  private addActionRecord(type: string, label: string, xp: number = 0) {
    const record: ActionRecord = {
      id: `a_${Date.now()}`,
      type,
      label,
      timestamp: new Date().toISOString(),
      xpReward: xp
    };
    this.state.actions.push(record);
    this.state.xp += xp;
  }

  private evaluateScenarioProgress() {
    // Phase transitions
    if (this.state.status === 'INVESTIGATING' && this.state.evidence.length > 2) {
      this.state.currentStepId = 'MEASURE';
    }
  }

  private completeScenario() {
    this.state.status = "COMPLETED";
    this.state.completedAt = new Date().toISOString();
    this.state.xp += 200;
  }

  public getState(): ScenarioState {
    return { ...this.state };
  }

  public selectHypothesis(id: string) {
    const h = this.state.hypotheses.find(h => h.id === id);
    if (h) {
      this.addActionRecord('SELECT_HYPOTHESIS', `Analisando hipótese: ${h.title}`);
    }
  }
}
