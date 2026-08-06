import { useState, useEffect, useCallback } from 'react';
import { SimulationAPI } from '../simulation-core/api/SimulationAPI';
import { SimulationState, SessionStatus } from '../simulation-core/domain/sessions/SimulationSession';
import { useSession, useUpdateSession } from './useSession';
import { DiagnosticCase } from '../types/diagnosis';

export const useDiagnosis = (caseId?: string) => {
  const api = SimulationAPI.getInstance();
  const [state, setState] = useState<SimulationState>(api.getSessionState());
  
  const { data: sessionResult, isLoading: sessionLoading } = useSession(caseId || '');
  const updateSessionMutation = useUpdateSession();

  const loadCase = useCallback((dbCase: DiagnosticCase) => {
    api.createSession(dbCase);
    setState(api.getSessionState());
  }, []);

  const selectChoice = useCallback(async (choiceId: string, params: any = {}) => {
    api.executeAction(choiceId, params);
    const newState = api.getSessionState();
    setState(newState);

    // Persist session to database via repo (through hooks for now)
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
  }, [caseId, sessionResult, updateSessionMutation]);

  const answerQuiz = useCallback((optionIndex: number) => {
    api.answerQuiz(optionIndex);
    setState(api.getSessionState());
  }, []);

  return {
    state,
    loadCase,
    selectChoice,
    answerQuiz,
    measure: api.measure.bind(api),
    isLoading: sessionLoading
  };
};
