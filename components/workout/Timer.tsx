"use client"

import { useEffect, useState } from "react";
import Modal from "../Modal";
import Button from "../ui/Button";
import { Pause, Play, Plus } from "lucide-react";
import CircularTimer from "./CircularTimer";
import { useTimerStore } from "@/store/useUIStore";


export default function Timer() {

    
    const { time, initialTime, isRunning, setOpen , addExtraTime, isOpen, stopTimer, pauseTimer, resumeTimer} = useTimerStore();

    if (!isOpen) return null;

    return (
        <Modal className="max-w-sm " onClose={() => setOpen(false)}>
            <div className="flex flex-col gap-10 items-center justify-center p-4 z-50">
                <div className="flex items-center justify-between w-full">
                    
                    <p className="text-2xl font-semibold">Descanso</p>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Minimizar descanso"
                    >
                        Minimizar
                    </button>
                </div>

                <CircularTimer 
                    timer={time} 
                    initialTime={initialTime} 
                    isRunning={isRunning} 
                    setIsRunning={(val) => val ? resumeTimer() : pauseTimer()} 
                />
                <div className="flex flex-col gap-4 w-full">
                    <Button onClick={stopTimer} autoFocus={true} className="bg-green-600 hover:bg-green-700 text-lg">
                        Terminar Descanso
                    </Button>
                    <Button onClick={() => addExtraTime(30)} className="bg-transparent border border-zinc-800 hover:bg-zinc-800 text-lg text-white">
                        <Plus className="w-4 h-4 inline-block mr-1" />
                        Agregar 30s
                    </Button>
                </div>
            </div>
        </Modal>
    );
}