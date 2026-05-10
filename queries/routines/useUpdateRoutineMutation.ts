import { routineService } from "@/services/routine.service";
import { Routine } from "@/types/types";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateRoutineMutation() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: ({ id, data } : { id: string; data: Partial<Routine> }) =>
      routineService.update(id, data),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["routines"]
      });

      toast.success(
        "Rutina actualizada"
      );
    },

    onError: () => {

      toast.error(
        "Error al actualizar la rutina"
      );
    }
  });
}