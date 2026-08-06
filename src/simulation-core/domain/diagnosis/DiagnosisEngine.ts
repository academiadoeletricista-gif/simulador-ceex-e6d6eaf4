import { CircuitSolver } from '../solver/CircuitSolver';
import { SimulationState, SessionStatus } from '../sessions/SimulationSession';
import { ElectricalComponent, SwitchComponent, ContactorComponent } from '../components/ElectricalComponent';
import { CircuitBreakerComponent, ThermalRelayComponent, MotorComponent } from '../components/IndustrialComponents';
import { QuizState, QuizQuestion } from '../quiz/QuizTypes';
import { COMPONENT_QUIZ_POOL, FAULT_QUIZ_POOL } from '../quiz/QuizPool';
import { ReportGenerator } from '../reports/ReportGenerator';
import { TechnicalReport } from '../reports/ReportTypes';
import { DiagnosticCase } from '@/types/diagnosis';
import { FaultType } from './FaultType';
import { FaultMapper } from './FaultMapper';

export { FaultType };

export class DiagnosisEngine {
  private solver: CircuitSolver;
  private components: Map<string, ElectricalComponent> = new Map();
  private history: any[] = [];
  private startTime: number = Date.now();
  private status: SessionStatus = SessionStatus.IN_PROGRESS;
  private activeFault: FaultType | null = null;
  private currentCase: DiagnosticCase | null = null;
  private currentNodeId: string = 's0';
  private errorMessage: string | null = null;
  private quizState: QuizState = {
    currentQuestion: null,
    answeredQuestions: [],
    totalPoints: 0
  };
  private report: TechnicalReport | null = null;
  private totalXP: number = 0;
  private totalScore: number = 100;

  constructor() {
    this.solver = new CircuitSolver();
  }

  loadCase(caseData: DiagnosticCase, setupFn: (solver: CircuitSolver) => void) {
    this.currentCase = caseData;
    this.currentNodeId = 's0';
    this.loadCircuit(setupFn);
    
    // Inject fault based on case components if applicable
    const faultyComp = caseData.components?.find(c => c.isFaulty);
    if (faultyComp) {
      const faultType = (FaultType as any)[faultyComp.failureDetails || ''] || FaultType.OPEN_FUSE;
      this.injectFault(faultType, faultyComp.componentTag);
    }
  }

  loadCircuit(setupFn: (solver: CircuitSolver) => void) {
    setupFn(this.solver);
    this.solver.getComponents().forEach(c => {
      this.components.set(c.id, c);
      c.updateState();
    });
    this.solver.solve();
  }

  injectFault(type: FaultType, componentId?: string) {
    this.activeFault = type;
    
    switch (type) {
      case 'OPEN_FUSE':
        const fuse = this.components.get(componentId || 'F1');
        if (fuse) fuse.failureStatus = 'OPEN';
        break;
      case 'BROKEN_COIL':
        const k1 = this.components.get(componentId || 'K1');
        if (k1) k1.failureStatus = 'BURNT_COIL';
        break;
      case 'SHORTED_COIL':
        const k1_short = this.components.get(componentId || 'K1');
        if (k1_short) k1_short.failureStatus = 'SHORTED_COIL';
        break;
      case 'OPEN_START_BUTTON':
        const s2 = this.components.get(componentId || 'S2');
        if (s2) s2.failureStatus = 'STUCK_OPEN';
        break;
      case 'OPEN_STOP_BUTTON':
        const s1 = this.components.get(componentId || 'S1');
        if (s1) s1.failureStatus = 'STUCK_OPEN';
        break;
      case 'BROKEN_AUX_CONTACT':
        const k1_aux = this.components.get(componentId || 'K1');
        if (k1_aux) k1_aux.failureStatus = 'BROKEN_AUX';
        break;
      case 'TRIPPED_RELAY':
        const f2 = this.components.get(componentId || 'F2') as ThermalRelayComponent;
        if (f2) f2.isTripped = true;
        break;
      case 'MECHANICAL_FAILURE':
        const k1_mech = this.components.get(componentId || 'K1');
        if (k1_mech) k1_mech.failureStatus = 'MECHANICAL_STUCK';
        break;
    }
    
    this.components.forEach(c => c.updateState());
    this.solver.solve();
  }

  performAction(action: string, params: any = {}) {
    if (this.status === SessionStatus.COMPLETED) return;

    let observation = "Ação executada.";

    // Handle narrative node transitions if the action matches a choice in the current node
    if (this.currentCase?.occurrence) {
      // For now, if the action is a choice label from the reference project style
      // We map these to the narrative flow
    }

    if (action === 'PRESS_START') {
      const targetId = params.id || 'S2';
      const start = this.components.get(targetId) as SwitchComponent;
      if (start) {
        start.isPressed = true;
        observation = `Botão ${targetId} pressionado.`;
      }
    } else if (action === 'RELEASE_START') {
      const targetId = params.id || 'S2';
      const start = this.components.get(targetId) as SwitchComponent;
      if (start) {
        start.isPressed = false;
        observation = `Botão ${targetId} solto.`;
      }
    } else if (action === 'TOGGLE_BREAKER') {
      const breaker = this.components.get(params.id) as CircuitBreakerComponent;
      if (breaker) {
        breaker.toggle();
        observation = `Disjuntor ${params.id} ${breaker.isClosed ? 'ligado' : 'desligado'}.`;
      }
    } else if (action === 'RESET_RELAY') {
      const relay = this.components.get('F2') as ThermalRelayComponent;
      if (relay) {
        relay.reset();
        observation = "Relé térmico resetado.";
        if (this.activeFault === FaultType.TRIPPED_RELAY) {
          this.activeFault = FaultType.NONE;
        }
      }
    } else if (action === 'REPLACE_COMPONENT') {
      const comp = this.components.get(params.id);
      if (comp) {
        comp.failureStatus = null;
        if (comp instanceof ThermalRelayComponent) comp.isTripped = false;
        
        // Clear active fault if this was the faulty component
        if (this.activeFault) {
          const faultComponentMap: Record<string, string> = {
            'F1': FaultType.OPEN_FUSE,
            'K1': FaultType.BROKEN_COIL,
            'S2': FaultType.OPEN_START_BUTTON,
            'S1': FaultType.OPEN_STOP_BUTTON,
            'F2': FaultType.TRIPPED_RELAY
          };
          if (faultComponentMap[params.id] === this.activeFault) {
            this.activeFault = FaultType.NONE;
          } else if (params.id === 'Q1' && this.activeFault === FaultType.OPEN_FUSE) {
            // Q1 is often confused with a fuse in generic repair actions, allow it if it clears the fault logic
            this.activeFault = FaultType.NONE;
          }
        }
        observation = `Componente ${params.id} substituído por um novo.`;
      }
    } else if (action === 'NEXT_STEP') {
        // Explicit narrative transition
        this.currentNodeId = params.nextId || this.currentNodeId;
    }
    
    this.components.forEach(c => c.updateState());
    this.solver.solve();
    
    // Check success: Is the contactor energized?
    const k1 = this.components.get('K1') as ContactorComponent;
    const motor = this.components.get('M1') as MotorComponent;
    const q1 = this.components.get('Q1') as CircuitBreakerComponent;
    
    // Motor state depends on KM1 power contacts having voltage
    // For DOL, if KM1 is energized and Q1 is closed, motor should run
    if (k1?.isEnergized && q1?.isClosed) {
      if (motor) motor.isRunning = true;
      // Success condition: Contactor energized AND no active fault remaining
      if (!this.activeFault || this.activeFault === FaultType.NONE) {
        // Only complete if the motor is actually running (meaning power path is OK)
        if (motor?.isRunning) {
          setTimeout(() => {
            this.generateQuiz();
            if (!this.quizState.currentQuestion) {
              this.completeSession();
            }
          }, 100);
        }
      }
    } else {
      if (motor) motor.isRunning = false;
    }

    console.log('DiagnosisEngine state update:', {
      k1_energized: k1?.isEnergized,
      q1_closed: q1?.isClosed,
      motor_running: motor?.isRunning,
      active_fault: this.activeFault
    });

    this.history.push({ 
      action, 
      params, 
      observation,
      timestamp: Date.now() 
    });
  }

  private generateQuiz(componentId?: string) {
    if (this.quizState.currentQuestion) return;

    let possibleQuestions: QuizQuestion[] = [];
    
    if (componentId && COMPONENT_QUIZ_POOL[componentId]) {
      possibleQuestions = COMPONENT_QUIZ_POOL[componentId];
    } else if (this.activeFault && FAULT_QUIZ_POOL[this.activeFault]) {
      possibleQuestions = FAULT_QUIZ_POOL[this.activeFault]!;
    }

    // Filter out already answered
    const filtered = possibleQuestions.filter(q => 
      !this.quizState.answeredQuestions.some(aq => aq.questionId === q.id)
    );

    if (filtered.length > 0) {
      this.quizState.currentQuestion = filtered[0] || null;
      this.status = SessionStatus.QUIZ_PENDING;
    }
  }

  public answerQuiz(optionIndex: number) {
    if (!this.quizState.currentQuestion) return;

    const isCorrect = this.quizState.currentQuestion.correctOptionIndex === optionIndex;
    const points = isCorrect ? this.quizState.currentQuestion.points : 0;

    this.quizState.answeredQuestions.push({
      questionId: this.quizState.currentQuestion.id,
      isCorrect,
      pointsEarned: points
    });

    this.totalXP += points;
    if (!isCorrect) this.totalScore -= 10;

    this.quizState.currentQuestion = null;
    this.status = SessionStatus.IN_PROGRESS;

    // Re-check completion
    const k1 = this.components.get('K1') as ContactorComponent;
    if (k1?.isEnergized && (!this.activeFault || this.activeFault === FaultType.NONE)) {
      this.completeSession();
    }
  }

  private completeSession() {
    this.status = SessionStatus.COMPLETED;
    this.report = ReportGenerator.generate(this.getState(), "Laboratório Industrial");
    this.totalXP += 500; // Bonus for completion
  }

  public measureVoltage(nodeId1: string, nodeId2: string): number {
    return this.solver.getVoltageBetween(nodeId1, nodeId2);
  }

  getState(): SimulationState {
    const motor = this.components.get('M1') as MotorComponent;
    return {
      history: [...this.history],
      isMotorRunning: motor?.isRunning || false,
      startTime: this.startTime,
      status: this.status,
      currentNodeId: this.currentNodeId,
      xp: this.totalXP,
      score: this.totalScore,
      quiz: {
        currentQuestion: this.quizState.currentQuestion,
        isCorrect: null
      },
      report: this.report,

      components: Array.from(this.components.values()).map(c => ({
        id: c.id,
        type: c.type,
        state: c.state,
        failure: c.failureStatus,
        isEnergized: (c as any).isEnergized || false,
        isClosed: (c as any).isClosed ?? null,
        isRunning: (c as any).isRunning ?? null,
      }))
    };
  }
}
