"use client"

import { Dumbbell, LayoutDashboard, TrendingUp, ChartColumnBig  } from "lucide-react";
import { NavLink } from "./NavLink";

export default function Footer() {

    return (
        <div className="fixed bottom-0 w-full  bg-stone-950 rounded-t-2xl">
        <nav className="flex items-center justify-around p-4 bg-neutral/80 backdrop-blur-md border border-white/10 rounded-t-2xl shadow-2xl">
            <NavLink href="/" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink href="/workouts" icon={Dumbbell}>Entrenamientos</NavLink>
            <NavLink href="/progress" icon={TrendingUp}>Progreso</NavLink>
            <NavLink href="/stats" icon={ChartColumnBig}>Estadisticas</NavLink>
        </nav>
        </div>
    );
}