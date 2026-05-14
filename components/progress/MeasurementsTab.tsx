import { Card } from "../cards/Card";
import { CalendarSearch, Plus } from "lucide-react";
import WeightChart from "./WeightCharts";
import RangeFilter from "../RangeFilter";
import { useState } from "react";
import MetricCard from "../cards/MetriCard";
import { BodyMeasurement, UserProfile } from "@/types/types";
import FormModalMeasurement from "./FormMeasurement";
import Modal from "../Modal";
import WeightCard from "../dashboard/WeightCard";
import HistoryCard from "./measurements/HistoryCard";
import Button from "../ui/Button";
import { useMeasurementStats } from "@/hooks/progress/useMeasurementsStats";
import { useMeasurementsQuery } from "@/queries/measurements/getMeasurementsQuery";
import { useProfileQuery } from "@/queries/profile/getProfileQuery";
import { useUser } from "@/contexts/AuthContext";
import EmptyStateWelcome from "./EmptyStateWelcome";

export default function MeasurementsTab() {
  const { user, loading } = useUser();
  const {data: profile = null} = useProfileQuery(user?.id ?? "")
  const [range, setRange] = useState<"7D" | "30D" | "90D" >("7D");
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<BodyMeasurement | null>(null);

  const userId = profile?.id;

  const {data: measurements = [], isLoading, error} = useMeasurementsQuery(userId ?? "")

  const { history: weightHistory, latest, progress, metrics, prefill } = useMeasurementStats(measurements, profile ?? ({} as UserProfile), range);

  const isValidRange = (value: string): value is "7D" | "30D" | "90D" =>
      value === "7D" || value === "30D" || value === "90D" ;

  const isBrandNew = measurements.length === 0;

  const isRangeEmpty = !isBrandNew && weightHistory.length === 0;

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

  if (error) {
    return (
      <div className="flex-1 flex justify-center items-center h-full mx-auto gap-6 text-center">
        <h1 className="text-2xl font-bold text-primary">Ocurrió un error al cargar tus medidas. Por favor, intentá nuevamente más tarde.</h1>
      </div>
    );
  }

  if (isBrandNew) {
    return <EmptyStateWelcome setOpen={setOpen} setEditing={setEditing} profile={profile} prefill={prefill} open={open} editing={editing} />;
  }

  return (
    <div className="flex flex-col gap-4 flex-1 w-full py-4 bg-natural">
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

      {isRangeEmpty ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed">
          <div className="text-zinc-500 bg-zinc-800/50 p-4 rounded-full">
            <CalendarSearch size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-zinc-200">No hay registros en los últimos {range}</h3>
            <p className="text-sm text-zinc-500">
              Probá cambiando el rango o cargá una nueva medición hoy.
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="...">
            Registrar hoy
          </Button>
        </Card>
      ) : (
        <>
          <WeightCard latest={latest} change={metrics[0]?.change} weightProgress={progress ?? 0} user={profile} />

          <Card className="flex flex-col gap-8 px-6">
            <div className="flex items-center justify-between">
              
              <p className="text-xs uppercase tracking-widest text-secondary font-bold">Evolución</p>
              
            </div>
            {weightHistory.length > 0 ? (
              <WeightChart data={weightHistory.map((m) => ({ date: m.date, weight: m.weight }))} goalWeight={profile?.weight_goal ?? 0} />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center">
                  Aún no has registrado medidas. ¡Comienza hoy para ver tu evolución!
                </p>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.length > 0 ? metrics.map((metric, index) => {
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
            }): (
              <Card className="px-6 py-4 flex flex-col gap-2 justify-center items-center w-full md:col-span-2">
                <p className="text-sm text-muted-foreground text-center">
                  Aún no has registrado métricas. ¡Comienza hoy para ver tu evolución!
                </p>
              </Card>
            )}
          </div>

          <HistoryCard weightHistory={weightHistory} 
            onEdit={(m) => {
              setEditing(m);
              setOpen(true);
            }} 
            editing={editing}
          />

          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="text-sm font-medium w-full text-center py-4 rounded-md flex items-center justify-center transition-colors bg-green-600 hover:bg-green-800 text-black border-none
            "
          >
            <Plus className="w-5 h-5" />
            Registrar medidas
          </Button>
        </>
      )}


      {open && (
        <Modal className="max-w-2xl! overflow-y-auto max-h-[88vh] sm:max-h-full -mt-6 rounded-none! sm:rounded-xl! bg-natural!" >
          <FormModalMeasurement
            userId={profile?.id ?? ""}
            mode={editing ? "edit" : "create"}
            onClose={() => setOpen(false)}
            initialData={editing ?? prefill}
          />
        </Modal>
      )}
    </div>
  );
}

