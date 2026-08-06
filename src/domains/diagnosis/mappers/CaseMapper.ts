import { UniversalCaseSchema } from '../types/schema';
import { DiagnosisCase, DiagnosisNode, DiagnosisChoice } from '../domain/entities/DiagnosisCase';

export class CaseMapper {
  static toDomain(schema: UniversalCaseSchema): DiagnosisCase {
    const nodesMap = new Map<string, DiagnosisNode>();

    schema.nodes.forEach(nodeSchema => {
      const choices = nodeSchema.choices.map(c => 
        new DiagnosisChoice(c.id, c.label, c.nextNodeId, c.feedback, c.metadata)
      );

      const node = new DiagnosisNode(
        nodeSchema.id,
        nodeSchema.type,
        nodeSchema.title,
        nodeSchema.description,
        choices,
        nodeSchema.metadata
      );

      nodesMap.set(node.id, node);
    });

    return new DiagnosisCase(
      schema.metadata.id,
      schema.metadata.title,
      nodesMap,
      schema.initialNodeId
    );
  }
}
