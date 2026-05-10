import { measurementsService } from "@/services/measurements.service";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateMeasurementMutation() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn:
      measurementsService.update,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["measurements"]
      });

      toast.success(
        "Medición actualizada"
      );
    }
  });
}