import { supabase } from "@/lib/supabaseClient";
import { GoalOption } from "@/types/types";

export async function login(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

export async function register(
  form: {
    email: string;
    password: string;
    name: string;
    age: number;
    height: number;
    weight_goal: number;
    goal_type: "lose" | "maintain" | "gain";
  }
) {
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
  });

  if (error) throw error;

  const user = data.user;

  if (user) {
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      email: form.email,
      name: form.name,
      height: form.height,
      age: form.age,
      weight_goal: form.weight_goal,
      goal_type: form.goal_type,
    });

    if (error) throw error;
  }
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function updateMetrics(userId: string, weightGoal: number, height: number, goalType: GoalOption) {
  const { error } = await supabase.from("profile").update({
    weight_goal: weightGoal,
    height: height,
    goal_type: goalType,
    updatedAt: new Date().toISOString(),
  }).eq("id", userId);

  if (error) throw error;
}