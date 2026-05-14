import { Plus } from "lucide-react";
import Modal from "../Modal";
import FormModalMeasurement from "./FormMeasurement";
import Button from "../ui/Button";
import { BodyMeasurement, UserProfile } from "@/types/types";

interface EmptyStateWelcomeProps {
    setOpen: (open: boolean) => void;
    setEditing: (measurement: BodyMeasurement | null) => void;
    profile: UserProfile | null;
    prefill: BodyMeasurement;
    open: boolean;
    editing: BodyMeasurement | null;
}

export default function EmptyStateWelcome({ setOpen, setEditing, profile, prefill, open, editing }: EmptyStateWelcomeProps) {
    return (
        <div className="flex flex-col gap-6 flex-1 w-full py-8 bg-natural items-center justify-center text-center">
            <div className="max-w-md flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                <div className="p-6 bg-primary/10 rounded-full text-primary shadow-neon-glow">
                <Plus size={48} strokeWidth={1.5} />
                </div>
                
                <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-100 italic">EMPEZÁ TU TRANSFORMACIÓN</h2>
                <p className="text-zinc-500 text-sm leading-relaxed">
                    Todavía no registraste ninguna medida. Registrá tu peso y medidas corporales hoy para empezar a ver gráficos de evolución y estadísticas de progreso.
                </p>
                </div>

                <Button
                onClick={() => {
                    setEditing(null);
                    setOpen(true);
                }}
                className="text-lg font-semibold w-full text-center py-4 rounded-md flex items-center justify-center transition-colors bg-green-600 hover:bg-green-800 text-black border-none
                "
                >
                Registrar medidas
                </Button>
            </div>

            {open && (
                
                <Modal className="max-w-2xl! overflow-y-auto max-h-[88vh] sm:max-h-full  rounded-none! sm:rounded-xl! bg-natural!" >
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