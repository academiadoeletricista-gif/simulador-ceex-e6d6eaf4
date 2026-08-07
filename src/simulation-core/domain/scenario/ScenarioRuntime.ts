import { DiagnosticCase } from "@/types/diagnosis";
import { 
  ScenarioState, 
  ScenarioStatus, 
  Hypothesis, 
  DiagnosticAction, 
  ActionRecord, 
  Evidence, 
  Measurement,
  RepairRecord,
  Symptom
} from "./ScenarioState";

export class ScenarioRuntime {
  private state: ScenarioState;
  private currentCase: DiagnosticCase | null = null;

  constructor(sessionId: string, caseId: string) {
    this.state = this.createInitialState(sessionId, caseId);
  }

  private createInitialState(sessionId: string, caseId: string): ScenarioState {
    return {
      sessionId,
      caseId,
      status: "READY",
      currentStepId: "start",
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
      { id: 'formulate_hypothesis', label: 'Formular Hipótese', type: 'TALK', enabled: true },
      { id: 'perform_repair', label: 'Realizar Reparo', type: 'REPAIR', enabled: false },
    ];
  }

  public loadCase(caseData: DiagnosticCase) {
    this.currentCase = caseData;
    this.state.status = "INVESTIGATING";
    
    // Load symptoms from work order
    if (caseData.workOrder) {
      this.state.symptoms = [{
        id: 'symptom_primary',
        label: 'Sintoma Reportado',
        description: caseData.workOrder.symptoms,
        severity: 'high'
      }];
    }

    // Load hypotheses from case data
    if (caseData.hypotheses) {
      this.state.hypotheses = caseData.hypotheses.map(h => ({
        id: h.id,
        title: h.title,
        description: h.description,
        status: 'PENDING',
        isCorrect: h.isCorrect,
        isRootCause: h.isRootCause,
        validationLogic: h.validationLogic
      }));
    }

    this.addActionRecord('LOAD_CASE', `Iniciando caso: ${caseData.code}`);
  }

  public performAction(actionId: string, params: any = {}) {
    const action = this.state.availableActions.find(a => a.id === actionId);
    if (!action || !action.enabled) {
      console.warn(`Action ${actionId} not available or disabled`);
      return;
    }

    this.addActionRecord(actionId, action.label, 10);

    // Context-sensitive logic
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
    }

    this.evaluateScenarioProgress();
  }

  private handleMeasurement(params: any) {
    const { point } = params;
    if (!point) return;

    // Simulate measurement result from case evidence or logic
    // For now, simple mock or lookup in evidenceData
    const evidence = this.currentCase?.evidenceData?.find(e => 
      e.type === 'measurement' && e.label.includes(point)
    );

    const measurement: Measurement = {
      id: `m_${Date.now()}`,
      point,
      value: evidence?.value || '0V',
      unit: 'V',
      timestamp: new Date().toISOString()
    };

    this.state.measurements.push(measurement);
    this.addActionRecord('MEASUREMENT', `Medição em ${point}: ${measurement.value}`);

    // Check if this measurement validates any hypothesis
    this.validateHypothesesByAction('measurement', point);
  }

  private handleRepair(params: any) {
    const { componentId } = params;
    
    // Check if root cause is confirmed
    const rootCauseConfirmed = this.state.hypotheses.some(h => h.isRootCause && h.status === 'CONFIRMED');
    
    const repair: RepairRecord = {
      id: `r_${Date.now()}`,
      componentId: componentId || 'main',
      action: 'REPAIR',
      timestamp: new Date().toISOString(),
      success: rootCauseConfirmed
    };

    this.state.repairs.push(repair);

    if (repair.success) {
      this.state.status = "VALIDATING";
      this.addActionRecord('REPAIR_SUCCESS', `Componente reparado com sucesso!`, 100);
      this.completeScenario();
    } else {
      this.state.mistakes += 1;
      this.state.score -= 20;
      this.addActionRecord('REPAIR_FAIL', `Falha no reparo: Causa raiz não confirmada.`, -50);
    }
  }

  private handleInspection(params: any) {
    // Similar to measurement but for visual things
    this.addActionRecord('INSPECTION', `Inspeção visual realizada.`);
    this.validateHypothesesByAction('inspection', params.target);
  }

  private validateHypothesesByAction(type: string, target: string) {
    this.state.hypotheses.forEach(h => {
      if (h.status !== 'PENDING') return;

      const logic = h.validationLogic;
      if (logic && logic.requiredMeasurement === target) {
        // Logic: if current state matches expected (always true for the "correct" path in this simplified version)
        // In PD-001, if we measure F1 and it's 0V, we confirm "F1 Queimado"
        h.status = logic.ifMatch === 'confirma' ? 'CONFIRMED' : 'DISCARDED';
        this.addActionRecord('HYPOTHESIS_UPDATE', `Hipótese "${h.title}" -> ${h.status}`);

        if (h.isRootCause && h.status === 'CONFIRMED') {
          // Enable repair action
          const repairAction = this.state.availableActions.find(a => a.type === 'REPAIR');
          if (repairAction) repairAction.enabled = true;
          this.state.status = "DIAGNOSING";
        }
      }
    });
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
    // State machine transitions based on history
    if (this.state.status === "INVESTIGATING" && this.state.measurements.length > 0) {
      // Potentially move to DIAGNOSING
    }
  }

  private completeScenario() {
    this.state.status = "COMPLETED";
    this.state.completedAt = new Date().toISOString();
    this.state.xp += 500; // Finish bonus
  }

  public getState(): ScenarioState {
    return { ...this.state };
  }

  public selectHypothesis(id: string) {
    // User focusing on a hypothesis
    this.addActionRecord('SELECT_HYPOTHESIS', `Focando na hipótese: ${id}`);
  }
}
