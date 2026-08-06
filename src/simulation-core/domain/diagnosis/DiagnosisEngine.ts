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
    try {
      console.log(`[DiagnosisEngine] Loading case: ${caseData.code} - ${caseData.title}`);
      this.currentCase = caseData;
      this.currentNodeId = 's0';
      this.status = SessionStatus.IN_PROGRESS;
      this.errorMessage = null;

      this.loadCircuit(setupFn);
      console.log(`[DiagnosisEngine] Circuit initialized with ${this.components.size} components`);
      
      // Inject fault based on case components if applicable
      // First check for components[] array from newer schema
      let faultyComp = caseData.components?.find(c => c.isFaulty);
      
      // Fallback: If no components array, check title/description/content for implicit faults
      // (This helps bridge the gap with simpler seeded data)
      let failureDetails = faultyComp?.failureDetails;
      let componentTag = faultyComp?.componentTag;
      
      if (!failureDetails) {
        const titleUpper = caseData.title.toUpperCase();
        if (titleUpper.includes('FALHA NO SELO')) {
          failureDetails = 'BROKEN_AUX_CONTACT';
          componentTag = 'K1';
        } else if (titleUpper.includes('RELÉ TÉRMICO')) {
          failureDetails = 'TRIPPED_RELAY';
          componentTag = 'F2';
        } else if (titleUpper.includes('MOTOR NÃO LIGA')) {
          failureDetails = 'OPEN_FUSE';
          componentTag = 'F1';
        } else if (titleUpper.includes('CONTATOR NÃO ATRACA')) {
          failureDetails = 'BROKEN_COIL';
          componentTag = 'K1';
        } else if (titleUpper.includes('REVERSÃO')) {
          failureDetails = 'BROKEN_AUX_CONTACT';
          componentTag = 'K2';
        }
      }

      if (failureDetails) {
        console.log(`[DiagnosisEngine] Fault detected: ${failureDetails} for component ${componentTag || 'default'}`);
        
        // Use FaultMapper for normalization and validation
        const faultType = FaultMapper.map(failureDetails);
        console.log(`[DiagnosisEngine] Normalized fault: ${faultType}`);

        // Set default tags if missing
        const finalTag = componentTag || (faultType === FaultType.TRIPPED_RELAY ? 'F2' : (faultType === FaultType.OPEN_FUSE ? 'F1' : 'K1'));

        // Validate component exists in initialized circuit
        if (!this.components.has(finalTag)) {
          console.warn(`[DiagnosisEngine] Component "${finalTag}" not found in current circuit topology. Attempting fallback.`);
          // Try to find ANY component of the same type if the specific tag failed
          const fallback = Array.from(this.components.values()).find(c => {
             if (faultType === FaultType.TRIPPED_RELAY) return c instanceof ThermalRelayComponent;
             if (faultType === FaultType.OPEN_FUSE) return c instanceof CircuitBreakerComponent;
             if (faultType === FaultType.BROKEN_COIL) return c instanceof ContactorComponent;
             return false;
          });
          if (fallback) {
            console.log(`[DiagnosisEngine] Found fallback component: ${fallback.id}`);
            this.injectFault(faultType, fallback.id);
          } else {
            throw new Error(`Component "${finalTag}" not found in circuit topology and no fallback found.`);
          }
        } else {
          this.injectFault(faultType, finalTag);
        }
      } else {
        console.log('[DiagnosisEngine] No fault identified from case data');
      }
    } catch (error: any) {
      console.error(`[DiagnosisEngine] CRITICAL ERROR during case loading:`, error);
      this.status = SessionStatus.ERROR;
      this.errorMessage = error.message;
      throw error; 
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
    console.log(`[DiagnosisEngine] Injecting fault ${type} into ${componentId || 'default component'}`);
    this.activeFault = type;
    
    const targetId = componentId;
    
    switch (type) {
      case FaultType.OPEN_FUSE: {
        const fuse = this.components.get(targetId || 'F1') || this.components.get('Q1');
        if (fuse) {
          fuse.failureStatus = 'OPEN';
          console.log(`[DiagnosisEngine] FUSE ${fuse.id} set to OPEN`);
        } else {
          throw new Error(`Fault injection failed: FUSE component ${targetId || 'F1'} not found.`);
        }
        break;
      }
      case FaultType.BROKEN_COIL: {
        const k1 = this.components.get(targetId || 'K1');
        if (k1) {
          k1.failureStatus = 'BURNT_COIL';
          console.log(`[DiagnosisEngine] COIL ${k1.id} set to BURNT_COIL`);
        } else {
          throw new Error(`Fault injection failed: COIL component ${targetId || 'K1'} not found.`);
        }
        break;
      }
      case FaultType.SHORTED_COIL: {
        const k1_short = this.components.get(targetId || 'K1');
        if (k1_short) {
          k1_short.failureStatus = 'SHORTED_COIL';
          console.log(`[DiagnosisEngine] COIL ${k1_short.id} set to SHORTED_COIL`);
        } else {
          throw new Error(`Fault injection failed: COIL component ${targetId || 'K1'} not found.`);
        }
        break;
      }
      case FaultType.OPEN_START_BUTTON: {
        const s2 = this.components.get(targetId || 'S2');
        if (s2) {
          s2.failureStatus = 'STUCK_OPEN';
          console.log(`[DiagnosisEngine] START BUTTON ${s2.id} set to STUCK_OPEN`);
        } else {
          throw new Error(`Fault injection failed: START BUTTON ${targetId || 'S2'} not found.`);
        }
        break;
      }
      case FaultType.OPEN_STOP_BUTTON: {
        const s1 = this.components.get(targetId || 'S1');
        if (s1) {
          s1.failureStatus = 'STUCK_OPEN';
          console.log(`[DiagnosisEngine] STOP BUTTON ${s1.id} set to STUCK_OPEN`);
        } else {
          throw new Error(`Fault injection failed: STOP BUTTON ${targetId || 'S1'} not found.`);
        }
        break;
      }
      case FaultType.BROKEN_AUX_CONTACT: {
        const k1_aux = this.components.get(targetId || 'K1');
        if (k1_aux) {
          k1_aux.failureStatus = 'BROKEN_AUX';
          console.log(`[DiagnosisEngine] AUX CONTACT ${k1_aux.id} set to BROKEN_AUX`);
        } else {
          throw new Error(`Fault injection failed: AUX CONTACT component ${targetId || 'K1'} not found.`);
        }
        break;
      }
      case FaultType.TRIPPED_RELAY: {
        const f2 = this.components.get(targetId || 'F2') as ThermalRelayComponent;
        if (f2) {
          f2.isTripped = true;
          console.log(`[DiagnosisEngine] THERMAL RELAY ${f2.id} set to TRIPPED`);
        } else {
          throw new Error(`Fault injection failed: THERMAL RELAY component ${targetId || 'F2'} not found.`);
        }
        break;
      }
      case FaultType.MECHANICAL_FAILURE: {
        const k1_mech = this.components.get(targetId || 'K1');
        if (k1_mech) {
          k1_mech.failureStatus = 'MECHANICAL_STUCK';
          console.log(`[DiagnosisEngine] CONTACTOR ${k1_mech.id} set to MECHANICAL_STUCK`);
        } else {
          throw new Error(`Fault injection failed: CONTACTOR component ${targetId || 'K1'} not found.`);
        }
        break;
      }
      case FaultType.NONE:
        console.log(`[DiagnosisEngine] No fault injected (NONE)`);
        break;
      default:
        console.warn(`[DiagnosisEngine] Fault type ${type} mapping not implemented for physical engine.`);
    }
    
    this.components.forEach(c => c.updateState());
    this.solver.solve();
    console.log(`[DiagnosisEngine] Initial physical state computed after fault injection.`);
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
        if (this.activeFault && this.activeFault !== FaultType.NONE) {
          console.log(`[DiagnosisEngine] Component ${params.id} replaced. Checking if it clears active fault: ${this.activeFault}`);
          
          const faultyComp = this.currentCase?.components?.find(c => c.isFaulty);
          if (faultyComp && faultyComp.componentTag === params.id) {
            console.log(`[DiagnosisEngine] Success! Faulty component ${params.id} replaced. Clearing fault.`);
            this.activeFault = FaultType.NONE;
          } else {
            // Fallback for generic cases or legacy data
            const faultComponentMap: Record<string, FaultType> = {
              'F1': FaultType.OPEN_FUSE,
              'K1': FaultType.BROKEN_COIL,
              'S2': FaultType.OPEN_START_BUTTON,
              'S1': FaultType.OPEN_STOP_BUTTON,
              'F2': FaultType.TRIPPED_RELAY
            };
            if (faultComponentMap[params.id] === this.activeFault) {
              console.log(`[DiagnosisEngine] Generic match: Component ${params.id} clears fault ${this.activeFault}`);
              this.activeFault = FaultType.NONE;
            }
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
      error: this.errorMessage,
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
