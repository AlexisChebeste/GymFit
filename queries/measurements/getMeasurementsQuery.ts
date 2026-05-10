import { measurementsService } from "@/services/measurements.service";
import { useQuery } from "@tanstack/react-query"

export function useMeasurementsQuery(
  userId: string
) {
    const queryKey = ['measurements', userId];

    const { data, isPending, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => measurementsService.getAll(userId),
        enabled: !!userId
    })

    return { data, isLoading: isPending, error };
}
