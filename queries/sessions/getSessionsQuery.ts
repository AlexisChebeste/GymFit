import { sessionService } from "@/services/sessions.service";
import { useQuery } from "@tanstack/react-query"

export function useSessionsQuery(
  userId: string
) {
    const queryKey = ['sessions', userId];

    const { data, isPending, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => sessionService.getAll(userId),
        enabled: !!userId
    })

    return { data, isLoading: isPending, error };
}
