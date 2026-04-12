"use client";

import DashboardView from "@/components/DashboardView";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useRoutines } from "@/hooks/useRoutine";
import useSessions from "@/hooks/useSessions";
import { useUser } from "@/hooks/useUser";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading } = useUser();

  const { sessions } = useSessions(user?.id ?? "");
  const { routine } = useRoutines(user?.id ?? "");
  const { templates } = useWorkoutTemplates(user?.id ?? "");

  const measurements = useMeasurements(user?.id ?? "", "30D");

  if (loading) return (
    <div className="flex-1 flex justify-center items-center h-full mx-auto gap-6 text-center">
      <h1 className="text-2xl font-bold text-primary">Cargando...</h1>
      
    </div>
  );

  if (!user || !profile) return (
      <div className="flex-1 flex flex-col justify-center items-center h-full mx-auto gap-6 text-center">
        <h1 className="text-2xl font-bold text-primary">No autenticado</h1>
        <p className="text-lg text-zinc-400">
          Por favor, inicia sesión para acceder al dashboard.
        </p>
        <button 
          className="bg-primary text-zinc-800 font-bold uppercase px-6 py-3 rounded-lg hover:bg-primary/80 transition cursor-pointer"
        onClick={() => router.push("/auth/login")}>
          Ir a la página de inicio de sesión
        </button>
      </div>

  );

  return (
    <DashboardView
      user={profile}
      sessions={sessions}
      routine={routine}
      templates={templates}
      measurements={measurements}
    />
  );
}