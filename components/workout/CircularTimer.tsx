
"use client";

import { formatTime } from "@/lib/formatTime";
import { Pause, Play } from "lucide-react";

interface CircularTimerProps {
  timer: number;      
  initialTime: number; 
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
}

export default function CircularTimer({ 
  timer, 
  initialTime, 
  isRunning, 
  setIsRunning, 
}: CircularTimerProps) {
  
  const radius = 90;
  const circumference = 2 * Math.PI * radius; 
  
  const progress = initialTime > 0 ? timer / initialTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      <svg className="absolute w-full h-full -rotate-90 transform">
        <circle
          cx="112"
          cy="112"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-zinc-800"
        />
        <circle
          cx="112"
          cy="112"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset,
            transition: "stroke-dashoffset 1s linear" 
          }}
          strokeLinecap="round"
          className={`${timer === 0 ? 'text-red-500' : 'text-primary'}`}
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center gap-1">
        <p className="text-4xl font-bold text-white">{formatTime(timer)}</p>
        <p className="text-zinc-600 text-sm uppercase tracking-widest font-bold">Restante</p>
        <button 
          onClick={() => setIsRunning(!isRunning)} 
          className="mt-2 cursor-pointer text-zinc-400 hover:text-primary transition-colors"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
      </div>
    </div>
  );
}