import { addExercise, addSet, deleteExercise, deleteSet, toggleSetCompletion, updateSet } from "@/lib/workout/workout.helpers";
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
      return addSet(state, action.payload.exerciseInstanceId);

    case "UPDATE_SET":
      return updateSet(
        state,
        action.payload.exerciseInstanceId,
        action.payload.setId,
        action.payload.field,
        action.payload.value
      );

    case "TOGGLE_SET":
      return toggleSetCompletion(
        state,
        action.payload.exerciseInstanceId,
        action.payload.setId
      );

    case "DELETE_SET":
      return deleteSet(
        state,
        action.payload.exerciseInstanceId,
        action.payload.setId
      );

    case "ADD_EXERCISE":
      return addExercise(state, action.payload.exerciseId);
    
    case "DELETE_EXERCISE":
      return deleteExercise(state, action.payload.exerciseId);

    default:
      return state;
  }
}