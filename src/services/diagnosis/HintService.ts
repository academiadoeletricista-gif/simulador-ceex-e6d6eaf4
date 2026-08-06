import { supabase } from "@/integrations/supabase/client";
import { CaseHint } from "@/types/diagnosis";

export const HintService = {
  async getByCase(caseId: string): Promise<CaseHint[]> {
    const { data, error } = await (supabase as any)
      .from('case_hints')
      .select('*')
      .eq('case_id', caseId)
      .order('level', { ascending: true });

    if (error) throw error;
    
    return (data as any[]).map(item => ({
      id: item.id,
      caseId: item.case_id,
      level: item.level,
      content: item.content,
      explanation: item.explanation,
      fundamentalBasis: item.fundamental_basis,
      xpPenalty: item.xp_penalty
    }));
  }
};
