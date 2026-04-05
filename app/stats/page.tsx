"use client"

import { useExercises } from "@/hooks/useExercises";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { WorkoutSession } from "@/types/types";

export default function StatsPage() {

    const [sessions] = useLocalStorage<WorkoutSession[]>("sessions", []);
    const {exercises} = useExercises();
    const [selectedExerciseId, setSelectedExerciseId] =
    useLocalStorage<string>("selectedExercise", exercises[0]?.id || "");

    function getUsedExercises(
        sessions: WorkoutSession[],
        exercises: { id: string; name: string }[]
    ) {
        const usedIds = new Set<string>();

        sessions.forEach(session => {
            session.exercises.forEach(ex => {
                usedIds.add(ex.exerciseId);
            });
        });

        console.log("Used Exercise IDs:", usedIds);

        console.log("All Exercises:", exercises);

        console.log("All ExercisesFilters:", exercises.filter(ex => usedIds.has(ex.id)));

        return exercises.filter(ex => usedIds.has(ex.id));
    }

    const usedExercises = getUsedExercises(sessions, exercises);
    

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


            </main>
        </div>
    );
}