import { Workout } from "@/types/types";
import { Card } from "./Card"
import { Dumbbell, Pen, Play, Trash2 } from "lucide-react"
import Link from "next/link";

interface WorkoutCardProps {
    workout: Workout
    deleteTemplate: (id: string) => void
}

export function WorkoutCard({ workout, deleteTemplate }: WorkoutCardProps) {
    const updatedAtDate = workout.updated_at ? new Date(workout.updated_at) : null;
    const updatedAtTime = updatedAtDate?.getTime();
    const daysDiff = typeof updatedAtTime === "number" && !Number.isNaN(updatedAtTime)
        ? Math.floor((Date.now() - updatedAtTime) / (1000 * 60 * 60 * 24))
        : null;
    const updatedAt = daysDiff !== null
        ? daysDiff === 0 || daysDiff === -1
            ? "Hoy"
            : daysDiff === 1
                ? "Hace 1 día"
            : "Hace " + daysDiff + " días"
        : "Sin fecha de actualización";

    const backgroundColor = `${workout.color}33`; // "33" es 20% de opacidad en HEX
         
    return (
        <Card className="w-full" key={workout.id} >
            <div className="flex items-center gap-4 justify-between">
                <section className="flex gap-4 items-center">

                    <div className={`p-2 rounded-lg`} style={{ backgroundColor: backgroundColor }}>
                        <Dumbbell className={`w-6 h-6`}  style={{ color: workout.color }}/>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold">{workout.name}</h2>
                        <p className="text-sm text-stone-500">
                            {workout.exercises.length} ejercicios - {updatedAt}
                        </p>
                    </div>
                </section>
                <div className="flex gap-2 items-center mr:auto">
                    <Link 
                        href={`/workouts/session/${workout.id}`}
                        className={`text-sm  p-2 cursor-pointer rounded-lg flex items-center  opacity-80 transition-opacity`}
                        style={{ color: workout.color }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = backgroundColor}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        aria-label="Iniciar session"
                                
                    >
                        <Play className="w-4 h-4 inline" />
                    </Link>
                    <Link 
                        href={`/workouts/edit/${workout.id}`}
                        className={`text-sm  p-2 cursor-pointer rounded-lg flex items-center  opacity-80 transition-opacity text-blue-500 hover:bg-blue-500/20`}
                        aria-label="Editar rutina"
                    >
                      <Pen className="w-4 h-4 inline" />
                    </Link>
                    <button 
                        type="button"
                        className="text-sm text-red-500 hover:bg-red-500/20 cursor-pointer p-2 rounded-lg" 
                        onClick={() => deleteTemplate(workout.id)}
                        aria-label={`Eliminar rutina ${workout.name}`}
                    >
                        <Trash2 className="w-4 h-4  inline" />
                    </button>
                </div>
            </div>
        </Card>
    );
  
}