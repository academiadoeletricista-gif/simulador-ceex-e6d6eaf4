import { CircuitSolver } from '../../solver/CircuitSolver';
import { ComponentType, SwitchComponent, ContactorComponent } from '../../components/ElectricalComponent';
import { CircuitBreakerComponent, ThermalRelayComponent, MotorComponent } from '../../components/IndustrialComponents';

export class ReversingCircuit {
  static setup(solver: CircuitSolver) {
    const nodes = [
      { id: 'L1', voltage: 220, connections: [] },
      { id: 'L2', voltage: 220, connections: [] },
      { id: 'L3', voltage: 220, connections: [] },
      { id: 'N', voltage: 0, connections: [] },
      
      { id: 'ctrl_in', voltage: 0, connections: [] },
      { id: 'ctrl_stop', voltage: 0, connections: [] },
      { id: 'ctrl_forward', voltage: 0, connections: [] },
      { id: 'ctrl_reverse', voltage: 0, connections: [] },
      { id: 'k1_coil_in', voltage: 0, connections: [] },
      { id: 'k2_coil_in', voltage: 0, connections: [] },
      
      { id: 'motor_u', voltage: 0, connections: [] },
      { id: 'motor_v', voltage: 0, connections: [] },
      { id: 'motor_w', voltage: 0, connections: [] },
    ];

    nodes.forEach(n => solver.addNode(n));

    // Q1 - Breaker
    const q1 = new CircuitBreakerComponent('Q1');
    q1.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'L1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'ctrl_in' }
    };
    q1.isClosed = true;
    solver.addComponent(q1);

    // S0 - STOP (NC)
    const s0 = new SwitchComponent('S0', ComponentType.PUSHBUTTON_STOP, false);
    s0.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'ctrl_in' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'ctrl_stop' }
    };
    solver.addComponent(s0);

    // S1 - FORWARD (NO)
    const s1 = new SwitchComponent('S1', ComponentType.PUSHBUTTON_START, true);
    s1.terminals = {
      '3': { id: 't3', name: '3', voltage: 0, nodeId: 'ctrl_stop' },
      '4': { id: 't4', name: '4', voltage: 0, nodeId: 'ctrl_forward' }
    };
    solver.addComponent(s1);

    // S2 - REVERSE (NO)
    const s2 = new SwitchComponent('S2', ComponentType.PUSHBUTTON_START, true);
    s2.terminals = {
      '3': { id: 't3', name: '3', voltage: 0, nodeId: 'ctrl_stop' },
      '4': { id: 't4', name: '4', voltage: 0, nodeId: 'ctrl_reverse' }
    };
    solver.addComponent(s2);

    // K1 - Forward Contactor
    const k1 = new ContactorComponent('K1', ComponentType.CONTACTOR);
    k1.terminals = {
      'A1': { id: 'tA1', name: 'A1', voltage: 0, nodeId: 'k1_coil_in' },
      'A2': { id: 'tA2', name: 'A2', voltage: 0, nodeId: 'N' },
      '13': { id: 't13', name: '13', voltage: 0, nodeId: 'ctrl_stop' },
      '14': { id: 't14', name: '14', voltage: 0, nodeId: 'ctrl_forward' }
    };
    solver.addComponent(k1);

    // K2 - Reverse Contactor
    const k2 = new ContactorComponent('K2', ComponentType.CONTACTOR);
    k2.terminals = {
      'A1': { id: 'tA1', name: 'A1', voltage: 0, nodeId: 'k2_coil_in' },
      'A2': { id: 'tA2', name: 'A2', voltage: 0, nodeId: 'N' },
      '13': { id: 't13', name: '13', voltage: 0, nodeId: 'ctrl_stop' },
      '14': { id: 't14', name: '14', voltage: 0, nodeId: 'ctrl_reverse' }
    };
    solver.addComponent(k2);

    // Motor
    const m1 = new MotorComponent('M1');
    m1.terminals = {
      'U1': { id: 'tU1', name: 'U1', voltage: 0, nodeId: 'motor_u' },
      'V1': { id: 'tV1', name: 'V1', voltage: 0, nodeId: 'motor_v' },
      'W1': { id: 'tW1', name: 'W1', voltage: 0, nodeId: 'motor_w' }
    };
    solver.addComponent(m1);
  }
}
