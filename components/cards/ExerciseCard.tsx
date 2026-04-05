"use client"

import { Plus } from "lucide-react";
import { Card } from "./Card";
import SetRow from "./SetRow";
import { ExerciseInstance, WorkoutSession } from "@/types/types";
import ExerciseMenu from "./ExerciseMenu";
import { useMemo } from "react";
import { useExercises } from "@/hooks/useExercises";

interface ExerciseCardProps {
    exercise: ExerciseInstance;
    mode: "edit" | "session";

    setActions: {
        update: (setId: string, field: 'weight' | 'reps' | 'rir', value: number) => void;
        toggle: (exerciseId: string, setId: string) => void;
    };

    editActions?: {
        deleteExercise: (exerciseId: string) => void;
        addSet: (exerciseId: string) => void;
        deleteSet: (exerciseId: string, setId: string) => void;
    };

    sessions?: WorkoutSession[];
}

export default function ExerciseCard(
    { exercise, mode, setActions, editActions, sessions }: ExerciseCardProps) 
{

    const isEditMode = mode === "edit";

    const {exercises} = useExercises()


    function getSetScore(set: { weight: number; reps: number; rir?: number }) {
        return set.weight * set.reps * (1 + (5 - (set.rir ?? 0)) * 0.05);
    }

    function getHistoricalBestScore(
        sessions: WorkoutSession[],
        exerciseId: string
    ) {
        let best = 0;

        sessions.forEach(s => {
            s.exercises
            .filter(ex => ex.exerciseId === exerciseId)
            .forEach(ex => {
                ex.sets.forEach(set => {
                const score = getSetScore(set);
                if (score > best) best = score;
                });
            });
        });

        return best;
    }

    const bestSetId = useMemo(() => {
        if (!exercise.sets.length) return null;

        return exercise.sets.reduce((best, current) =>
            getSetScore(current) > getSetScore(best) ? current : best
        ).id;
    }, [exercise.sets]);

    const historicalBest = useMemo(
        () => getHistoricalBestScore(sessions ?? [], exercise.exerciseId),
        [sessions, exercise.exerciseId]
    );

    const exerciseData = exercises.find(e => e.id === exercise.exerciseId);

    
    return(
        <>
            <Card key={exercise.id} className="flex flex-col gap-2 w-full sm:w-auto p-0! overflow-hidden border-none ">
                <header className="flex justify-between items-center bg-zinc-800 p-4">
                    <div className={`flex  ${mode === "session" ? "flex-row items-center justify-between w-full" : "flex-col"}`}>

                        <h2 className="text-lg font-semibold">{exerciseData?.name}</h2>
                        <p className="text-sm text-zinc-500">{exerciseData?.type}</p>
                    </div>
                    {isEditMode && editActions && (
                        <ExerciseMenu 
                            onDelete={() => editActions?.deleteExercise(exercise.id)}
                        />
                    )}
                </header>
                <div className="p-4">
                    <div className="text-center grid grid-cols-5 gap-4 mb-4">
                        <span className=" text-sm text-zinc-500">Serie</span>
                        <span className=" text-sm text-zinc-500">Peso</span>
                        <span className=" text-sm text-zinc-500">Reps</span>
                        <span className=" text-sm text-zinc-500">RIR</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {exercise.sets.map(set => (
                            <SetRow
                                key={set.id}
                                set={set}
                                isEdit={isEditMode}
                                onChangeReps={(value) => setActions.update(set.id, 'reps', value)}
                                onChangeWeight={(value) => setActions.update(set.id, 'weight', value)}
                                onChangeRir={(value) => setActions.update(set.id, 'rir', value)}
                                onToggleDone={() => setActions.toggle(exercise.id, set.id)} 
                                onDelete={() => editActions?.deleteSet(exercise.id, set.id)}   
                                isPr={
                                    set.id === bestSetId &&
                                    getSetScore(set) > historicalBest
                                }
                            />
                        ))}
                        {isEditMode && (
                            <button className={`flex items-center gap-4 justify-center p-4 bg-black/30 rounded-lg w-full transition-all duration-200 cursor-pointer border-dashed border-2 border-zinc-500 }`}
                                onClick={() => editActions?.addSet(exercise.id)}
                            >
                                <Plus className="w-5 h-5 " />
                                <span className="text-sm text-zinc-500">Agregar serie</span>
                            </button>
                        )}

                    </div>
                </div>

            </Card>

        </>
    )

}