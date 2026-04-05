import { Workout } from "@/types/types";

type Action =
  | { type: "INIT"; payload: Workout }
  | { type: "ADD_EXERCISE"; payload: { name: string; type: string } }
  | { type: "ADD_SET"; payload: { exerciseId: string } }
  | { type: "UPDATE_SET"; payload: { exerciseId: string; setId: string; field: 'weight' | 'reps' | 'rir'; value: number } }
  | { type: "TOGGLE_SET"; payload: { exerciseId: string; setId: string } }
  | { type: "EDIT_EXERCISE"; payload: { exerciseId: string; name: string; type: string } }
  | { type: "DELETE_SET"; payload: { exerciseId: string; setId: string } }
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


    case "ADD_EXERCISE":
      return {
        ...state,
        exercises: [
          ...state.exercises,
          {
            id: crypto.randomUUID(),
            workoutId: state.id,
            name: action.payload.name,
            type: action.payload.type,
            sets: []
          }
        ]
      };

    case "ADD_SET":
      return {
        ...state,
        exercises: state.exercises.map(ex =>
          ex.id === action.payload.exerciseId
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
          ex.id === action.payload.exerciseId
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
          ex.id === action.payload.exerciseId
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

    case "EDIT_EXERCISE":
      return {
        ...state,
        exercises: state.exercises.map(ex =>
          ex.id === action.payload.exerciseId
            ? { ...ex, name: action.payload.name, type: action.payload.type }
            : ex
        )
      };

    case "DELETE_SET":
      return {
        ...state,
        exercises: state.exercises.map(ex =>
          ex.id === action.payload.exerciseId
            ? {
                ...ex,
                sets: ex.sets
                  .filter(s => s.id !== action.payload.setId)
                  .map((s, i) => ({ ...s, set: i + 1 })) // reordenar
              }
            : ex
        )
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