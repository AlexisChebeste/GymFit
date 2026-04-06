export type WeightEntry = {
  date: string;
  weight: number;
};

export type weightGoal = {
  goal: number;
  history: WeightEntry[];
}

export function useWeightStats(weightGoal: weightGoal) {

  const sorted = [...weightGoal.history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const current = sorted.at(-1)?.weight ?? null;
  const previous = sorted.at(-2)?.weight ?? null;

  const change = current && previous
    ? current - previous
    : null;

  const progress = current && weightGoal.goal
    ? current > weightGoal.goal
      ? Math.min(weightGoal.goal / (current / 100), 100)
      : Math.min((current / weightGoal.goal) * 100, 100)
    : null;

  return {
    current,
    change,
    progress,
  };
}