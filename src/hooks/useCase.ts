import { useQuery } from "@tanstack/react-query";
import { CaseService } from "@/services/CaseService";

export const useCases = () => {
  return useQuery({
    queryKey: ['cases'],
    queryFn: () => CaseService.getAll(),
  });
};

export const useCase = (id: string) => {
  return useQuery({
    queryKey: ['case', id],
    queryFn: () => CaseService.getById(id),
    enabled: !!id,
  });
};

export const useCasesByLab = (labId: string) => {
  return useQuery({
    queryKey: ['cases', 'lab', labId],
    queryFn: () => CaseService.getByLab(labId),
    enabled: !!labId,
  });
};
