import { ElectricalComponent, Terminal, ElectricalState } from './ElectricalComponent';

export interface GraphNode {
  id: string;
  voltage: number;
  connections: string[]; // List of component IDs connecting to this node
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
    // 1. Reset all non-source nodes to 0V
    this.nodes.forEach(node => {
      if (node.id !== 'L1' && node.id !== 'L2' && node.id !== 'L3' && node.id !== 'N') {
        node.voltage = 0;
      }
    });

    // 2. Propagate voltage from sources
    let changed = true;
    let iterations = 0;
    const MAX_ITERATIONS = 50;

    while (changed && iterations < MAX_ITERATIONS) {
      changed = false;
      iterations++;

      this.components.forEach(comp => {
        // Simple propagation: if terminals are connected (continuity), they share the same voltage
        const terminalNames = Object.keys(comp.terminals);
        for (let i = 0; i < terminalNames.length; i++) {
          for (let j = i + 1; j < terminalNames.length; j++) {
            const t1 = comp.terminals[terminalNames[i]];
            const t2 = comp.terminals[terminalNames[j]];
            
            if (t1 && t2 && comp.getContinuity(terminalNames[i], terminalNames[j])) {
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

        // Update internal state of components based on terminal voltages
        if (comp.type === 'CONTACTOR') {
          // Check coil voltage
          const a1 = (comp as any).terminals['A1'];
          const a2 = (comp as any).terminals['A2'];
          if (a1 && a2) {
            const vA1 = this.nodes.get(a1.nodeId)?.voltage || 0;
            const vA2 = this.nodes.get(a2.nodeId)?.voltage || 0;
            
            const diff = Math.abs(vA1 - vA2);
            const wasEnergized = (comp as any).isEnergized;
            (comp as any).isEnergized = diff >= 110; 
            if (wasEnergized !== (comp as any).isEnergized) changed = true;
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
}
