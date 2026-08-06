import { ElectricalComponent } from '../components/ElectricalComponent';

export interface GraphNode {
  id: string;
  voltage: number;
  connections: string[];
}

export class CircuitSolver {
  private components: Map<string, ElectricalComponent> = new Map();
  private nodes: Map<string, GraphNode> = new Map();

  addComponent(comp: ElectricalComponent) {
    this.components.set(comp.id, comp);
  }

  addNode(node: GraphNode) {
    this.nodes.set(node.id, node);
  }

  solve() {
    this.nodes.forEach(node => {
      if (!['L1', 'L2', 'L3', 'N', 'PE'].includes(node.id)) {
        node.voltage = 0;
      }
    });

    let changed = true;
    let iterations = 0;
    const MAX_ITERATIONS = 50;

    while (changed && iterations < MAX_ITERATIONS) {
      changed = false;
      iterations++;

      this.components.forEach(comp => {
        const terminalNames = Object.keys(comp.terminals);
        for (let i = 0; i < terminalNames.length; i++) {
          const t1Name = terminalNames[i];
          if (!t1Name) continue;
          
          for (let j = i + 1; j < terminalNames.length; j++) {
            const t2Name = terminalNames[j];
            if (!t2Name) continue;

            const t1 = comp.terminals[t1Name];
            const t2 = comp.terminals[t2Name];
            
            if (t1 && t2 && comp.getContinuity(t1Name, t2Name)) {
              const n1 = this.nodes.get(t1.nodeId);
              const n2 = this.nodes.get(t2.nodeId);

              if (n1 && n2 && n1.voltage !== n2.voltage) {
                const maxV = Math.max(n1.voltage, n2.voltage);
                n1.voltage = maxV;
                n2.voltage = maxV;
                changed = true;
              }
            }
          }
        }

        if (comp.type === 'CONTACTOR') {
          const c = comp as any;
          const a1 = c.terminals['A1'];
          const a2 = c.terminals['A2'];
          if (a1 && a2) {
            const vA1 = this.nodes.get(a1.nodeId)?.voltage || 0;
            const vA2 = this.nodes.get(a2.nodeId)?.voltage || 0;
            const diff = Math.abs(vA1 - vA2);
            
            const wasEnergized = c.isEnergized;
            // Logical condition for DOL: if voltage diff is enough, coil tries to pull
            const hasControlVoltage = diff >= 110;
            
            if (c.failureStatus === 'BURNT_COIL' || c.failureStatus === 'MECHANICAL_STUCK') {
               c.isEnergized = false;
            } else {
               c.isEnergized = hasControlVoltage;
            }

            if (wasEnergized !== c.isEnergized) changed = true;
          }
        }
      });
    }
  }

  getVoltageBetween(nodeId1: string, nodeId2: string): number {
    const v1 = this.nodes.get(nodeId1)?.voltage || 0;
    const v2 = this.nodes.get(nodeId2)?.voltage || 0;
    return Math.abs(v1 - v2);
  }

  getNodes() {
    return Array.from(this.nodes.values());
  }

  getComponents() {
    return Array.from(this.components.values());
  }
}
