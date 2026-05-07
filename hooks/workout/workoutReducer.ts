import { Workout } from "@/types/types";

type Action =
  | { type: "INIT"; payload: Workout }
  | { type: "ADD_SET"; payload: { exerciseInstanceId: string } }
  | { type: "UPDATE_SET"; payload: { exerciseInstanceId: string; setId: string; field: 'weight' | 'reps' | 'rir'; value: number } }
  | { type: "DELETE_SET"; payload: { exerciseInstanceId: string; setId: string } }
  | { type: "TOGGLE_SET"; payload: { exerciseInstanceId: string; setId: string } }
  | { type: "ADD_EXERCISE"; payload: { exerciseId: string } }
  | { type: "DELETE_EXERCISE"; payload: { exerciseId: string } }
  | { type: "RESET"; payload: Workout}
  | { type: "EDIT_WORKOUT"; payload: { name: string; description: string } }

export function workoutReducer(state: Workout, action: Action): Workout {
  switch (action.type) {

    case "INIT":
      return action.payload || state;

    case "RESET":
      return action.payload;

    case "EDIT_WORKOUT":
      return {
        ...state,
        name: action.payload.name,
        description: action.payload.description
      };

    case "ADD_SET":
      return {
        ...state,
        exercises: state.exercises.map(ex =>
          ex.id === action.payload.exerciseInstanceId
            ? {
                ...ex,
                sets: [
                  ...ex.sets,
                  {
                    id: crypto.randomUUID(),
                    exerciseInstanceId: ex.id,
                    set: ex.sets.length + 1,
                    weight: 0,
                    reps: 0,
                    rir: 0,
                    isPR: false,
                    isCompleted: false
                  }
                ]
              }
            : ex
        )
      };

    case "UPDATE_SET":
      return {
        ...state,
        exercises: state.exercises.map(ex =>
          ex.id === action.payload.exerciseInstanceId
            ? {
                ...ex,
                sets: ex.sets.map(s =>
                  s.id === action.payload.setId
                    ? { ...s, [action.payload.field]: action.payload.value }
                    : s
                )
              }
            : ex
        )
      };

    case "TOGGLE_SET":
      return {
        ...state,
        exercises: state.exercises.map(ex =>
          ex.id === action.payload.exerciseInstanceId
            ? {
                ...ex,
                sets: ex.sets.map(s =>
                  s.id === action.payload.setId
                    ? { ...s, isCompleted: !s.isCompleted }
                    : s
                )
              }
            : ex
        )
      };

    case "DELETE_SET":
      return {
        ...state,
        exercises: state.exercises.map(ex =>
          ex.id === action.payload.exerciseInstanceId
            ? {
                ...ex,
                sets: ex.sets
                  .filter(s => s.id !== action.payload.setId)
                  .map((s, i) => ({ ...s, set: i + 1 })) // reordenar
              }
            : ex
        )
      };

    case "ADD_EXERCISE":
      const instanceId = crypto.randomUUID();  

      return {
        ...state,
        exercises: [
          ...state.exercises,
          {
            id: instanceId,
            exercise_id: action.payload.exerciseId,
            sets: [
              {
                id: crypto.randomUUID(),
                exerciseInstanceId: instanceId,
                set: 1,
                weight: 0,
                reps: 0,
                rir: 0,
                isCompleted: false,
                isPR: false
              }
            ]
          }
        ]
      };
    
    case "DELETE_EXERCISE":
      return {
        ...state,
        exercises: state.exercises.filter(ex => ex.id !== action.payload.exerciseId)
      };

    default:
      return state;
  }
}