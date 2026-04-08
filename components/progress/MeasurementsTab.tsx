import { Card } from "../cards/Card";
import { TrendingUp } from "lucide-react";
import WeightChart from "./WeightCharts";
import RangeFilter from "../RangeFilter";
import { useState } from "react";
import { useMeasurements } from "@/hooks/useMeasurements";
import MetricCard from "../cards/MetriCard";
import { BodyMeasurement, UserProfile } from "@/types/types";
import { WeightHistory } from "./WeightHistory";
import FormModalMeasurement from "./FormMeasurement";
import Modal from "../Modal";
import { useProfile } from "@/hooks/useProfile";


export default function MeasurementsTab() {
  const { profile } = useProfile();

  const [range, setRange] = useState<"7D" | "30D" | "90D" >("7D");

  const [open, setOpen] = useState<boolean>(false);

  const [editing, setEditing] = useState<BodyMeasurement | null>(null);


  const { 
    latest, 
    change, 
    weightProgress,
    history: weightHistory,
    addMeasurement,
    metrics,
    updateMeasurement,
    getPrefill
  } = useMeasurements(range);

  const isValidRange = (value: string): value is "7D" | "30D" | "90D" =>
      value === "7D" || value === "30D" || value === "90D" ;


  const mainMetrics = metrics.slice(0, 4);
  const extraMetrics = metrics.slice(4);

  const prefill = getPrefill();

  return (
    <div className="flex flex-col gap-4 flex-1 w-full pt-6">
      <div className="w-full flex items-center justify-end">

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
              {latest?.weight?.toFixed(1)}
              <span className="text-lg font-normal text-muted-foreground uppercase italic ml-2">kg</span> 

            </h2>

            <div className="flex text-sm gap-2 items-center">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-green-500 font-medium">{change?.toFixed(1)} kg {
                  range === "7D" ? "los ultimos 7 dias" : range === "30D" ? "el último mes" : "los últimos 90 días"
                }</span>
            </div>
            
          
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Objetivo</span>
              <span>{latest?.weight?.toFixed(1)} / {profile?.weightGoal?.toFixed(1)}</span>
            </div>

            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${weightProgress + 100}%` }}
              />
            </div>

            <p className="text-xs text-secondary font-semibold">
              {100 + (Number(weightProgress?.toFixed(1)) || 0)} % hacia tu objetivo
            </p>
          </div>
        </Card>
      )}

      {/* Gráfico */}
      <Card className="flex flex-col gap-8 px-6">
        <div className="flex items-center justify-between">
          
          <p className="text-xs uppercase tracking-widest text-secondary font-bold">Evolución</p>
          
        </div>
        {weightHistory.length > 0 && (
          <WeightChart data={weightHistory.map((m) => ({ date: m.date, weight: m.weight }))} goalWeight={profile?.weightGoal} />
        )}
      </Card>

      {/* 3. Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mainMetrics.map((metric) => (
          <MetricCard
            key={metric.key}
            label={metric.label}
            value={metric.value.toFixed(1)}
            unit={metric.unit}
            change={metric.change.toFixed(1)}
            trend={metric.trend}
            range={range}
          />
        ))}


      </div>

{/*       {extraMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
          {extraMetrics.map(m => (
            <MetricCard key={m.key}
              label={m.label}
              value={m.value.toFixed(1)}
              unit={m.unit}
              change={m.change.toFixed(1)}
              trend={m.trend}
              range={range}
            />
          ))}
        </div>
        )} */}

      {/* 4. Historial */}
      <Card className="px-6">
        <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-3">Historial</p>
        {weightHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay registros anteriores. Comenzá a registrar tu peso para ver el historial.
          </p>
        ) : (
          <WeightHistory 
            weightHistory={weightHistory} 
            onEdit={(m) => {
              setEditing(m);
              setOpen(true);
            }}
            editing={editing}
          />
        )}
      </Card>

      {/* 5. Botón */}
      <button className="bg-primary hover:bg-primary/90 cursor-pointer  py-3 rounded-lg font-semibold  text-gray-100" 
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
      >
        + Registrar medidas
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)} className="max-w-2xl!">
          <FormModalMeasurement
            mode={editing ? "edit" : "create"}
            onSubmit={editing ? updateMeasurement : addMeasurement}
            onClose={() => setOpen(false)}
            initialData={editing ?? prefill}
          />
        </Modal>
      )}
    </div>
  );
}

