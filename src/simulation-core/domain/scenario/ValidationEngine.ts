import { ScenarioState, ScenarioStatus } from "./ScenarioState";

export class ValidationEngine {
  static validateRepair(state: ScenarioState): boolean {
    const lastRepair = state.repairs[state.repairs.length - 1];
    if (!lastRepair) return false;
    
    // For PD-001, success is already determined in handleRepair
    return lastRepair.success;
  }
}
