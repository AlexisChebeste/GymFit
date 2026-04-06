

export default function MeasurementsTab() {
  return (
    <div className="flex flex-col gap-4 flex-1 w-full pt-6">
         {/* Card peso actual */}
      <div className="bg-zinc-900 p-4 rounded-xl">
        <p className="text-xs text-muted-foreground">Peso actual</p>
        <h2 className="text-3xl font-bold">68.3 kg</h2>
        <p className="text-green-500 text-sm">+0.5 kg esta semana</p>
      </div>

      {/* Gráfico */}
      <div className="bg-zinc-900 p-4 rounded-xl">
        {/* acá reutilizás tu VolumeChart pero para weight */}
        <p className="text-sm mb-2">Evolución</p>
        {/* <WeightChart data={...} /> */}
      </div>

      {/* Historial */}
      <div className="bg-zinc-900 p-4 rounded-xl flex flex-col gap-2">
        <p className="text-sm font-semibold">Historial</p>
        {/* map de mediciones */}
      </div>
    </div>
  );
}