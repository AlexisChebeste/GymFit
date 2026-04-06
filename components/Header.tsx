import { UserRound } from "lucide-react";
import Link from "next/link";
import { NavLink } from "./NavLink";

const links = [
    { href: "/", label: "Dashboard" },
    { href: "/workouts", label: "Entrenamientos" },
    { href: "/progress", label: "Progreso" },
    { href: "/stats", label: "Estadisticas" },
]

export default function Header() {

  return (
    <header className="w-full bg-white dark:bg-stone-950 shadow-md border-b border-gray-200 dark:border-gray-800 max-h-14 h-full">
      <div className="mx-auto flex items-center justify-between h-full px-4 max-w-7xl">
        <Link href="/" className="text-2xl font-bold text-primary italic">
            TrackFit
        </Link>

        <nav className="md:flex items-center justify-between gap-6 hidden">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} className="text-sm font-semibold">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link href="/profile" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full 
          p-2 hover:bg-gray-100 dark:hover:bg-gray-700
        ">
            <UserRound size={20} />
        </Link>
      </div>
    </header>
  );
}
