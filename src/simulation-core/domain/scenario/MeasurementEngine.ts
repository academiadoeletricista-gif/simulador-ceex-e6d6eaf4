import { DiagnosticCase } from "@/types/diagnosis";

export type MeasurementMode = 'VOLTAGE_AC' | 'VOLTAGE_DC' | 'CONTINUITY' | 'RESISTANCE';

export interface MeasurementRequest {
  instrument: string;
  mode: MeasurementMode;
  pointA: string;
  pointB?: string;
}

export class MeasurementEngine {
  static calculate(request: MeasurementRequest, currentCase: DiagnosticCase, isFaultActive: boolean): { value: string; unit: string } {
    const point = request.pointB ? `${request.pointA}-${request.pointB}` : request.pointA;
    
    // In a real physical engine, this would use CircuitSolver + Topology.
    // For PD-001 functional implementation, we use evidenceData from the case.
    
    const evidence = currentCase.evidenceData?.find(e => 
      e.type === 'measurement' && (
        e.label === point || 
        e.label.split('-').reverse().join('-') === point ||
        (point.includes('-') && e.label === point.split('-')[0]) // Fallback for single point in list
      )
    );

    if (evidence) {
      // If fault is active and we have specific evidence for this point, use it.
      // If no evidence found but it's a standard point, return nominal values.
      return { 
        value: isFaultActive ? evidence.value : this.getNominalValue(point, request.mode), 
        unit: this.getUnit(request.mode) 
      };
    }

    // Default nominal values if no specific evidence
    return { 
      value: this.getNominalValue(point, request.mode), 
      unit: this.getUnit(request.mode) 
    };
  }

  private static getNominalValue(point: string, mode: MeasurementMode): string {
    if (mode === 'VOLTAGE_AC') return '220';
    if (mode === 'CONTINUITY') return 'OK';
    return '0';
  }

  private static getUnit(mode: MeasurementMode): string {
    switch (mode) {
      case 'VOLTAGE_AC':
      case 'VOLTAGE_DC': return 'V';
      case 'RESISTANCE': return 'Ω';
      default: return '';
    }
  }
}
