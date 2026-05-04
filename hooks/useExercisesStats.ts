import { useMemo } from "react";
import { WorkoutSession } from "@/types/types";

type Set = {
  weight: number;
  reps: number;
  rir: number;
};

export type BestSet = {
  date: string;
  rawDate: string;
  weight: number;
  reps: number;
  rir?: number;
  score: number;
};

export type ExerciseStats = {
  bestSets: BestSet[];
  pr: Set | null;
  totalVolume: number;
  frequency: number;
  progress: number | null;
  insights: string;
};

export function useExerciseStats(
  sessions: WorkoutSession[],
  exerciseId: string,
  range: "30D" | "3M" | "6M" | "ALL"
) {

  //  SCORE (prioriza peso real)
  function getSetScore(s : Set) {
    return s.weight * (1 + (s.reps + s.rir) / 30);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short"
    });
  }

  function filterByRange(date: string, range: string) {
    const d = new Date(date);

    if (isNaN(d.getTime())) return false; 

    const now = new Date();
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

    if (range === "30D") return diffDays <= 30;
    if (range === "3M") return diffDays <= 90;
    if (range === "6M") return diffDays <= 180;
    return true;
  }

  //  1. TODAS las sesiones del ejercicio (sin filtro)
  const allExerciseSessions = useMemo(() => {
    return sessions
      .map(session => {
        const ex = session.exercises.find(
          e => e.exercise_id === exerciseId
        );
        if (!ex) return null;

        return {
          date: session.date,
          sets: ex.sets
        };
      })
      .filter(Boolean) as { date: string; sets: Set[] }[];
  }, [sessions, exerciseId]);

  //  2. Sesiones filtradas por rango (para gráfico + métricas dinámicas)
  const filteredSessions = useMemo(() => {

    return allExerciseSessions.filter(session =>
      filterByRange(session.date, range)
    );
  }, [allExerciseSessions, range]);

  //  3. Ordenar por fecha (IMPORTANTE)
  const sortedSessions = useMemo(() => {
    return [...filteredSessions].sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [filteredSessions]);

  // 4. Limitar sesiones para gráfico (UX limpia)
  const lastSessions = useMemo(() => {
    return sortedSessions.slice(-12);
  }, [sortedSessions]);

  //  5. Best set por sesión (para gráfico)
  const bestSets = useMemo(() => {
    return lastSessions.map(session => {
      const best = session.sets.reduce((a, b) =>
        getSetScore(a) > getSetScore(b) ? a : b
      );

      return {
        rawDate: session.date,
        date: formatDate(session.date),
        ...best,
        score: getSetScore(best)
      };
    });
  }, [lastSessions]);

  console.log({ bestSets });

  //  6. PR GLOBAL (NO depende del filtro)
  const pr = useMemo(() => {
    let best: Set | null = null;

    allExerciseSessions.forEach(session => {
      session.sets.forEach(set => {
        if (
          !best ||
          set.weight > best.weight ||
          (set.weight === best.weight && set.reps > best.reps)
        ) {
          best = set;
        }
      });
    });

    return best;
  }, [allExerciseSessions]);

  //  7. Volumen (según filtro)
  const totalVolume = useMemo(() => {
    return filteredSessions.reduce((acc, session) => {
      return (
        acc +
        session.sets.reduce(
          (sum, set) => sum + set.weight * set.reps,
          0
        )
      );
    }, 0);
  }, [filteredSessions]);

  // 8. Frecuencia (según filtro)
  const frequency = filteredSessions.length;

  //  9. Progreso (comparación interna del rango)
  const progress = useMemo(() => {
    if (filteredSessions.length < 2) return null;

    const mid = Math.floor(filteredSessions.length / 2);
    const firstHalf = filteredSessions.slice(0, mid);
    const secondHalf = filteredSessions.slice(mid);

    // Función para obtener el promedio de volumen por sesión
    const getAvgVolume = (sessions: typeof filteredSessions) => {
      if (sessions.length === 0) return 0;
      const totalVolume = sessions.reduce((acc, session) => {
        return acc + session.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      }, 0);
      return totalVolume / sessions.length; // Dividimos por cantidad de sesiones
    };

    const prevAvg = getAvgVolume(firstHalf);
    const currentAvg = getAvgVolume(secondHalf);

    if (prevAvg === 0) return null;

    // Calculamos la diferencia porcentual entre promedios
    return ((currentAvg - prevAvg) / prevAvg) * 100;
  }, [filteredSessions]);

  // 10. Insights
  const insights = useMemo(() => {
    if (bestSets.length < 3) return "Seguí registrando sesiones para desbloquear el análisis de rendimiento. ¡Vamos por ese progreso!";

    const scores = bestSets.map(s => s.score);
    const last = scores.at(-1)!;
    const prev = scores.at(-2)!;
    
    // 1. Detección de Estancamiento (Plateau)
    const isPlateau = scores.slice(-4).every(s => Math.abs(s - last) < (last * 0.02)); 
    if (isPlateau) return "Estancamiento detectado. Considerá un Deload o cambiar el rango de repeticiones para romper la meseta.";

    // 2. Progreso de Fuerza Real (1RM)
    const totalGain = ((last - scores[0]) / scores[0]) * 100;
    if (totalGain > 10) return `¡Increíble! Tu fuerza estimada subió un ${totalGain.toFixed(1)}% desde que empezaste.`;

    // 3. Eficiencia de Esfuerzo (RIR)
    const lastSet = bestSets.at(-1)!;
    if (lastSet.rir && lastSet.rir > 4) return "Estás moviendo buen peso, pero tu RIR es alto. Podrías intentar subir la carga en la próxima sesión.";

    // 4. Tu lógica de tendencia actual (simplificada)
    if (last > prev) return "Ganancia de fuerza respecto a la sesión anterior. ¡Buen trabajo! ";
    
    return "Manteniendo el nivel. La consistencia es la clave del crecimiento. ";
  }, [bestSets]);

  return {
    bestSets,
    pr,
    totalVolume,
    frequency,
    progress,
    insights
  };
}