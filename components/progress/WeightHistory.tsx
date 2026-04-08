import { BodyMeasurement } from "@/types/types";
import { Pencil } from "lucide-react";


export function WeightHistory({ weightHistory, onEdit, editing }: { weightHistory: BodyMeasurement[]; onEdit: (measurement: BodyMeasurement) => void; editing: BodyMeasurement | null }) {
  return (
    <div className="flex flex-col divide-y divide-zinc-800">
      {weightHistory.map((entry, idx) => (
        <div key={idx} className="flex items-center justify-between py-3" >
          <span className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
          <div className="flex gap-4 items-center">
            
            <span className="text-sm font-medium">{entry.weight.toFixed(1)} kg</span>
            <button className={` cursor-pointer text-xs text-blue-500 font-medium hover:bg-blue-500/50 p-1 rounded-full ${editing?.id === entry.id ? "bg-primary/10" : ""}`} onClick={() => onEdit(entry)}>
              <Pencil className="w-4 h-4" />  
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}