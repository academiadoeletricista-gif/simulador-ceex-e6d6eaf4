import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";

export interface CaseSession {
  id: string;
  user_id: string;
  case_id: string;
  status: 'in_progress' | 'completed';
  current_step: number;
  answers: Record<string, any>;
  start_time: string;
  completed_at?: string;
  last_activity?: string;
}

export class SessionRepository {
  async findByUserIdAndCaseId(userId: string, caseId: string): Promise<Result<CaseSession | null>> {
    try {
      const { data, error } = await supabase
        .from('case_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('case_id', caseId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return ok(null);
        return fail(error.message, error.code);
      }
      return ok(data as unknown as CaseSession);
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async findAllByUserId(userId: string): Promise<Result<CaseSession[]>> {
    try {
      const { data, error } = await supabase
        .from('case_sessions')
        .select('*')
        .eq('user_id', userId);

      if (error) return fail(error.message, error.code);
      return ok(data as unknown as CaseSession[]);
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async upsert(session: Partial<CaseSession>): Promise<Result<CaseSession>> {
    try {
      const { data, error } = await supabase
        .from('case_sessions')
        .upsert(session as any, { onConflict: 'user_id,case_id' })
        .select()
        .single();

      if (error) return fail(error.message, error.code);
      return ok(data as unknown as CaseSession);
    } catch (e: any) {
      return fail(e.message);
    }
  }

  async update(id: string, data: Partial<CaseSession>): Promise<Result<CaseSession>> {
    try {
      const { data: updated, error } = await supabase
        .from('case_sessions')
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      if (error) return fail(error.message, error.code);
      return ok(updated as unknown as CaseSession);
    } catch (e: any) {
      return fail(e.message);
    }
  }
}

export const sessionRepository = new SessionRepository();
