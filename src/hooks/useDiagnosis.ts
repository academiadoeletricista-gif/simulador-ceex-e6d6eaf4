import { useState, useEffect, useCallback } from 'react';
import { DiagnosisEngine, DiagnosisState } from '../domains/diagnosis/engine/DiagnosisEngine';
import { DiagnosisCase, DiagnosisNode, DiagnosisChoice } from '../domains/diagnosis/domain/entities/DiagnosisCase';
import { NodeType, SessionStatus } from '../domains/diagnosis/types/enums';
import { DiagnosticCase } from '../types/diagnosis';
import { useSession, useUpdateSession } from './useSession';

export const useDiagnosis = (caseId?: string) => {
  const [engine] = useState(() => new DiagnosisEngine());
  const [state, setState] = useState<DiagnosisState>(engine.getState());
  
  const { data: sessionResult, isLoading: sessionLoading } = useSession(caseId || '');
  const updateSessionMutation = useUpdateSession();

  // Convert DiagnosticCase to domain DiagnosisCase
  const convertToDomain = useCallback((dbCase: DiagnosticCase): DiagnosisCase => {
    const nodes = new Map<string, DiagnosisNode>();
    
    // Create an initial node from the occurrence
    const initialNodeId = 'initial';
    const initialChoices: DiagnosisChoice[] = [];
    
    // If we have actions, they could be choices
    if (dbCase.actions) {
      dbCase.actions.forEach(action => {
        initialChoices.push(new DiagnosisChoice(
          action.id,
          action.name,
          `action-${action.id}`,
          action.description || undefined
        ));
      });
    }

    // Add a terminal choice if we have hypotheses
    if (dbCase.hypotheses) {
      dbCase.hypotheses.forEach(h => {
        initialChoices.push(new DiagnosisChoice(
          `hypo-${h.id}`,
          `Hipotese: ${h.title}`,
          h.isCorrect ? 'success' : 'failure',
          h.description || undefined
        ));
      });
    }

    nodes.set(initialNodeId, new DiagnosisNode(
      initialNodeId,
      NodeType.START,
      dbCase.title,
      dbCase.description || '',
      initialChoices
    ));

    // Simple success/failure nodes
    nodes.set('success', new DiagnosisNode(
      'success',
      NodeType.SUCCESS,
      'Diagnóstico Concluído',
      'Parabéns! Você identificou a falha corretamente.',
      []
    ));

    nodes.set('failure', new DiagnosisNode(
      'failure',
      NodeType.FAILURE,
      'Diagnóstico Incorreto',
      'Infelizmente sua hipótese estava incorreta. Tente novamente.',
      []
    ));

    // Dynamic action nodes
    if (dbCase.actions) {
      dbCase.actions.forEach(action => {
        nodes.set(`action-${action.id}`, new DiagnosisNode(
          `action-${action.id}`,
          NodeType.DECISION,
          action.name,
          action.realResult || 'Ação executada com sucesso.',
          [new DiagnosisChoice('back', 'Voltar para Diagnóstico', initialNodeId)]
        ));
      });
    }

    return new DiagnosisCase(
      dbCase.id,
      dbCase.title,
      nodes,
      initialNodeId
    );
  }, []);

  const loadCase = useCallback((dbCase: DiagnosticCase) => {
    const domainCase = convertToDomain(dbCase);
    engine.load(domainCase);
    
    // If session exists, resume state from 'answers'
    if (sessionResult?.success && sessionResult.data && sessionResult.data.answers) {
      const savedState = sessionResult.data.answers as any;
      if (savedState.currentNodeId) {
        // We'd need to expose a way to set state in engine
        // For now, we'll just start fresh but this is where it would go
      }
    }
    
    engine.start();
    setState(engine.getState());
  }, [engine, convertToDomain, sessionResult]);

  const selectChoice = useCallback(async (choiceId: string) => {
    engine.selectChoice(choiceId);
    const newState = engine.getState();
    setState(newState);

    // Persist session
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
  }, [engine, caseId, sessionResult, updateSessionMutation]);

  return {
    state,
    currentNode: engine.getCurrentNode(),
    choices: engine.getAvailableChoices(),
    loadCase,
    selectChoice,
    isLoading: sessionLoading
  };
};
