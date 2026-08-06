import { sessionRepository, CaseSession } from "@/repositories/SessionRepository";
import { Result, fail } from "@/lib/result/Result";
import { supabase } from "@/integrations/supabase/client";

export const SessionService = {
  async getByCaseId(caseId: string): Promise<Result<CaseSession | null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail("User not authenticated");
      
      return sessionRepository.findByUserIdAndCaseId(user.id, caseId);
    } catch (e: any) {
      return fail(e.message);
    }
  },

  async getAllSessions(): Promise<Result<CaseSession[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail("User not authenticated");
      
      return sessionRepository.findAllByUserId(user.id);
    } catch (e: any) {
      return fail(e.message);
    }
  },

  async startSession(caseId: string): Promise<Result<CaseSession>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail("User not authenticated");

      return sessionRepository.upsert({
        user_id: user.id,
        case_id: caseId,
        status: 'in_progress',
        current_step: 0,
        answers: {},
        start_time: new Date().toISOString()
      });
    } catch (e: any) {
      return fail(e.message);
    }
  },

  async updateSession(id: string, data: Partial<CaseSession>): Promise<Result<CaseSession>> {
    return sessionRepository.update(id, data);
  }
};
