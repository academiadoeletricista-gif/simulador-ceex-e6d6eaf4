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
  const [isInitializing, setIsInitializing] = useState(false);
  
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
    if (sessionResult?.success && sessionResult.data && caseId && !isInitializing) {
      console.log(`[useDiagnosis] Found session for caseId: ${caseId}. Fetching case data...`);
      setIsInitializing(true);
      caseRepository.findById(caseId).then(result => {
        if (result.success && result.data) {
          console.log(`[useDiagnosis] Auto-loading case: ${result.data.code}`);
          player.startSession(result.data);
          setState(player.getPlayerState());
        } else if (!result.success) {
          console.error(`[useDiagnosis] Failed to fetch case data for initialization:`, result.error.message);
        }
      }).catch(err => {
         console.error(`[useDiagnosis] Exception during case fetch:`, err);
      }).finally(() => {
        setIsInitializing(false);
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

  // If the engine state is already ERROR, we show it.
  const isEngineError = state?.status === SessionStatus.ERROR;
  const isSessionError = !!sessionResult && !sessionResult.success;
  
  // LOG THE ERRORS FOR DEBUGGING IN PREVIEW
  if (isEngineError || isSessionError || !!sessionError) {
    console.log("[useDiagnosis] Error Detected:", { 
      isEngineError, 
      isSessionError, 
      sessionError: sessionError ? (sessionError as any).message : null,
      sessionResultError: sessionResult && !sessionResult.success ? sessionResult.error.message : null
    });
  }

  const derivedIsError = !sessionLoading && !isInitializing && (isSessionError || isEngineError || !!sessionError);

  return {
    state: state || player.getPlayerState(), 
    loadCase,
    selectChoice,
    selectHypothesis,
    collectEvidence,
    useHint,
    isLoading: sessionLoading || isInitializing,
    sessionError: sessionError ? (sessionError as any).message : (sessionResult && !sessionResult.success ? sessionResult.error.message : null),
    isError: derivedIsError
  };
};
