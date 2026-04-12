import { TrendingUp } from "lucide-react";
import { Card } from "../cards/Card";

interface WeightCardProps {
    latest: any;
    change: number;
    weightProgress: number ;
    user: any;
}

export default function WeightCard({ latest, change, weightProgress, user }: WeightCardProps) {

    return(
        <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
            <div className="flex flex-col gap-2">
                
                <p className="text-xs uppercase tracking-widest text-secondary font-bold">Peso corporal</p>
                <h2 className="text-4xl font-bold">
                {latest?.weight}
                <span className="text-lg font-normal text-muted-foreground uppercase italic ml-2">kg</span> 

                </h2>

                <div className="flex text-sm gap-2 items-center">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 font-medium">{change?.toFixed(1)} kg en el ultimo mes</span>
                </div>
                
            
            </div>

            <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Objetivo</span>
                <span>{latest?.weight} / {user?.weightGoal}</span>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${weightProgress + 100}%` }}
                />
                </div>

                <p className="text-xs text-secondary font-semibold">
                {100 + (Number(weightProgress?.toFixed(1)) || 0)} % hacia tu objetivo
                </p>
            </div>
        </Card>
    )
}