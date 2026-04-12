"use client";

import { Card } from "@/components/cards/Card";
import VolumeChart from "@/components/VolumeCharts";
import WeeklyConsistency from "@/components/WeeklyConsistency";
import { useDashboard } from "@/hooks/useDashboard";
import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { useWorkoutSchedule } from "@/hooks/useWorkoutSchedule";
import { UserProfile } from "@/types/types";
import DashboardHeader from "./dashboard/DashboardHeader";
import WorkoutInfoCard from "./dashboard/WorkoutInfoCard";
import StatsGrid from "./dashboard/StatsGrid";
import WeightCard from "./dashboard/WeightCard";
import InsightsCard from "./dashboard/InsightsCard";

interface DashboardViewProps {
    user: UserProfile;
    sessions: any[];
    routine: any;
    templates: any[];
    measurements: any;
}

export default function DashboardView({ user, sessions, routine, templates, measurements }: DashboardViewProps) {

  const {history: weightHistory, latest, change, weightProgress} = measurements;

  const { 
    volumeData, 
    totalVolume, 
    frequency, 
    progress,
    bestSession,
    insightsData,
    hasTrainedToday
  } = useDashboard(sessions);

  const {todayWorkout, nextWorkout, isToday, label } = useWorkoutSchedule(routine, templates);

  const { completionRate, missedWorkouts } = useWeeklyStats(routine, sessions);

  const isRestDay = !isToday && !nextWorkout;

  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-zinc-50 font-sans dark:bg-natural max-h-[85vh] overflow-y-auto md:max-h-full">
      <div className=" h-full w-full flex items-center justify-center ">

        <main className="flex flex-1 w-full flex-col items-start p-4 bg-white dark:bg-natural gap-4 max-w-7xl h-full ">
          <section className="flex flex-col gap-4 md:flex-row items-center justify-between w-full mb-4">
            
            <DashboardHeader name={user?.name} completionRate={completionRate} missedWorkouts={missedWorkouts} />

            <WeeklyConsistency sessions={sessions} routine={routine} />
          
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full">

            <WorkoutInfoCard
              isToday={isToday}
              hasTrainedToday={hasTrainedToday}
              isRestDay={isRestDay}
              todayWorkout={todayWorkout}
              nextWorkout={nextWorkout}
              label={label}
            />

            <StatsGrid 
              totalVolume={totalVolume} frequency={frequency} progress={progress} bestSession={bestSession} 
            />

            <Card className="lg:col-span-2 flex flex-col gap-4 w-full">
              <h2 className="text-xs uppercase tracking-widest text-secondary font-bold">Volumen de entrenamiento</h2>
              <VolumeChart data={volumeData} />
            </Card>

            {!weightHistory.length ? (
              <Card className="px-6 py-4 flex flex-col gap-2 justify-center items-center w-full">
                <p className="text-sm text-muted-foreground text-center">
                  Empezá a registrar tu peso corporal para ver tus estadísticas y progreso a lo largo del tiempo.
                </p>
              </Card>
            ) : (
              <WeightCard latest={latest} change={change} weightProgress={weightProgress} user={user} />
            )}

            <div className="lg:col-span-3 flex flex-col gap-2 w-full pb-6">
              <h2 className="text-xs uppercase tracking-widest text-secondary font-bold">Perspectivas</h2>
              <p className="text-sm text-muted-foreground">
                Aquí encontrarás análisis y recomendaciones basadas en tus datos de entrenamiento.
              </p>
              <InsightsCard insightsData={insightsData} volumeData={volumeData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
