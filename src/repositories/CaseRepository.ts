import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";
import { DiagnosticCase, CaseDifficulty } from "@/types/diagnosis";

export class CaseRepository {
  async findAll(): Promise<Result<DiagnosticCase[]>> {
    try {
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (casesError) return fail(casesError.message, casesError.code);

      const { data: hypotheses } = await supabase
        .from('case_hypotheses')
        .select('*');

      const fullData = cases.map(c => ({
        ...c,
        case_hypotheses: (hypotheses || []).filter(h => h.case_id === c.id)
      }));

      return ok(fullData.map(this.mapToCamelCase));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findById(id: string): Promise<Result<DiagnosticCase | null>> {
    try {
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();

      if (caseError) {
        if (caseError.code === 'PGRST116') return ok(null);
        return fail(caseError.message, caseError.code);
      }

      const { data: hypotheses } = await supabase
        .from('case_hypotheses')
        .select('*')
        .eq('case_id', id);

      const fullData = {
        ...caseData,
        case_hypotheses: hypotheses || []
      };

      return ok(this.mapToCamelCase(fullData));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findByLaboratoryId(labId: string): Promise<Result<DiagnosticCase[]>> {
    try {
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('*')
        .eq('laboratory_id', labId)
        .eq('published', true)
        .order('code', { ascending: true });

      if (casesError) return fail(casesError.message, casesError.code);
      
      const { data: hypotheses } = await supabase
        .from('case_hypotheses')
        .select('*')
        .in('case_id', cases.map(c => c.id));

      const fullData = cases.map(c => ({
        ...c,
        case_hypotheses: (hypotheses || []).filter(h => h.case_id === c.id)
      }));

      const mapped = fullData.map(this.mapToCamelCase);
      
      if (mapped.length === 0) {
        return this.findAll();
      }

      return ok(mapped);
    } catch (e: any) {
      return fail(e.message);
    }
  }

  private mapToCamelCase(item: any): DiagnosticCase {
    const content = item.content || {};
    const hypotheses = (item.case_hypotheses || []).map((h: any) => ({
      id: h.id,
      title: h.title,
      description: h.description,
      isCorrect: h.is_correct,
      isRootCause: h.is_root_cause || h.root_cause,
      validationLogic: h.validation_logic
    }));
    
    return {
      id: item.id,
      code: item.code || content.code || 'PD-000',
      title: item.title,
      description: item.description || content.description,
      laboratoryId: item.laboratory_id,
      difficulty: item.level as CaseDifficulty,
      estimatedTime: item.time_estimate,
      xpReward: item.xp_reward,
      
      workOrder: content.workOrder || {
        customer: 'Planta Industrial',
        machine: item.title,
        symptoms: item.description || 'Falha desconhecida'
      },
      decisionTree: content.decisionTree || [],
      possibleFaults: content.possibleFaults || [],
      evidenceData: content.evidenceData || [],
      hints: content.hints || [],
      hypotheses: hypotheses.length > 0 ? hypotheses : content.hypotheses || [],
      availableTools: content.availableTools || ['Multímetro', 'Inspeção Visual'],

      topology: content.topology,
      category: item.category,
      status: (item.published ? 'published' : 'draft') as any,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }
}

export const caseRepository = new CaseRepository();
