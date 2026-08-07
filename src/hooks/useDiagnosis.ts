import { useState, useCallback, useEffect } from 'react';
import { SimulationPlayer } from '../simulation-core/services/SimulationPlayer';
import { SimulationState, SessionStatus } from '../simulation-core/domain/sessions/SimulationSession';
import { useSession, useUpdateSession } from './useSession';
import { DiagnosticCase } from '../types/diagnosis';
import { caseRepository } from '@/repositories/CaseRepository';

export const useDiagnosis = (caseId?: string) => {
  const [ticker, setTicker] = useState(0);

  const player = SimulationPlayer.getInstance();
  const [state, setState] = useState<SimulationState | null>(player.getPlayerState());
  
  const { data: sessionResult, isLoading: sessionLoading, error: sessionError } = useSession(caseId || '');
  const updateSessionMutation = useUpdateSession();

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getLatestState = useCallback(() => {
    const newState = player.getPlayerState();
    setState(newState);
    return newState;
  }, [player]);

  const loadCase = useCallback((dbCase: DiagnosticCase) => {
    console.log(`[useDiagnosis] Manually loading case: ${dbCase.code}`);
    player.startSession(dbCase);
    setState(player.getPlayerState());
  }, [player]);

  useEffect(() => {
    if (sessionResult?.success && sessionResult.data && caseId) {
      console.log(`[useDiagnosis] Found session for caseId: ${caseId}. Fetching case data...`);
      caseRepository.findById(caseId).then(result => {
        if (result.success && result.data) {
          console.log(`[useDiagnosis] Auto-loading case: ${result.data.code}`);
          player.startSession(result.data);
          setState(player.getPlayerState());
        }
      });
    }
  }, [sessionResult, player, caseId]);

  const selectChoice = useCallback(async (choiceId: string, params: any = {}) => {
    player.handleAction(choiceId, params);
    const newState = getLatestState();
    
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
  }, [caseId, sessionResult, updateSessionMutation, player, getLatestState]);

  const collectEvidence = useCallback((evidenceId: string) => {
    player.collectEvidence(evidenceId);
    setState(player.getPlayerState());
  }, [player]);
  
  const useHint = useCallback(() => {
    player.useHint();
    setState(player.getPlayerState());
  }, [player]);

  const selectHypothesis = useCallback((hypothesisId: string) => {
    player.selectHypothesis(hypothesisId);
    setState(player.getPlayerState());
  }, [player]);

  const derivedIsError = (!!sessionResult && !sessionResult.success) || 
                         (state?.status === SessionStatus.ERROR) || 
                         !!sessionError;

  return {
    state: player.getPlayerState() || state, 
    loadCase,
    selectChoice,
    selectHypothesis,
    collectEvidence,
    useHint,
    isLoading: sessionLoading,
    sessionError: sessionError ? (sessionError as any).message : (sessionResult && !sessionResult.success ? sessionResult.error.message : null),
    isError: derivedIsError
  };
};
