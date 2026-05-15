"use client"

import { Card } from "@/components/cards/Card";
import { CustomSelect } from "@/components/CustomSelect";
import InsightsCard from "@/components/dashboard/InsightsCard";
import Loading from "@/components/Loading";
import RangeFilter from "@/components/RangeFilter";
import StatsChart from "@/components/StatsCharts";
import Button from "@/components/ui/Button";
import { useUser } from "@/contexts/AuthContext";
import { ExerciseStats, useExerciseStats } from "@/hooks/exercise/useExercisesStats";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useExercisesQuery } from "@/queries/exercises/getExercisesQuery";
import { useSessionsQuery } from "@/queries/sessions/getSessionsQuery";
import { TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function StatsPage() {
    const {user, loading} = useUser();
    const router = useRouter();
    const {data: sessions = [], isLoading: isSessionsLoading} = useSessionsQuery(user?.id ?? "");
    const {data: exercises = [], isLoading: isExercisesLoading} = useExercisesQuery(user?.id ?? "");
    const [range, setRange] = useState<"30D" | "3M" | "6M">("30D");

    const isValidRange = (value: string): value is "30D" | "3M" | "6M" =>
        value === "30D" || value === "3M" || value === "6M" ;

    const usedExercises = useMemo(() => {
        const usedIds = new Set<string>();

        sessions.forEach(session => {
            session.exercises.forEach(ex => {
                usedIds.add(ex.exercise_id);
            });
        });

        return exercises.filter(ex => usedIds.has(ex.id));
    }, [sessions, exercises]);

    const [selectedExerciseId, setSelectedExerciseId] =
        useLocalStorage<string>("selectedExercise", "");

    useEffect(() => {
        if (!selectedExerciseId && usedExercises.length > 0) {
            setSelectedExerciseId(usedExercises[0].id);
        }
    }, [usedExercises]);
    
    const stats : ExerciseStats = useExerciseStats(sessions, selectedExerciseId, range);

    if (loading || isSessionsLoading || isExercisesLoading) return <Loading />;

    if (usedExercises.length === 0 || !selectedExerciseId) {
        return (
            <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural overflow-y-auto max-h-[85vh] md:max-h-full">
                <main className="flex flex-1 w-full flex-col gap-8 p-4 bg-white dark:bg-natural max-w-7xl h-full items-center justify-center text-center">
                    
                    {/* Contenedor de Icono con Glow */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full" />
                        <div className="relative p-6 bg-zinc-900 border border-white/5 rounded-full text-zinc-500 shadow-2xl">
                            <Zap size={48} strokeWidth={1.5} className="animate-pulse" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 max-w-md">
                        <h2 className="text-2xl font-black italic tracking-tight text-zinc-100 uppercase">
                            Sin datos de rendimiento
                        </h2>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Para visualizar tus gráficas de fuerza y récords personales (PR), primero necesitás completar al menos una sesión de entrenamiento. 
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-md">
                        <Button 
                            onClick={() => router.push("/dashboard")}
                            className="text-lg font-semibold w-full text-center max-w-md py-4 rounded-md flex items-center justify-center transition-colors bg-green-600 hover:bg-green-800 text-black border-none
                            "
                        >
                            Empezar a entrenar
                        </Button>
                        
                        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
                            TrackFit • Engine v1.0
                        </p>
                    </div>
                    
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural overflow-y-auto max-h-[85vh] md:max-h-full">
            <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural  max-w-7xl">
                <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Ejercicio especifico</p>

                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                
                    <CustomSelect
                        options={usedExercises}
                        value={selectedExerciseId}
                        onChange={setSelectedExerciseId}
                    />

                    <RangeFilter
                        value={range}
                        onChange={(next) => {
                            setRange((prev) => {
                                const resolved = typeof next === "function" ? next(prev) : next;
                                return isValidRange(resolved) ? resolved : prev;
                            });
                        }}
                    />
                    
                </div>

                <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                    <Card className="px-6 py-4 flex flex-col gap-4 col-span-2 lg:col-span-1">
                        <p className="text-xs uppercase tracking-widest text-secondary font-bold">PR Actual</p>
                        {stats.pr ? (
                            <div className="flex gap-2 items-baseline">
                                
                                <p className="text-4xl font-bold">
                                {stats.pr.weight}<span className="text-lg font-normal text-muted-foreground uppercase italic">kg</span> 
                                </p>
                                <p className="text-2xl font-bold px-2">x</p>
                                <p className="text-4xl font-bold">
                                {stats.pr.reps}<span className="text-lg font-normal text-muted-foreground uppercase italic">Reps</span> 
                                </p>

                                
                                <span className="text-lg font-normal text-muted-foreground uppercase italic">(RIR {stats.pr.rir})</span>
                            </div>
                        ): (
                            <p className="text-4xl font-bold text-muted-foreground">Sin registros de PR en este período</p>
                        )}
                    </Card>
                    <Card className="px-6 py-4 flex flex-col gap-4">
                        <p className="text-xs uppercase tracking-widest text-secondary font-bold">Volumen</p>
                        <p className="text-4xl font-bold flex gap-2 items-baseline">{stats.totalVolume}<span className="text-lg font-normal text-muted-foreground uppercase italic">kg</span></p>
                    </Card>
                    <Card className="px-6 py-4 flex flex-col gap-4">
                        <p className="text-xs uppercase tracking-widest text-secondary font-bold">Frecuencia</p>
                        <p className="text-4xl font-bold">{stats.frequency} <span className="text-lg font-normal text-muted-foreground uppercase italic">{stats.frequency === 1 ? " sesión" : ` sesiones`}</span></p>
                    </Card>
                    {stats.progress !== null && (
                        <Card className="flex flex-col gap-1 col-span-full items-center justify-center ">
                            <p className="text-xs uppercase tracking-widest text-secondary font-bold">Crecimiento</p>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-black ${stats.progress >= 0 ? 'text-primary' : 'text-red-500'}`}>
                                {stats.progress >= 0 ? '+' : ''}{stats.progress.toFixed(1)}%
                                </span>
                                {stats.progress >= 0 ? <TrendingUp size={20} className="text-primary" /> : <TrendingDown size={20} className="text-red-500" />}
                            </div>
                            <p className="text-[9px] text-zinc-500">Promedio de volumen por sesión</p>
                        </Card>
                    )}
                </div>
                
                <Card className="lg:col-span-2 flex flex-col gap-4 w-full">
                    <p className="text-xs uppercase tracking-widest text-secondary font-bold">Evolución de Fuerza</p>
                
                    <StatsChart data={stats.bestSets} />
                </Card>

                <div className="flex flex-col gap-3 w-full py-6">
                    <p className="text-xs text-secondary uppercase font-bold tracking-widest">Análisis de Rendimiento</p>

                    <InsightsCard insightsData={stats.insights} volumeData={stats.bestSets} />
                </div>
            </main>
        </div>
    );
}