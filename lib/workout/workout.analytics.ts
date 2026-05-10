export function detectPlateau(scores: number[]) {
  if (scores.length < 4) return false;

  const last = scores.at(-1)!;

  return scores
    .slice(-4)
    .every(score =>
      Math.abs(score - last) < last * 0.02
    );
}

export function detectFatigue(
  current: number,
  previous: number
) {
  return current < previous * 0.9;
}

export function detectProgression(
  current: number,
  previous: number
) {
  return current > previous;
}