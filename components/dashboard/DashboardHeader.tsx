

export default function DashboardHeader({ name, completionRate, missedWorkouts }: { name: string; completionRate: number; missedWorkouts: number }) {

    return (
        <div className="flex flex-col">

            <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Bienvenido de nuevo</p>
            <h1 className="text-4xl font-bold">Hola, {name}!</h1>
            {completionRate !== undefined && (
            <span className="text-sm text-muted-foreground">
                Tasa de cumplimiento esta semana:{" "}
                <span className="font-medium text-green-500">{(completionRate).toFixed(1)}%</span>
            </span>
            )}
            {missedWorkouts > 0 && (
            <span className="text-sm text-red-500">
                Has perdido {missedWorkouts} entrenamiento(s) esta semana.
            </span>
            )}

            
        </div>
    )
}