import { useQuery } from "@tanstack/react-query";
import { LaboratoryService } from "@/services/LaboratoryService";

export const useLaboratories = () => {
  return useQuery({
    queryKey: ['laboratories'],
    queryFn: () => LaboratoryService.getAll(),
  });
};

export const useLaboratory = (id: string) => {
  return useQuery({
    queryKey: ['laboratory', id],
    queryFn: () => LaboratoryService.getById(id),
    enabled: !!id,
  });
};
