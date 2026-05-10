
import { exerciseService } from "@/services/exercises.service";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateExerciseMutation() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn:
      exerciseService.create,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["exercises"]
      });

      toast.success(
        "Ejercicio agregado"
      );
    }
  });
}