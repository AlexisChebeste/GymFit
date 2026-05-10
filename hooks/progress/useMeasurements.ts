import { measurementsService } from "@/services/measurements.service";
import { BodyMeasurement } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";



export function useMeasurements(userId: string) {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const fetchMeasurements = async () => {
      try{
        const data = await measurementsService.getAll(userId);
        setMeasurements(data || []);
      } catch (error) {
        console.error("Error fetching routine:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeasurements();
  }, [userId]);

  const addMeasurement = async (newMeasurement: BodyMeasurement) => {

    try{
      const measurement = await measurementsService.create(newMeasurement);
      const updated = [...measurements, measurement].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setMeasurements(updated);
    } catch (error) {
      toast.error("Error al agregar medición: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const updateMeasurement = async (updated: BodyMeasurement) => {
    const newData = measurements.map(m =>
      m.id === updated.id ? updated : m
    );

    setMeasurements(newData);
    
    try{
      await measurementsService.update(updated);
    } catch (error) {
      toast.error("Error al actualizar medición: " + (error instanceof Error ? error.message : String(error))); 
    }
  };



  return {
    measurements,
    addMeasurement,
    updateMeasurement,
    isLoading
  };
}