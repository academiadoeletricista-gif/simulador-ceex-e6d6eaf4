import { profileRepository } from "@/repositories/ProfileRepository";
import { Result, fail, ok } from "@/lib/result/Result";
import { Profile } from "@/store/useAppStore";
import { supabase } from "@/integrations/supabase/client";

export const ProfileService = {
  async getCurrentProfile(): Promise<Result<Profile | null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail("User not authenticated");
      
      const result = await profileRepository.findById(user.id);
      
      // If profile doesn't exist (e.g. trigger failed or delay), create a default one
      if (result.success && !result.data) {
        console.log("Profile not found for user, creating default...");
        const newProfile: Partial<Profile> = {
          id: user.id,
          full_name: user.is_anonymous ? 'Visitante Anônimo' : (user.user_metadata?.full_name || 'Usuário'),
          avatar_url: user.user_metadata?.avatar_url || '',
          xp: 0,
          level: 1,
          theme: 'dark',
          language: 'pt-br'
        };
        
        // Use upsert to be safe
        const { data, error } = await supabase
          .from('profiles')
          .upsert(newProfile as any)
          .select()
          .single();
          
        if (error) {
          console.error("Failed to create default profile:", error);
          // Return the original result (null) if we can't create one
          return result;
        }
        return ok(data as unknown as Profile);
      }
      
      return result;
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
