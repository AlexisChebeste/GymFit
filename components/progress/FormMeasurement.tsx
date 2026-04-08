import { BodyMeasurement } from "@/types/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

function createDefaultForm(): BodyMeasurement {
  return {
    id: crypto.randomUUID(),
    weight: 0,
    waist: 0,
    chest: 0,
    arm: 0,
    bodyFat: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    leg: 0,
    userId: "user123",
    date: new Date().toISOString(),
  };
}


export default function FormModalMeasurement({ mode, onSubmit, onClose, initialData }: { mode: "create" | "edit"; onSubmit: (m: BodyMeasurement) => void; onClose: () => void; initialData?: BodyMeasurement | null }) {
    const isEditing = mode === "edit";

    const [form, setForm] = useState<BodyMeasurement>(() => {
        return initialData || createDefaultForm();
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate(form: BodyMeasurement) {
        const errors: Record<string, string> = {};

        if (form.weight < 30 || form.weight > 300)
            errors.weight = "Peso poco realista";

        if (form.bodyFat < 3 || form.bodyFat > 60)
            errors.bodyFat = "Grasa corporal fuera de rango";

        if (form.waist < 40 || form.waist > 200)
            errors.waist = "Cintura inválida";

        if (form.chest < 50 || form.chest > 200)
            errors.chest = "Pecho inválido";

        if (form.arm < 15 || form.arm > 100)
            errors.arm = "Brazo inválido";

        if (form.leg < 30 || form.leg > 150)
            errors.leg = "Pierna inválida";

        return errors;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validate(form);
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        onSubmit({
            ...form,
            updatedAt: new Date().toISOString(),
            createdAt: initialData?.createdAt || new Date().toISOString()
        });

        onClose();
    };
  
    return (
        <div className="flex flex-col gap-6 p-2">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-2xl font-bold ">
                    {isEditing ? "Editar medición" : "Agregar nueva medición"}
                </h2>

                <button className="text-muted-foreground hover:text-foreground cursor-pointer hover:bg-gray-500 rounded-full p-1" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>
            <p className="text-sm text-muted-foreground">
                Registra tu peso y medidas para hacer seguimiento de tu progreso.
            </p>

            <form 
                className="flex flex-col gap-4" 
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium">Peso (kg)</label>
                        <input type="number" step="0.1" min="0" required value={form.weight} onChange={(e) => setForm({...form, weight: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-md" placeholder="Ej: 72.5"/>
                        {errors.weight && (
                            <p className="text-red-500 text-xs">{errors.weight}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Cintura (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.waist} onChange={(e) => setForm({...form, waist: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-md" 
                        placeholder="Ej: 85.0"
                        />
                        {errors.waist && (
                            <p className="text-red-500 text-xs">{errors.waist}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Pecho (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.chest} onChange={(e) => setForm({...form, chest: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-md" placeholder="Ej: 95.0"/>
                        {errors.chest && (
                            <p className="text-red-500 text-xs">{errors.chest}</p>
                        )}

                    </div>
                    <div>
                        <label className="text-sm font-medium">Brazo (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.arm} onChange={(e) => setForm({...form, arm: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-md" placeholder="Ej: 35.0"/>
                        {errors.arm && (
                            <p className="text-red-500 text-xs">{errors.arm}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Pierna (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.leg} onChange={(e) => setForm({...form, leg: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-md" placeholder="Ej: 90.0"/>
                        {errors.leg && (
                            <p className="text-red-500 text-xs">{errors.leg}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Grasa corporal (%)</label>
                        <input type="number" step="0.1" min="0" max="100" required value={form.bodyFat} onChange={(e) => setForm({...form, bodyFat: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-md" placeholder="Ej: 25.0"/>
                        {errors.bodyFat && (
                            <p className="text-red-500 text-xs">{errors.bodyFat}</p>
                        )}
                    </div>
                </div>

                {/* Aquí irían los inputs para cada campo */}
                <button className="bg-primary hover:bg-primary/90 cursor-pointer  py-3 rounded-lg font-semibold  text-gray-100" type="submit">
                    {isEditing ? "Actualizar medición" : "Guardar medición"}
                </button>
            </form>


         </div>
    );
}