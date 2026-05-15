"use client"

import { Plus } from "lucide-react";
import { Exercise, ExerciseInstance } from "@/types/types";
import { Card } from "@/components/cards/Card";
import ExerciseMenu from "@/components/cards/ExerciseMenu";
import SetRowEdit from "./SetRowEdit";

interface ExerciseCardProps {
    exercise: ExerciseInstance;
    editActions: {
        deleteExercise: (exerciseId: string) => void;
        addSet: (exerciseId: string) => void;
        deleteSet: (exerciseId: string, setId: string) => void;
    };
    exercises: Exercise[]
}

export default function ExerciseCard(
    { exercise, editActions, exercises }: ExerciseCardProps) 
{
    const exerciseData = exercises.find(e => e.id === exercise.exercise_id);
    
    return(
        <>
            <Card key={exercise.id} className="flex flex-col gap-2 w-full sm:w-auto p-0! overflow-hidden border-none ">
                <header className="flex justify-between items-center bg-zinc-800 p-4">
                    <div className={`flex   flex-col gap-1`}>

                        <h2 className="text-lg font-semibold">{exerciseData?.name}</h2>
                        <p className="text-sm text-zinc-500">{exerciseData?.type}</p>
                    </div>
                    <ExerciseMenu 
                        onDelete={() => editActions?.deleteExercise(exercise.id)}
                    />
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
                            <SetRowEdit
                                key={set.id}
                                set={set}
                                onDelete={() => editActions?.deleteSet(exercise.id, set.id)}   
                            />
                        ))}
                        <button className={`flex items-center gap-4 justify-center p-4 bg-black/30 rounded-lg w-full transition-all duration-200 cursor-pointer border-dashed border-2 border-zinc-500 }`}
                            onClick={() => editActions?.addSet(exercise.id)}
                        >
                            <Plus className="w-5 h-5 " />
                            <span className="text-sm text-zinc-500">Agregar serie</span>
                        </button>

                    </div>
                </div>

            </Card>

        </>
    )

}