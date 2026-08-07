import { DiagnosticCase } from '@/types/diagnosis';
import { SimulationAPI } from '../api/SimulationAPI';
import { SimulationState, SessionStatus } from '../domain/sessions/SimulationSession';

/**
 * SimulationPlayer acts as the central orchestrator for a diagnostic session.
 * It coordinates between the UI (hooks), the physics engine (DiagnosisEngine), 
 * and persistent storage.
 */
export class SimulationPlayer {
  private static instance: SimulationPlayer;
  private api: SimulationAPI;
  private activeCaseId: string | null = null;
  private userId: string | null = null;

  private constructor() {
    this.api = SimulationAPI.getInstance();
  }

  public static getInstance(): SimulationPlayer {
    if (!SimulationPlayer.instance) {
      SimulationPlayer.instance = new SimulationPlayer();
    }
    return SimulationPlayer.instance;
  }

  /**
   * Initializes a new simulation session
   */
  public startSession(caseData: DiagnosticCase, userId?: string) {
    try {
      console.log(`[SimulationPlayer] Initializing session for case ${caseData.id} (${caseData.code})`);
      this.activeCaseId = caseData.id;
      this.userId = userId || null;
      
      this.api.createSession(caseData);
      
      const state = this.getPlayerState();
      if (state?.status === SessionStatus.ERROR) {
        throw new Error(state.error || 'Unknown error during simulation initialization');
      }
      
      console.log(`[SimulationPlayer] Session successfully started and in state: ${state?.status}`);
    } catch (error: any) {
      console.error(`[SimulationPlayer] FAILED to start simulation:`, error);
      // Ensure we are in ERROR state if not already set by engine
      // The API call to createSession should have already handled this through the engine
    }
  }

  /**
   * Executes a diagnostic action (measurement, inspection, repair)
   */
  public handleAction(action: string, params: any = {}) {
    if (!this.activeCaseId) {
      console.error("[SimulationPlayer] No active session to handle action");
      return;
    }

    console.log(`[SimulationPlayer] Handling action: ${action}`, params);
    this.api.executeAction(action, params);
  }

  /**
   * Collects evidence during investigation
   */
  public collectEvidence(evidenceId: string) {
    this.api.collectEvidence(evidenceId);
  }


  /**
   * Gets the current observable state of the simulation
   */
  public getPlayerState(): SimulationState | null {
    return this.api.getSessionState();
  }

  /**
   * Ends the current session and prepares final data
   */
  public finishSession() {
    const state = this.getPlayerState();
    if (state?.status === SessionStatus.COMPLETED) {
      console.log(`[SimulationPlayer] Session finished successfully. XP: ${state.xp}`);
      // Here we would trigger final persistence or achievement checks
    }
    this.activeCaseId = null;
  }
}
