"use client";

import { authService } from "@/services/auth.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: async  () => {
      queryClient.clear();

      toast.success("Sesión cerrada");
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });
}