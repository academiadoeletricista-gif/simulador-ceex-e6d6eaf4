import { SimulationState, SessionStatus } from '../sessions/SimulationSession';
import { DiagnosticCase } from '@/types/diagnosis';

export class DiagnosisEngine {
  private startTime: number = Date.now();
  private status: SessionStatus = SessionStatus.IN_PROGRESS;
  private currentCase: DiagnosticCase | null = null;
  private currentNodeId: string = 'start';
  private errorMessage: string | null = null;
  private totalXP: number = 0;
  private totalScore: number = 100;
  private history: any[] = [];
  
  // Scenario state
  private hypotheses: Array<{ id: string; label: string; confidence: number; description?: string; status?: 'pending' | 'confirmed' | 'discarded' }> = [];
  private selectedHypothesisId: string | null = null;
  private confirmedRootCause: boolean = false;
  private evidence: Array<{ id: string; type: any; label: string; value: string }> = [];
  private measurementPoints: string[] = [];
  private unlockedTools: string[] = ['Visual Inspection', 'Multimeter', 'Diagram'];

  private activeHints: string[] = [];
  private timer: number = 0;
  private timerInterval: any = null;


  constructor() {}
 
  loadCase(caseData: DiagnosticCase) {
    try {
      console.log(`[DiagnosisEngine] Loading Scenario: ${caseData.code} - ${caseData.title}`);
      this.currentCase = caseData;
      this.currentNodeId = 'start';
      this.status = SessionStatus.IN_PROGRESS;
      this.errorMessage = null;
      this.startTime = Date.now();
      this.history = [];
      this.evidence = [];
      this.selectedHypothesisId = null;
      this.confirmedRootCause = false;
      
      this.measurementPoints = (caseData as any).topology === 'Reversing' 
        ? ['L1-L2', 'L2-L3', 'L1-L3', 'F1_in-F1_out', 'K1_1-K1_2', 'K2_1-K2_2', 'Motor_U-Motor_V']
        : ['L1-N', 'F1_in-F1_out', '95-96', 'Start-A1', 'K1_A1-K1_A2'];
 
      this.totalXP = 0;
      this.totalScore = 100;
      
      // Initialize hypotheses from case (priority to case_hypotheses table)
      this.hypotheses = caseData.hypotheses?.map((h: any) => ({
        id: h.id,
        label: h.title,
        description: h.description,
        confidence: 0,
        status: 'pending'
      })) || (caseData as any).possibleFaults?.map((f: any) => ({
        id: f.id,
        label: f.label,
        confidence: 0,
        status: 'pending'
      })) || [];
 
      this.addHistory('SESSION_START', 'Procedimento diagnóstico iniciado.');
    } catch (error: any) {
      console.error(`[DiagnosisEngine] CRITICAL ERROR during case loading:`, error);
      this.status = SessionStatus.ERROR;
      this.errorMessage = error.message;
      throw error; 
    }
  }
 
  selectHypothesis(hypothesisId: string) {
    if (this.status === SessionStatus.COMPLETED) return;
    
    this.selectedHypothesisId = hypothesisId;
    const h = this.hypotheses.find(x => x.id === hypothesisId);
    if (h) {
      this.addHistory('HYPOTHESIS_SELECTED', `Hipótese selecionada: ${h.label}`);
    }
  }
 
  performAction(actionId: string, params: any = {}) {
    if (this.status === SessionStatus.COMPLETED) return;
 
    console.log(`[DiagnosisEngine] Executing Decision Node: ${actionId}`, params);
    
    // Check if it's a repair action
    if (actionId === 'REPAIR' || actionId === 'SUBSTITUTE') {
      if (!this.confirmedRootCause) {
        this.addHistory('ERROR', 'Tentativa de reparo prematuro detectada. A causa raiz deve ser confirmada primeiro.', -50);
        this.errorMessage = "Você ainda não confirmou a causa raiz deste defeito através de medições.";
        return;
      }
      this.completeSession();
      return;
    }

    // Measurement action logic for hypotheses
    if (actionId === 'MEASURE' && this.selectedHypothesisId) {
      this.validateHypothesis(params.point);
    }

    // Find node in decision tree
    const node = (this.currentCase as any).decisionTree?.find((n: any) => n.id === actionId);
    
    if (node) {
      this.currentNodeId = node.id;
      this.addHistory('DECISION', node.label, node.xpReward || 0);
      
      if (node.isCompletion) {
        this.completeSession();
      }
    } else {
      // Fallback for generic actions
      this.addHistory('ACTION', actionId);
    }
  }

  private validateHypothesis(measurementPoint: string) {
    if (!this.currentCase || !this.selectedHypothesisId) return;

    const hypothesis = this.currentCase.hypotheses?.find(h => h.id === this.selectedHypothesisId);
    if (!hypothesis) return;

    const logic = hypothesis.validationLogic;
    if (logic && logic.requiredMeasurement === measurementPoint) {
      const hState = this.hypotheses.find(h => h.id === this.selectedHypothesisId);
      if (!hState) return;

      // Simulated measurement result based on logic
      // In a real physics engine, we'd check the actual state. 
      // Here we match the "expected" result to trigger confirmation/discard.
      const isMatch = true; // Simulating successful measurement of the expected condition
      const outcome = isMatch ? logic.ifMatch : logic.ifNoMatch;

      if (outcome === 'confirma') {
        hState.status = 'confirmed';
        hState.confidence = 100;
        if (hypothesis.isRootCause) {
          this.confirmedRootCause = true;
          this.addHistory('SUCCESS', `Causa raiz confirmada: ${hypothesis.title}`, 200);
        } else {
          this.addHistory('INFO', `Hipótese confirmada: ${hypothesis.title}`, 50);
        }
      } else {
        hState.status = 'discarded';
        hState.confidence = 0;
        this.addHistory('INFO', `Hipótese descartada: ${hypothesis.title}. ${hypothesis.description || ''}`, 20);
      }
    }
  }

  
  useHint() {
    if (!this.currentCase || this.status === SessionStatus.COMPLETED) return;
    
    const allHints: any[] = (this.currentCase as any).hints || [];
    const availableHints = allHints.filter(h => !this.activeHints.includes(h.text));
    
    if (availableHints.length > 0) {
      // Get the next hint by level
      const nextHint = availableHints.sort((a, b) => a.level - b.level)[0];
      this.activeHints.push(nextHint.text);
      this.addHistory('HINT_USED', `Dica Nível ${nextHint.level} utilizada`, -(nextHint.xpPenalty || 0));
    }
  }

  collectEvidence(evidenceId: string) {

    const evidenceData = (this.currentCase as any).evidenceData?.find((e: any) => e.id === evidenceId);
    if (evidenceData && !this.evidence.find(e => e.id === evidenceId)) {
      this.evidence.push({
        id: evidenceData.id,
        type: evidenceData.type,
        label: evidenceData.label,
        value: evidenceData.value
      });
      
      this.addHistory('EVIDENCE_COLLECTED', `New evidence found: ${evidenceData.label}`);
      this.updateHypotheses(evidenceData);
    }
  }

  private updateHypotheses(evidence: any) {
    if (evidence.impacts) {
      this.hypotheses = this.hypotheses.map(h => {
        const impact = evidence.impacts[h.id] || 0;
        return {
          ...h,
          confidence: Math.min(100, Math.max(0, h.confidence + impact))
        };
      });
    }
  }

  private addHistory(type: string, description: string, points: number = 0) {
    this.history.push({
      type,
      description,
      timestamp: Date.now(),
      points
    });
    this.totalXP += points;
  }

  private completeSession() {
    this.status = SessionStatus.COMPLETED;
    this.totalXP += 500; // Bonus
  }

  getState(): SimulationState | null {
    if (!this.currentCase && this.status !== SessionStatus.ERROR) {
        return null;
    }

    return {
      status: this.status,
      startTime: this.startTime,
      xp: this.totalXP,
      score: this.totalScore,
      error: this.errorMessage,
      history: this.history,
      case: this.currentCase!,
      currentNodeId: this.currentNodeId,
      selectedHypothesisId: this.selectedHypothesisId,
      confirmedRootCause: this.confirmedRootCause,
      currentHypotheses: this.hypotheses,
      collectedEvidence: this.evidence,
      unlockedTools: this.unlockedTools,
      activeHints: this.activeHints,
      measurementPoints: this.measurementPoints,
      timer: Math.floor((Date.now() - this.startTime) / 1000)
    };


  }
}

