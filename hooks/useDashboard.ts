import { WorkoutSession } from "@/types/types";
import { useMemo } from "react";

type VolumePoint = {
  date: string;
  rawDate: string;
  volume: number;
};

const INSIGHT_MESSAGES = {
  STAGNATED: {
    title: "ESTANCAMIENTO DETECTADO",
    text: "Llevás 3 sesiones con un volumen similar. Es momento de variar el rango de repeticiones o ajustar la carga para romper la meseta.",
    icon: "ShieldAlert"
  },
  PROGRESSING: {
    title: "TENDENCIA DE MEJORA",
    text: "¡Excelente! Tu volumen total está en ascenso. Mantener esta tendencia es clave para la hipertrofia a largo plazo.",
    icon: "Zap"
  },
  FATIGUE: {
    title: "ALERTA DE FATIGA",
    text: "Tu rendimiento bajó en la última sesión. Si no fue intencional (Deload), priorizá el descanso y el sueño esta noche.",
    icon: "Moon"
  },
  NEW_PR: {
    title: "RÉCORD PERSONAL",
    text: "¡Felicidades! Superaste tu mejor marca histórica. Tu sistema nervioso está rindiendo al máximo.",
    icon: "Trophy"
  }
};

export function useDashboard(sessions: WorkoutSession[]) {

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
    });
  }

  function getSessionVolume(session: WorkoutSession) {
    return session.exercises.reduce((total, ex) => {
      return total + ex.sets.reduce((sum, set) => {
        return sum + set.weight * set.reps;
      }, 0);
    }, 0);
  }

  // 1. Volumen por sesión (ordenado + limpio)
  const volumeData: VolumePoint[] = useMemo(() => {
    return sessions
      .slice(-10)
      .map((session) => ({
        date: formatDate(session.date),
        rawDate: session.date,
        volume: getSessionVolume(session),
      }))
      .sort(
        (a, b) =>
          new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
      );
  }, [sessions]);

  // 2. Volumen total (últimos 30 días)
  const totalVolume = useMemo(() => {
    const now = new Date();

    return sessions.reduce((acc, session) => {
      const date = new Date(session.date);

      const diffDays =
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays <= 30) {
        return acc + getSessionVolume(session);
      }

      return acc;
    }, 0);
  }, [sessions]);

  // 3. Frecuencia (últimos 30 días)
  const frequency = useMemo(() => {
    const now = new Date();

    return sessions.filter((session) => {
      const date = new Date(session.date);

      const diffDays =
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      return diffDays <= 30;
    }).length;
  }, [sessions]);

  // 4. Progreso (volumen actual vs anterior)
  const progress = useMemo(() => {
    const now = new Date();

    let current = 0;
    let previous = 0;

    sessions.forEach((session) => {
      const date = new Date(session.date);
      const volume = getSessionVolume(session);

      const diffDays =
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays <= 7) {
        current += volume;
      } else if (diffDays <= 30) {
        previous += volume;
      }
    });

    if (previous === 0) return null;

    return ((current - previous) / previous) * 100;
  }, [sessions]);

  // 5. Insights simples pero útiles
  const insightsData = useMemo(() => {
    if (volumeData.length < 3) {
      return {
        title: "RECOMENDACIÓN",
        text: "Seguí registrando tus sesiones. Necesito al menos 3 entrenamientos para empezar a darte consejos de rendimiento.",
        icon: "TrendingUp"
      };
    }

    const volumes = volumeData.map(d => d.volume);
    const last = volumes.at(-1)!;
    const prev = volumes.at(-2)!;
    const prev2 = volumes.at(-3)!;

    // 1. Detección de Estancamiento (Plateau)
    // Si la diferencia entre los últimos 3 es menor al 3%, está estancado
    const isStagnated = Math.abs(last - prev) < (prev * 0.01) && Math.abs(prev - prev2) < (prev2 * 0.03);
    
    if (isStagnated) return INSIGHT_MESSAGES.STAGNATED;

    // 2. Tendencia de mejora (2 sesiones seguidas subiendo)
    if (last > prev && prev > prev2) {
      return {
        ...INSIGHT_MESSAGES.PROGRESSING,
        text: `Tu volumen aumentó un ${(((last - prev2) / prev2) * 100).toFixed(1)}% en las últimas sesiones. ¡Seguí así!`
      };
    }

    // 3. Bajada significativa (Fatiga)
    if (last < prev * 0.90) { // Si bajó más del 10%
      return INSIGHT_MESSAGES.FATIGUE;
    }

    // 4. Mejora puntual
    if (last > prev) {
      return {
          title: "MEJORA DETECTADA",
          text: "Lograste mover más carga que la sesión anterior. Cada kilo cuenta para tu objetivo final.",
          icon: "TrendingUp"
      };
    }

    return {
      title: "CONSISTENCIA",
      text: "Tu nivel se mantiene estable. Recordá que la constancia es lo que construye el físico a largo plazo.",
      icon: "Activity"
    };
  }, [volumeData] );

  // 6. Mejor sesión (para mostrar en la card)
  const bestSession = useMemo(() => {
    if (!sessions.length) return null;

    let best = 0;

    sessions.forEach(session => {
      const volume = getSessionVolume(session);
      if (volume > best) best = volume;
    });

    return best;
  }, [sessions]);

  return {
    volumeData,   // para el gráfico
    totalVolume,  // cards
    frequency,
    progress,
    bestSession,
    insightsData,
  };
}