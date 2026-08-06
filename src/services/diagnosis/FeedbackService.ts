import { supabase } from "@/integrations/supabase/client";

export const FeedbackService = {
  async getByCase(caseId: string) {
    const { data, error } = await supabase
      .from('case_feedback')
      .select('*')
      .eq('case_id', caseId);

    if (error) throw error;
    return data;
  },

  async saveFeedback(caseId: string, feedback: any) {
    const { data, error } = await supabase
      .from('case_feedback')
      .upsert({
        case_id: caseId,
        ...feedback,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  }
};
