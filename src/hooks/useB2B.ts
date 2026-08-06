import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";

export interface TeamMember {
  id: string;
  full_name: string;
  avatar_url: string;
  xp: number;
  level: number;
  last_activity: string;
  completion_rate: number;
}

export interface OrganizationStats {
  total_members: number;
  average_xp: number;
  total_certifications: number;
  active_simulations: number;
}

export const useB2BData = () => {
  return useQuery({
    queryKey: ['b2b-data'],
    queryFn: async (): Promise<Result<{ members: TeamMember[], stats: OrganizationStats }>> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return fail("User not authenticated");

        // Get user profile to find organization_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (!profile?.organization_id) return fail("User does not belong to an organization");

        // Get members
        const { data: membersData, error: membersError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, xp, level, updated_at')
          .eq('organization_id', profile.organization_id);

        if (membersError) return fail(membersError.message);

        const members: TeamMember[] = (membersData || []).map(m => ({
          id: m.id,
          full_name: m.full_name || 'Usuário',
          avatar_url: m.avatar_url || '',
          xp: m.xp || 0,
          level: m.level || 1,
          last_activity: m.updated_at,
          completion_rate: Math.floor(Math.random() * 40) + 60 // Mock for now
        }));

        const stats: OrganizationStats = {
          total_members: members.length,
          average_xp: members.length > 0 ? members.reduce((acc, m) => acc + m.xp, 0) / members.length : 0,
          total_certifications: members.length * 2, // Mock
          active_simulations: Math.floor(members.length * 0.4) // Mock
        };

        return ok({ members, stats });
      } catch (e: any) {
        return fail(e.message);
      }
    },
  });
};
