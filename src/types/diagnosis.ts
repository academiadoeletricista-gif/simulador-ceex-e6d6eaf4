import { Asset } from "./assets";

export type CaseDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialista';
export type CaseStatus = 'draft' | 'published' | 'archived';
export type UrgencyLevel = 'Baixa' | 'Normal' | 'Alta' | 'Crítica';
export type CriticalityLevel = 'Baixa' | 'Média' | 'Alta';
export type ActionCategory = 'measurement' | 'inspection' | 'replacement' | 'operation';
export type SymptomVisibility = 'always' | 'condition' | 'hidden';

export interface DiagnosticCase {
  id: string;
  laboratoryId: string;
  circuitId?: string;
  code: string;
  title: string;
  description?: string;
  category?: string;
  level: CaseDifficulty;
  xpReward: number;
  timeEstimate?: string;
  complexity: number;
  author?: string;
  version: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;

  // Expanded relations
  occurrence?: CaseOccurrence;
  symptoms?: CaseSymptom[];
  components?: CaseComponent[];
  measurements?: CaseMeasurement[];
  actions?: CaseAction[];
  hypotheses?: CaseHypothesis[];
  hints?: CaseHint[];
  errors?: CaseError[];
  lesson?: CaseLesson;
  assets?: Asset[];
}

export interface CaseOccurrence {
  id: string;
  caseId: string;
  title: string;
  description: string;
  operationalContext?: string;
  equipment?: string;
  location?: string;
  occurrenceDate: string;
  shift?: string;
  responsible?: string;
  history?: string;
  initialCondition?: string;
  urgency: UrgencyLevel;
  criticality: CriticalityLevel;
  operationalRisk?: string;
  operatorMessage?: string;
}

export interface CaseSymptom {
  id: string;
  caseId: string;
  code: string;
  description: string;
  category?: string;
  priority: number;
  visibility: SymptomVisibility;
  appearanceTrigger?: string;
  conditionLogic: Record<string, any>;
}

export interface CaseComponent {
  id: string;
  caseId: string;
  componentId?: string;
  componentTag: string;
  initialState: string;
  expectedState: string;
  stateAfterIntervention?: string;
  isFaulty: boolean;
  canInspect: boolean;
  canMeasure: boolean;
  canReplace: boolean;
  failureDetails?: string;
}

export interface CaseMeasurement {
  id: string;
  caseId: string;
  measurementPointId?: string;
  pointCode: string;
  expectedValue?: string;
  realValue: string;
  presentedValue?: string;
  unit?: string;
  precision?: number;
  tolerance?: number;
  displayMessage?: string;
  state?: string;
  condition?: string;
}

export interface CaseAction {
  id: string;
  caseId: string;
  name: string;
  description?: string;
  category: ActionCategory;
  timeCost: number;
  xpReward: number;
  requiredTool?: string;
  expectedResult?: string;
  realResult?: string;
  impact?: string;
}

export interface CaseHypothesis {
  id: string;
  caseId: string;
  title: string;
  description?: string;
  isCorrect: boolean;
  rootCause: boolean;
  validationLogic: Record<string, any>;
}

export interface CaseHint {
  id: string;
  caseId: string;
  level: number;
  content: string;
  explanation?: string;
  fundamentalBasis?: string;
  xpPenalty: number;
}

export interface CaseError {
  id: string;
  caseId: string;
  errorType: string;
  description: string;
  feedback: string;
  xpPenalty: number;
  penaltyExplanation?: string;
}

export interface CaseLesson {
  id: string;
  caseId: string;
  technicalSummary?: string;
  failureExplanation?: string;
  circuitTheory?: string;
  fundamentalBasis?: string;
  bestPractices?: string;
  normsRelated?: string;
  safetyWarnings?: string;
  commonMistakes?: string;
}
