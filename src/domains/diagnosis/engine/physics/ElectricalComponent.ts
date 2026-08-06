export enum ElectricalState {
  OFF = 'OFF',
  ON = 'ON',
  TRIPPED = 'TRIPPED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  STUCK_OPEN = 'STUCK_OPEN',
  STUCK_CLOSED = 'STUCK_CLOSED',
  BURNT = 'BURNT'
}

export enum ComponentType {
  POWER_SUPPLY = 'POWER_SUPPLY',
  TRANSFORMER = 'TRANSFORMER',
  FUSE = 'FUSE',
  CIRCUIT_BREAKER = 'CIRCUIT_BREAKER',
  PUSHBUTTON_START = 'PUSHBUTTON_START',
  PUSHBUTTON_STOP = 'PUSHBUTTON_STOP',
  EMERGENCY_STOP = 'EMERGENCY_STOP',
  CONTACTOR = 'CONTACTOR',
  AUXILIARY_CONTACT = 'AUXILIARY_CONTACT',
  THERMAL_RELAY = 'THERMAL_RELAY',
  TIMER = 'TIMER',
  LIMIT_SWITCH = 'LIMIT_SWITCH',
  MOTOR = 'MOTOR',
  PILOT_LAMP = 'PILOT_LAMP',
  TERMINAL_BLOCK = 'TERMINAL_BLOCK'
}

export interface Terminal {
  id: string;
  name: string;
  voltage: number;
  nodeId: string; // ID of the electrical node in the graph
}

export abstract class ElectricalComponent {
  id: string;
  type: ComponentType;
  state: ElectricalState = ElectricalState.OFF;
  terminals: Record<string, Terminal> = {};
  resistance: number = 0; // Ohms (internal resistance)
  failureStatus: string | null = null;

  constructor(id: string, type: ComponentType) {
    this.id = id;
    this.type = type;
  }

  abstract updateState(): void;
  abstract getContinuity(t1: string, t2: string): boolean;
}

export class SwitchComponent extends ElectricalComponent {
  isNormallyOpen: boolean = true;
  isPressed: boolean = false;

  constructor(id: string, type: ComponentType, isNormallyOpen: boolean) {
    super(id, type);
    this.isNormallyOpen = isNormallyOpen;
    this.state = isNormallyOpen ? ElectricalState.OPEN : ElectricalState.CLOSED;
  }

  updateState(): void {
    if (this.failureStatus === 'STUCK_OPEN') {
      this.state = ElectricalState.OPEN;
    } else if (this.failureStatus === 'STUCK_CLOSED') {
      this.state = ElectricalState.CLOSED;
    } else {
      const active = this.isPressed;
      this.state = this.isNormallyOpen 
        ? (active ? ElectricalState.CLOSED : ElectricalState.OPEN)
        : (active ? ElectricalState.OPEN : ElectricalState.CLOSED);
    }
  }

  getContinuity(t1: string, t2: string): boolean {
    return this.state === ElectricalState.CLOSED;
  }
}

export class ContactorComponent extends ElectricalComponent {
  coilTerminals: [string, string] = ['A1', 'A2'];
  isEnergized: boolean = false;

  updateState(): void {
    // Logic to be driven by voltage difference between A1 and A2
    if (this.failureStatus === 'BURNT_COIL') {
      this.isEnergized = false;
    }
  }

  getContinuity(t1: string, t2: string): boolean {
    // Main contacts or auxiliary contacts logic
    return this.isEnergized; 
  }
}
