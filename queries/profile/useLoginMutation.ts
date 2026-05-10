"use client";

import { authService } from "@/services/auth.services";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Payload = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ email, password }: Payload) =>
      authService.login(email, password),

    onSuccess: () => {
      toast.success("Bienvenido");
    },

    onError: () => {
      toast.error("Credenciales inválidas");
    }
  });
}