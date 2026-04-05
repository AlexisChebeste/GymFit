import { Workout} from "@/types/types";

export const workoutData : Workout = {
  id: "1",
  userId: "123",
  name: "Torso 1",
  description: "Ejercicios para el pecho, espalda y bíceps.",
  exercises: [
      {
        id: "1",
        name: "Press de banca",
        type: "Barra",
        workoutId: "1",
        sets: [
            {id: "1", exerciseInstanceId: "1", set: 1, weight: 80, reps: 10, isPR: true , isCompleted: false },
            {id: "2", exerciseInstanceId: "1", set: 2, weight: 70, reps: 10 ,isPR: false, isCompleted: false},
            {id: "3", exerciseInstanceId: "1", set: 3, weight: 60, reps: 10, isPR: false, isCompleted: false },
            {id: "4", exerciseInstanceId: "1", set: 4, weight: 50, reps: 10, isPR: false, isCompleted: false }
        ]
      },
      {
        id: "2",
        name: "Remo con barra",
        type: "Barra",
        workoutId: "1",
        sets: [
            {id: "1", exerciseInstanceId: "2", set: 1, weight: 70, reps: 10, isPR: true, isCompleted: false },
            {id: "2", exerciseInstanceId: "2", set: 2, weight: 60, reps: 10 ,isPR: false, isCompleted: false},
            {id: "3", exerciseInstanceId: "2", set: 3, weight: 50, reps: 10, isPR: false, isCompleted: false },
            {id: "4", exerciseInstanceId: "2", set: 4, weight: 40, reps: 10, isPR: false, isCompleted: false }
        ],
      },
      {
        id: "3",
        name: "Peck Deck",
        sets: [
            {id: "1", exerciseInstanceId: "3", set: 1, weight: 60, reps: 10, isPR: true, isCompleted: false },
            {id: "2", exerciseInstanceId: "3", set: 2, weight: 50, reps: 10 ,isPR: false, isCompleted: false},
            {id: "3", exerciseInstanceId: "3", set: 3, weight: 40, reps: 10, isPR: false, isCompleted: false },
            {id: "4", exerciseInstanceId: "3", set: 4, weight: 30, reps: 10, isPR: false, isCompleted: false }
        ],
        type: "Maquina",
        workoutId: "1",
      }
  ],
  color: "#39ff14",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function getInitialWorkout(template: Workout): Workout {
  if (typeof window === "undefined") return template;

  const saved = localStorage.getItem("active_session");

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return template;
    }
  }

  return template;
}