import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";

export interface Certification {
  id: string;
  name: string;
  issue_date: string;
  expiry_date?: string;
  certificate_url: string;
  case_id: string;
  case_title: string;
}

export const useCertifications = () => {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: async (): Promise<Result<Certification[]>> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return fail("User not authenticated");

        // In a real scenario, this would be a real table. 
        // For now, let's mock it based on completed sessions if the table doesn't exist
        // or just return empty for now to avoid crashes if table doesn't exist.
        
        // Let's assume there is a 'certifications' table
        const { data, error } = await supabase
          .from('certifications' as any)
          .select('*, diagnostic_cases(title)')
          .eq('user_id', user.id);

        if (error) return fail(error.message, error.code);

        const certifications = (data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          issue_date: c.issue_date,
          expiry_date: c.expiry_date,
          certificate_url: c.certificate_url,
          case_id: c.case_id,
          case_title: c.diagnostic_cases?.title || 'Caso Técnico'
        }));

        return ok(certifications);
      } catch (e: any) {
        return fail(e.message);
      }
    },
  });
};
