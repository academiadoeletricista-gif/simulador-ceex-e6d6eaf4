export type CaseDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialista';
export type CaseStatus = 'draft' | 'published' | 'archived';

export interface DiagnosticCase {
  id: string;
  code: string;
  title: string;
  description: string;
  laboratoryId: string;
  difficulty: CaseDifficulty;
  estimatedTime: string;
  xpReward: number;
  
  // Scenario Data (Supabase content JSONB)
  workOrder?: {
    customer: string;
    machine: string;
    symptoms: string;
  };
  
  decisionTree?: DecisionNode[];
  possibleFaults?: Array<{
    id: string;
    label: string;
    confidence: number;
  }>;
  
  evidenceData?: Array<{
    id: string;
    type: 'visual' | 'measurement' | 'inspection' | 'document';
    label: string;
    value: string;
    impacts?: Record<string, number>; // Maps faultId -> confidence change
  }>;

  hints?: CaseHint[];
  availableTools: string[];

  
  // Metadata & Legacy
  category?: string;
  topology?: string;
  status?: CaseStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface DecisionNode {
  id: string;
  label: string;
  situation: string;
  isCompletion?: boolean;
  options: DecisionOption[];
  // New field for step-by-step guidance
  steps?: Array<{
    situation: string;
    reading?: string | null;
    correct: string;
    wrong?: [string, string][];
  }>;
  // Pedagogical content for completion nodes
  lesson?: CaseLesson;
}

export interface CaseLesson {
  technicalSummary: string;
  failureExplanation: string;
  circuitTheory: string;
  fundamentalBasis: string;
  bestPractices?: string;
  commonMistakes?: string;
  safetyWarnings?: string;
}

export interface CaseHint {
  id: string;
  text: string;
  xpPenalty: number;
  level: 1 | 2 | 3;
}

export interface DecisionOption {
  label: string;
  detail?: string;
  consequence?: string;
  nextNodeId: string;
  xpReward?: number;
  unlockedEvidenceIds?: string[];
}



