"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingDown, Scale, Dumbbell } from "lucide-react";
import { register } from "@/services/auth.services";
import { UserProfile } from "@/types/types";

type Goal = "lose" | "maintain" | "gain";

type UserProfileOmit = Omit<UserProfile, "id" | "created_at" | "updated_at"> & { password: string };

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState<UserProfileOmit>({
    email: "",
    password: "",
    name: "",
    age: 18,
    height: 170,
    weight_goal: 70,
    goal_type: "maintain" as Goal,
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const handleRegister = async () => {
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error al registrarse");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-natural p-6">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-xl flex flex-col gap-6">

        {/* STEP 1 → ACCOUNT */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold text-primary">Crear cuenta</h1>

            <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                Correo electrónico
                </label>
                <input
                type="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                Contraseña
                </label>
                <input
                type="password"
                placeholder="Contraseña"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
            </div>

            <button onClick={next} className="btn-primary">
              Continuar
            </button>
          </>
        )}

        {/* STEP 2 → GOAL */}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-primary">
              ¿Cuál es tu objetivo?
            </h1>

            <div className="flex flex-col gap-3">

              <GoalCard
                active={form.goal_type === "lose"}
                onClick={() => setForm({ ...form, goal_type: "lose" })}
                title="Perder peso"
                icon={TrendingDown}
              />

              <GoalCard
                active={form.goal_type === "maintain"}
                onClick={() => setForm({ ...form, goal_type: "maintain" })}
                title="Mantener"
                icon={Scale}
              />

              <GoalCard
                active={form.goal_type === "gain"}
                onClick={() => setForm({ ...form, goal_type: "gain" })}
                title="Ganar masa"
                icon={Dumbbell}
              />

            </div>

            <div className="flex gap-2">
              <button onClick={back} className="btn-secondary w-full">
                Atrás
              </button>
              <button onClick={next} className="btn-primary w-full">
                Continuar
              </button>
            </div>
          </>
        )}

        {/* STEP 3 → BODY DATA */}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold text-primary">
              Datos físicos
            </h1>

            <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                    Altura (cm)
                </label>
                <input
                    type="number"
                    placeholder="Altura (cm)"
                    className="input"
                    value={form.height}
                onChange={(e) =>
                    setForm({ ...form, height: Number(e.target.value) })
                }
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                    Peso objetivo (kg)
                </label>
                <input
                    type="number"
                    placeholder="Peso objetivo (kg)"
                    className="input"
                    value={form.weight_goal}
                onChange={(e) =>
                    setForm({ ...form, weight_goal: Number(e.target.value) })
                }
                />
            </div>

            <div className="flex gap-2">
              <button onClick={back} className="btn-secondary w-full">
                Atrás
              </button>
              <button onClick={next} className="btn-primary w-full">
                Continuar
              </button>
            </div>
          </>
        )}

        {/* STEP 4 → PROFILE */}
        {step === 4 && (
          <>
            <h1 className="text-2xl font-bold text-primary">
              Completa tu perfil
            </h1>
            <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                Nombre
                </label>
            
                <input
                type="text"
                placeholder="Nombre"
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
            </div>

             <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                Edad
                </label>
            
                <input
                    type="number"
                    placeholder="Edad"
                    className="input"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                Foto de perfil (opcional)
                </label>
                {/* avatar simple opcional */}
                
                <input type="file" className="text-sm text-zinc-400 
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/80 transition cursor-pointer"
                 />

            </div>
            <div className="flex gap-2">
              <button onClick={back} className="btn-secondary w-full">
                Atrás
              </button>
              <button onClick={handleRegister} className="btn-primary w-full">
                Crear cuenta
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

function GoalCard({ title, icon: Icon, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition
        ${active
          ? "border-primary bg-primary/10"
          : "border-zinc-700 hover:border-primary"}
      `}
    >
      <Icon className="text-primary" />
      <span className="font-medium">{title}</span>
    </div>
  );
}