"use client"

import { UserRound, KeyRound, LockKeyhole, LogOut } from "lucide-react";
import { Pen } from "lucide-react";
import {  useRef, useState } from "react";
import OptionProfile from "@/components/profile/OptionProfile";
import FitnessSettings from "@/components/profile/FitnessSettings";
import { useMeasurements } from "@/hooks/useMeasurements";
import PasswordSettings from "@/components/profile/PasswordSettings";
import PrivacySettings from "@/components/profile/PrivacySettings";
import { useUser } from "@/hooks/useUser";
import { logout, updateMetrics } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/types";
import { supabase } from "@/lib/supabaseClient";
import { uploadAvatar } from "@/services/avatar.service";
import { toast } from "sonner";

type ProfileSection =
  | "account"
  | "password"
  | "privacy";

export default function ProfilePage() {
    const router = useRouter();
    const {profile, setProfile, loading } = useUser();
    const {latest} = useMeasurements(profile?.id ?? "",profile ?? {} as UserProfile ,"90D");
    
    const fileRef = useRef<HTMLInputElement>(null);
    const [section, setSection] = useState<ProfileSection>("account");

    if (loading) {
        return (
            <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural overflow-y-auto max-h-[85vh] md:max-h-full ">
                <main className="flex flex-1 w-full flex-col gap-2 items-center p-4 bg-white dark:bg-natural max-w-7xl h-full justify-center text-center">
                    <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Perfil de usuario</p>
                    <h1 className="text-4xl font-bold">Cargando perfil...</h1>
                    <p className="text-lg text-muted-foreground">Estamos cargando tu perfil, por favor espera un momento.</p>
                </main>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural overflow-y-auto max-h-[85vh] md:max-h-full">
                <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural max-w-7xl">
                    <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Perfil de usuario</p>
                    <h1 className="text-4xl font-bold">No hay perfil</h1>
                    <p className="text-lg text-muted-foreground">Por favor, crea un perfil para ver tus datos.</p>
                </main>
            </div>
        );
    }

    const yearSince = new Date(profile.created_at).getFullYear();

    const singOut = () => {
        logout();
        router.push("/auth/login");
    }

    const handleAvatarChange = async (file: File) => {
        if (!profile) return;

        try {
            const url = await uploadAvatar(profile.id, file);
            console.log("Avatar subido con éxito:", url);
            await supabase
                .from("profiles")
                .update({ avatar_url: url })
                .eq("id", profile.id);

            setProfile((prev) => ({
                ...prev!,
                avatar_url: url
            }));

        } catch (err) {
            console.error(err);
            toast.error("Error al subir el avatar. Por favor, intenta de nuevo.");
        }
    };

    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural overflow-y-auto max-h-[85vh] md:max-h-full">
            <main className="flex flex-1 w-full flex-col md:flex-row gap-6 items-start p-4 py-8 bg-white dark:bg-natural max-w-7xl">
                {/* <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Perfil de usuario</p> */}

                <section className="flex flex-col gap-6 items-center w-full md:w-xl md:bg-white md:dark:bg-zinc-900 p-6 rounded-xl py-8">
                    <div className="border-2 border-primary rounded-full p-1 shadow-[0_0_25px_rgba(57,255,20,0.35)] relative">
                        
                        <img src={profile.avatar_url || "/default-avatar.webp"} alt="Avatar" className="w-46 h-46 rounded-full object-cover" />
                        
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute bottom-3 right-3 bg-primary rounded-full p-2 text-zinc-900 cursor-pointer hover:bg-secondary transition"
                        >
                            <Pen className="w-4 h-4" />
                        </button>

                        {/* INPUT OCULTO */}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAvatarChange(file);
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-2 items-center">

                        <h1 className="text-4xl font-bold">{profile.name}</h1>
                        <p className="text-sm uppercase tracking-wider text-muted-foreground bg-zinc-800 p-2 rounded-full px-4 ">{yearSince ? `Miembro desde ${yearSince}` : "Miembro desde hace poco"}</p>

                    </div>

                    <div className="hidden md:flex flex-col gap-4 p-2 w-full">
                        
                        <span className="text-sm uppercase tracking-widest text-secondary font-bold">Configuración</span>
                        <OptionProfile 
                            title="Cuenta" 
                            section={section}
                            label="account"
                            icon={UserRound} 
                            onClick={() => setSection("account")}
                        />
                        <OptionProfile 
                            title="Cambiar contraseña" 
                            label="password"
                            section={section}
                            icon={KeyRound} 
                            onClick={() => setSection("password")}
                        />
{/*                         <OptionProfile 
                            title="Privacidad" 
                            label="privacy"
                            section={section}
                            icon={LockKeyhole} 
                            onClick={() => setSection("privacy")}
                        /> */}
                        <OptionProfile title="Cerrar sesión" 
                            label="log-out"
                            icon={LogOut} className="text-red-700" viewArrow={false} 
                            onClick={singOut} 
                        />
                    </div>
                </section>

                <section className="w-full flex flex-col gap-4 ">

                    {section === "account" && 
                        <FitnessSettings
                            profile={profile}
                            currentWeight={latest?.weight}
                            updateMetrics={updateMetrics}
                        />
                    }
                    {section === "password" && <PasswordSettings />}
{/*                     {section === "privacy" && <PrivacySettings />} */}
                    
                </section>

                <div className="flex flex-col gap-4 p-2 w-full md:hidden">
                        
                    <span className="text-sm uppercase tracking-widest text-secondary font-bold">Configuración</span>
                    <OptionProfile 
                        title="Cuenta" 
                        section={section}
                        label="account"
                        icon={UserRound} 
                        onClick={() => setSection("account")}
                    />
                    <OptionProfile 
                        title="Cambiar contraseña" 
                        label="password"
                        section={section}
                        icon={KeyRound} 
                        onClick={() => setSection("password")}
                    />
{/*                     <OptionProfile 
                        title="Privacidad" 
                        label="privacy"
                        section={section}
                        icon={LockKeyhole} 
                        onClick={() => setSection("privacy")}
                    /> */}
                    <OptionProfile title="Cerrar sesión" 
                        label="log-out"
                        icon={LogOut} className="text-red-700" viewArrow={false} 
                        onClick={singOut} 
                    />
                </div>
            </main>
        </div>
    );
}