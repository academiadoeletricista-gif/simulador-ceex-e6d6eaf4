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
  const [state, setState] = useState<SimulationState>(player.getPlayerState());
  
  const { data: sessionResult, isLoading: sessionLoading } = useSession(caseId || '');
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
    if (caseId && sessionResult?.success && sessionResult.data) {
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

  const answerQuiz = useCallback((optionIndex: number) => {
    player.submitQuizAnswer(optionIndex);
    setState(player.getPlayerState());
  }, [player]);

  return {
    state,
    loadCase,
    selectChoice,
    answerQuiz,
    measure: player.performMeasurement.bind(player),
    isLoading: sessionLoading,
    isError: !!sessionResult && !sessionResult.success
  };
};
