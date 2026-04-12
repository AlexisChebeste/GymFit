"use client"

import { ZapOff } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6">
      <ZapOff size={64} className="text-zinc-600 mb-4" />
      <h2 className="text-3xl font-bold italic text-primary uppercase tracking-tighter">
        404 - Circuito Cortado
      </h2>
      <p className="text-zinc-400 mt-2 mb-8">
        La página que buscas no existe o fue movida.
      </        p>
      <Link 
        href="/dashboard" 
        className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:scale-105 transition"
      >
        VOLVER AL ENTRENAMIENTO
      </Link>
    </div>
  )
}