"use client"

import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  icon?: LucideIcon
  className?: string
}

export function NavLink({ href, children, icon: Icon, className }: NavLinkProps) {
  const pathname = usePathname()
  
  // Verificamos si la ruta actual coincide con el href
  const isActive = href === "/" ? pathname === href : pathname.includes(href)

  return (
    <Link
      href={href}
      className={`${className || "nav-link"} ${
        isActive 
          ? "text-primary drop-shadow- pointer-events-none" // Colores activos (tus variables)
          : "text-gray-600 hover:bg-neutral/10 hover:text-foreground" // Colores inactivos
      }`}
      
    >
      {Icon && (
        <Icon 
          size={20} 
          className={`transition-transform duration-300 ${
            isActive ? "scale-110 drop-shadow-[0_0_12px_#39FF14] " : "group-hover:scale-110"
          }`} 
        />
      )}
      {children}
    </Link>
  )
}