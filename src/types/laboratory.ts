import { CaseDifficulty } from "@/domains/diagnosis/types/enums";
import { Asset } from "./assets";

export interface ComponentCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Component {
  id: string;
  code: string;
  tag?: string;
  name: string;
  description?: string;
  categoryId?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  function?: string;
  electricalSymbol?: string;
  imageUrl?: string;
  datasheetUrl?: string;
  manualUrl?: string;
  locationPanel?: string;
  locationDiagram?: string;
  terminals?: any;
  contacts?: any;
  voltage?: string;
  current?: string;
  power?: string;
  observations?: string;
  status: 'active' | 'inactive';
  assets?: Asset[];
}

export interface Circuit {
  id: string;
  laboratoryId: string;
  name: string;
  description?: string;
  objective?: string;
  industrialApplication?: string;
  operationalSequence?: string;
  powerDiagramUrl?: string;
  controlDiagramUrl?: string;
  functionalDiagramUrl?: string;
  terminalList?: any;
  wireList?: any;
  nominalVoltages?: any;
  technicalObservations?: string;
  relatedNorms?: string;
  bibliography?: string;
  version: string;
  status: 'active' | 'inactive';
  assets?: Asset[];
}

export interface MeasurementPoint {
  id: string;
  laboratoryId: string;
  circuitId?: string;
  code: string;
  name: string;
  description?: string;
  type?: string;
  category?: string;
  diagramCoordinates?: any;
  panelCoordinates?: any;
  expectedValue?: string;
  unit?: string;
  observations?: string;
  status: 'active' | 'inactive';
  assets?: Asset[];
}

export interface LearningResource {
  id: string;
  laboratoryId: string;
  categoryId: string;
  title: string;
  description?: string;
  type: string;
  url: string;
  metadata?: any;
  status: 'active' | 'inactive';
  asset?: Asset;
}

export interface Laboratory {
  id: string;
  code: string;
  slug: string;
  name: string;
  description: string;
  learningObjectives: string[];
  competencies: string[];
  prerequisites: string[];
  level: CaseDifficulty;
  estimatedDuration: string;
  estimatedTime: string; // compatibility with old UI
  totalXp: number;
  defectCount: number;
  componentCount: number;
  measurementPointCount: number;
  diagramCount: number;
  resourceCount: number;
  status: 'active' | 'inactive';
  version: string;
  author?: string;
  createdAt: string;
  updatedAt: string;

  // Progress/Stats (for current user)
  progress: number;
  averageAccuracy: number;
  bestStreak: number;
  achievements: string[];

  // Relationships (loaded if needed)
  baseCircuit?: Circuit;
  components?: Component[];
  measurementMap?: MeasurementPoint[];
  resources?: LearningResource[];
  assets?: Asset[];
}

export interface LabDefect {
  id: string;
  labId: string;
  code: string;
  title: string;
  description: string;
  difficulty: CaseDifficulty;
  xpReward: number;
  
  // Universal Case Schema fields
  initialState?: any;
  activeDefect?: any;
  nodes?: any[];
  transitions?: any[];
  choices?: any[];
  measurements?: any[];
  results?: any;
  hints?: string[];
  explanations?: string;
  lessonsLearned?: string[];
  scoring?: any;
  assets?: Asset[]; // Updated to use real Asset type
  checklist?: string[];
}

