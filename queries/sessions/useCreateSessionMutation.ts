
import { sessionService } from "@/services/sessions.service";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateSessionMutation() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn:
      sessionService.create,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["sessions"]
      });

      toast.success(
        "Sesión agregada"
      );
    }
  });
}