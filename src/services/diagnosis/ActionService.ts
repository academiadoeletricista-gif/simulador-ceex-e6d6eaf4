import { supabase } from "@/integrations/supabase/client";
import { CaseAction } from "@/types/diagnosis";

export const ActionService = {
  async getByCase(caseId: string): Promise<CaseAction[]> {
    const { data, error } = await supabase
      .from('case_actions')
      .select('*')
      .eq('case_id', caseId);

    if (error) throw error;
    
    return (data as any[]).map(item => ({
      id: item.id,
      caseId: item.case_id,
      name: item.name,
      description: item.description,
      category: item.category,
      timeCost: item.time_cost,
      xpReward: item.xp_reward,
      requiredTool: item.required_tool,
      expectedResult: item.expected_result,
      realResult: item.real_result,
      impact: item.impact
    }));
  }
};
