import { supabase } from "../integrations/supabase/client";
import { CaseRepository } from "./CaseRepository";

export const forceDebugCases = async () => {
  console.log('--- EMERGENCY CASE DEBUG ---');
  
  // 1. Test connection and raw data
  const { data, error } = await supabase.from('cases').select('id, code, published, laboratory_id');
  console.log('Raw cases fetch result:', { count: data?.length, error });
  
  if (data) {
    data.forEach(c => {
      console.log(`Case: ${c.code} | ID: ${c.id} | Published: ${c.published} | LabID: ${c.laboratory_id}`);
    });
  }

  // 2. Test Repository directly
  const repo = new CaseRepository();
  const labId = window.location.pathname.split('/').pop();
  console.log('Current URL LabID:', labId);
  
  if (labId && labId !== 'library') {
    const result = await repo.findByLaboratoryId(labId);
    console.log('Repo findByLaboratoryId result:', result);
  }
  
  console.log('--- END DEBUG ---');
};

if (typeof window !== 'undefined') {
  (window as any).forceDebugCases = forceDebugCases;
}
