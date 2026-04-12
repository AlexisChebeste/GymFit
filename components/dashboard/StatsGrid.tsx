import { BicepsFlexed, Calendar, Dumbbell, TrendingUp } from "lucide-react";
import { Card } from "../cards/Card";

interface StatsGridProps {
    totalVolume: number;
    frequency: number;
    progress: number | null;
    bestSession: number | null;
}

export default function StatsGrid({ totalVolume, frequency, progress, bestSession }: StatsGridProps) {

    return(
        <div className="grid grid-cols-2 gap-4">
            <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
            
            <p className="text-xs uppercase tracking-widest text-secondary font-bold">Volumen</p>
            <div className="flex items-center gap-3">
                <Dumbbell className="text-green-500" size={20} />
                <div className="flex flex-col">
                <p className="text-lg font-medium ">{totalVolume} <span className="text-xs font-normal text-muted-foreground uppercase italic">(Kg)</span></p>
                </div>
            </div>
            </Card>
            <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
            <p className="text-xs uppercase tracking-widest text-secondary font-bold">Frecuencia</p>
            <div className="flex items-center gap-3">
                <Calendar className="text-green-500" size={20} />
                <div className="flex flex-col">
                <p className="text-lg font-medium ">{frequency} <span className="text-xs font-normal text-muted-foreground uppercase italic">(sesiones)</span></p>
                </div>
            </div>
            </Card>
            <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
            
            <p className="text-xs uppercase tracking-widest text-secondary font-bold">Progreso</p>
            <div className="flex items-center gap-3">
                <TrendingUp className="text-green-500" size={20} />
                <div className="flex flex-col">
                <p className="text-lg font-medium ">{progress?.toFixed(2)} <span className="text-xs font-normal text-muted-foreground uppercase italic">% (7D)</span></p>
                </div>
            </div>
            </Card>
            <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
            
            <p className="text-xs uppercase tracking-widest text-secondary font-bold">Mejor sesión</p>
            <div className="flex items-center gap-3">
                <BicepsFlexed className="text-green-500" size={20} />
                <div className="flex flex-col">
                <p className="text-lg font-medium ">{bestSession} <span className="text-xs font-normal text-muted-foreground uppercase italic">(Kg)</span></p>
                </div>
            </div>
            </Card>
        </div>
    )
}