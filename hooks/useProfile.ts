import { UserProfile } from "@/types/types";
import { useEffect, useState } from "react";

export type GoalOption = "maintain" | "lose" | "gain";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("profile");
    if (data) setProfile(JSON.parse(data));
  }, []);

  const updateProfile = (newData: UserProfile) => {
    setProfile(newData);
    localStorage.setItem("profile", JSON.stringify(newData));
  };

  const updateMetrics = (weightGoal: number, height: number, goalType: GoalOption) => {
    if (profile) {
      const newData = { ...profile, weightGoal, height, goalType };
      setProfile(newData);
      localStorage.setItem("profile", JSON.stringify(newData));
    }
  };

  return { profile, updateProfile, updateMetrics };
}