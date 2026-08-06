import { NodeType, ChoiceResult, CaseDifficulty, EquipmentType } from './enums';

export interface CaseId extends String {}
export interface NodeId extends String {}
export interface ChoiceId extends String {}
export interface SessionId extends String {}

export interface CaseMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  version: string;
  difficulty: CaseDifficulty;
  category: string;
  tags: string[];
  estimatedTime: number; // in minutes
  xpReward: number;
}

export interface ChoiceSchema {
  id: string;
  label: string;
  result: ChoiceResult;
  feedback?: string;
  nextNodeId: string;
  requirements?: string[];
  metadata?: Record<string, any>;
}

export interface NodeSchema {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  media?: {
    type: 'image' | 'video' | 'diagram';
    url: string;
  };
  choices: ChoiceSchema[];
  requirements?: string[];
  feedback?: string;
  metadata?: Record<string, any>;
}

export interface UniversalCaseSchema {
  metadata: CaseMetadata;
  learningObjectives: string[];
  equipment: EquipmentType[];
  prerequisites: string[];
  assets: {
    images: string[];
    diagrams: string[];
  };
  nodes: NodeSchema[];
  initialNodeId: string;
  assessmentRules: {
    minScoreToPass: number;
    maxErrorsAllowed: number;
  };
  rewards: {
    xp: number;
    achievements: string[];
  };
}
