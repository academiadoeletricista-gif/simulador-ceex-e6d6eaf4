import { profileRepository } from "@/repositories/ProfileRepository";
import { Result, fail } from "@/lib/result/Result";
import { Profile } from "@/store/useAppStore";
import { supabase } from "@/integrations/supabase/client";

export const ProfileService = {
  async getCurrentProfile(): Promise<Result<Profile | null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail("User not authenticated");
      
      return profileRepository.findById(user.id);
    } catch (e: any) {
      return fail(e.message);
    }
  },

  async updateProfile(data: Partial<Profile>): Promise<Result<Profile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail("User not authenticated");
      
      return profileRepository.update(user.id, data);
    } catch (e: any) {
      return fail(e.message);
    }
  },

  async addXp(amount: number): Promise<Result<Profile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail("User not authenticated");

      const profileResult = await profileRepository.findById(user.id);
      if (!profileResult.success || !profileResult.data) {
        return fail("Profile not found");
      }

      const profile = profileResult.data;
      const newXp = (profile.xp || 0) + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;

      return profileRepository.update(user.id, { xp: newXp, level: newLevel });
    } catch (e: any) {
      return fail(e.message);
    }
  }
};
