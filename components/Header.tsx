"use client"

import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { NavLink } from "./NavLink";
import { usePathname } from "next/navigation";
import { logout } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { ThemeToggle } from "./ui/ThemeToggle";
const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/workouts", label: "Entrenamientos" },
    { href: "/progress", label: "Progreso" },
    { href: "/stats", label: "Estadisticas" },
]

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const {profile} = useUser();

  const isPageLogin = pathname.includes("/auth/login") || pathname.includes("/auth/register")

  const singOut = () => {
      logout();
      router.push("/auth/login");
  }

  if(isPageLogin) return null

  return (
    <header className="w-full bg-white dark:bg-stone-950 shadow-md border-b border-gray-200 dark:border-gray-800 min-h-14">
      <div className="mx-auto flex items-center justify-between h-14 px-4 max-w-7xl">
        <Link href="/dashboard" className="text-2xl font-bold text-primary italic">
            TrackFit
        </Link>

        <nav className="md:flex items-center justify-between gap-6 hidden">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} className="text-sm font-semibold" aria-label={link.label}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex gap-2 items-center">
          
{/*           <ThemeToggle /> */}

          {profile ? (
            <Link 
              href="/profile" 
              className="flex items-center justify-center text-sm font-medium transition-colors rounded-full h-8 w-8 overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:opacity-80"
              aria-label="Perfil"
            >
              {profile.avatar_url ? (
                <Image 
                  src={profile.avatar_url} 
                  alt={`Avatar de ${profile.name || "usuario"}`} 
                  className="h-full w-full object-cover"
                  width={32} 
                  height={32}  
                /> 
              ) : (
                <div className="flex items-center justify-center h-full w-full text-stone-600 dark:text-stone-300">
                  {profile.name ? (
                    profile.name.charAt(0).toUpperCase() 
                  ) : (
                    <UserRound size={18} />
                  )}
                </div>
              )}
            </Link>
          ) : (
            <div className="flex items-center justify-center h-full w-full text-stone-600 dark:text-stone-300">
              <UserRound size={18} />
            </div>
          )}

          <button 
            onClick={singOut} 
            className="flex items-center gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/20 transition-colors rounded-full 
            p-2 cursor-pointer"
            aria-label="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
