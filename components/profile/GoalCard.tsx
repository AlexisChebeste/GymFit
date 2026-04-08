import { Check, LucideIcon } from "lucide-react";
import { Card } from "../cards/Card";

interface GoalCardProps {
    label: "maintain" | "lose" | "gain";
    goal: "maintain" | "lose" | "gain";
    setGoal: (goal: "maintain" | "lose" | "gain") => void;
    title: string;
    description: string;
    icon: LucideIcon
}

export default function GoalCard({ label, goal, setGoal, title, description, icon: Icon }: GoalCardProps) {
    return (
        <Card className={`w-full bg-zinc-800 flex flex-col gap-4 p-6 cursor-pointer border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all hover:scale-[1.02]
 ${goal === label ? 'bg-zinc-200 dark:bg-zinc-800  border-primary! hover:bg-zinc-100 dark:hover:bg-zinc-800' : ''}`} onClick={() => setGoal(label)}>
            
            <div className="flex items-center gap-4 mb-2 justify-between">
                {Icon && <Icon className="w-6 h-6 text-primary" />}

                <div className={`rounded-full bg-primary p-1 ${goal === label ? 'block' : 'hidden'} text-black`}>
                    <Check className={`w-3 h-3 stroke-4`}/>
                </div>
            </div>

            <h3 className="text-sm font-semibold flex items-center gap-2">
                {title}
            </h3>

            <p className="text-xs text-gray-500 hidden lg:block">
                {description}
            </p>

        </Card>
    );
}