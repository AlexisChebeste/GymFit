import { Routine, WorkoutSession } from "@/types/types";
import { useMemo } from "react";

export function toLocalISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`; // Siempre devuelve YYYY-MM-DD local
}

export function useWeeklyStats(routine: Routine | null, sessions: WorkoutSession[]) {
  return useMemo(() => {
    // 1. Obtener el lunes de esta semana (Local)
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const diff = now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const monday = new Date(now.getFullYear(), now.getMonth(), diff);

    // 2. Generar la data de los 7 días
    const daysData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      
      const dateKey = toLocalISO(d);
      // JS: 0=Dom, 1=Lun... -> Tu DB: 1=Lun, 7=Dom
      const dayNum = d.getDay() === 0 ? 7 : d.getDay();

      return {
        date: d,
        dateKey,
        isToday: d.toDateString() === now.toDateString(),
        hasTrained: sessions.some(s => s.date === dateKey),
        isPlanned: routine?.days.some(rd => rd.day === dayNum) ?? false
      };
    });

    // 3. Métricas
    const plannedCount = routine?.days.length || 0;
    const trainedCount = daysData.filter(d => d.hasTrained).length;
    const completionRate = plannedCount === 0 ? 0 : (trainedCount / plannedCount) * 100;

    return {
      daysData,
      completionRate: Number(Math.min(completionRate, 100).toFixed(1)),
    };
  }, [routine, sessions]);
}