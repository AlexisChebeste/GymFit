"use client"

import { Card } from "@/components/cards/Card";
import { CustomSelect } from "@/components/CustomSelect";
import RangeFilter from "@/components/RangeFilter";
import StatsChart from "@/components/StatsCharts";
import { useExercises } from "@/hooks/useExercises";
import { BestSet, useExerciseStats } from "@/hooks/useExercisesStats";
import { useLocalStorage } from "@/lib/useLocalStorage";
import {  WorkoutSession } from "@/types/types";
import { TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function StatsPage() {

    const [sessions] = useLocalStorage<WorkoutSession[]>("sessions", []);
    const {exercises} = useExercises();
    const [range, setRange] = useState<"30D" | "3M" | "6M" | "ALL">("30D");

    const isValidRange = (value: string): value is "30D" | "3M" | "6M" | "ALL" =>
        value === "30D" || value === "3M" || value === "6M" || value === "ALL";

    const usedExercises = useMemo(() => {
        const usedIds = new Set<string>();

        sessions.forEach(session => {
            session.exercises.forEach(ex => {
                usedIds.add(ex.exerciseId);
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
    
    const stats : { bestSets: BestSet[]; pr: any; totalVolume: number; frequency: number; progress: number | null; insights: string } = useExerciseStats(sessions, selectedExerciseId, range);

    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural ">
            <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural overflow-y-auto max-h-[85vh] lg:overflow-hidden">
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
                        {stats.pr && (
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
                        )}
                    </Card>
                    <Card className="px-6 py-4 flex flex-col gap-4">
                        <p className="text-xs uppercase tracking-widest text-secondary font-bold">Volumen del mes</p>
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
                
                <div className="flex flex-col gap-2 w-full h-full">
                    <p className="text-sm text-secondary uppercase font-medium">Evolución de Fuerza</p>
                    
                    <StatsChart data={stats.bestSets} />
                </div>

                <div className="flex flex-col gap-3 w-full py-6">
                    <p className="text-xs text-secondary uppercase font-bold tracking-widest">Análisis de Rendimiento</p>
                    <Card className="bg-primary/5 border-primary/20 p-6 relative overflow-hidden group">
                        {/* Decoración neón sutil de fondo */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                        
                        <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary shadow-neon-glow">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-zinc-100 font-medium leading-relaxed">
                            {stats.insights}
                            </p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Análisis basado en tus últimas {stats.bestSets?.length} sesiones</p>
                        </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}