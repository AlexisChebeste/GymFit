"use client";

import { formatTime } from "@/lib/formatTime";
import { useTimerStore } from "@/store/useUIStore";
import { Zap } from "lucide-react";


export default function FloatingTimer() {
    const { time, isOpen, isRunning, setOpen } = useTimerStore();

    if (time === 0 || isOpen) return null; 

    return (
    <div onClick={() => setOpen(true)} className="fixed bottom-22 right-4 md:bottom-4 md:right-6 bg-zinc-900 border border-primary/30 py-3 px-4 rounded-full flex items-center gap-2 shadow-neon-glow cursor-pointer z-50">
        <Zap size={14} className={isRunning ? "animate-pulse text-primary" : "text-zinc-500"} />
        <span className="font-mono text-lg font-bold">{formatTime(time)}</span>
    </div>
    );

}