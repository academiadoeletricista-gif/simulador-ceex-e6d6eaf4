import { supabase } from "@/integrations/supabase/client";
import { CaseMeasurement } from "@/types/diagnosis";

export const MeasurementService = {
  async getByCase(caseId: string): Promise<CaseMeasurement[]> {
    const { data, error } = await supabase
      .from('case_measurements')
      .select('*')
      .eq('case_id', caseId);

    if (error) throw error;
    return data as CaseMeasurement[];
  },

  async getByPoint(caseId: string, pointCode: string): Promise<CaseMeasurement | null> {
    const { data, error } = await supabase
      .from('case_measurements')
      .select('*')
      .eq('case_id', caseId)
      .eq('point_code', pointCode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as CaseMeasurement;
  }
};
