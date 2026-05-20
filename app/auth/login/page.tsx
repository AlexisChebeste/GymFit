"use client"

import { useState } from "react";
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap } from "lucide-react";
import Link from "next/link";
import { useLoginMutation } from "@/queries/profile/useLoginMutation";

export default function LoginPage() {
    const router = useRouter();

    const [showCurrent, setShowCurrent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });

    const loginMutation = useLoginMutation();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await loginMutation.mutateAsync(loginForm);
            router.push("/dashboard");
        } catch (error) {
            setError("Credenciales inválidas. Por favor, intenta de nuevo.");
        }
    };

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
                <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                            Correo electrónico
                        </label>

                        <input 
                            type="email"
                            placeholder="Ingresá tu correo electrónico"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            className="w-full p-3 pr-10 rounded-lg  bg-zinc-800/50 border border-zinc-700/30 focus:outline-none focus:ring-2 focus:ring-primary transition truncate text-sm " 
                        
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">

                            <label className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                            Contraseña 
                            </label>

                            
                        </div>

                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                placeholder="Ingresá tu contraseña"
                                className="w-full p-3 pr-10 rounded-lg  bg-zinc-800/50 border border-zinc-700/30 focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
                            />

                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-4 text-muted-foreground cursor-pointer"
                            >
                                {showCurrent ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                        <div className="flex justify-center md:justify-end mt-2">

                            <button
                                type="button"
                                className="text-xs text-zinc-400 font-medium uppercase  cursor-pointer hover:underline align-self-end"
                            >
                                Has olvidado tu contraseña?
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button type="submit" 
                        className="bg-primary font-black text-zinc-800 uppercase p-3 rounded-lg hover:bg-primary/80 transition cursor-pointer text-base"
                    >
                        Iniciar sesión
                    </button>


                </form>

                <div className="flex gap-1 items-center">
                    <p className="text-xs md:text-sm text-zinc-400">
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