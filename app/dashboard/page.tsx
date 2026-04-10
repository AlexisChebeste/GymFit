"use client";

import { Card } from "@/components/cards/Card";
import VolumeChart from "@/components/VolumeCharts";
import WeeklyConsistency from "@/components/WeeklyConsistency";
import { useDashboard } from "@/hooks/useDashboard";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useRoutines } from "@/hooks/useRoutine";
import useSessions from "@/hooks/useSessions";
import { useUser } from "@/hooks/useUser";
import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { useWorkoutSchedule } from "@/hooks/useWorkoutSchedule";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import { BicepsFlexed, Calendar, Check, Dumbbell, Eye, Play, ShieldAlert, TrendingUp, Trophy, Zap } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {

  const { user, loading } = useUser();

  const {sessions} = useSessions(user?.id ?? "");
  const {routine} = useRoutines(user?.id ?? "");
  const {templates} = useWorkoutTemplates(user?.id ?? "");


  const {history: weightHistory, latest, change, weightProgress} = useMeasurements(user?.id ?? "", "30D");

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
  
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>No autenticado</div>;
  }

  console.log("user", user);

  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-zinc-50 font-sans dark:bg-natural max-h-[85vh] overflow-y-auto md:max-h-full">
      <div className=" h-full w-full flex items-center justify-center ">

        <main className="flex flex-1 w-full flex-col items-start p-4 bg-white dark:bg-natural gap-4 max-w-7xl h-full ">
          <section className="flex flex-col gap-4 md:flex-row items-center justify-between w-full mb-4">
            
            <div className="flex flex-col">

              <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Bienvenido de nuevo</p>
              <h1 className="text-4xl font-bold">Hola, {user?.name}!</h1>
              {completionRate !== undefined && (
                <span className="text-sm text-muted-foreground">
                  Tasa de cumplimiento esta semana:{" "}
                  <span className="font-medium text-green-500">{(completionRate).toFixed(1)}%</span>
                </span>
              )}
              {missedWorkouts > 0 && (
                <span className="text-sm text-red-500">
                  Has perdido {missedWorkouts} entrenamiento(s) esta semana.
                </span>
              )}

              
            </div>

            <WeeklyConsistency sessions={sessions} routine={routine} />
          
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full">

            <Card className="px-6 py-4 flex flex-col gap-4 colspan-1 lg:col-span-2 justify-between">
              <section className="flex items-center justify-between">
                <div className="flex flex-col gap-2">

                  <p className="text-xs uppercase tracking-widest text-secondary font-bold">{isToday ? "Hoy" : "Próxima sesión"}</p>
                  <h2 className="text-3xl font-bold">
                    {isRestDay
                      ? "Descanso"
                      : isToday
                        ? todayWorkout?.name
                        : nextWorkout?.name ?? "Sin rutina"}
                  </h2>
                </div>

                <div className="flex flex-col gap-2  border border-zinc-600 p-3 rounded-full items-center justify-center">
                  <Dumbbell className="text-primary" size={24} />
                </div>
              </section>

              <p className="text-sm font-normal text-muted-foreground uppercase italic">
                {isRestDay
                  ? "Día libre"
                  : hasTrainedToday
                    ? "Entrenamiento completado"
                    : label ?? "Sin planificación"}
              </p>

              <Link href={isToday && !hasTrainedToday ? `/workouts/session/${todayWorkout?.id}` : "/workouts"} className={`text-sm font-semibold w-full text-center py-4 rounded-md flex items-center justify-center transition-colors
                ${hasTrainedToday ? "bg-green-700 hover:bg-green-800" : "bg-primary/80 hover:bg-primary"}
              `}
              >
                
                {isToday && hasTrainedToday ? <Check  className="mr-2 stroke-2" size={16}/> : isToday ? <Play className="mr-2 stroke-2" size={16} /> : <Eye className="mr-2" size={16} />}

                {isRestDay
                  ? "Ver rutinas"
                  : isToday && !hasTrainedToday
                    ? "Empezar entrenamiento"
                    : "Ver rutina"}
              </Link>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
                
                <p className="text-xs uppercase tracking-widest text-secondary font-bold">Volumen</p>
                <div className="flex items-center gap-3">
                  <Dumbbell className="text-green-500" size={20} />
                  <div className="flex flex-col">
                    <p className="text-lg font-medium ">{totalVolume} <span className="text-xs font-normal text-muted-foreground uppercase italic">(Kg)</span></p>
                  </div>
                </div>
              </Card>
              <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
                <p className="text-xs uppercase tracking-widest text-secondary font-bold">Frecuencia</p>
                <div className="flex items-center gap-3">
                  <Calendar className="text-green-500" size={20} />
                  <div className="flex flex-col">
                    <p className="text-lg font-medium ">{frequency} <span className="text-xs font-normal text-muted-foreground uppercase italic">(sesiones)</span></p>
                  </div>
                </div>
              </Card>
              <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
                
                <p className="text-xs uppercase tracking-widest text-secondary font-bold">Progreso</p>
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-green-500" size={20} />
                  <div className="flex flex-col">
                    <p className="text-lg font-medium ">{progress?.toFixed(2)} <span className="text-xs font-normal text-muted-foreground uppercase italic">% (7D)</span></p>
                  </div>
                </div>
              </Card>
              <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
                
                <p className="text-xs uppercase tracking-widest text-secondary font-bold">Mejor sesión</p>
                <div className="flex items-center gap-3">
                  <BicepsFlexed className="text-green-500" size={20} />
                  <div className="flex flex-col">
                    <p className="text-lg font-medium ">{bestSession} <span className="text-xs font-normal text-muted-foreground uppercase italic">(Kg)</span></p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4 w-full">
              <h2 className="text-xs uppercase tracking-widest text-secondary font-bold">Volumen de entrenamiento</h2>
              <VolumeChart data={volumeData} />
            </div>
            
            {!weightHistory.length ? (
              <Card className="px-6 py-4 flex flex-col gap-2 justify-center items-center w-full">
                <p className="text-sm text-muted-foreground text-center">
                  Empezá a registrar tu peso corporal para ver tus estadísticas y progreso a lo largo del tiempo.
                </p>
              </Card>
            ) : (
              <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
                <div className="flex flex-col gap-2">
                  
                  <p className="text-xs uppercase tracking-widest text-secondary font-bold">Peso corporal</p>
                  <h2 className="text-4xl font-bold">
                    {latest?.weight}
                    <span className="text-lg font-normal text-muted-foreground uppercase italic ml-2">kg</span> 

                  </h2>

                  <div className="flex text-sm gap-2 items-center">
                    <TrendingUp className="text-green-500" size={16} />
                    <span className="text-green-500 font-medium">{change?.toFixed(1)} kg en el ultimo mes</span>
                  </div>
                  
                
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>Objetivo</span>
                    <span>{latest?.weight} / {user?.weightGoal}</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${weightProgress + 100}%` }}
                    />
                  </div>

                  <p className="text-xs text-secondary font-semibold">
                    {100 + (Number(weightProgress?.toFixed(1)) || 0)} % hacia tu objetivo
                  </p>
                </div>
              </Card>
            )}

            <div className="lg:col-span-3 flex flex-col gap-2 w-full pb-6">
              <h2 className="text-xs uppercase tracking-widest text-secondary font-bold">Perspectivas</h2>
              <p className="text-sm text-muted-foreground">
                Aquí encontrarás análisis y recomendaciones basadas en tus datos de entrenamiento.
              </p>
              <Card className="bg-zinc-900/40 border-white/5 p-6 relative overflow-hidden group transition-all hover:border-primary/20">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-[80px]" />

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-neon-glow">
                    {/* Mapeo dinámico de iconos de Lucide */}
                    {insightsData.icon === "Zap" && <Zap size={24} fill="currentColor" />}
                    {insightsData.icon === "Trophy" && <Trophy size={24} />}
                    {insightsData.icon === "ShieldAlert" && <ShieldAlert size={24} />}
                    {/* ... otros iconos */}
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                      {insightsData.title}
                    </h3>
                    <p className="text-base text-zinc-100 font-medium leading-relaxed max-w-[90%]">
                      {insightsData.text}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                          Análisis basado en tus últimas {volumeData.length} sesiones
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
