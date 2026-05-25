"use client"

import { useTimerStore } from "@/store/useUIStore";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { Set } from "@/types/types";
import { Check } from "lucide-react";
import React from "react";


function SetRow({set, isPr, exerciseId}: {
    set: Set;
    exerciseId: string;
    isPr: boolean;
}) {

    const updateSet = useWorkoutStore(s => s.updateSet);
    const toggleSet = useWorkoutStore(s => s.toggleSet);
    const {startTimer, setOpen } = useTimerStore();
    const openTimer = () => {
        startTimer(120);
        setOpen(true);
    }

    const handleCompleteSet = () => {
        
        if (!set.weight || !set.reps) return;

        if (!set.isCompleted) {
            openTimer();
        }
        toggleSet(exerciseId, set.id);
    }

    return(
        <div className={`place-items-center grid grid-cols-5 gap-4 py-2 bg-black/30 rounded-lg w-full transition-all duration-200 border-l-4 ${set.isCompleted ? ' border-primary' : 'border-transparent hover:border-primary/50'}`}>
            <div className="text-center">
                <span className={`font bold ${set.isCompleted ? 'text-primary' : 'text-zinc-300'}`}>{set.set}</span>
            </div>
            <div className="relative flex items-center justify-center col-span-1">
                <input 
                    type="number" 
                    max={999}
                    min="0"
                    step="0.5"
                    aria-label={`Peso por serie ${set.set}`}
                    className={`bg-black/80 h-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-center w-full ${set.isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={set.weight || ""}
                    onChange={(e) => {
                        const value = e.target.value;

                        const parsed = parseFloat(value);
                        if (!isNaN(parsed)) {
                            updateSet(exerciseId, set.id, 'weight', Math.min(999, parsed));
                        }
                    }}
                    onBlur={() => {
                        if (set.weight === 0) {
                            updateSet(exerciseId, set.id, 'weight', 0);
                        }
                    }}
                                        
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.currentTarget.blur();
                        }
                    }}
                    disabled={set.isCompleted}
                />
                {isPr && (
                    <span className="text-xs text-primary absolute -top-2 -right-2 bg-green-600 p-1 rounded-full flex items-center justify-center px-2">PR</span>
                )}
            </div>
            <div className="col-span-1 text-center">
                <input 
                    type="number" 
                    step="1"
                    max={99}
                    aria-label={`Repeticiones por serie ${set.set}`}
                    className={`bg-black/80 h-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-center w-full ${set.isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={set.reps || ""}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.currentTarget.blur();
                        }
                    }}
                    onChange={(e) => {
                        const value = e.target.value;

                        const parsed = parseInt(value);
                        if (!isNaN(parsed)) {
                            updateSet(exerciseId, set.id, 'reps', Math.min(99, parsed));
                        }
                    }}
                    onBlur={() => {
                        if (set.reps === 0) {
                            updateSet(exerciseId, set.id, 'reps', 0);
                        }
                    }}
                    disabled={set.isCompleted}
                />  
            </div>

            <div className="col-span-1 text-center w-full">
                <input
                    type="number"
                    min={0}
                    max={5}
                    step={1}
                    aria-label={`RIR por serie ${set.set}`}
                    className={`bg-black/80 h-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-center w-full ${set.isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={set.rir?.toString() || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        const parsed = parseInt(value);
                        if (!isNaN(parsed)) {
                            updateSet(exerciseId, set.id, 'rir', Math.min(5, Math.max(0, parsed)));
                        }
                    }}
                    onBlur={() => {
                        const rir = Math.min(5, Math.max(0, parseInt(set.rir?.toString() || "0") || 0));
                        updateSet(exerciseId, set.id, 'rir', rir);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.currentTarget.blur();
                        }
                    }}
                    disabled={set.isCompleted}
                />
            </div>
            <div className=" flex items-center justify-center col-span-1 gap-1">
                    <button 
                        className={`text-sm p-2 rounded-full transition-colors cursor-pointer w-8 h-8 flex items-center justify-center 
                        border text-gray-400  
                        ${set.isCompleted ? 'text-secondary bg-primary  border-primary ' : 'hover:bg-primary/40 hover:text-primary'}
                        `}
                        aria-label="Marcar serie como completada"
                    onClick={handleCompleteSet}
                >
                    <Check className="inline-block" size={16} strokeWidth={3}/>
                </button>
            </div>
        </div>
    )
}

export default React.memo(SetRow);