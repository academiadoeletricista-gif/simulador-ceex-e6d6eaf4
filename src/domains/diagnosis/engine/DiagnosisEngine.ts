import { DiagnosisCase, DiagnosisNode } from '../domain/entities/DiagnosisCase';
import { SessionStatus } from '../types/enums';

export interface DiagnosisState {
  currentNodeId: string;
  history: string[]; // sequence of choice IDs or node IDs
  status: SessionStatus;
  startTime: number;
  endTime?: number;
  score: number;
  xp: number;
}

export class DiagnosisEngine {
  private currentCase?: DiagnosisCase;
  private state: DiagnosisState;

  constructor() {
    this.state = this.createInitialState('');
  }

  private createInitialState(nodeId: string): DiagnosisState {
    return {
      currentNodeId: nodeId,
      history: [],
      status: SessionStatus.IDLE,
      startTime: Date.now(),
      score: 100,
      xp: 0
    };
  }

  load(caseData: DiagnosisCase): void {
    this.currentCase = caseData;
    this.state = this.createInitialState(caseData.initialNodeId);
  }

  start(): void {
    if (!this.currentCase) throw new Error('No case loaded');
    this.state.status = SessionStatus.IN_PROGRESS;
    this.state.startTime = Date.now();
  }

  getCurrentNode(): DiagnosisNode | undefined {
    if (!this.currentCase || !this.state.currentNodeId) return undefined;
    return this.currentCase.getNode(this.state.currentNodeId);
  }

  getAvailableChoices() {
    const node = this.getCurrentNode();
    return node ? node.choices : [];
  }

  selectChoice(choiceId: string): void {
    if (this.state.status !== SessionStatus.IN_PROGRESS) return;
    
    const node = this.getCurrentNode();
    if (!node) return;

    const choice = node.choices.find(c => c.id === choiceId);
    if (!choice) return;

    this.state.history.push(choiceId);
    this.state.currentNodeId = choice.nextNodeId;

    const nextNode = this.getCurrentNode();
    if (!nextNode || nextNode.choices.length === 0) {
      this.state.status = SessionStatus.COMPLETED;
      this.state.endTime = Date.now();
    }
  }

  getState(): DiagnosisState {
    return { ...this.state };
  }

  isFinished(): boolean {
    return this.state.status === SessionStatus.COMPLETED;
  }

  reset(): void {
    if (this.currentCase) {
      this.state = this.createInitialState(this.currentCase.initialNodeId);
    }
  }
}
