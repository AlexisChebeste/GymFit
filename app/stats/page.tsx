"use client"

import { useExercises } from "@/hooks/useExercises";
import { useLocalStorage } from "@/lib/useLocalStorage";
import {  WorkoutSession } from "@/types/types";
import { useEffect, useMemo } from "react";

export default function StatsPage() {

    const [sessions] = useLocalStorage<WorkoutSession[]>("sessions", []);
    const {exercises} = useExercises();


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
    
    const bestSets = useMemo(() => {
        if (!selectedExerciseId) return [];

        return sessions
            .map(session => {
            const ex = session.exercises.find(e => e.exerciseId === selectedExerciseId);
            if (!ex) return null;

        const best = ex.sets.reduce((a, b) =>
            getSetScore(a) > getSetScore(b) ? a : b
        );

        return {
            date: session.date,
            ...best,
            score: getSetScore(best)
        };
        })
        .filter(Boolean);
    }, [sessions, selectedExerciseId]);

    function getSetScore(set: { weight: number; reps: number; rir?: number }) {
        return set.weight * set.reps * (1 + (5 - (set.rir ?? 0)) * 0.05);
    }

    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural ">
            <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural overflow-y-auto max-h-[85vh]">
                <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Ejercicio especifico</p>
                
                <select
                    value={selectedExerciseId}
                    onChange={(e) => setSelectedExerciseId(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
                >
                    {usedExercises.map((ex) => (
                        <option key={ex.id} value={ex.id} className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            {ex.name}
                        </option>
                    ))}
                </select>

{/*                 {bestSets.map(set => (
                    <div key={set.date}>
                        {new Date(set.date).toLocaleDateString()} - 
                        {set.weight}kg x {set.reps} (RIR {set.rir}) → score {Math.round(set.score)}
                    </div>
                ))} */}
            </main>
        </div>
    );
}