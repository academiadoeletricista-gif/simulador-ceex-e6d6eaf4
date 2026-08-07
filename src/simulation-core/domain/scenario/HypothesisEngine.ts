import { Hypothesis } from "./ScenarioState";

export type HypothesisStatus = 'PENDING' | 'CONFIRMED' | 'DISCARDED';

export class HypothesisEngine {
  static updateHypothesis(
    hypothesis: Hypothesis,
    evidence: { point: string; value: string }
  ): Hypothesis {
    const { validationLogic } = hypothesis;
    if (!validationLogic || !validationLogic.requiredMeasurement) return hypothesis;

    // Check if the evidence point matches the hypothesis requirement
    // Support both single point and point-to-point (A-B)
    const points = validationLogic.requiredMeasurement.split('-');
    const evidencePoints = evidence.point.split('-');
    
    const isPointMatch = validationLogic.requiredMeasurement === evidence.point || 
                        (points.length === 2 && evidencePoints.length === 2 && 
                         ((points[0] === evidencePoints[0] && points[1] === evidencePoints[1]) || 
                          (points[0] === evidencePoints[1] && points[1] === evidencePoints[0])));

    if (!isPointMatch) return hypothesis;

    const isMatch = evidence.value === validationLogic.expectedResult;
    
    let newStatus: HypothesisStatus = 'PENDING';
    
    if (validationLogic.ifMatch === 'confirma') {
      newStatus = isMatch ? 'CONFIRMED' : 'DISCARDED';
    } else {
      newStatus = isMatch ? 'DISCARDED' : 'CONFIRMED';
    }

    return {
      ...hypothesis,
      status: newStatus,
      confidence: newStatus === 'CONFIRMED' ? 100 : (newStatus === 'DISCARDED' ? 0 : 50)
    } as any;
  }
}
