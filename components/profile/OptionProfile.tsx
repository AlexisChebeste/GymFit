import { ChevronRight, LucideIcon } from "lucide-react";

interface OptionProfileProps {
    title: string;
    icon: LucideIcon;
    onClick?: () => void;
    label: string;
    section?: string;
    variant?: "default" | "danger";
}

export default function OptionProfile({ title, icon: Icon, onClick, label, section,variant = "default" }: OptionProfileProps) {

    const isActive = label === section;

    const variantStyles = {
        default: isActive 
            ? "bg-secondary/50 text-white border-primary" 
            : "text-zinc-400 hover:text-white hover:bg-secondary/30 border-transparent",
        danger: "text-red-500 hover:text-red-400 hover:bg-red-500/10 border-transparent"
    };

    return (
       <button
            type="button"
            onClick={onClick}
            className={`
                flex items-center justify-between w-full p-3 px-4 
                transition-all duration-200 rounded-xl border
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer
                ${variantStyles[variant]}
            `}
        >
            <div className="flex gap-4 items-center">
                <Icon className={`w-5 h-5 ${isActive ? "text-white animate-pulse" : ""}`} />
                <p className="font-medium tracking-tight">{title}</p>
            </div>

            {/* Solo mostramos la flecha si no es danger y no está activo */}
            {variant !== "danger" && !isActive && (
                <ChevronRight className="w-4 h-4 opacity-50" />
            )}
            
            {/* Si está activo, podemos mostrar un puntito o dejarlo limpio */}
            {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,0,0.5)]" />
            )}
        </button>
    )
}