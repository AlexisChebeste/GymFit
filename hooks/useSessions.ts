import { useLocalStorage } from "@/lib/useLocalStorage";
import { WorkoutSession } from "@/types/types";
import { useEffect } from "react";


export default function useSessions(userId: string) {

  const [sessions] = useLocalStorage<WorkoutSession[]>("sessions", []);

  useEffect(() => {
    if (!userId) return;

    const userSessions = sessions.filter(s => s.userId === userId);

    if (userSessions.length === 0) {
        const newSessions = [...sessions, ...userSessions];
        localStorage.setItem("sessions", JSON.stringify(newSessions));
    }
    }, [userId, sessions]);

    return {
      sessions: sessions.filter(s => s.userId === userId)
    }
}