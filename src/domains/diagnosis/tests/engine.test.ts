import { expect, test, describe } from 'vitest';
import { DiagnosisEngine } from '../engine/DiagnosisEngine';
import { CaseMapper } from '../mappers/CaseMapper';
import { UniversalCaseSchema } from '../types/schema';
import { NodeType, ChoiceResult, CaseDifficulty, EquipmentType } from '../types/enums';

const mockSchema: UniversalCaseSchema = {
  metadata: {
    id: 'test-case',
    slug: 'test-case',
    title: 'Test Case',
    description: 'Testing the engine',
    version: '1.0.0',
    difficulty: CaseDifficulty.BEGINNER,
    category: 'Testing',
    tags: ['test'],
    estimatedTime: 5,
    xpReward: 100
  },
  learningObjectives: ['Test the engine'],
  equipment: [EquipmentType.MULTIMETER],
  prerequisites: [],
  assets: { images: [], diagrams: [] },
  initialNodeId: 'node-1',
  nodes: [
    {
      id: 'node-1',
      type: NodeType.INFORMATION,
      title: 'Start',
      description: 'Welcome',
      choices: [
        {
          id: 'choice-1',
          label: 'Next',
          result: ChoiceResult.NEUTRAL,
          nextNodeId: 'node-2'
        }
      ]
    },
    {
      id: 'node-2',
      type: NodeType.END,
      title: 'End',
      description: 'Finished',
      choices: []
    }
  ],
  assessmentRules: { minScoreToPass: 70, maxErrorsAllowed: 3 },
  rewards: { xp: 100, achievements: [] }
};

describe('DiagnosisEngine', () => {
  test('should load and navigate correctly', () => {
    const engine = new DiagnosisEngine();
    const domainCase = CaseMapper.toDomain(mockSchema);
    
    engine.load(domainCase);
    engine.start();
    
    expect(engine.getCurrentNode()?.id).toBe('node-1');
    expect(engine.isFinished()).toBe(false);
    
    engine.selectChoice('choice-1');
    
    expect(engine.getCurrentNode()?.id).toBe('node-2');
    expect(engine.isFinished()).toBe(true);
  });
});
