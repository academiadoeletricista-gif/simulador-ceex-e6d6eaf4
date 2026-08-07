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

      return ok(fullData.map(item => this.mapToCamelCase(item)));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findById(id: string): Promise<Result<DiagnosticCase | null>> {
    console.log(`Repository: findById ${id}`);
    try {
      // 1. Try diagnostic_cases first
      const { data: diagCases, error: diagError } = await supabase
        .from('diagnostic_cases')
        .select('*')
        .eq('id', id)
        .limit(1);

      const diagCase = diagCases && diagCases.length > 0 ? diagCases[0] : null;

      if (!diagError && diagCase) {
        const { data: hypotheses } = await supabase
          .from('case_hypotheses')
          .select('*')
          .eq('case_id', diagCase.id);

        return ok(this.mapToCamelCase({ ...diagCase, case_hypotheses: hypotheses || [] }));
      }

      // 2. Fallback to cases
      const { data: casesData, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .limit(1);

      const caseData = casesData && casesData.length > 0 ? casesData[0] : null;

      if (caseError) {
        if (caseError.code === 'PGRST116') return ok(null);
        return fail(caseError.message, caseError.code);
      }

      const { data: hypotheses } = await supabase
        .from('case_hypotheses')
        .select('*')
        .eq('case_id', id);

      return ok(this.mapToCamelCase({ ...caseData, case_hypotheses: hypotheses || [] }));
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findByCode(code: string): Promise<Result<DiagnosticCase | null>> {
    console.log(`Repository: findByCode ${code}`);
    try {
      // 1. Try to fetch from diagnostic_cases first
      const { data: diagCases, error: diagError } = await supabase
        .from('diagnostic_cases')
        .select('*')
        .eq('code', code)
        .limit(1);

      const diagCase = diagCases && diagCases.length > 0 ? diagCases[0] : null;

      if (!diagError && diagCase) {
        const { data: hypotheses } = await supabase
          .from('case_hypotheses')
          .select('*')
          .eq('case_id', diagCase.id);

        return ok(this.mapToCamelCase({ ...diagCase, case_hypotheses: hypotheses || [] }));
      }

      // 2. Fallback to cases table
      const { data: caseItems, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('code', code)
        .limit(1);

      const caseItem = caseItems && caseItems.length > 0 ? caseItems[0] : null;

      if (caseError) {
        return fail(caseError.message, caseError.code);
      }

      if (!caseItem) return ok(null);

      const { data: hypotheses } = await supabase
        .from('case_hypotheses')
        .select('*')
        .eq('case_id', caseItem.id);

      return ok(this.mapToCamelCase({ ...caseItem, case_hypotheses: hypotheses || [] }));
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

      const mapped = fullData.map(item => this.mapToCamelCase(item));
      
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
      difficulty: (item.level || item.difficulty || 'Básico') as CaseDifficulty,
      estimatedTime: item.time_estimate || item.estimated_time || 15,
      xpReward: item.xp_reward || 100,
      
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
