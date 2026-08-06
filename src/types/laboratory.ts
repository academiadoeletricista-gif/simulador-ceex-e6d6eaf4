import { CaseDifficulty } from "@/domains/diagnosis/types/enums";

export interface ComponentFichaTecnica {
  code: string;
  name: string;
  function: string;
  coilVoltage?: string;
  manufacturer?: string;
  model?: string;
  auxContacts?: string;
  mainContacts?: string;
  electricalSymbol?: string;
  image?: string;
  location?: string;
}

export interface MeasurementPoint {
  id: string;
  label: string;
  description?: string;
}

export interface BaseCircuit {
  electricalDiagram?: string;
  functionalDiagram?: string;
  powerDiagram?: string;
  controlDiagram?: string;
  panelLayout?: string;
  internalPanelImage?: string;
  terminalList?: string[];
  wireList?: string[];
  components?: string[];
  measurements?: string[];
}

export interface PanelView {
  frontView?: string;
  internalView?: string;
  numberedComponents?: string[];
  terminalId?: string[];
  cableId?: string[];
}

export interface Laboratory {
  id: string;
  code: string;
  name: string;
  description: string;
  learningObjectives: string[];
  prerequisites: string[];
  level: CaseDifficulty;
  estimatedTime: string;
  totalXp: number;
  defectCount: number;
  
  // Progress/Stats (for current user)
  progress: number;
  averageAccuracy: number;
  bestStreak: number;
  achievements: string[];

  // Technical Data
  baseCircuit: BaseCircuit;
  panel: PanelView;
  components: ComponentFichaTecnica[];
  measurementMap: MeasurementPoint[];
}

export interface LabDefect {
  id: string;
  labId: string;
  code: string;
  title: string;
  description: string;
  difficulty: CaseDifficulty;
  xpReward: number;
  
  // Universal Case Schema fields (future integration)
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
  assets?: any;
  checklist?: string[];
}
