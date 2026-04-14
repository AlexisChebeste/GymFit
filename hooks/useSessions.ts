import { supabase } from "@/lib/supabaseClient";
import { WorkoutSession } from "@/types/types";
import { useEffect, useState } from "react";


export default function useSessions(userId: string) {

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;
      const fetchSessions = async () => {
        const {data, error } = await supabase
          .from("workout_sessions")
          .select("*")
          .eq("user_id", userId)

        if (error) {
          console.error("Error fetching routine:", error);
        } else {
          setSessions(data || []);
        }
        setIsLoading(false);
      };

      fetchSessions();
    }, [userId]);

    return {
      sessions,
      setSessions,
      isSessionsLoaded: !isLoading,
    }
}