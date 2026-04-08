import { Dumbbell, LucideIcon, Scale, TrendingDown } from "lucide-react";
import { Card } from "../cards/Card";
import GoalCard from "./GoalCard";
import { UserProfile } from "@/types/types";

type GoalOption = "maintain" | "lose" | "gain";

type GoalInfo = {
    title: string;
    label: GoalOption;
    description: string;
    icon: LucideIcon;
};

const goalsFitness: GoalInfo[] = [
    {
        label: "lose",
        title: "Perder peso",
        description: "Crea un déficit calórico con dieta balanceada y cardio para resultados sostenibles.",
        icon: TrendingDown
    },
    {
        label: "maintain",
        title: "Mantener peso",
        description: "Conserva tu peso actual con nutrición  y rutina de entrenamiento consistente.",
        icon: Scale
    },
    {
        label: "gain",
        title: "Ganar masa",
        description: "Aumenta tu masa muscular con proteína alta y entrenamientos de fuerza progresivos.",
        icon: Dumbbell
    }
];

export default function FitnessSettings({goal, setGoal, profile}: {goal: GoalOption, setGoal: (goal: GoalOption) => void, profile: UserProfile}) {
    return (
        <>
        <p className="text-sm uppercase tracking-widest text-secondary font-bold">Objetivo principal </p>

                    <div className="grid grid-cols-3 gap-4">

                    
                        {goalsFitness.map((goalOption) => (
                            <GoalCard
                                key={goalOption.label}
                                label={goalOption.label}
                                goal={goal}
                                setGoal={setGoal}
                                title={goalOption.title}
                                description={goalOption.description}
                                icon={goalOption.icon}
                            />
                        ))}
                    </div>

                    <p className="text-sm uppercase tracking-widest text-secondary font-bold pt-8">Biometria</p>
                    
                    <Card className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">

                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Peso Actual</span>
                            <div className="flex gap-2 items-center p-2 border rounded-lg bg-zinc-300 dark:bg-zinc-800 text-center text-lg font-medium border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition">
                                <input
                                type="number"
                                value={profile.weightGoal}
                                readOnly
                                className="w-full px-2 focus:outline-none focus:ring-0 bg-transparent text-center text-lg font-medium"
                                />
                                <span className="text-lg font-medium uppercase italic px-2">Kg</span>
                            </div>

                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Peso Objetivo</span>
                            <div className="flex gap-2 items-center p-2 border rounded-lg bg-zinc-300 dark:bg-zinc-800 text-center text-lg font-medium border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition">
                                <input
                                type="number"
                                value={profile.weightGoal}
                                readOnly
                                className="w-full px-2 focus:outline-none focus:ring-0 bg-transparent text-center text-lg font-medium"
                                />
                                <span className="text-lg font-medium uppercase italic px-2">Kg</span>
                            </div>

                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Altura</span>
                            <div className="flex gap-2 items-center p-2 border rounded-lg bg-zinc-300 dark:bg-zinc-800 text-center text-lg font-medium border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition">
                                <input
                                type="number"
                                value={profile.height}
                                readOnly
                                className="w-full px-2 focus:outline-none focus:ring-0 bg-transparent text-center text-lg font-medium"
                                />
                                <span className="text-lg font-medium uppercase italic px-2">CM</span>
                            </div>

                        </div>

                    </Card>

                 

                    <button className="bg-primary/80 hover:bg-primary/70 cursor-pointer  py-3 rounded-lg font-semibold  text-gray-100">
                        Actualizar objetivo
                    </button>
        </>
    )
}