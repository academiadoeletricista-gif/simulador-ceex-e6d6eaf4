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
      NodeType.STORY,
      dbCase.title,
      dbCase.description || '',
      initialChoices
    ));

    // Simple success/failure nodes
    nodes.set('success', new DiagnosisNode(
      'success',
      NodeType.RESULT,
      'Diagnóstico Concluído',
      'Parabéns! Você identificou a falha corretamente.',
      []
    ));

    nodes.set('failure', new DiagnosisNode(
      'failure',
      NodeType.RESULT,
      'Diagnóstico Incorreto',
      'Infelizmente sua hipótese estava incorreta. Tente novamente.',
      []
    ));

    // Dynamic action nodes
    if (dbCase.actions) {
      dbCase.actions.forEach(action => {
        nodes.set(`action-${action.id}`, new DiagnosisNode(
          `action-${action.id}`,
          NodeType.ACTION,
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
    
    // If session exists, resume state
    if (sessionResult?.success && sessionResult.data) {
      // In a real scenario, we'd have the engine state in the DB
      // For now, we'll just start it
    }
    
    engine.start();
    setState(engine.getState());
  }, [engine, convertToDomain, sessionResult]);

  const selectChoice = useCallback(async (choiceId: string) => {
    engine.selectChoice(choiceId);
    const newState = engine.getState();
    setState(newState);

    // Persist session
    if (caseId) {
      await updateSessionMutation.mutateAsync({
        case_id: caseId,
        status: newState.status as any,
        xp_earned: newState.xp,
        metadata: { 
          currentNodeId: newState.currentNodeId,
          history: newState.history
        }
      });
    }
  }, [engine, caseId, updateSessionMutation]);

  return {
    state,
    currentNode: engine.getCurrentNode(),
    choices: engine.getAvailableChoices(),
    loadCase,
    selectChoice,
    isLoading: sessionLoading
  };
};
