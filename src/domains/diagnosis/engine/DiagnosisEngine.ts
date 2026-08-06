import { ElectricalComponent, ComponentType, ElectricalState } from './ElectricalComponent';
import { GraphNode, CircuitSolver } from './CircuitSolver';

export class DiagnosisEngine {
  private solver: CircuitSolver;
  private components: Map<string, ElectricalComponent> = new Map();
  private history: any[] = [];
  private startTime: number = Date.now();
  private faultInjected: boolean = false;

  constructor() {
    this.solver = new CircuitSolver();
    this.setupPD001();
  }

  private setupPD001() {
    // Nodes
    const nodes: GraphNode[] = [
      { id: 'L1', voltage: 220, connections: [] },
      { id: 'N', voltage: 0, connections: [] },
      { id: 'n1', voltage: 0, connections: [] }, // Pos-fusivel
      { id: 'n2', voltage: 0, connections: [] }, // Pos-emergencia
      { id: 'n3', voltage: 0, connections: [] }, // Pos-stop
      { id: 'n4', voltage: 0, connections: [] }, // Pos-start / Coil A1
    ];
    nodes.forEach(n => this.solver.addNode(n));

    // Components
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

    // Initial state: Everything normal, but we will inject the fault for PD-001
    this.injectFault('F1', 'OPEN'); // PD-001: Motor does not start because fuse is open
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
    const timestamp = Date.now();
    let result = "Ação executada.";

    if (action === 'PRESS_START') {
      const start = this.components.get('S2') as SwitchComponent;
      start.isPressed = true;
      start.updateState();
      this.solver.solve();
      result = "Botão START pressionado.";
    } else if (action === 'RELEASE_START') {
      const start = this.components.get('S2') as SwitchComponent;
      start.isPressed = false;
      start.updateState();
      this.solver.solve();
      result = "Botão START liberado.";
    } else if (action === 'MEASURE_VOLTAGE') {
      const v = this.solver.getVoltageBetween(params.node1, params.node2);
      result = `Tensão medida entre ${params.node1} e ${params.node2}: ${v}V`;
    } else if (action === 'REPLACE_COMPONENT') {
      const comp = this.components.get(params.id);
      if (comp) {
        comp.failureStatus = null;
        comp.updateState();
        this.solver.solve();
        result = `Componente ${params.id} substituído por um novo.`;
      }
    }

    this.history.push({ action, params, result, timestamp });
    return result;
  }

  getState() {
    const contactor = this.components.get('K1') as ContactorComponent;
    return {
      history: this.history,
      isMotorRunning: contactor.isEnergized, // Simplified for PD-001
      startTime: this.startTime,
      components: Array.from(this.components.values()).map(c => ({
        id: c.id,
        type: c.type,
        state: c.state,
        failure: c.failureStatus
      }))
    };
  }
}

// Minimal implementations to avoid build errors if they were missing in the previous turn
class SwitchComponent extends ElectricalComponent {
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
  getContinuity() { return this.state === ElectricalState.CLOSED; }
}

class ContactorComponent extends ElectricalComponent {
  isEnergized: boolean = false;
  updateState() {}
  getContinuity(t1: string, t2: string) {
    if ((t1 === '13' && t2 === '14') || (t1 === '14' && t2 === '13')) return this.isEnergized;
    return false;
  }
}
