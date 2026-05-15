import { ShieldAlert, Trophy, Zap, Info } from "lucide-react";

interface InsightsCardProps {
    insightsData: {
        title: string;
        text: string;
        icon: string;
    };
    volumeData: any[];
}

export default function InsightsCard({ insightsData, volumeData }: InsightsCardProps) {
    const IconComponent: React.ReactNode = {
        Zap: <Zap size={20} fill="currentColor" />,
        Trophy: <Trophy size={20} />,
        ShieldAlert: <ShieldAlert size={20} />,
        Info: <Info size={20} />
    }[insightsData.icon as keyof typeof IconComponent] || <Zap size={20} fill="currentColor" />;

    return (
        <div className="w-full relative mt-2 p-5 rounded-2xl bg-linear-to-br from-zinc-900 to-black border border-zinc-800 overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500" />

            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center relative z-10">
                <div className="shrink-0 p-3 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                    {IconComponent}
                </div>

                <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/80">
                            Estado del motor
                        </span>
                        <div className="h-0.5 w-8 bg-primary/20" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-zinc-100 tracking-tight">
                        {insightsData.title}
                    </h3>
                    
                    <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
                        {insightsData.text}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-1 self-end sm:self-center border-l border-white/10 pl-5">
                    <span className="text-[20px] font-black text-white">
                        {volumeData.length}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-right leading-none">
                        Sesiones<br/>Analizadas
                    </span>
                </div>
            </div>
        </div>
    );
}