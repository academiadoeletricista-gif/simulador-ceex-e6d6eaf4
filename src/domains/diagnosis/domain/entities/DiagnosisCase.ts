import { NodeType } from '../types/enums';
import { NodeId, ChoiceId } from '../types/schema';

export class DiagnosisNode {
  constructor(
    public readonly id: string,
    public readonly type: NodeType,
    public readonly title: string,
    public readonly description: string,
    public readonly choices: DiagnosisChoice[],
    public readonly metadata: Record<string, any> = {}
  ) {}
}

export class DiagnosisChoice {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly nextNodeId: string,
    public readonly feedback?: string,
    public readonly metadata: Record<string, any> = {}
  ) {}
}

export class DiagnosisCase {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly nodes: Map<string, DiagnosisNode>,
    public readonly initialNodeId: string
  ) {}

  getNode(id: string): DiagnosisNode | undefined {
    return this.nodes.get(id);
  }
}
