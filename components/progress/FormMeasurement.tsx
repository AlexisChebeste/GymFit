import { BodyMeasurement } from "@/types/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type FormState = Omit<BodyMeasurement, "weight" | "waist" | "chest" | "body_fat" | "left_arm" | "right_arm" | "left_leg" | "right_leg"> & {
  weight: string;
  waist: string;
  chest: string;
  body_fat: string;
  left_arm: string;
  right_arm: string;
  left_leg: string;
  right_leg: string;
};

export default function FormModalMeasurement({userId, mode, onSubmit, onClose, initialData }: { userId: string; mode: "create" | "edit"; onSubmit: (m: BodyMeasurement) => void; onClose: () => void; initialData?: BodyMeasurement | null }) {
    const isEditing = mode === "edit";

    function createDefaultForm(): FormState {
        return {
            id: crypto.randomUUID(),
            weight: "",
            waist: "",
            chest: "",
            left_arm: "",
            right_arm: "",
            body_fat: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            left_leg: "",
            right_leg: "",
            user_id: userId,
            date: new Date().toISOString(),
        };
    }

    function mapToForm(data: BodyMeasurement): FormState {
        return {
            ...data,
            weight: data.weight.toString(),
            waist: data.waist.toString(),
            chest: data.chest.toString(),
            body_fat: data.body_fat.toString(),
            left_arm: data.left_arm.toString(),
            right_arm: data.right_arm.toString(),
            left_leg: data.left_leg.toString(),
            right_leg: data.right_leg.toString(),
        };
    }

    const [form, setForm] = useState<FormState>(() => {
        if (initialData && isEditing) return mapToForm(initialData);
        return createDefaultForm();
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate(form: BodyMeasurement) {
        const errors: Record<string, string> = {};

        if (form.weight < 30 || form.weight > 300)
            errors.weight = "Peso poco realista";

        if (form.body_fat < 3 || form.body_fat > 60)
            errors.body_fat = "Grasa corporal fuera de rango";

        if (form.waist < 40 || form.waist > 200)
            errors.waist = "Cintura inválida";

        if (form.chest < 50 || form.chest > 200)
            errors.chest = "Pecho inválido";

        if (form.left_arm < 15 || form.left_arm > 100)
            errors.left_arm = "Brazo izquierdo inválido";

        if (form.right_arm < 15 || form.right_arm > 100)
            errors.right_arm = "Brazo derecho inválido";

        if (form.left_leg < 30 || form.left_leg > 150)
            errors.left_leg = "Pierna izquierda inválida";

        if (form.right_leg < 30 || form.right_leg > 150)
            errors.right_leg = "Pierna derecha inválida";

        return errors;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsed: BodyMeasurement = {
            ...form,
            weight: parseFloat(form.weight),
            waist: parseFloat(form.waist),
            chest: parseFloat(form.chest),
            body_fat: parseFloat(form.body_fat),
            left_arm: parseFloat(form.left_arm),
            right_arm: parseFloat(form.right_arm),
            left_leg: parseFloat(form.left_leg),
            right_leg: parseFloat(form.right_leg),
            updated_at: new Date().toISOString(),
            created_at: initialData?.created_at || new Date().toISOString()
        };

        const validation = validate(parsed);
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        onSubmit(parsed);
        onClose();
    };

    useEffect(() => {
        if (initialData && isEditing) {
            setForm(mapToForm(initialData));
        }
    }, [initialData, isEditing]);

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
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Peso (kg)</label>
                        <input type="number" step="0.1" min="0" required value={form.weight} onChange={(e) => setForm({...form, weight: e.target.value})} className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 72.5"/>
                        {errors.weight && (
                            <p className="text-red-500 text-xs">{errors.weight}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Cintura (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.waist} onChange={(e) => setForm({...form, waist: e.target.value})} className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" 
                        placeholder="Ej: 85.0"
                        />
                        {errors.waist && (
                            <p className="text-red-500 text-xs">{errors.waist}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Pecho (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.chest} onChange={(e) => setForm({...form, chest: e.target.value})} className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 95.0"/>
                        {errors.chest && (
                            <p className="text-red-500 text-xs">{errors.chest}</p>
                        )}

                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Grasa corporal (%)</label>
                        <input type="number" step="0.1" min="0" max="100" required value={form.body_fat} onChange={(e) => setForm({...form, body_fat: e.target.value})} className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 25.0"/>
                        {errors.body_fat && (
                            <p className="text-red-500 text-xs">{errors.body_fat}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Brazo izquierdo (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.left_arm} onChange={(e) => setForm({...form, left_arm: e.target.value})} className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 35.0"/>
                        {errors.left_arm && (
                            <p className="text-red-500 text-xs">{errors.left_arm}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Brazo derecho (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.right_arm} onChange={(e) => setForm({...form, right_arm: e.target.value})} className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 35.0"/>
                        {errors.right_arm && (
                            <p className="text-red-500 text-xs">{errors.right_arm}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Pierna izquierda (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.left_leg} onChange={(e) => setForm({...form, left_leg: e.target.value})} className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 55.0"/>
                        {errors.left_leg && (
                            <p className="text-red-500 text-xs">{errors.left_leg}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-secondary">Pierna derecha (cm)</label>
                        <input type="number" step="0.1" min="0" required value={form.right_leg} onChange={(e) => setForm({...form, right_leg: e.target.value})} className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 55.0"/>
                        {errors.right_leg && (
                            <p className="text-red-500 text-xs">{errors.right_leg}</p>
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