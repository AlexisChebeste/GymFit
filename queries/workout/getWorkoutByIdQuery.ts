import { workoutService } from "@/services/workout.service";
import { useQuery } from "@tanstack/react-query"

export function useWorkoutByIdQuery(
  workoutId: string
) {
    const queryKey = ['workouts', workoutId];

    const { data, isPending, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => workoutService.getById(workoutId),
        enabled: !!workoutId
    })

    return { data, isLoading: isPending, error };
}
