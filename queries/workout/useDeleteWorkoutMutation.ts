import { workoutService } from "@/services/workout.service";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteWorkoutMutation() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn:(workoutId: string) =>
      workoutService.delete(workoutId),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["workouts"]
      });

      toast.success(
        "Rutina eliminada"
      );
    }
  });
}