import { ShieldAlert, Trophy, Zap } from "lucide-react";
import { Card } from "../cards/Card";

interface InsightsCardProps {
    insightsData: {
        title: string;
        text: string;
        icon: string; // Nombre del icono de Lucide
    };
    volumeData: any[]; // Tipo específico según tu estructura de datos
}

export default function InsightsCard({ insightsData, volumeData }: InsightsCardProps) {

    return(
        <Card className="bg-zinc-900/40 border-white/5 p-6 relative overflow-hidden group transition-all hover:border-primary/20">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-[80px]" />

            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-neon-glow">
                    {/* Mapeo dinámico de iconos de Lucide */}
                    {insightsData.icon === "Zap" && <Zap size={24} fill="currentColor" />}
                    {insightsData.icon === "Trophy" && <Trophy size={24} />}
                    {insightsData.icon === "ShieldAlert" && <ShieldAlert size={24} />}
                    {/* Agrega más iconos según sea necesario */}
                    {!["Zap", "Trophy", "ShieldAlert"].includes(insightsData.icon) && (
                        <Zap size={24} fill="currentColor" /> // Icono por defecto
                    )}
                </div>

                <div className="flex flex-col gap-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                    {insightsData.title}
                </h3>
                <p className="text-base text-zinc-100 font-medium leading-relaxed max-w-[90%]">
                    {insightsData.text}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                        Análisis basado en tus últimas {volumeData.length} sesiones
                    </span>
                </div>
                </div>
            </div>
            </Card>
    )
}