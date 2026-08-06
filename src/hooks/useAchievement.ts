import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  xpReward: number;
}

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async (): Promise<Result<Achievement[]>> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return fail("User not authenticated");

        // This is a placeholder as we don't have a user_achievements table join yet
        // In a real scenario, we'd join achievements with user_achievements
        const { data, error } = await supabase
          .from('achievements')
          .select('*');

        if (error) return fail(error.message, error.code);

        const achievements = (data || []).map(a => ({
          id: a.id,
          title: a.title,
          description: a.description,
          progress: 0, // Placeholder
          maxProgress: a.max_progress,
          completed: false, // Placeholder
          xpReward: a.xp_reward
        }));

        return ok(achievements);
      } catch (e: any) {
        return fail(e.message);
      }
    },
  });
};
