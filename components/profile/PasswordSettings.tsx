import { useState } from "react";
import { Card } from "../cards/Card";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

function getPasswordStrength(password: string) {
    const checks = {
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
        length: password.length >= 8
    };

    const score = Object.values(checks).filter(Boolean).length;

    return { checks, score };
}


export default function PasswordSettings() {

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const { checks, score } = getPasswordStrength(form.newPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.newPassword !== form.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try{
            const {data: userData} = await supabase.auth.getUser();
            const email = userData?.user?.email;
            if (!email) {
                setError("Usuario no autenticado");
                return;
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password: form.currentPassword
            });

            if (signInError) {
                setError("Contraseña actual incorrecta");
                return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: form.newPassword
            });

            if (updateError) {
                setError("Error al actualizar la contraseña");
                return;
            }

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            toast.success("Contraseña actualizada correctamente");
        } catch (err) {
            console.error(err);
            setError("Error al actualizar la contraseña");
        }
    };

    const strengthLabel =
        score <= 1 ? "Débil" :
        score === 2 ? "Media" :
        score === 3 ? "Buena" :
        "Fuerte";

    return (
        <>
            <p className="text-sm uppercase tracking-widest text-secondary font-bold">Configuración de seguridad</p>
            <Card className="flex flex-col gap-6 w-full p-8">

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                        Contraseña actual
                        </label>

                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={form.currentPassword}
                                onChange={(e) =>
                                setForm({ ...form, currentPassword: e.target.value })
                                }
                                className="w-full p-3 pr-10 rounded-lg border bg-zinc-200 dark:bg-zinc-800"
                            />

                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-4 text-muted-foreground cursor-pointer"
                            >
                                {showCurrent ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                        Nueva contraseña
                        </label>

                        <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={form.newPassword}
                            onChange={(e) =>
                            setForm({ ...form, newPassword: e.target.value })
                            }
                            className="w-full p-3 pr-10 rounded-lg border bg-zinc-200 dark:bg-zinc-800"
                            placeholder="Mínimo 8 caracteres"
                        />

                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-4 text-muted-foreground cursor-pointer"
                        >
                            {showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">

                        <div className="flex justify-between text-xs font-semibold uppercase tracking-widest">
                        <span className="text-muted-foreground">Seguridad</span>
                        <span className="text-green-500">{strengthLabel}</span>
                        </div>

                        <div className="flex gap-2">
                        {[1,2,3,4].map((i) => (
                            <div
                            key={i}
                            className={`h-2 flex-1 rounded-full ${
                                score >= i
                                ? "bg-primary"
                                : "bg-zinc-300 dark:bg-zinc-700"
                            }`}
                            />
                        ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">

                        <Requirement ok={checks.uppercase} label="Mayúscula" />
                        <Requirement ok={checks.number} label="Número" />
                        <Requirement ok={checks.symbol} label="Símbolo" />
                        <Requirement ok={checks.length} label="12+ caracteres" />

                        </div>

                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-xs uppercase tracking-widest text-secondary font-bold">
                        Confirmar contraseña
                        </label>

                        <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={(e) =>
                            setForm({ ...form, confirmPassword: e.target.value })
                            }
                            className="w-full p-3 pr-10 rounded-lg border bg-zinc-200 dark:bg-zinc-800 "
                        />

                        {error && <span className="text-red-500 text-xs absolute -bottom-6 left-2">{error}</span>}

                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-4 text-muted-foreground cursor-pointer"
                        >
                            {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-2">
                        <button
                        type="button"
                        className="text-muted-foreground hover:text-white cursor-pointer border px-4 rounded-lg transition border-zinc-500 hover:bg-zinc-600"
                        >
                        Cancelar
                        </button>

                        <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold text-black cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed transition"
                        disabled={score < 4}
                        >
                        Actualizar contraseña
                        </button>
                    </div>


                </form>
            </Card>

        </>
    );
}

function Requirement({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 ${ok ? "text-green-500" : "text-muted-foreground"}`}>
      <CheckCircle size={14} />
      {label}
    </div>
  );
}