

export default function DashboardHeader({ name, completionRate, hasRoutine }: { name: string; completionRate: number; hasRoutine: boolean }) {

    const completionColor = completionRate >= 60 ? "text-green-500" : completionRate >= 30 ? "text-amber-500" : "text-orange-500";

    return (
        <div className="flex flex-col gap-1">

            <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Bienvenido de nuevo</p>
            <h1 className="text-4xl font-bold">Hola, {name}!</h1>
            {completionRate !== undefined && (
            <span className="text-sm text-muted-foreground">
                Tasa de cumplimiento esta semana:{" "}
                <span className={`font-medium ${completionColor}`}>{(completionRate).toFixed(1)}%</span>
            </span>
            )}
            <p className="text-zinc-500 text-sm mt-1 italic">
                {hasRoutine ? completionRate === 100 ? "¡Muy bien! Has alcanzado tu meta de cumplimiento." : "¡Vamos! Te quedan sesiones pendientes para cerrar la semana." : "¡Crea tu primera rutina para comenzar!"}
            </p>

            
        </div>
    )
}