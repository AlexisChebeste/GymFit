import { supabase } from "@/lib/supabaseClient";

export async function register(
  form: {
    email: string;
    password: string;
    name: string;
    age: number;
    avatar_url?: string;
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
      avatar_url: form.avatar_url,
      weight_goal: form.weight_goal,
      goal_type: form.goal_type,
    });

    if (error) throw error;
  }

  return user;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return data.user;
}

export const authService = {
  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  },
  register,
  logout,
  getCurrentUser,
};