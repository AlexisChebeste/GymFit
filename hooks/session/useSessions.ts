import { supabase } from "@/lib/supabaseClient";
import { sessionService } from "@/services/sessions.service";
import { WorkoutSession } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function useSessions(userId: string) {

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;
      const fetchSessions = async () => {
        try {
          const data = await sessionService.getAll(userId);
          setSessions(data);
        } catch (error) {
          toast.error("Error al cargar las sesiones.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSessions();
    }, [userId]);

    const createSession = async (session: Omit<WorkoutSession, "id">) => {
      const newSession = await sessionService.create(session);
      setSessions(prev => [...prev, newSession]);
    };

    return {
      sessions,
      createSession,
      isSessionsLoaded: !isLoading,
    }
}