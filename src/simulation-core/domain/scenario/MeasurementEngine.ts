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
    
    console.log(`[MeasurementEngine] Calculating for point: ${point} (Fault Active: ${isFaultActive})`);

    const evidence = currentCase.evidenceData?.find(e => {
      const label = e.label.toLowerCase();
      const p = point.toLowerCase();
      return e.type === 'measurement' && (
        label === p || 
        label.split('-').reverse().join('-') === p ||
        label.includes(p) ||
        p.includes(label)
      );
    });

    if (evidence) {
      return { 
        value: isFaultActive ? evidence.value : this.getNominalValue(point, request.mode), 
        unit: this.getUnit(request.mode) 
      };
    }

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
