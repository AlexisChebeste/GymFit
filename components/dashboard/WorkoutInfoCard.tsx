import { Check, Dumbbell, Eye, Play } from "lucide-react";
import { Card } from "../cards/Card";
import Link from "next/link";

interface WorkoutInfoCardProps {
    isToday: boolean;
    hasTrainedToday: boolean;
    isRestDay: boolean;
    todayWorkout: any;
    nextWorkout: any;
    label: string | null;
}

export default function WorkoutInfoCard({ isToday, hasTrainedToday, isRestDay, todayWorkout, nextWorkout, label }: WorkoutInfoCardProps) {

    return(
        <Card className="px-6 py-4 flex flex-col gap-4 colspan-1 lg:col-span-2 justify-between">
            <section className="flex items-center justify-between">
            <div className="flex flex-col gap-2">

                <p className="text-xs uppercase tracking-widest text-secondary font-bold">{isToday ? "Hoy" : "Próxima sesión"}</p>
                <h2 className="text-3xl font-bold">
                {isRestDay
                    ? "Descanso"
                    : isToday
                    ? todayWorkout?.name
                    : nextWorkout?.name ?? "Sin rutina"}
                </h2>
            </div>

            <div className="flex flex-col gap-2  border border-zinc-600 p-3 rounded-full items-center justify-center">
                <Dumbbell className="text-primary" size={24} />
            </div>
            </section>

            <p className="text-sm font-normal text-muted-foreground uppercase italic">
            {isRestDay
                ? "Día libre"
                : hasTrainedToday
                ? "Entrenamiento completado"
                : label ?? "Sin planificación"}
            </p>

            <Link href={isToday && !hasTrainedToday ? `/workouts/session/${todayWorkout?.id}` : "/workouts"} className={`text-sm font-semibold w-full text-center py-4 rounded-md flex items-center justify-center transition-colors
            ${hasTrainedToday ? "bg-green-700 hover:bg-green-800" : "bg-primary/80 hover:bg-primary"}
            `}
            >
            
            {isToday && hasTrainedToday ? <Check  className="mr-2 stroke-2" size={16}/> : isToday ? <Play className="mr-2 stroke-2" size={16} /> : <Eye className="mr-2" size={16} />}

            {isRestDay
                ? "Ver rutinas"
                : isToday && !hasTrainedToday
                ? "Empezar entrenamiento"
                : "Ver rutina"}
            </Link>
        </Card>
    )
}