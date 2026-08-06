import { ElectricalComponent, ComponentType, ElectricalState, Terminal } from './ElectricalComponent';

export class CircuitBreakerComponent extends ElectricalComponent {
  isClosed: boolean = false;

  constructor(id: string, type: ComponentType = ComponentType.CIRCUIT_BREAKER) {
    super(id, type);
    this.state = ElectricalState.OPEN;
  }

  updateState(): void {
    if (this.failureStatus === 'STUCK_OPEN' || this.failureStatus === 'TRIPPED') {
      this.isClosed = false;
      this.state = ElectricalState.OPEN;
    } else if (this.failureStatus === 'STUCK_CLOSED') {
      this.isClosed = true;
      this.state = ElectricalState.CLOSED;
    } else {
      this.state = this.isClosed ? ElectricalState.CLOSED : ElectricalState.OPEN;
    }
  }

  getContinuity(t1: string, t2: string): boolean {
    return this.state === ElectricalState.CLOSED;
  }

  toggle(): void {
    this.isClosed = !this.isClosed;
    this.updateState();
  }
}

export class ThermalRelayComponent extends ElectricalComponent {
  isTripped: boolean = false;

  constructor(id: string) {
    super(id, ComponentType.THERMAL_RELAY);
    this.state = ElectricalState.CLOSED; // Normally closed 95-96
  }

  updateState(): void {
    if (this.failureStatus === 'TRIPPED' || this.isTripped) {
      this.state = ElectricalState.OPEN;
    } else {
      this.state = ElectricalState.CLOSED;
    }
  }

  getContinuity(t1: string, t2: string): boolean {
    // 95-96 is NC (Normally Closed) - opens on trip
    // 97-98 is NO (Normally Open) - closes on trip
    const is95_96 = (t1 === '95' && t2 === '96') || (t1 === '96' && t2 === '95');
    const is97_98 = (t1 === '97' && t2 === '98') || (t1 === '98' && t2 === '97');

    if (this.failureStatus === 'TRIPPED' || this.isTripped) {
      if (is95_96) return false;
      if (is97_98) return true;
    } else {
      if (is95_96) return true;
      if (is97_98) return false;
    }
    return false;
  }

  reset(): void {
    this.isTripped = false;
    this.updateState();
  }
}

export class MotorComponent extends ElectricalComponent {
  isRunning: boolean = false;

  constructor(id: string) {
    super(id, ComponentType.MOTOR);
  }

  updateState(): void {
    // Motor state is usually determined by the solver check of power terminals
  }

  getContinuity(t1: string, t2: string): boolean {
    // Internal windings continuity
    return this.failureStatus !== 'BURNT_WINDING';
  }
}

export class TransformerComponent extends ElectricalComponent {
  constructor(id: string) {
    super(id, ComponentType.TRANSFORMER);
  }

  updateState(): void {}

  getContinuity(t1: string, t2: string): boolean {
    // Primary and secondary windings isolation
    const primary = ['H1', 'H2', 'H3', 'H4'];
    const secondary = ['X1', 'X2'];
    
    if (primary.includes(t1) && primary.includes(t2)) return true;
    if (secondary.includes(t1) && secondary.includes(t2)) return true;
    return false;
  }
}
