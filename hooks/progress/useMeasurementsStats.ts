import { BodyMeasurement, UserProfile } from "@/types/types";
import { useMemo } from "react";
import { getChange, getLatestMeasurement, getMeasurementFiltered, getMeasurementsSorted, getMetrics, getWeightProgress } from "@/lib/measurements/measurements.selectors";
import { buildMeasurementsTimeline } from "@/lib/measurements/measurements.timeline";
import { buildMeasurementsAnalytics } from "@/lib/measurements/measurements.analytics";
import { createMeasurementPrefill } from "@/lib/measurements/measurements.factories";

export function useMeasurementStats(
  measurements: BodyMeasurement[],
  profile: UserProfile,
  range: "7D" | "30D" | "90D"
) {

return useMemo(() => {

    const timeline =
      buildMeasurementsTimeline(
        measurements,
        range
      );

    const analytics =
      buildMeasurementsAnalytics(
        timeline.first,
        timeline.latest,
        profile
      );

    const prefill = createMeasurementPrefill(
      timeline.latest,
      profile.id
    );

    return {
      latest: timeline.latest,
      history: timeline.filtered,

      metrics: analytics.metrics,

      weightProgress:
        analytics.weightProgress,

      progress:
        analytics.progress,

      prefill
    };

  }, [measurements, profile, range]);
}