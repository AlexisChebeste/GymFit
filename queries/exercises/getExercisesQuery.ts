import { exerciseService } from "@/services/exercises.service";
import { useQuery } from "@tanstack/react-query"

export function useExercisesQuery(
  userId: string
) {
    const queryKey = ['exercises', userId];

    const { data, isPending, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => exerciseService.getAll(userId),
        enabled: !!userId
    })

    return { data, isLoading: isPending, error };
}
