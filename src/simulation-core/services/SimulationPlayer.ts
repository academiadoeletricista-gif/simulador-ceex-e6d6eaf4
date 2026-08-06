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
    this.activeCaseId = caseData.id;
    this.userId = userId || null;
    this.api.createSession(caseData);
    
    console.log(`[SimulationPlayer] Started session for case ${caseData.id}`);
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
   * Performs a physical measurement between two nodes
   */
  public performMeasurement(node1: string, node2: string): number {
    return this.api.measure(node1, node2);
  }

  /**
   * Answers a technical quiz question
   */
  public submitQuizAnswer(optionIndex: number) {
    this.api.answerQuiz(optionIndex);
  }

  /**
   * Gets the current observable state of the simulation
   */
  public getPlayerState(): SimulationState {
    return this.api.getSessionState();
  }

  /**
   * Ends the current session and prepares final data
   */
  public finishSession() {
    const state = this.getPlayerState();
    if (state.status === SessionStatus.COMPLETED) {
      console.log(`[SimulationPlayer] Session finished successfully. XP: ${state.xp}`);
      // Here we would trigger final persistence or achievement checks
    }
    this.activeCaseId = null;
  }
}
