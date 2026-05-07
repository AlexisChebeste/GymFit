import { isWithinDays, toLocalISO } from "@/lib/date";
import { WorkoutSession } from "@/types/types";
import { useMemo } from "react";

type VolumePoint = {
  date: string;
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

  function getSessionVolume(session: WorkoutSession) {
    return session.exercises.reduce((total, ex) => {
      return total + ex.sets.reduce((sum, set) => {
        return sum + set.weight * set.reps;
      }, 0);
    }, 0);
  }

  const sessionsWithVolume = useMemo(() => {
    return sessions.map(s => ({
      ...s,
      volume: getSessionVolume(s)
    }));
  }, [sessions]);

  const volumeData: VolumePoint[] = useMemo(() => {
    return sessionsWithVolume
      .slice(-10)
      .map((session) => ({
        date: session.date,
        volume: session.volume,
      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [sessionsWithVolume]);

  const totalVolume = useMemo(() => {
    return sessionsWithVolume
      .filter(s => isWithinDays(s.date, 30))
      .reduce((acc, s) => acc + s.volume, 0);
  }, [sessionsWithVolume]);

  const frequency = useMemo(() => {
    return sessionsWithVolume.filter(s => isWithinDays(s.date, 30)).length;
  }, [sessionsWithVolume]);

  const progress = useMemo(() => {
    let current = 0;
    let previous = 0;

    sessionsWithVolume.forEach(s => {
      const volume = s.volume;

      if (isWithinDays(s.date, 7)) current += volume;
      else if (isWithinDays(s.date, 30)) previous += volume;
    });

    if (previous === 0) return null;

    return ((current - previous) / previous) * 100;
  }, [sessionsWithVolume]);

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

    const isStagnated = Math.abs(last - prev) < (prev * 0.01) && Math.abs(prev - prev2) < (prev2 * 0.03);
    
    if (isStagnated) return INSIGHT_MESSAGES.STAGNATED;

    if (last > prev && prev > prev2) {
      return {
        ...INSIGHT_MESSAGES.PROGRESSING,
        text: `Tu volumen aumentó un ${(((last - prev2) / prev2) * 100).toFixed(1)}% en las últimas sesiones. ¡Seguí así!`
      };
    }

    if (last < prev * 0.90) { 
      return INSIGHT_MESSAGES.FATIGUE;
    }

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

  const bestSession = useMemo(() => {
    if (!sessionsWithVolume.length) return null;
    return Math.max(...sessionsWithVolume.map(s => s.volume));
  }, [sessionsWithVolume]);

  function hasTrainedToday() {
    const today = toLocalISO(new Date());
    return sessions.some(s => s.date === today);
  }

  return {
    volumeData, 
    totalVolume, 
    frequency,
    progress,
    bestSession,
    insightsData,
    hasTrainedToday: hasTrainedToday()
  };
}
