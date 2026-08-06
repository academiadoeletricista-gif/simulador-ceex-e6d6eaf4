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
  nodeId: string;
}

export abstract class ElectricalComponent {
  id: string;
  type: ComponentType;
  state: ElectricalState = ElectricalState.OFF;
  terminals: Record<string, Terminal> = {};
  resistance: number = 0;
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
    if (this.failureStatus === 'STUCK_OPEN' || this.failureStatus === 'OPEN') {
      this.state = ElectricalState.OPEN;
    } else if (this.failureStatus === 'STUCK_CLOSED' || this.failureStatus === 'CLOSED') {
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
    if (this.failureStatus === 'BURNT_COIL' || this.failureStatus === 'BROKEN_COIL') {
      this.isEnergized = false;
    }
  }

  getContinuity(t1: string, t2: string): boolean {
    if (this.failureStatus === 'BROKEN_AUX') return false;
    
    // Physical state for contacts
    const active = this.isEnergized;

    // Power contacts (1-2, 3-4, 5-6)
    const isPower1 = (t1 === '1' && t2 === '2') || (t1 === '2' && t2 === '1');
    const isPower2 = (t1 === '3' && t2 === '4') || (t1 === '4' && t2 === '3');
    const isPower3 = (t1 === '5' && t2 === '6') || (t1 === '6' && t2 === '5');
    
    if (isPower1 || isPower2 || isPower3) {
      return active;
    }
    
    // Main auxiliary contact (NO 13-14)
    if ((t1 === '13' && t2 === '14') || (t1 === '14' && t2 === '13')) {
      return active;
    }

    // NC contact (21-22) if exists
    if ((t1 === '21' && t2 === '22') || (t1 === '22' && t2 === '21')) {
      return !active;
    }
    
    return false; 
  }
}
