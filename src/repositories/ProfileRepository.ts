import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";
import { Profile } from "@/store/useAppStore";

export class ProfileRepository {
  async findById(id: string): Promise<Result<Profile | null>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return ok(null);
        return fail(error.message, error.code);
      }
      return ok(data as unknown as Profile);
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async update(id: string, data: Partial<Profile>): Promise<Result<Profile>> {
    try {
      const { data: updated, error } = await supabase
        .from('profiles')
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      if (error) return fail(error.message, error.code);
      return ok(updated as unknown as Profile);
    } catch (e: any) {
      return fail(e.message);
    }
  }
}

export const profileRepository = new ProfileRepository();
