"use client"
import { useMemo } from "react";
import { Check } from "lucide-react";
import { Card } from "./cards/Card";
import { WorkoutSession } from "@/types/types";

export const getWeekDays = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Dom) a 6 (Sab)

    // Ajustamos para que la semana empiece el Lunes (1)
    // Si hoy es Domingo (0), lo tratamos como 7 para la resta
    const diff = now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const monday = new Date(now.setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        return day;
    });
};

export default function WeeklyConsistency({ sessions }: { sessions: WorkoutSession[] }) {

  const weekDays = useMemo(() => getWeekDays(), []);

  const toLocalKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const trainedDays = useMemo(() => {
    return new Set(
      sessions.map(s => toLocalKey(new Date(s.date)))
    );
  }, [sessions]);

  const dayNames = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <Card className="p-4 bg-zinc-900/20 border-white/5">
      <div className="flex justify-between items-start gap-2">
        {weekDays.map((date, index) => {
          const dateKey = toLocalKey(date); // Genera "2026-04-05" según hora local
          const hasTrained = trainedDays.has(dateKey);
          
          // Para el punto de "Hoy" seguí usando toDateString que es seguro
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {dayNames[index]}
              </span>
              
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                ${hasTrained 
                  ? "bg-primary text-black shadow-neon-glow" 
                  : "bg-zinc-800/50 text-zinc-600 border border-white/5"}
                ${isToday && !hasTrained ? "border-primary/50 border-dashed" : ""}
              `}>
                {hasTrained ? (
                  <Check size={18} strokeWidth={4} />
                ) : (
                  <span className="text-xs font-bold">{date.getDate()}</span>
                )}
              </div>
              
              {isToday && (
                <div className="w-1 h-1 bg-primary rounded-full shadow-neon-glow animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}