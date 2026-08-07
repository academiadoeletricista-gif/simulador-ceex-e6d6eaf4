import { supabase } from "@/integrations/supabase/client";
import { Result, ok, fail } from "@/lib/result/Result";
import { CaseSession, sessionRepository } from "@/repositories/SessionRepository";

export const SessionService = {
  async getByCaseId(caseId: string): Promise<Result<CaseSession | null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn("[SessionService] No authenticated user found");
      }
      
      const userId = user?.id;
      if (!userId) return fail("User not authenticated");

      return sessionRepository.findByUserIdAndCaseId(userId, caseId);
    } catch (e: any) {
      console.error("[SessionService] Error in getByCaseId:", e);
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

      console.log(`[SessionService] Starting session for user ${user.id} and case ${caseId}`);

      return sessionRepository.upsert({
        user_id: user.id,
        case_id: caseId,
        status: 'in_progress',
        current_step: 0,
        answers: {},
        start_time: new Date().toISOString()
      });
    } catch (e: any) {
      console.error("[SessionService] Error starting session:", e);
      return fail(e.message);
    }
  },

  async updateSession(id: string, data: Partial<CaseSession>): Promise<Result<CaseSession>> {
    return sessionRepository.update(id, data);
  }
};
