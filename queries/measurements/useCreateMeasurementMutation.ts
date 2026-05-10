import { measurementsService } from "@/services/measurements.service";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateMeasurementMutation() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn:
      measurementsService.create,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["measurements"]
      });

      toast.success(
        "Medición agregada"
      );
    }
  });
}