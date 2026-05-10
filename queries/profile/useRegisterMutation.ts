"use client";

import { authService } from "@/services/auth.services";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authService.register,

    onSuccess: () => {
      toast.success("Cuenta creada");
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });
}