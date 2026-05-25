import { useQuery } from "@tanstack/react-query";
import { performanceService } from "@/services/performance.service";

export function useWorkoutPerformanceQuery(
  userId?: string,
  workoutId?: string
) {
  return useQuery({
    queryKey: ["workout-performance", workoutId],
    queryFn: () =>
      performanceService.getWorkoutPerformance(
        userId!,
        workoutId!
      ),
    enabled: !!userId && !!workoutId,
    staleTime: 1000 * 60 * 5
  });
}