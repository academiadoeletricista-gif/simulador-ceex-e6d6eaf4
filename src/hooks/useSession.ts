import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionService } from "@/services/SessionService";
import { CaseSession } from "@/repositories/SessionRepository";

export const useSession = (caseId: string) => {
  return useQuery({
    queryKey: ['session', caseId],
    queryFn: () => SessionService.getByCaseId(caseId),
    enabled: !!caseId,
  });
};

export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => SessionService.getAllSessions(),
  });
};

export const useStartSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caseId: string) => SessionService.startSession(caseId),
    onSuccess: (_, caseId) => {
      queryClient.invalidateQueries({ queryKey: ['session', caseId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CaseSession> }) => 
      SessionService.updateSession(id, data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['session', result.data.case_id] });
        queryClient.invalidateQueries({ queryKey: ['sessions'] });
      }
    },
  });
};
