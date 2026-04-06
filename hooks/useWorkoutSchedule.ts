import { Routine, Workout } from "@/types/types";
import { useMemo } from "react";

export function useWorkoutSchedule(routine: Routine | null, templates: Workout[]) {
  return useMemo(() => {
    if (!routine) {
      return {
        todayWorkout: null,
        nextWorkout: null,
        isToday: false,
        label: null
      };
    }

    const today = new Date().getDay();

    // buscar hoy
    const todayPlan = routine.days.find(d => d.day === today);

    if (todayPlan) {
      const template = templates.find(t => t.id === todayPlan.templateId);

      return {
        todayWorkout: template || null,
        nextWorkout: template || null,
        isToday: true,
        label: "Hoy"
      };
    }

    // buscar próxima
    for (let i = 1; i < 7; i++) {
      const checkDay = (today + i) % 7;

      const found = routine.days.find(d => d.day === checkDay);

      if (found) {
        const template = templates.find(t => t.id === found.templateId);

        let label = "";
        if (i === 1) label = "Mañana";
        else label = `En ${i} días`;

        return {
          todayWorkout: null,
          nextWorkout: template || null,
          isToday: false,
          label
        };
      }
    }


    return {
      todayWorkout: null,
      nextWorkout: null,
      isToday: false,
      label: null
    };
  }, [routine, templates]);
}