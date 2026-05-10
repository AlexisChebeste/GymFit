import { BestSet, Set } from "@/hooks/exercise/useExercisesStats";
import { WorkoutSession } from "@/types/types";

export type ExerciseSession = {
  date: string;
  sets: Set[];
};

export function getSessionVolume(session: ExerciseSession) {
  return session.sets.reduce((total, set) => {
    return (
      total +
      set.weight * set.reps
    );
  }, 0);
}

export function getTotalVolume(
  sessions: ExerciseSession[]
) {
  return sessions.reduce(
    (acc, s) => acc + getSessionVolume(s),
    0
  );
}

export function getExerciseSessions(
    sessions: WorkoutSession[],
    exerciseId : string,
) {


    return sessions
      .map(session => {
        const ex = session.exercises.find(e => e.exercise_id === exerciseId);
        if (!ex) return null;

        

        return {
          date: session.date,
          sets: ex.sets,
        };
      })
      .filter(Boolean) as {
        date: string;
        sets: Set[];
      }[];

}

export function filterSessionsByRange(
  sessions: ExerciseSession[],
  range: "30D" | "3M" | "6M" | "ALL"
) {
  
  const now = new Date();

  const rangeDays =
    range === "30D" ? 30 :
    range === "3M" ? 90 :
    range === "6M" ? 180 :
    Infinity;

  return sessions.filter(session => {
    const diff =
          (now.getTime() - new Date(session.date).getTime()) /
          (1000 * 60 * 60 * 24);

    return diff <= rangeDays;
  });
}

export function getBestSets(sessions: ExerciseSession[]): BestSet[] {

    const getScore = (s: Set) =>
      s.weight * (1 + (s.reps + s.rir) / 30);

    const formatDate = (date: string) =>
      new Date(date).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short"
      });

    return sessions.map(session => {
        const best = session.sets.reduce((a, b) =>
            getScore(a) > getScore(b) ? a : b
        );
        return {
            rawDate: session.date,
            date: formatDate(session.date),
            ...best,
            score: getScore(best)
        };
    });
}

export function getExercisePR(
  sessions: ExerciseSession[]
) {

    let pr: Set | null = null;

    sessions.forEach(session => {   
        session.sets.forEach(set => {
            if (
                !pr ||
                set.weight > pr.weight ||
                (set.weight === pr.weight && set.reps > pr.reps)
            ) {
                pr = set;
            }
        });

    });

    return pr;
}

export function getExerciseProgress(
  sessions: ExerciseSession[]
) {
  let progress: number | null = null;

  if (sessions.length >= 4) {
      const first = sessions.slice(0, 3);
      const last = sessions.slice(-3);

      const avg = (arr: typeof sessions) =>
        arr.reduce((acc, s) =>
          acc + s.sets.reduce((sum, set) =>
            sum + set.weight * set.reps, 0), 0
        ) / arr.length;

      const prev = avg(first);
      const curr = avg(last);

      if (prev !== 0) {
        progress = ((curr - prev) / prev) * 100;
      }
    }

    return progress;
}