export type ScenarioStatus =
  | "READY"
  | "INVESTIGATING"
  | "DIAGNOSING"
  | "REPAIRING"
  | "VALIDATING"
  | "COMPLETED"
  | "ERROR";

export interface Symptom {
  id: string;
  label: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Observation {
  id: string;
  timestamp: string;
  text: string;
  type: 'visual' | 'auditory' | 'tactile' | 'smell';
}

export interface Hypothesis {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'CONFIRMED' | 'DISCARDED';
  isCorrect: boolean;
  isRootCause: boolean;
  validationLogic?: {
    requiredMeasurement?: string;
    expectedResult?: string;
    ifMatch: 'confirma' | 'descarta';
    ifNoMatch: 'confirma' | 'descarta';
  };
}

export interface Evidence {
  id: string;
  type: 'visual' | 'measurement' | 'inspection' | 'document';
  label: string;
  value: string;
  collectedAt: string;
}

export interface Measurement {
  id: string;
  point: string;
  value: string;
  unit: string;
  timestamp: string;
}

export interface ActionRecord {
  id: string;
  type: string;
  label: string;
  timestamp: string;
  xpReward: number;
  result?: string;
}

export interface RepairRecord {
  id: string;
  componentId: string;
  action: string;
  timestamp: string;
  success: boolean;
}

export interface DiagnosticAction {
  id: string;
  label: string;
  type: 'INSPECT' | 'MEASURE' | 'TEST' | 'REPAIR' | 'TALK';
  enabled: boolean;
}

export interface Tool {
  id: string;
  label: string;
  type: string;
}

export interface Fault {
  id: string;
  label: string;
  componentId: string;
  type: string;
}

export interface ScenarioState {
  sessionId: string;
  caseId: string;

  status: ScenarioStatus;

  currentStepId: string | null;

  symptoms: Symptom[];
  observations: Observation[];

  hypotheses: Hypothesis[];

  evidence: Evidence[];

  measurements: Measurement[];

  actions: ActionRecord[];

  repairs: RepairRecord[];

  confirmedFault: Fault | null;

  availableActions: DiagnosticAction[];
  availableTools: Tool[];

  score: number;
  xp: number;
  mistakes: number;

  startedAt: string;
  completedAt?: string;

  error?: string;
}
