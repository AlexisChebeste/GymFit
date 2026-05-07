import { Routine, Workout } from "@/types/types";

export function getWorkoutSchedule(
  routine: Routine | null,
  templates: Workout[]
) {
  if (!routine) {
    return {
      todayWorkout: null,
      nextWorkout: null,
      isToday: false,
      label: null,
    };
  }

  const today = new Date().getDay()-1;

  const todayPlan = routine.days.find((d) => d.day === today);

  if (todayPlan) {
    const template = templates.find(
      (t) => t.id === todayPlan.templateId
    );

    return {
      todayWorkout: template || null,
      nextWorkout: template || null,
      isToday: true,
      label: "Hoy",
    };
  }

  for (let i = 1; i < 7; i++) {
    const checkDay = (today + i) % 7;

    const found = routine.days.find((d) => d.day === checkDay);

    if (found) {
      const template = templates.find(
        (t) => t.id === found.templateId
      );

      return {
        todayWorkout: null,
        nextWorkout: template || null,
        isToday: false,
        label: i === 1 ? "Mañana" : `En ${i} días`,
      };
    }
  }

  return {
    todayWorkout: null,
    nextWorkout: null,
    isToday: false,
    label: null,
  };
}