import { CircuitSolver } from '../../solver/CircuitSolver';
import { ComponentType, SwitchComponent, ContactorComponent } from '../../components/ElectricalComponent';
import { CircuitBreakerComponent, ThermalRelayComponent, MotorComponent } from '../../components/IndustrialComponents';

export class StarDeltaCircuit {
  static setup(solver: CircuitSolver) {
    // 1. Define Nodes
    const nodes = [
      // Power Lines
      { id: 'L1', voltage: 220, connections: [] },
      { id: 'L2', voltage: 220, connections: [] },
      { id: 'L3', voltage: 220, connections: [] },
      { id: 'N', voltage: 0, connections: [] },
      { id: 'PE', voltage: 0, connections: [] },

      // Control Nodes
      { id: 'ctrl_in', voltage: 0, connections: [] },
      { id: 'ctrl_stop', voltage: 0, connections: [] },
      { id: 'ctrl_start', voltage: 0, connections: [] },
      { id: 'ctrl_relay', voltage: 0, connections: [] },
      
      // Timer & Contactor specific nodes
      { id: 'k1_coil', voltage: 0, connections: [] },
      { id: 'k2_coil', voltage: 0, connections: [] }, // Star
      { id: 'k3_coil', voltage: 0, connections: [] }, // Delta
      { id: 'timer_coil', voltage: 0, connections: [] },
      { id: 'timer_star', voltage: 0, connections: [] },
      { id: 'timer_delta', voltage: 0, connections: [] },

      // Power nodes
      { id: 'motor_u1', voltage: 0, connections: [] },
      { id: 'motor_v1', voltage: 0, connections: [] },
      { id: 'motor_w1', voltage: 0, connections: [] },
      { id: 'motor_u2', voltage: 0, connections: [] },
      { id: 'motor_v2', voltage: 0, connections: [] },
      { id: 'motor_w2', voltage: 0, connections: [] },
    ];

    nodes.forEach(n => solver.addNode(n));

    // Power Circuit (After Q1)
    solver.addNode({ id: 'pow_q1_1', voltage: 0, connections: [] });
    solver.addNode({ id: 'pow_q1_2', voltage: 0, connections: [] });
    solver.addNode({ id: 'pow_q1_3', voltage: 0, connections: [] });

    // Q1 - Main Breaker
    const q1 = new CircuitBreakerComponent('Q1');
    q1.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'L1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'pow_q1_1' },
      '3': { id: 't3', name: '3', voltage: 0, nodeId: 'L2' },
      '4': { id: 't4', name: '4', voltage: 0, nodeId: 'pow_q1_2' },
      '5': { id: 't5', name: '5', voltage: 0, nodeId: 'L3' },
      '6': { id: 't6', name: '6', voltage: 0, nodeId: 'pow_q1_3' }
    };
    q1.isClosed = true;
    solver.addComponent(q1);

    // Q2 - Control Breaker
    const q2 = new CircuitBreakerComponent('Q2');
    q2.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'L1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'ctrl_in' }
    };
    q2.isClosed = true;
    solver.addComponent(q2);

    // S1 - STOP Button (NC)
    const s1 = new SwitchComponent('S1', ComponentType.PUSHBUTTON_STOP, false);
    s1.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'ctrl_in' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'ctrl_stop' }
    };
    solver.addComponent(s1);

    // S2 - START Button (NO)
    const s2 = new SwitchComponent('S2', ComponentType.PUSHBUTTON_START, true);
    s2.terminals = {
      '3': { id: 't3', name: '3', voltage: 0, nodeId: 'ctrl_stop' },
      '4': { id: 't4', name: '4', voltage: 0, nodeId: 'ctrl_start' }
    };
    solver.addComponent(s2);

    // F2 - Thermal Relay (NC 95-96)
    const f2 = new ThermalRelayComponent('F2');
    f2.terminals = {
      '95': { id: 't95', name: '95', voltage: 0, nodeId: 'ctrl_start' },
      '96': { id: 't96', name: '96', voltage: 0, nodeId: 'ctrl_relay' }
    };
    solver.addComponent(f2);

    // K1 - Main Contactor
    const k1 = new ContactorComponent('K1', ComponentType.CONTACTOR);
    k1.terminals = {
      'A1': { id: 'tA1', name: 'A1', voltage: 0, nodeId: 'ctrl_relay' },
      'A2': { id: 'tA2', name: 'A2', voltage: 0, nodeId: 'N' },
      '13': { id: 't13', name: '13', voltage: 0, nodeId: 'ctrl_stop' },
      '14': { id: 't14', name: '14', voltage: 0, nodeId: 'ctrl_start' },
      // Power contacts
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'pow_q1_1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'motor_u1' },
      '3': { id: 't3', name: '3', voltage: 0, nodeId: 'pow_q1_2' },
      '4': { id: 't4', name: '4', voltage: 0, nodeId: 'motor_v1' },
      '5': { id: 't5', name: '5', voltage: 0, nodeId: 'pow_q1_3' },
      '6': { id: 't6', name: '6', voltage: 0, nodeId: 'motor_w1' }
    };
    solver.addComponent(k1);

    // M1 - Motor (6 terminals)
    const m1 = new MotorComponent('M1');
    m1.terminals = {
      'U1': { id: 'tU1', name: 'U1', voltage: 0, nodeId: 'motor_u1' },
      'V1': { id: 'tV1', name: 'V1', voltage: 0, nodeId: 'motor_v1' },
      'W1': { id: 'tW1', name: 'W1', voltage: 0, nodeId: 'motor_w1' },
      'U2': { id: 'tU2', name: 'U2', voltage: 0, nodeId: 'motor_u2' },
      'V2': { id: 'tV2', name: 'V2', voltage: 0, nodeId: 'motor_v2' },
      'W2': { id: 'tW2', name: 'W2', voltage: 0, nodeId: 'motor_w2' }
    };
    solver.addComponent(m1);
  }
}
