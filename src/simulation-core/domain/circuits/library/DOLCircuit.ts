import { CircuitSolver } from '../solver/CircuitSolver';
import { ComponentType, SwitchComponent, ContactorComponent } from '../components/ElectricalComponent';
import { CircuitBreakerComponent, ThermalRelayComponent, MotorComponent } from '../components/IndustrialComponents';

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

      // Control Nodes
      { id: 'ctrl_in', voltage: 0, connections: [] },  // After Control Breaker
      { id: 'ctrl_f1', voltage: 0, connections: [] },  // After Fuse
      { id: 'ctrl_stop', voltage: 0, connections: [] }, // After S1
      { id: 'ctrl_start', voltage: 0, connections: [] }, // After S2 / K1 NO
      { id: 'ctrl_relay', voltage: 0, connections: [] }, // After Thermal Relay 95-96
      
      // Power nodes (simplified for 1-phase control logic first, then 3-phase)
      { id: 'motor_u', voltage: 0, connections: [] },
      { id: 'motor_v', voltage: 0, connections: [] },
      { id: 'motor_w', voltage: 0, connections: [] },
    ];

    nodes.forEach(n => solver.addNode(n));

    // 2. Control Circuit Components
    
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
    f1.terminals = {
      '1': { id: 't1', name: '1', voltage: 0, nodeId: 'ctrl_in' },
      '2': { id: 't2', name: '2', voltage: 0, nodeId: 'ctrl_f1' }
    };
    solver.addComponent(f1);

    // S1 - STOP Button (NC)
    const s1 = new SwitchComponent('S1', ComponentType.PUSHBUTTON_STOP, false);
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
      '14': { id: 't14', name: '14', voltage: 0, nodeId: 'ctrl_start' }
    };
    solver.addComponent(k1);

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
