import { UserProfile } from "@/types/types";
import { useState, useEffect } from "react";


export type GoalOption = "lose" | "maintain" | "gain";

export function useUser() {

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    const stored = localStorage.getItem("user")

    if(stored){
      setUser(JSON.parse(stored))
    }
    setLoading(false);

  }, []);

  const updateUser = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const updateMetrics = (weightGoal: number, height: number, goalType: GoalOption) => {
    updateUser({ weightGoal, height, goalType });
  };

  return { user, loading, updateUser, updateMetrics };
}