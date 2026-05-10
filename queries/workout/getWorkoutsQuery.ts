import { workoutService } from "@/services/workout.service";
import { useQuery } from "@tanstack/react-query"

export function useWorkoutsQuery(
  userId: string
) {
    const queryKey = ['workouts', userId];

    const { data, isPending, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => workoutService.getAll(userId),
        enabled: !!userId
    })

    return { data, isLoading: isPending, error };
}
