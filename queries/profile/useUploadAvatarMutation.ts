"use client";

import { profileService } from "@/services/profile.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Payload = {
  userId: string;
  file: File;
};

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, file }: Payload) => {
      const avatarUrl = await profileService.uploadAvatar(
        userId,
        file
      );

      return await profileService.update(userId, {
        avatar_url: avatarUrl
      });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId]
      });

      toast.success("Avatar actualizado");
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });
}