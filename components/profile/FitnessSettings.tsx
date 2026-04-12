import { Dumbbell, LucideIcon, Scale, TrendingDown } from "lucide-react";
import { Card } from "../cards/Card";
import GoalCard from "./GoalCard";
import { useState } from "react";
import { GoalOption, UserProfile } from "@/types/types";

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
        title: "Ganar peso",
        description: "Aumenta tu masa muscular con proteína alta y entrenamientos de fuerza progresivos.",
        icon: Dumbbell
    }
];

type FormSettings = {
    goal_type: GoalOption;
    height: number;
    weight_goal: number;
}

export default function FitnessSettings({ profile, currentWeight, updateMetrics }: { profile: UserProfile, currentWeight?: number, updateMetrics: (userId: string, weightGoal: number, height: number, goalType: GoalOption) => void }) {

    const [form, setForm] = useState<FormSettings>({
        goal_type: profile?.goal_type as GoalOption,
        height: profile?.height,
        weight_goal: profile?.weight_goal
    });

    const handleCancel = () => {
        setForm({
            goal_type: profile?.goal_type as GoalOption,
            height: profile?.height ,
            weight_goal: profile?.weight_goal 
        });
    }

    const handleSave = () => {
        updateMetrics(profile.id,form.weight_goal, form.height, form.goal_type);
    }

    const hasChanges =
        form.goal_type !== profile.goal_type ||
        form.height !== profile.height ||
        form.weight_goal !== profile.weight_goal;

    return (
        <>
            <p className="text-sm uppercase tracking-widest text-secondary font-bold">Objetivo principal </p>

            <div className="grid grid-cols-3 gap-4">
                {goalsFitness.map((goalOption) => (
                    <GoalCard
                        key={goalOption.label}
                        label={goalOption.label}
                        goal={form.goal_type}
                        setGoal={(goal) => setForm(prev => ({...prev, goal_type: goal}))}
                        title={goalOption.title}
                        description={goalOption.description}
                        icon={goalOption.icon}
                    />
                ))}
            </div>

            <p className="text-sm uppercase tracking-widest text-secondary font-bold pt-8">Biometria</p>
                    
            <Card className="grid grid-cols-1  gap-4 p-6">

                <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Peso Actual</span>
                    <div className="flex gap-2 items-center p-2 border rounded-lg bg-zinc-300 dark:bg-zinc-800 text-center text-lg font-medium border-zinc-400 dark:border-zinc-600">

                        {!currentWeight ? (
                            <p className="w-full text-sm text-muted-foreground text-center">
                                Sin mediciones
                            </p>
                        ) :(
                            <input
                                type="number"
                                value={currentWeight}
                                readOnly
                                className="w-full px-2 focus:outline-none bg-transparent text-center text-lg font-medium"
                            />
                        )}

                        <span className="text-lg font-medium uppercase italic px-2">kg</span>

                    </div>

                </div>
                
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Peso Objetivo</span>
                    <div className="flex gap-2 items-center p-2 border rounded-lg bg-zinc-300 dark:bg-zinc-800 text-center text-lg font-medium border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition">
                        <input
                            type="number"
                            value={form.weight_goal}
                            onChange={(e) => setForm(prev => ({...prev, weight_goal: Number(e.target.value)}))}
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
                        value={form.height}
                        onChange={(e) => setForm(prev => ({...prev, height: Number(e.target.value)}))}
                        className="w-full px-2 focus:outline-none focus:ring-0 bg-transparent text-center text-lg font-medium"
                        />
                        <span className="text-lg font-medium uppercase italic px-2">CM</span>
                    </div>

                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">BMI</span>
                    <div className="flex gap-2 items-center p-2 border rounded-lg bg-zinc-300 dark:bg-zinc-800 text-center text-lg font-medium border-zinc-400 dark:border-zinc-600">

                        <input
                            type="number"
                            value={currentWeight && form.height ? (currentWeight / ((form.height / 100) ** 2)).toFixed(1) : "N/A"}
                            readOnly
                            className="w-full px-2 focus:outline-none bg-transparent text-center text-lg font-medium"
                        />

                        <span className="text-lg  font-medium uppercase italic px-2">Normal</span>

                    </div>

                </div>

            </Card>

            <div className="flex gap-4 w-full">
                <button 
                    className="w-full bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer  py-3 rounded-lg font-semibold text-gray-800 dark:text-gray-200"
                    onClick={handleCancel}
                >
                    Cancelar
                </button>
                <button 
                    className="w-full bg-primary/80 hover:bg-primary/70 cursor-pointer  py-3 rounded-lg font-semibold  text-gray-100
                    disabled:bg-primary/50 disabled:cursor-not-allowed disabled:hover:bg-primary/50 transition
                    "
                    onClick={handleSave}
                    disabled={!hasChanges}
                >
                    Actualizar objetivo
                </button>
            </div>
        </>
    )
}