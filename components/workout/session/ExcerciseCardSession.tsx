"use client"

import { Plus } from "lucide-react";
import { Exercise, ExerciseInstance, WorkoutSession } from "@/types/types";
import { useMemo } from "react";
import { Card } from "@/components/cards/Card";
import SetRow from "./SetRow";

interface ExerciseCardProps {
    exercise: ExerciseInstance;

    setActions: {
        update: (setId: string, field: 'weight' | 'reps' | 'rir', value: number) => void;
        toggle: (exerciseId: string, setId: string) => void;
    };

    sessions?: WorkoutSession[];
    exercises: Exercise[]
    setOpenTimer: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExerciseCard(
    { exercise, setActions, sessions, exercises, setOpenTimer }: ExerciseCardProps) 
{


    type ComparableSet = { weight: number; reps: number };

    function isBetterSet(a: ComparableSet, b: ComparableSet | null) {
        if (!b) return true;

        return (
            a.weight > b.weight ||
            (a.weight === b.weight && a.reps > b.reps)
        );
    }

    function getHistoricalPR(
    sessions: WorkoutSession[],
    exerciseId: string
    ) {
        let best : ComparableSet | null = null;

        sessions.forEach(s => {
            s.exercises
            .filter(ex => ex.exercise_id === exerciseId)
            .forEach(ex => {
                ex.sets.forEach(set => {
                if (!best || isBetterSet(set, best)) {
                    best = set;
                }
                });
            });
        });

        return best;
    }

    const historicalPR = useMemo<ComparableSet | null>(
        () => getHistoricalPR(sessions ?? [], exercise.exercise_id),
        [sessions, exercise.exercise_id]
    );

    const isPRSet = (set: ComparableSet) => {
        if (historicalPR === null) return false;

        return (
            set.weight > historicalPR.weight ||
            (set.weight === historicalPR.weight &&
            set.reps > historicalPR.reps)
        );
    };

    const exerciseData = exercises.find(e => e.id === exercise.exercise_id);
    
    return(
        <>
            <Card key={exercise.id} className="flex flex-col gap-2 w-full sm:w-auto p-0! overflow-hidden border-none ">
                <header className="flex justify-between items-center bg-zinc-800 p-4">
                    <div className={`flex  flex-row items-center justify-between w-full`}>

                        <h2 className="text-lg font-semibold">{exerciseData?.name}</h2>
                        <p className="text-sm text-zinc-500">{exerciseData?.type}</p>
                    </div>
                </header>
                <div className="p-4">
                    <div className="text-center grid grid-cols-5 gap-4 mb-4">
                        <span className=" text-sm text-zinc-500">Serie</span>
                        <span className=" text-sm text-zinc-500">Peso</span>
                        <span className=" text-sm text-zinc-500">Reps</span>
                        <span className=" text-sm text-zinc-500">RIR</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {exercise.sets.map((set, index) => (
                            <SetRow
                                key={set.id}
                                set={set}
                                onChangeReps={(value) => setActions.update(set.id, 'reps', value)}
                                onChangeWeight={(value) => setActions.update(set.id, 'weight', value)}
                                onChangeRir={(value) => setActions.update(set.id, 'rir', value)}
                                onToggleDone={() => setActions.toggle(exercise.id, set.id)}  
                                isPr={index === 0 && isPRSet(set)}
                                setOpenTimer={setOpenTimer}
                            />
                        ))}

                    </div>
                </div>

            </Card>

        </>
    )

}