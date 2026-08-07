import { Asset } from "./assets";
import { FaultType } from "@/simulation-core/domain/diagnosis/FaultType";

export type CaseDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialista';
export type CaseStatus = 'draft' | 'published' | 'archived';

export interface DiagnosticCase {
  id: string;
  code: string;
  title: string;
  description: string;
  laboratoryId: string;
  topology: 'DOL' | 'REVERSING' | 'STAR_DELTA';
  difficulty: CaseDifficulty;
  estimatedTime: string;
  xpReward: number;
  objective: string;
  
  // Electrical Core
  circuit: {
    baseVoltage: number;
    nodes: Array<{ id: string; voltage: number; connections: string[] }>;
  };
  
  components: CaseComponent[];
  
  fault: {
    type: FaultType;
    componentTag: string;
    description: string;
  };
  
  initialState: Record<string, any>;
  expectedMeasurements: Array<{ point: string; value: number }>;
  
  // Tools & Actions
  availableTools: string[];
  repairActions: Array<{
    id: string;
    label: string;
    type: 'REPLACE' | 'RESET' | 'CLEAN' | 'ADJUST';
    targetTag: string;
    clearsFault: boolean;
  }>;
  
  completionCriteria: {
    faultRemoved: boolean;
    motorRunning: boolean;
    allMeasurementsCorrect?: boolean;
  };

  // Legacy/UI Compatibility
  category?: string;
  status?: CaseStatus;
  createdAt?: string;
  updatedAt?: string;
  symptoms?: Array<{ id: string; description: string }>;
}

export interface CaseComponent {
  id: string;
  tag: string;
  type: 'CONTACTOR' | 'BREAKER' | 'RELAY' | 'FUSE' | 'MOTOR' | 'BUTTON' | 'TIMER';
  label: string;
  isFaulty: boolean;
  failureDetails?: string;
}

