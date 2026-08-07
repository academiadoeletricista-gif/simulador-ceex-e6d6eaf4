import { ScenarioState } from "./ScenarioState";

export class RepairEngine {
  static canRepair(state: ScenarioState): boolean {
    // Requires root cause confirmation
    return state.hypotheses.some(h => h.isRootCause && h.status === 'CONFIRMED');
  }
}
