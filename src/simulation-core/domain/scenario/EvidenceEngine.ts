import { Evidence } from "./ScenarioState";

export type EvidenceType = 'MEASUREMENT' | 'VISUAL' | 'AUDIBLE' | 'CONTINUITY' | 'BEHAVIOR' | 'DOCUMENT';

export interface EvidenceSource {
  actionId: string;
  componentId?: string;
  point?: string;
}

export class EvidenceEngine {
  static createEvidence(
    source: EvidenceSource, 
    type: EvidenceType, 
    label: string, 
    value: string, 
    interpretation?: string
  ): Evidence {
    return {
      id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type.toLowerCase() as any,
      label,
      value,
      collectedAt: new Date().toISOString()
    };
  }
}
