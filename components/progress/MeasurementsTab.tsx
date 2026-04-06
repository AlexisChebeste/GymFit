import { useWeightStats, weightGoal } from "@/hooks/useWeightStats";
import { Card } from "../cards/Card";
import { TrendingUp } from "lucide-react";
import WeightChart from "./WeightCharts";
import RangeFilter from "../RangeFilter";
import { useState } from "react";
import { mesaurementsMock, useMeasurements } from "@/hooks/useMeasurements";

export default function MeasurementsTab() {
  const [range, setRange] = useState<"7D" | "30D" | "90D" >("7D");

  const isValidRange = (value: string): value is "7D" | "30D" | "90D" =>
      value === "7D" || value === "30D" || value === "90D" ;
    
  const { 
    latest, 
    change, 
    weightProgress,
    history: weightHistory
  } = useMeasurements(mesaurementsMock, range);

  return (
    <div className="flex flex-col gap-4 flex-1 w-full pt-6">

      {!weightHistory.length ? (
        <Card className="px-6 py-4 flex flex-col gap-2 justify-center items-center w-full">
          <p className="text-sm text-muted-foreground text-center">
            Empezá a registrar tu peso corporal para ver tus estadísticas y progreso a lo largo del tiempo.
          </p>
        </Card>
      ) : (
        <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
          <div className="flex flex-col gap-2">
            
            <p className="text-xs uppercase tracking-widest text-secondary font-bold">Peso corporal</p>
            <h2 className="text-4xl font-bold">
              {latest.weight?.toFixed(1)}
              <span className="text-lg font-normal text-muted-foreground uppercase italic ml-2">kg</span> 

            </h2>

            <div className="flex text-sm gap-2 items-center">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-green-500 font-medium">{change?.toFixed(1)} kg desde la última semana</span>
            </div>
            
          
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Objetivo</span>
              <span>{latest.weight?.toFixed(1)} / {72}</span>
            </div>

            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${weightProgress}%` }}
              />
            </div>

            <p className="text-xs text-secondary font-semibold">
              {weightProgress?.toFixed(1)} % hacia tu objetivo
            </p>
          </div>
        </Card>
      )}

      {/* Gráfico */}
      <Card className="flex flex-col gap-8 px-6">
        <div className="flex items-center justify-between">
          
          <p className="text-xs uppercase tracking-widest text-secondary font-bold">Evolución</p>
          <RangeFilter
            value={range}
            ranges={["7D", "30D", "90D"]}
            onChange={(next) => {
              setRange((prev) => {
                const resolved = typeof next === "function" ? next(prev) : next;
                return isValidRange(resolved) ? resolved : prev;
              });
            }}
          />
        </div>
        {weightHistory.length > 0 && (
          <WeightChart data={weightHistory.map((m) => ({ date: m.date, weight: m.weight }))} />
        )}
      </Card>

      {/* 3. Métricas */}
{/*       <div className="grid grid-cols-2 gap-4">
        <MetricCard label="Cintura" value="82 cm" change="-1.2" />
        <MetricCard label="Pecho" value="100 cm" change="+0.8" />
        <MetricCard label="Brazo" value="38 cm" change="+0.5" />
        <MetricCard label="% Grasa" value="15%" change="-0.7" />
      </div> */}

      {/* 4. Historial */}
      <Card className="px-6">
        <p className="text-xs uppercase tracking-widest text-secondary font-bold">Historial</p>
        {/* map */}
      </Card>

      {/* 5. Botón */}
      <button className="bg-primary/80 hover:bg-primary/90 cursor-pointer  py-3 rounded-lg font-semibold">
        + Registrar medidas
      </button>
    </div>
  );
}