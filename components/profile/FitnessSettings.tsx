import { Dumbbell, LucideIcon, Scale, TrendingDown } from "lucide-react";
import { Card } from "../cards/Card";
import GoalCard from "./GoalCard";
import { useState } from "react";
import { GoalOption, UserProfile } from "@/types/types";
import Button from "../ui/Button";
import { useUpdateProfileMutation } from "@/queries/profile/useUpdateProfileMutation";

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

export default function FitnessSettings({ profile, currentWeight }: { profile: UserProfile, currentWeight?: number }) {

    const updateMutation = useUpdateProfileMutation();

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

    const handleSave = async () => {
        await updateMutation.mutateAsync({ userId: profile.id, data: form});
    }

    const hasChanges =
        form.goal_type !== profile.goal_type ||
        form.height !== profile.height ||
        form.weight_goal !== profile.weight_goal;

    return (
        <>
            <p className="text-sm uppercase tracking-widest text-secondary font-bold">Objetivo principal </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    
            <Card className="p-6">

                <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-zinc-800">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Peso Actual</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white">{currentWeight || "--"}</span>
                            <span className="text-sm text-zinc-500 italic font-medium uppercase">kg</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs uppercase text-muted-foreground font-bold tracking-wider">BMI</span>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-white">
                            {currentWeight && form.height ? (currentWeight / ((form.height / 100) ** 2)).toFixed(1) : "N/A"}
                            </span>
                            <span className="text-[10px] w-fit px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold border border-green-500/30">
                            NORMAL
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Peso Objetivo</label>
                        <div className="relative group">
                            <input
                            type="number"
                            value={form.weight_goal}
                            onChange={(e) => setForm(prev => ({...prev, weight_goal: Number(e.target.value)}))}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 px-4 text-xl font-semibold text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-bold italic uppercase">Kg</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Altura</label>
                        <div className="relative group">
                            <input
                            type="number"
                            value={form.height}
                            onChange={(e) => setForm(prev => ({...prev, height: Number(e.target.value)}))}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 px-4 text-xl font-semibold text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-bold italic uppercase">Cm</span>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex flex-col-reverse sm:flex-row gap-4 w-full justify-end mt-4">
                <button 
                    type="button"
                    className="w-full sm:w-max py-3 px-6 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-medium border border-zinc-700 cursor-pointer"
                    onClick={handleCancel}
                >
                    Cancelar
                </button>

                {/* Botón de Guardar: El protagonista */}
                <Button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`
                    w-full sm:max-w-xs  rounded-xl text-lg font-bold transition-all
                    ${hasChanges 
                        ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20" 
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"}
                    `}
                >
                    Actualizar objetivo
                </Button>
            </div>
        </>
    )
}