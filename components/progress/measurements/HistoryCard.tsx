import { Card } from "@/components/cards/Card";
import { WeightHistory } from "../WeightHistory";


export default function HistoryCard({ weightHistory, onEdit, editing }: {
    weightHistory: any[];
    editing: any;
    onEdit: (measurement: any) => void;
}) {
    return(
        <Card className="px-6">
            <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-3">Historial</p>
            {weightHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                No hay registros anteriores. Comenzá a registrar tu peso para ver el historial.
                </p>
            ) : (
                <WeightHistory 
                    weightHistory={weightHistory} 
                    onEdit={onEdit}
                    editing={editing}
                />
            )}
        </Card>
    )
}