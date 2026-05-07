"use client";

import DashboardView from "@/components/DashboardView";
import Loading from "@/components/Loading";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useRoutines } from "@/hooks/useRoutine";
import useSessions from "@/hooks/useSessions";
import { useUser } from "@/hooks/useUser";
import { useWorkoutTemplates } from "@/hooks/workout/useWorkoutTemplates";
import { UserProfile } from "@/types/types";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading } = useUser();

  const { sessions } = useSessions(user?.id ?? "");
  const { routine } = useRoutines(user?.id ?? "");
  const { templates } = useWorkoutTemplates(user?.id ?? "");

  const measurements = useMeasurements(user?.id ?? "", profile ?? {} as UserProfile, "30D");

  if (loading) return  (
      <div className="flex flex-col gap-4 w-full pt-6 p-4 h-full animate-pulse max-w-7xl mx-auto overflow-y-auto">
        <div className="h-64 md:h-32 bg-zinc-800 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-48 bg-zinc-800 rounded-xl lg:col-span-2" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-full bg-zinc-800 rounded-xl" />
            <div className="h-full bg-zinc-800 rounded-xl" />
            <div className="h-full bg-zinc-800 rounded-xl" />
            <div className="h-full bg-zinc-800 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-80 bg-zinc-800 rounded-xl lg:col-span-2" />
          <div className="h-48 lg:h-80 bg-zinc-800 rounded-xl" />
        </div>
        <div className="h-64 bg-zinc-800 rounded-xl" />
      </div>
    );;

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