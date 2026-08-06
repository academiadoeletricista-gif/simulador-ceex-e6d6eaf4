import { CircuitSolver } from './CircuitSolver';
import { ElectricalComponent, ComponentType, SwitchComponent, ContactorComponent } from './ElectricalComponent';

export class PartidaDiretaCircuit {
  solver: CircuitSolver;

  constructor() {
    this.solver = new CircuitSolver();
    this.setupCircuit();
  }

  private setupCircuit() {
    // 1. Define Nodes
    const nodes = [
      { id: 'L1', voltage: 220, connections: [] },
      { id: 'N', voltage: 0, connections: [] },
      { id: 'n1', voltage: 0, connections: [] }, // After Fuse
      { id: 'n2', voltage: 0, connections: [] }, // After Emergency
      { id: 'n3', voltage: 0, connections: [] }, // After Stop
      { id: 'n4', voltage: 0, connections: [] }, // After Start / Contactor NO
    ];

    nodes.forEach(n => this.solver.addNode(n));

    // 2. Define Components
    const fuse = new SwitchComponent('F1', ComponentType.FUSE, false);
    fuse.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'L1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'n1' }
    };
    // Fuses are "closed" (conducting) by default
    (fuse as any).isPressed = false; 

    const emergency = new SwitchComponent('S0', ComponentType.EMERGENCY_STOP, false);
    emergency.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'n1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'n2' }
    };

    const stop = new SwitchComponent('S1', ComponentType.PUSHBUTTON_STOP, false);
    stop.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'n2' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'n3' }
    };

    const start = new SwitchComponent('S2', ComponentType.PUSHBUTTON_START, true);
    start.terminals = {
      '3': { id: 't3', name: '3', voltage: 0, nodeId: 'n3' },
      '4': { id: 't4', name: '4', voltage: 0, nodeId: 'n4' }
    };

    const contactor = new ContactorComponent('K1', ComponentType.CONTACTOR);
    contactor.terminals = {
      'A1': { id: 'tA1', name: 'A1', voltage: 0, nodeId: 'n4' },
      'A2': { id: 'tA2', name: 'A2', voltage: 0, nodeId: 'N' },
      '13': { id: 't13', name: '13', voltage: 0, nodeId: 'n3' }, // Seal contact
      '14': { id: 't14', name: '14', voltage: 0, nodeId: 'n4' }
    };

    this.solver.addComponent(fuse);
    this.solver.addComponent(emergency);
    this.solver.addComponent(stop);
    this.solver.addComponent(start);
    this.solver.addComponent(contactor);
  }

  pressStart() {
    const start = this.solver['components'].get('S2') as SwitchComponent;
    if (start) {
      start.isPressed = true;
      start.updateState();
      this.solver.solve();
    }
  }

  releaseStart() {
    const start = this.solver['components'].get('S2') as SwitchComponent;
    if (start) {
      start.isPressed = false;
      start.updateState();
      this.solver.solve();
    }
  }

  injectFault(compId: string, fault: string) {
    const comp = this.solver['components'].get(compId);
    if (comp) {
      comp.failureStatus = fault;
      comp.updateState();
      this.solver.solve();
    }
  }
}
