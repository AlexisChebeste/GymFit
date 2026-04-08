import { ChevronRight, LucideIcon } from "lucide-react";

interface OptionProfileProps {
    title: string;
    icon: LucideIcon;
    onClick?: () => void;
    className?: string;
    viewArrow?: boolean;
    label?: string;
    section?: string;
}

export default function OptionProfile({ title, icon: Icon, onClick, label, section, className, viewArrow = true }: OptionProfileProps) {

    return (
        <div className={`flex items-center justify-between w-full p-3 px-4 text-gray-500 cursor-pointer hover:text-primary hover:bg-secondary  transition-colors duration-300 hover:border-primary rounded-full ${className || ""}  ${label === section ? "bg-secondary text-primary border-primary border" : ""}`} onClick={onClick}>
            <div className="flex gap-4 items-center">
                <Icon className="w-5 h-5 " />
                <p className="font-semibold">{title}</p>
            </div>

            {viewArrow !== false && (
                <div className="text-sm hover:underline cursor-pointer">
                    <ChevronRight className="w-4 h-4 inline-block" />
                </div>
            )}
        </div>
    )
}