import { supabase } from "@/integrations/supabase/client";
import { DiagnosticCase } from "@/types/diagnosis";

export const CaseService = {
  async getAll(): Promise<DiagnosticCase[]> {
    const { data, error } = await supabase
      .from('diagnostic_cases')
      .select(`
        *,
        occurrence:case_occurrences(*),
        symptoms:case_symptoms(*),
        components:case_components(*),
        measurements:case_measurements(*),
        actions:case_actions(*),
        hypotheses:case_hypotheses(*),
        hints:case_hints(*),
        errors:case_errors(*),
        lesson:case_lessons(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as DiagnosticCase[];
  },

  async getById(id: string): Promise<DiagnosticCase | null> {
    const { data, error } = await supabase
      .from('diagnostic_cases')
      .select(`
        *,
        occurrence:case_occurrences(*),
        symptoms:case_symptoms(*),
        components:case_components(*),
        measurements:case_measurements(*),
        actions:case_actions(*),
        hypotheses:case_hypotheses(*),
        hints:case_hints(*),
        errors:case_errors(*),
        lesson:case_lessons(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as unknown as DiagnosticCase;
  },

  async getByLab(labId: string): Promise<DiagnosticCase[]> {
    const { data, error } = await supabase
      .from('diagnostic_cases')
      .select('*')
      .eq('laboratory_id', labId)
      .eq('status', 'published');

    if (error) throw error;
    return data as unknown as DiagnosticCase[];
  }
};
