import { routineService } from "@/services/routine.service";
import { useQuery } from "@tanstack/react-query"

export function useRoutinesQuery(
  userId: string
) {
    const queryKey = ['routines', userId];

    const { data, isPending, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => routineService.getRoutineSingle(userId),
        enabled: !!userId
    })

    return { data, isLoading: isPending, error };
}
