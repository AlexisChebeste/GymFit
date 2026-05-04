import { Card } from "../cards/Card";
import { TrendingUp } from "lucide-react";
import WeightChart from "./WeightCharts";
import RangeFilter from "../RangeFilter";
import { useMemo, useState } from "react";
import { useMeasurements } from "@/hooks/useMeasurements";
import MetricCard from "../cards/MetriCard";
import { BodyMeasurement, UserProfile } from "@/types/types";
import { WeightHistory } from "./WeightHistory";
import FormModalMeasurement from "./FormMeasurement";
import Modal from "../Modal";
import { useUser } from "@/hooks/useUser";
import WeightCard from "../dashboard/WeightCard";
import HistoryCard from "./measurements/HistoryCard";


export default function MeasurementsTab() {
  const { profile, loading } = useUser();
  const [range, setRange] = useState<"7D" | "30D" | "90D" >("7D");
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<BodyMeasurement | null>(null);

  const userId = profile?.id;

  const { 
    latest, 
    change, 
    history: weightHistory,
    addMeasurement,
    metrics,
    updateMeasurement,
    getPrefill,
    progress,
    isLoading
  } = useMeasurements( userId ?? "",
    profile ?? ({} as UserProfile), range);

  const isValidRange = (value: string): value is "7D" | "30D" | "90D" =>
      value === "7D" || value === "30D" || value === "90D" ;

  const prefill = useMemo(() => getPrefill(), [weightHistory]);

  if (isLoading || loading) {
    return (
      <div className="flex flex-col gap-4 w-full pt-6 animate-pulse">
        <div className="h-32 bg-zinc-800 rounded-xl" />
        <div className="h-64 bg-zinc-800 rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-zinc-800 rounded-xl" />
          <div className="h-24 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
        <div className="flex-1 flex justify-center items-center h-full mx-auto gap-6 text-center">
      <h1 className="text-2xl font-bold text-primary">Iniciá sesión para registrar tus medidas y ver tu progreso</h1>
      
    </div>
    );
  }

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
        <WeightCard latest={latest} change={change} weightProgress={progress ?? 0} user={profile} />
      )}

      {/* Gráfico */}
      <Card className="flex flex-col gap-8 px-6">
        <div className="flex items-center justify-between">
          
          <p className="text-xs uppercase tracking-widest text-secondary font-bold">Evolución</p>
          
        </div>
        {weightHistory.length > 0 && (
          <WeightChart data={weightHistory.map((m) => ({ date: m.date, weight: m.weight }))} goalWeight={profile?.weight_goal ?? 0} />
        )}
      </Card>

      {/* 3. Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {metrics.map((metric, index) => {
          const isLastAndOdd = index === metrics.length - 1 && metrics.length % 2 !== 0;

          return (
            <div 
              key={metric.key} 
              className={isLastAndOdd ? "md:col-span-2" : ""}
            >
              <MetricCard
                metric={{
                  ...metric,
                  value: Number(metric.value)
                }}
                range={range}
              />
            </div>
          );
        })}
      </div>

      {/* 4. Historial */}
      <HistoryCard weightHistory={weightHistory} 
        onEdit={(m) => {
          setEditing(m);
          setOpen(true);
        }} 
        editing={editing}
      />

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
        <Modal className="max-w-2xl!">
          <FormModalMeasurement
            userId={profile?.id ?? ""}
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

