import { workoutService } from "@/services/workout.service";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateWorkoutMutation() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn:
      workoutService.create,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["workouts"]
      });

      toast.success(
        "Rutina agregada"
      );
    }
  });
}