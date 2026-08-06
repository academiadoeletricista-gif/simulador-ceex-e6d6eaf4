import { CircuitSolver } from '../../solver/CircuitSolver';
import { ComponentType, SwitchComponent, ContactorComponent } from '../../components/ElectricalComponent';
import { CircuitBreakerComponent, ThermalRelayComponent, MotorComponent } from '../../components/IndustrialComponents';

export class DOLCircuit {
  static setup(solver: CircuitSolver) {
    // 1. Define Nodes
    const nodes = [
      // Power Lines
      { id: 'L1', voltage: 220, connections: [] },
      { id: 'L2', voltage: 220, connections: [] },
      { id: 'L3', voltage: 220, connections: [] },
      { id: 'N', voltage: 0, connections: [] },
      { id: 'PE', voltage: 0, connections: [] },

      // Main Power path (after Q1)
      { id: 'pow_q1_1', voltage: 0, connections: [] },
      { id: 'pow_q1_2', voltage: 0, connections: [] },
      { id: 'pow_q1_3', voltage: 0, connections: [] },

      // After KM1
      { id: 'pow_km1_1', voltage: 0, connections: [] },
      { id: 'pow_km1_2', voltage: 0, connections: [] },
      { id: 'pow_km1_3', voltage: 0, connections: [] },

      // Control Nodes
      { id: 'ctrl_in', voltage: 0, connections: [] },  // After Control Breaker
      { id: 'ctrl_f1', voltage: 0, connections: [] },  // After Fuse
      { id: 'ctrl_stop', voltage: 0, connections: [] }, // After S1
      { id: 'ctrl_start', voltage: 0, connections: [] }, // After S2 / K1 NO
      { id: 'ctrl_relay', voltage: 0, connections: [] }, // After Thermal Relay 95-96
      
      // Power nodes (motor terminals)
      { id: 'motor_u', voltage: 0, connections: [] },
      { id: 'motor_v', voltage: 0, connections: [] },
      { id: 'motor_w', voltage: 0, connections: [] },
    ];

    nodes.forEach(n => solver.addNode(n));

    // 2. Power Circuit Components
    
    // Q1 - Main Circuit Breaker (Power)
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

    // 3. Control Circuit Components
    
    // Q2 - Control Circuit Breaker
    const q2 = new CircuitBreakerComponent('Q2');
    q2.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'L1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'ctrl_in' }
    };
    q2.isClosed = true;
    solver.addComponent(q2);

    // F1 - Control Fuse
    const f1 = new SwitchComponent('F1', ComponentType.FUSE, false);
    // Add alias for cases referring to 'FUSE' generic tag
    solver.addNode({ id: 'alias_f1_in', voltage: 0, connections: ['ctrl_in'] });
    solver.addNode({ id: 'alias_f1_out', voltage: 0, connections: ['ctrl_f1'] });
    f1.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'ctrl_in' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'ctrl_f1' }
    };
    solver.addComponent(f1);

    // S1 - STOP Button (NC)
    const s1 = new SwitchComponent('S1', ComponentType.PUSHBUTTON_STOP, false);
    // Interlock check: add alias for S0
    const s0_alias = new SwitchComponent('S0', ComponentType.PUSHBUTTON_STOP, false);
    s0_alias.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'ctrl_f1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'ctrl_stop' }
    };
    solver.addComponent(s0_alias);
    s1.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'ctrl_f1' },
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
      // Seal contact (NO 13-14)
      '13': { id: 't13', name: '13', voltage: 0, nodeId: 'ctrl_stop' },
      '14': { id: 't14', name: '14', voltage: 0, nodeId: 'ctrl_start' },
      // Power contacts
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'pow_q1_1' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'pow_km1_1' },
      '3': { id: 't3', name: '3', voltage: 0, nodeId: 'pow_q1_2' },
      '4': { id: 't4', name: '4', voltage: 0, nodeId: 'pow_km1_2' },
      '5': { id: 't5', name: '5', voltage: 0, nodeId: 'pow_q1_3' },
      '6': { id: 't6', name: '6', voltage: 0, nodeId: 'pow_km1_3' }
    };
    solver.addComponent(k1);

    // Update F2 to connect power side as well if needed, but for simplicity we'll connect KM1 output to Motor via solver nodes
    // Actually, in a real DOL, KM1 -> F2 -> Motor.
    // Let's adjust F2 nodes.
    f2.terminals['1'] = { id: 't1', name: '1', voltage: 0, nodeId: 'pow_km1_1' };
    f2.terminals['2'] = { id: 't2', name: '2', voltage: 0, nodeId: 'motor_u' };
    f2.terminals['3'] = { id: 't3', name: '3', voltage: 0, nodeId: 'pow_km1_2' };
    f2.terminals['4'] = { id: 't4', name: '4', voltage: 0, nodeId: 'motor_v' };
    f2.terminals['5'] = { id: 't5', name: '5', voltage: 0, nodeId: 'pow_km1_3' };
    f2.terminals['6'] = { id: 't6', name: '6', voltage: 0, nodeId: 'motor_w' };

    // M1 - Motor
    const m1 = new MotorComponent('M1');
    m1.terminals = {
      'U1': { id: 'tU1', name: 'U1', voltage: 0, nodeId: 'motor_u' },
      'V1': { id: 'tV1', name: 'V1', voltage: 0, nodeId: 'motor_v' },
      'W1': { id: 'tW1', name: 'W1', voltage: 0, nodeId: 'motor_w' }
    };
    solver.addComponent(m1);
  }
}
