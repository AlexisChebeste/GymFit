import { Workout } from "@/types/types";

export function getTemplateById(id: string): Workout | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem("templates");
    if (!saved) return null;

    const templates: Workout[] = JSON.parse(saved);

    return templates.find(t => t.id === id) || null;
  } catch (err) {
    console.error("Error reading templates", err);
    return null;
  }
}