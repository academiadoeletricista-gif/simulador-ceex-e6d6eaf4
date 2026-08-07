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
  private hypotheses: Array<{ id: string; label: string; confidence: number }> = [];
  private evidence: Array<{ id: string; type: any; label: string; value: string }> = [];
  private unlockedTools: string[] = ['Visual Inspection', 'Multimeter', 'Diagram'];

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
      this.totalXP = 0;
      this.totalScore = 100;
      
      // Initialize hypotheses from case if available
      this.hypotheses = (caseData as any).possibleFaults?.map((f: any) => ({
        id: f.id,
        label: f.label,
        confidence: 0
      })) || [];

      this.addHistory('SESSION_START', 'Diagnostic procedure initiated.');
    } catch (error: any) {
      console.error(`[DiagnosisEngine] CRITICAL ERROR during case loading:`, error);
      this.status = SessionStatus.ERROR;
      this.errorMessage = error.message;
      throw error; 
    }
  }

  performAction(actionId: string, params: any = {}) {
    if (this.status === SessionStatus.COMPLETED) return;

    console.log(`[DiagnosisEngine] Executing Decision Node: ${actionId}`, params);
    
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
    if (!this.currentCase) {
        return null;
    }

    return {
      status: this.status,
      startTime: this.startTime,
      xp: this.totalXP,
      score: this.totalScore,
      error: this.errorMessage,
      history: this.history,
      case: this.currentCase,
      currentNodeId: this.currentNodeId,
      currentHypotheses: this.hypotheses,
      collectedEvidence: this.evidence,
      unlockedTools: this.unlockedTools
    };
  }
}

