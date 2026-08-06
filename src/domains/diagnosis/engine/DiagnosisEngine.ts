import { ElectricalComponent, ComponentType, ElectricalState } from './physics/ElectricalComponent';
import { GraphNode, CircuitSolver } from './physics/CircuitSolver';

export interface DiagnosisState {
  history: any[];
  isMotorRunning: boolean;
  startTime: number;
  components: any[];
  status: 'IN_PROGRESS' | 'COMPLETED';
  currentNodeId: string;
  xp: number;
  score: number;
}

export class SwitchComponent extends ElectricalComponent {
  isNormallyOpen: boolean;
  isPressed: boolean = false;
  constructor(id: string, type: ComponentType, isNormallyOpen: boolean) {
    super(id, type);
    this.isNormallyOpen = isNormallyOpen;
  }
  updateState() {
    if (this.failureStatus === 'OPEN') this.state = ElectricalState.OPEN;
    else if (this.failureStatus === 'CLOSED') this.state = ElectricalState.CLOSED;
    else this.state = this.isPressed ? (this.isNormallyOpen ? ElectricalState.CLOSED : ElectricalState.OPEN) : (this.isNormallyOpen ? ElectricalState.OPEN : ElectricalState.CLOSED);
  }
  getContinuity(t1: string, t2: string) { return this.state === ElectricalState.CLOSED; }
}

export class ContactorComponent extends ElectricalComponent {
  isEnergized: boolean = false;
  updateState() {}
  getContinuity(t1: string, t2: string) {
    if ((t1 === '13' && t2 === '14') || (t1 === '14' && t2 === '13')) return this.isEnergized;
    return false;
  }
}

export class DiagnosisEngine {
  private solver: CircuitSolver;
  private components: Map<string, ElectricalComponent> = new Map();
  private history: any[] = [];
  private startTime: number = Date.now();
  private status: 'IN_PROGRESS' | 'COMPLETED' = 'IN_PROGRESS';
  private currentNodeId: string = 'initial';

  constructor() {
    this.solver = new CircuitSolver();
    this.setupPD001();
  }

  // Compatibility methods for old UI
  load(caseData: any) { console.log("Engine loaded", caseData); }
  start() { this.startTime = Date.now(); }
  getCurrentNode() { return { id: this.currentNodeId, title: 'Simulação em Tempo Real', description: 'Interaja com os componentes do painel.', type: 'DECISION' }; }
  getAvailableChoices() { return []; }
  selectChoice(id: string) { console.log("Choice selected", id); }
  isFinished() { return this.status === 'COMPLETED'; }

  private setupPD001() {
    const nodes: GraphNode[] = [
      { id: 'L1', voltage: 220, connections: [] },
      { id: 'N', voltage: 0, connections: [] },
      { id: 'n1', voltage: 0, connections: [] },
      { id: 'n2', voltage: 0, connections: [] },
      { id: 'n3', voltage: 0, connections: [] },
      { id: 'n4', voltage: 0, connections: [] },
    ];
    nodes.forEach(n => this.solver.addNode(n));

    const fuse = new SwitchComponent('F1', ComponentType.FUSE, false);
    fuse.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'L1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'n1' }
    };
    this.addComponent(fuse);

    const emergency = new SwitchComponent('S0', ComponentType.EMERGENCY_STOP, false);
    emergency.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'n1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'n2' }
    };
    this.addComponent(emergency);

    const stop = new SwitchComponent('S1', ComponentType.PUSHBUTTON_STOP, false);
    stop.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'n2' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'n3' }
    };
    this.addComponent(stop);

    const start = new SwitchComponent('S2', ComponentType.PUSHBUTTON_START, true);
    start.terminals = {
      '3': { id: 't3', name: '3', voltage: 0, nodeId: 'n3' },
      '4': { id: 't4', name: '4', voltage: 0, nodeId: 'n4' }
    };
    this.addComponent(start);

    const contactor = new ContactorComponent('K1', ComponentType.CONTACTOR);
    contactor.terminals = {
      'A1': { id: 'tA1', name: 'A1', voltage: 0, nodeId: 'n4' },
      'A2': { id: 'tA2', name: 'A2', voltage: 0, nodeId: 'N' },
      '13': { id: 't13', name: '13', voltage: 0, nodeId: 'n3' },
      '14': { id: 't14', name: '14', voltage: 0, nodeId: 'n4' }
    };
    this.addComponent(contactor);

    this.injectFault('F1', 'OPEN');
    this.solver.solve();
  }

  private addComponent(comp: ElectricalComponent) {
    this.components.set(comp.id, comp);
    this.solver.addComponent(comp);
  }

  private injectFault(id: string, fault: string) {
    const comp = this.components.get(id);
    if (comp) {
      comp.failureStatus = fault;
      comp.updateState();
    }
  }

  performAction(action: string, params: any = {}) {
    if (action === 'PRESS_START') {
      const start = this.components.get('S2') as SwitchComponent;
      if (start) {
        start.isPressed = true;
        start.updateState();
        this.solver.solve();
      }
    } else if (action === 'RELEASE_START') {
      const start = this.components.get('S2') as SwitchComponent;
      if (start) {
        start.isPressed = false;
        start.updateState();
        this.solver.solve();
      }
    } else if (action === 'REPLACE_COMPONENT') {
      const comp = this.components.get(params.id);
      if (comp) {
        comp.failureStatus = null;
        comp.updateState();
        this.solver.solve();
      }
    }
    
    this.history.push({ action, params, timestamp: Date.now() });
    
    // Check success condition: Contactor energized
    const contactor = this.components.get('K1') as ContactorComponent;
    if (contactor?.isEnergized) {
      this.status = 'COMPLETED';
    }
  }

  getState(): DiagnosisState {
    const contactor = this.components.get('K1') as ContactorComponent;
    return {
      history: this.history,
      isMotorRunning: contactor?.isEnergized || false,
      startTime: this.startTime,
      status: this.status,
      currentNodeId: this.currentNodeId,
      xp: 0,
      score: 100,
      components: Array.from(this.components.values()).map(c => ({
        id: c.id,
        type: c.type,
        state: c.state,
        failure: c.failureStatus
      }))
    };
  }
}
