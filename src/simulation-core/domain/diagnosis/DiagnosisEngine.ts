import { CircuitSolver } from '../solver/CircuitSolver';
import { SimulationState, SessionStatus } from '../sessions/SimulationSession';
import { ElectricalComponent, SwitchComponent, ContactorComponent } from '../components/ElectricalComponent';
import { CircuitBreakerComponent, ThermalRelayComponent, MotorComponent } from '../components/IndustrialComponents';

export enum FaultType {
  OPEN_FUSE = 'OPEN_FUSE',
  BROKEN_COIL = 'BROKEN_COIL',
  SHORTED_COIL = 'SHORTED_COIL',
  OPEN_START_BUTTON = 'OPEN_START_BUTTON',
  OPEN_STOP_BUTTON = 'OPEN_STOP_BUTTON',
  BROKEN_AUX_CONTACT = 'BROKEN_AUX_CONTACT',
  WELDED_AUX_CONTACT = 'WELDED_AUX_CONTACT',
  TRIPPED_RELAY = 'TRIPPED_RELAY',
  BROKEN_WIRE = 'BROKEN_WIRE',
  LOOSE_TERMINAL = 'LOOSE_TERMINAL',
  MISSING_VOLTAGE = 'MISSING_VOLTAGE',
  MECHANICAL_FAILURE = 'MECHANICAL_FAILURE',
  NONE = 'NONE'
}

export class DiagnosisEngine {
  private solver: CircuitSolver;
  private components: Map<string, ElectricalComponent> = new Map();
  private history: any[] = [];
  private startTime: number = Date.now();
  private status: SessionStatus = SessionStatus.IN_PROGRESS;
  private activeFault: FaultType | null = null;

  constructor() {
    this.solver = new CircuitSolver();
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
            'K1': FaultType.BROKEN_COIL, // Simple mapping, could be refined
            'S2': FaultType.OPEN_START_BUTTON,
            'S1': FaultType.OPEN_STOP_BUTTON,
            'F2': FaultType.TRIPPED_RELAY
          };
          if (faultComponentMap[params.id] === this.activeFault) {
            this.activeFault = FaultType.NONE;
          }
        }
        observation = `Componente ${params.id} substituído por um novo.`;
      }
    }
    
    this.components.forEach(c => c.updateState());
    this.solver.solve();
    
    // Check success: Is the contactor energized?
    const k1 = this.components.get('K1') as ContactorComponent;
    const motor = this.components.get('M1') as MotorComponent;
    
    // Contactor physical state depends on voltage across A1-A2
    // Motor state depends on K1 being energized
    if (k1?.isEnergized) {
      if (motor) motor.isRunning = true;
      // Success condition: Contactor energized AND no active fault remaining
      if (!this.activeFault || this.activeFault === FaultType.NONE) {
        this.status = SessionStatus.COMPLETED;
      }
    } else {
      if (motor) motor.isRunning = false;
    }

    this.history.push({ 
      action, 
      params, 
      observation,
      timestamp: Date.now() 
    });
  }

  measureVoltage(nodeId1: string, nodeId2: string): number {
    return this.solver.getVoltageBetween(nodeId1, nodeId2);
  }

  getState(): SimulationState {
    const motor = this.components.get('M1') as MotorComponent;
    return {
      history: this.history,
      isMotorRunning: motor?.isRunning || false,
      startTime: this.startTime,
      status: this.status,
      currentNodeId: this.activeFault || 'sim',
      xp: 0,
      score: 100,
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
