import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/services/ProfileService";
import { Profile } from "@/store/useAppStore";

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => ProfileService.getCurrentProfile(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Profile>) => ProfileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useAddXp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => ProfileService.addXp(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
