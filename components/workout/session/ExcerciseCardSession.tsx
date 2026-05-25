"use client"

import { Exercise, ExerciseInstance, ExercisePerformance } from "@/types/types";
import { Card } from "@/components/cards/Card";
import SetRow from "./SetRow";
import { useWorkoutStore } from "@/store/useWorkoutStore";

interface ExerciseCardProps {
  exerciseId: string;

  performance?: ExercisePerformance

  exerciseData?: Exercise;
}
export default function ExerciseCard(
    { exerciseId, performance, exerciseData }: ExerciseCardProps) 
{
    const exercise = useWorkoutStore(
    s => s.workout?.exercises.find(e => e.id === exerciseId)
    );
    type ComparableSet = { weight: number; reps: number };

    const isPRSet = (set: ComparableSet) => {
        if (!performance?.pr) return false;

        return (
            set.weight > performance.pr.weight ||
            (
            set.weight === performance.pr.weight &&
            set.reps > performance.pr.reps
            )
        );
    };
    
    return(
        <>
            <Card key={exercise?.id} className="flex flex-col gap-2 w-full sm:w-auto p-0! overflow-hidden border-none ">
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
                        {exercise?.sets.map((set) => (
                            <SetRow
                                key={set.id}
                                set={set}
                                exerciseId={exercise?.id}
                                isPr={isPRSet(set)}
                            />
                        ))}

                    </div>
                </div>

            </Card>

        </>
    )

}