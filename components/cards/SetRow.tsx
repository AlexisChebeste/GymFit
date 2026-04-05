"use client"

import { Set } from "@/types/types";
import { Check, Trash2 } from "lucide-react";
import React, { useState } from "react";


function SetRow({set, onChangeWeight, onChangeReps, onToggleDone, onDelete, isEdit, isPr, onChangeRir}: {
    set: Set;
    isEdit: boolean;
    onChangeWeight: (newWeight: number) => void;
    onChangeRir: (newRir: number) => void;
    onChangeReps: (newReps: number) => void;
    onToggleDone: () => void;
    onDelete?: () => void;
    isPr: boolean;
}) {

    const [localValue, setLocalValue] = useState<string>(
        set.weight ? String(set.weight) : ""
    );

    const [localReps, setLocalReps] = useState<string>(
        set.reps !== 0 ? String(set.reps) : ""
    );

    const [localRir, setLocalRir] = useState<string>(set.rir?.toString() ?? "");

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
                    className={`bg-black/80 h-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-center w-full ${set.isCompleted || isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={localValue}
                    onChange={(e) => {
                        const value = e.target.value;
                        setLocalValue(value);

                        const parsed = parseFloat(value);
                        if (!isNaN(parsed)) {
                            onChangeWeight(Math.min(999, parsed));
                        }
                    }}
                    onBlur={() => {
                        if (localValue === "") {
                            setLocalValue("0");
                            onChangeWeight(0);
                        }
                    }}
                                        
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.currentTarget.blur();
                        }
                    }}
                    disabled={set.isCompleted || isEdit}
                />
                {isPr && !isEdit && (
                    <span className="text-xs text-primary absolute -top-2 -right-2 bg-green-600 p-1 rounded-full flex items-center justify-center px-2">PR</span>
                )}
            </div>
            <div className="col-span-1 text-center">
                <input 
                    type="number" 
                    step="1"
                    max={99}
                    aria-label={`Repeticiones por serie ${set.set}`}
                    className={`bg-black/80 h-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-center w-full ${set.isCompleted || isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={localReps}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.currentTarget.blur();
                        }
                    }}
                    onChange={(e) => {
                        const value = e.target.value;
                        setLocalReps(value);

                        const parsed = parseInt(value);
                        if (!isNaN(parsed)) {
                            onChangeReps(Math.min(99, parsed));
                        }
                    }}
                    onBlur={() => {
                        if (localReps === "") {
                            setLocalReps("0");
                            onChangeReps(0);
                        }
                    }}
                    disabled={set.isCompleted || isEdit}
                />  
            </div>

            <div className="col-span-1 text-center w-full">
                <input
                    type="number"
                    min={0}
                    max={5}
                    step={1}
                    aria-label={`RIR por serie ${set.set}`}
                    className={`bg-black/80 h-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-center w-full ${set.isCompleted || isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={localRir}
                    onChange={(e) => setLocalRir(e.target.value)}
                    onBlur={() => {
                        const rir = Math.min(5, Math.max(0, parseInt(localRir) || 0));
                        onChangeRir(rir);
                        setLocalRir(rir.toString());
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.currentTarget.blur();
                        }
                    }}
                    disabled={set.isCompleted || isEdit}
                />
            </div>
            <div className=" flex items-center justify-center col-span-1 gap-1">
                {!isEdit && (
                    <button 
                        className={`text-sm p-2 rounded-full transition-colors cursor-pointer w-8 h-8 flex items-center justify-center 
                        border text-gray-400  
                        ${set.isCompleted ? 'text-secondary bg-primary  border-primary ' : 'hover:bg-primary/40 hover:text-primary'}
                        `}
                        aria-label="Marcar serie como completada"
                    onClick={onToggleDone}
                >
                    <Check className="inline-block" size={16} strokeWidth={3}/>
                </button>)}
                {isEdit && (
                    <button 
                        className="text-sm p-2 rounded-full transition-colors cursor-pointer w-8 h-8 flex items-center justify-center border text-gray-400 hover:bg-red-500 hover:text-white"
                        aria-label="Eliminar serie"
                        onClick={onDelete}
                    >
                        <Trash2 className="inline-block" size={16} strokeWidth={3}/>
                    </button>
                )}
            </div>
        </div>
    )
}

export default React.memo(SetRow);