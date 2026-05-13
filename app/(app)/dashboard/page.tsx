"use client";

import DashboardView from "@/components/DashboardView";
import { UserProfile } from "@/types/types";
import { useRouter } from "next/navigation";
import { useMeasurementStats } from "@/hooks/progress/useMeasurementsStats";
import { useMeasurementsQuery } from "@/queries/measurements/getMeasurementsQuery";
import { useSessionsQuery } from "@/queries/sessions/getSessionsQuery";
import { useWorkoutsQuery } from "@/queries/workout/getWorkoutsQuery";
import { useRoutinesQuery } from "@/queries/routines/getRoutinesQuery";
import { useProfileQuery } from "@/queries/profile/getProfileQuery";
import { useUser } from "@/contexts/AuthContext";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { data: profile = {}, isLoading: isProfileLoading } = useProfileQuery(user?.id ?? "");
  const { data: sessions = [], isLoading: isSessionsLoading } = useSessionsQuery(user?.id ?? "");
  const { data: routine = null, isLoading: isRoutinesLoading } = useRoutinesQuery(user?.id ?? "");
  const { data: templates = [], isLoading: isWorkoutsLoading } = useWorkoutsQuery(user?.id ?? "");

  const {data: measurements = [], isLoading: isMeasurementsLoading} = useMeasurementsQuery(user?.id ?? "");

  const measurementsStats = useMeasurementStats(measurements, profile as UserProfile, "30D");

  if (loading || isProfileLoading || isSessionsLoading || isRoutinesLoading || isWorkoutsLoading || isMeasurementsLoading) return  (
      <div className="flex flex-col gap-4 w-full pt-6 pb-2 mb-20 lg:pb-0 p-4 h-full animate-pulse max-w-7xl mx-auto overflow-y-auto ">
        <div className="min-h-64 bg-zinc-800 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-48 bg-zinc-800 rounded-xl lg:col-span-2" />
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
      user={profile as UserProfile}
      sessions={sessions}
      routine={routine}
      templates={templates}
      measurementsStats={measurementsStats}
    />
  );
}