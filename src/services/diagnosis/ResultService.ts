import { supabase } from "@/integrations/supabase/client";

export const ResultService = {
  async saveResult(result: any) {
    const { data, error } = await (supabase as any)
      .from('case_results')
      .insert({
        ...result,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  },

  async getByUser(userId: string) {
    const { data, error } = await (supabase as any)
      .from('case_results')
      .select('*, diagnostic_case:diagnostic_cases(title, code)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
