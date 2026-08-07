import { useState, useCallback } from 'react';
import { SimulationPlayer } from '../simulation-core/services/SimulationPlayer';
import { SimulationState, SessionStatus } from '../simulation-core/domain/sessions/SimulationSession';
import { useSession, useUpdateSession } from './useSession';
import { DiagnosticCase } from '../types/diagnosis';

/**
 * useDiagnosis hook now consumes the SimulationPlayer service,
 * which centralizes all diagnostic session logic.
 */
export const useDiagnosis = (caseId?: string) => {
  const player = SimulationPlayer.getInstance();
  const [state, setState] = useState<SimulationState | null>(player.getPlayerState());
  
  const { data: sessionResult, isLoading: sessionLoading, error: sessionError } = useSession(caseId || '');
  const updateSessionMutation = useUpdateSession();

  const loadCase = useCallback((dbCase: DiagnosticCase) => {
    player.startSession(dbCase);
    setState(player.getPlayerState());
  }, [player]);

  const selectChoice = useCallback(async (choiceId: string, params: any = {}) => {
    player.handleAction(choiceId, params);
    const newState = player.getPlayerState();
    setState(newState);

    // Persist session to database
    if (newState && caseId && sessionResult?.success && sessionResult.data) {
      await updateSessionMutation.mutateAsync({
        id: sessionResult.data.id,
        data: {
          status: newState.status === SessionStatus.COMPLETED ? 'completed' : 'in_progress',
          answers: { 
            currentNodeId: newState.currentNodeId,
            history: newState.history,
            xp: newState.xp,
            score: newState.score
          }
        }
      });
    }
  }, [caseId, sessionResult, updateSessionMutation, player]);

  const collectEvidence = useCallback((evidenceId: string) => {
    player.collectEvidence(evidenceId);
    setState(player.getPlayerState());
  }, [player]);

  return {
    state,
    loadCase,
    selectChoice,
    collectEvidence,
    isLoading: sessionLoading,
    sessionError: sessionError ? (sessionError as any).message : (sessionResult && !sessionResult.success ? sessionResult.message : null),
    isError: (!!sessionResult && !sessionResult.success) || state?.status === SessionStatus.ERROR || !!sessionError
  };
};

