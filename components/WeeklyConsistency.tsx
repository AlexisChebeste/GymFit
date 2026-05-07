"use client"
import { Check } from "lucide-react";
import { Card } from "./cards/Card";


export default function WeeklyConsistency({days}: {days: {date: Date, hasTrained: boolean, dateKey: string, isPlanned: boolean, isToday: boolean}[]}) {

  const dayNames = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <Card className="p-4 bg-zinc-900/20 border-white/5">
      <div className="flex justify-between items-start gap-2">
        {days.map((d, index) =>(
            <div key={index} className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {dayNames[index]}
              </span>
              
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500

                ${d.hasTrained 
                  ? "bg-secondary text-black " 
                  : d.isPlanned
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-zinc-800/50 text-zinc-600 border border-white/5"
                }

                ${d.isToday && !d.hasTrained ? "border-primary/50 border-dashed" : ""}
              `}>
                {d.hasTrained ? (
                  <Check size={18} strokeWidth={4} />
                ) : d.isPlanned ? (
                  <span className="text-[10px] font-bold">•</span>
                ) : (
                  <span className="text-xs font-bold">{new Date(d.date).getDate()}</span>
                )}
              </div>
              
              {d.isToday && (
                <div className="w-1 h-1 bg-primary rounded-full shadow-neon-glow animate-pulse" />
              )}
            </div>
          
        ))}
      </div>
    </Card>
  );
}