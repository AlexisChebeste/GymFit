import { exerciseService } from "@/services/exercises.service";
import { profileService } from "@/services/profile.service";
import { useQuery } from "@tanstack/react-query"

export function useProfileQuery(
  userId?: string
) {
    const queryKey = ['profile', userId];

    const { data, isPending, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => profileService.getById(userId!),
        enabled: !!userId
    })

    return { data, isLoading: isPending, error };
}
