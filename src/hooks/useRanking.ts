import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";

export interface RankingEntry {
  id: string;
  full_name: string;
  avatar_url: string;
  xp: number;
  level: number;
  role: string;
  rank: number;
}

export const useRanking = () => {
  return useQuery({
    queryKey: ['ranking'],
    queryFn: async (): Promise<Result<RankingEntry[]>> => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, xp, level, role')
          .order('xp', { ascending: false })
          .limit(100);

        if (error) return fail(error.message, error.code);

        const ranking = (data || []).map((p, index) => ({
          id: p.id,
          full_name: p.full_name || 'Usuário',
          avatar_url: p.avatar_url || '',
          xp: p.xp || 0,
          level: p.level || 1,
          role: p.role || 'Técnico',
          rank: index + 1
        }));

        return ok(ranking);
      } catch (e: any) {
        return fail(e.message);
      }
    },
  });
};
