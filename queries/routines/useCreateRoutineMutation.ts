import { routineService } from "@/services/routine.service";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateRoutineMutation() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn:
      routineService.create,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["routines"]
      });

      toast.success(
        "Rutina creada"
      );
    },

    onError: () => {

      toast.error(
        "Error al crear la rutina"
      );
    }
  });
}