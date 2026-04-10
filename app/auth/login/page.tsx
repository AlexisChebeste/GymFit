"use client"

import { useState } from "react";
import { redirect, useRouter } from "next/navigation"
import { Eye, EyeOff, Zap } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@/types/types";

export default function LoginPage() {
    const router = useRouter();

    const [showCurrent, setShowCurrent] = useState(false);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });

    function handleLogin() {
        // Simulamos una validación
        if (loginForm.email && loginForm.password) {
            const mockUser: UserProfile = {
                id: "user123",
                email: loginForm.email,
                name: "Alex",
                goalType: "lose",
                weightGoal: 69,
                height: 160,
                age: 20,
                createdAt: new Date().toISOString(),

            };
            
            localStorage.setItem("user", JSON.stringify(mockUser));
            router.push("/dashboard"); // router.push es mejor que redirect en eventos
        }


    }

    
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-8 bg-natural p-6">

            <div className="flex flex-col gap-2 items-center">

                <Zap 
                    size={36}
                    fill="currentColor" 
                    className="text-primary mb-6" 
                />
                <h1 className="text-5xl font-bold text-primary italic">TRACKFIT</h1>
                <p className="text-base uppercase text-zinc-400 tracking-wide">
                    Alimenta tu motor de rendimiento
                </p>
                
            </div>

            <div className="max-w-xl w-full p-8 h-full flex flex-col items-center justify-center gap-8 max-h-max rounded-xl bg-stone-900 border-none ">
                <form className="flex flex-col gap-8 w-full" onSubmit={(e) => {
                    e.preventDefault()
                    handleLogin()
                }}>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                        Correo electrónico
                        </label>

                        <input 
                            type="email"
                            placeholder="Ingresá tu correo electrónico"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            className="w-full p-3 pr-10 rounded-lg  bg-zinc-200 dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary transition" 
                        
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">

                            <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                            Contraseña 
                            </label>

                            <button
                                type="button"
                                className="text-xs text-primary font-semibold uppercase  cursor-pointer hover:underline"
                            >
                                Has olvidado tu contraseña?
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                placeholder="Ingresá tu contraseña"
                                className="w-full p-3 pr-10 rounded-lg  bg-zinc-200 dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-4 text-muted-foreground cursor-pointer"
                            >
                                {showCurrent ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>
                    <button type="submit" 
                        className="bg-primary text-zinc-800 font-bold uppercase p-3 rounded-lg hover:bg-primary/80 transition cursor-pointer"
                    >
                        Iniciar sesión
                    </button>
                </form>

                <div className="flex gap-1 items-center">
                    <p className="text-sm text-zinc-400">
                        ¿No tienes una cuenta?{' '}
                        <Link
                            href="/auth/register"
                            className="text-primary font-semibold hover:underline cursor-pointer">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}