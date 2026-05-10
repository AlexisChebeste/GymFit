"use client";

import { profileService } from "@/services/profile.service";
import { UserProfile } from "@/types/types";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

type Payload = {
  userId: string;
  data: Partial<UserProfile>;
};

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: Payload) =>
      profileService.update(userId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId]
      });

      toast.success("Perfil actualizado");
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });
}