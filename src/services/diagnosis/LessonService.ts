import { supabase } from "@/integrations/supabase/client";
import { CaseLesson } from "@/types/diagnosis";

export const LessonService = {
  async getByCase(caseId: string): Promise<CaseLesson | null> {
    const { data, error } = await (supabase as any)
      .from('case_lessons')
      .select('*')
      .eq('case_id', caseId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    const item = data as any;
    return {
      id: item.id,
      caseId: item.case_id,
      technicalSummary: item.technical_summary,
      failureExplanation: item.failure_explanation,
      circuitTheory: item.circuit_theory,
      fundamentalBasis: item.fundamental_basis,
      bestPractices: item.best_practices,
      normsRelated: item.norms_related,
      safetyWarnings: item.safety_warnings,
      commonMistakes: item.common_mistakes
    };
  }
};
