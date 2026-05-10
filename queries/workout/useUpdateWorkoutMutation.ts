import { workoutService } from "@/services/workout.service";
import { Workout } from "@/types/types";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateWorkoutMutation() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: ({workoutId, workoutData}: { workoutId: string; workoutData: Partial<Workout> }) => workoutService.update(workoutId, workoutData),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["workouts"]
      });

      toast.success(
        "Rutina actualizada"
      );
    }
  });
}