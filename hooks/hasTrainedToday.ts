import { WorkoutSession } from "@/types/types";

export function isSameDay(date1: Date, date2: Date) {
    return date1.toDateString() === date2.toDateString();
}

export function hasTrainedToday(sessions: WorkoutSession[]) {
    const today = new Date();

    return sessions.some(s => {
        const sessionDate = new Date(s.date);
        return isSameDay(sessionDate, today);
    });
}