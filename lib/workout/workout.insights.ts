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
      title: "RECOMENDACIÓN",
      text: "Seguí registrando tus sesiones. Necesito al menos 3 entrenamientos para empezar a darte consejos de rendimiento.",
      icon: "TrendingUp"
    };
  }

  const current = scores.at(-1)!;
  const previous = scores.at(-2)!;

  if (detectPlateau(scores)) {
    return {
      title: "ESTANCAMIENTO",
      text: "Estancamiento detectado. Probá variar intensidad.",
      icon: "TrendingDown"
    };
  }

  if (detectFatigue(current, previous)) {
    return {
      title: "FATIGA",
      text: "Fatiga detectada. Considerá tomar un día de descanso o hacer una sesión más liviana.",
      icon: "TrendingDown"
     };
  }

  if (detectProgression(current, previous)) {
    return {
      title: "PROGRESO",
      text: "¡Buen progreso! Estás moviendo más carga que la última vez. Mantené el buen trabajo.",
      icon: "TrendingUp"
    };
  }

  return {
    title: "RECOMENDACIÓN",
    text: "Manteniendo rendimiento estable.",
    icon: "Minus"
  };
}