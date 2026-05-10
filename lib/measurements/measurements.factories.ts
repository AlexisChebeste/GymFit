import { BodyMeasurement } from "@/types/types";

export function createMeasurementPrefill(
  latest: BodyMeasurement | null,
  userId: string
): BodyMeasurement {

  return {
    ...latest,

    id: crypto.randomUUID(),

    date: new Date().toISOString(),

    created_at: new Date().toISOString(),

    user_id: userId,

    weight: latest?.weight ?? 0,
    body_fat: latest?.body_fat ?? 0,
    chest: latest?.chest ?? 0,
    waist: latest?.waist ?? 0,
    left_arm: latest?.left_arm ?? 0,
    right_arm: latest?.right_arm ?? 0,
    left_leg: latest?.left_leg ?? 0,
    right_leg: latest?.right_leg ?? 0,
  };
}