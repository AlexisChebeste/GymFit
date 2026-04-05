"use client"

export function Card({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <div className={` ${className} bg-zinc-900 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-xl`} onClick={onClick}>
      {children}
    </div>
  )
}