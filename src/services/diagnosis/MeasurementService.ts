import { supabase } from "@/integrations/supabase/client";
import { CaseMeasurement } from "@/types/diagnosis";

export const MeasurementService = {
  async getByCase(caseId: string): Promise<CaseMeasurement[]> {
    const { data, error } = await supabase
      .from('case_measurements')
      .select('*')
      .eq('case_id', caseId);

    if (error) throw error;
    
    return (data as any[]).map(item => ({
      id: item.id,
      caseId: item.case_id,
      measurementPointId: item.measurement_point_id,
      pointCode: item.point_code,
      expectedValue: item.expected_value,
      realValue: item.real_value,
      presentedValue: item.presented_value,
      unit: item.unit,
      precision: item.precision,
      tolerance: item.tolerance,
      displayMessage: item.display_message,
      state: item.state,
      condition: item.condition
    }));
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

    const item = data as any;
    return {
      id: item.id,
      caseId: item.case_id,
      measurementPointId: item.measurement_point_id,
      pointCode: item.point_code,
      expectedValue: item.expected_value,
      realValue: item.real_value,
      presentedValue: item.presented_value,
      unit: item.unit,
      precision: item.precision,
      tolerance: item.tolerance,
      displayMessage: item.display_message,
      state: item.state,
      condition: item.condition
    };
  }
};
