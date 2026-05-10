import {
  detectFatigue,
  detectPlateau,
  detectProgression
} from "./workout.analytics";

export function generateExerciseInsight(
  scores: number[]
) {

  if (scores.length < 3) {
    return {
      type: "neutral",
      message:
        "Seguí registrando sesiones para desbloquear insights."
    };
  }

  const current = scores.at(-1)!;
  const previous = scores.at(-2)!;

  if (detectPlateau(scores)) {
    return {
      type: "plateau",
      message:
        "Estancamiento detectado. Probá variar intensidad."
    };
  }

  if (detectFatigue(current, previous)) {
    return {
      type: "fatigue",
      message:
        "Tu rendimiento cayó notablemente. Considerá descanso."
    };
  }

  if (detectProgression(current, previous)) {
    return {
      type: "progress",
      message:
        "Buen progreso. Estás moviendo más carga."
    };
  }

  return {
    type: "neutral",
    message:
      "Manteniendo rendimiento estable."
  };
}