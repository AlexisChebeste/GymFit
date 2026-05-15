"use client"

import { Set } from "@/types/types";
import { Check, Trash2 } from "lucide-react";
import React, { useState } from "react";


function SetRowEdit({set, onDelete}: {
    set: Set;
    onDelete: () => void;
}) {

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
                    className={`bg-black/80 h-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-center w-full opacity-50 cursor-not-allowed`}
                    value={0}
                    disabled={true}
                />
            </div>
            <div className="col-span-1 text-center">
                <input 
                    type="number" 
                    step="1"
                    max={99}
                    aria-label={`Repeticiones por serie ${set.set}`}
                    className={`bg-black/80 h-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-center w-full opacity-50 cursor-not-allowed`}
                    value={0}
                    disabled={true}
                />  
            </div>

            <div className="col-span-1 text-center w-full">
                <input
                    type="number"
                    min={0}
                    max={5}
                    step={1}
                    aria-label={`RIR por serie ${set.set}`}
                    className={`bg-black/80 h-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-center w-full opacity-50 cursor-not-allowed`}
                    value={0}
                    disabled={true}
                />
            </div>
            <div className=" flex items-center justify-center col-span-1 gap-1">
                <button 
                    className="text-sm p-2 rounded-full transition-colors cursor-pointer w-8 h-8 flex items-center justify-center border text-gray-400 hover:bg-red-500 hover:text-white"
                    aria-label="Eliminar serie"
                    onClick={onDelete}
                >
                    <Trash2 className="inline-block" size={16} strokeWidth={3}/>
                </button>
            </div>
        </div>
    )
}

export default React.memo(SetRowEdit);