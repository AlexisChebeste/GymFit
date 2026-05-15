"use client"

import { Card } from "@/components/cards/Card";
import { WorkoutCard } from "@/components/cards/WorkutCard";
import { CustomSelect } from "@/components/CustomSelect";
import Modal from "@/components/Modal";
import Button from "@/components/ui/Button";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWorkoutsQuery } from "@/queries/workout/getWorkoutsQuery";
import { useCreateWorkoutMutation } from "@/queries/workout/useCreateWorkoutMutation";
import { useDeleteWorkoutMutation } from "@/queries/workout/useDeleteWorkoutMutation";
import { useRoutinesQuery } from "@/queries/routines/getRoutinesQuery";
import { useUpdateRoutineMutation } from "@/queries/routines/useUpdateRoutineMutation";
import { useCreateRoutineMutation } from "@/queries/routines/useCreateRoutineMutation";
import { useUser } from "@/contexts/AuthContext";

export default function WorkoutPage() {
    const {user, loading} = useUser();
    const router = useRouter();
    const {
        data: templates = [],
        isLoading: isLoaded,
    } = useWorkoutsQuery(user?.id ?? "");

    const { data: routine } = useRoutinesQuery(user?.id ?? "");

    const createTemplate = useCreateWorkoutMutation();
    const deleteWorkout = useDeleteWorkoutMutation();
    const updateRoutine = useUpdateRoutineMutation();
    const createRoutine = useCreateRoutineMutation();

    const deleteTemplate = async (id: string) => {
        deleteWorkout.mutateAsync(id);
    }

    const [openModal, setOpenModal] = useState(false);
    const [openModalPlan, setOpenModalPlan] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [plan, setPlan] = useState<Record<number, string | null>>({});

    if (isLoaded || loading) return <div className="flex items-center justify-center h-screen">Cargando rutinas...</div>;

    const handleCreate = async () => {
        const newId =  createTemplate.mutateAsync(user?.id ?? "").then(res => res.id);

        if (!newId) return;

        router.push(`/workouts/edit/${newId}`);
    };

    const handleModalDelete = (id: string) => {
        setSelectedId(id);
        setSelectedName(templates.find(t => t.id === id)?.name || null);
        setOpenModal(true);
    }

    const handlePlan = () => {
        if (routine?.days && routine.days.length > 0) {
            const initialPlan: Record<number, string> = {};

            routine.days.forEach(d => {
                initialPlan[d.day] = d.templateId;
            });

            setPlan(initialPlan);
        }

        setOpenModalPlan(true);
    };

    const days = [
        { label: "Lunes", value: 0 },
        { label: "Martes", value: 1 },
        { label: "Miércoles", value: 2 },
        { label: "Jueves", value: 3 },
        { label: "Viernes", value: 4 },
        { label: "Sábado", value: 5 },
        { label: "Domingo", value: 6 },
    ];

    const handleSaveRoutine = async () => {
        const days = Object.entries(plan)
            .filter(([_, templateId]) => templateId)
            .map(([day, templateId]) => ({
                day: Number(day),
                templateId: templateId as string
            }));
        
        if (routine) {
            await updateRoutine.mutateAsync({
                id: routine.id,
                data: {
                    ...routine,
                    days
                }
            });
        } else {
            await createRoutine.mutateAsync({
                user_id: user?.id ?? "",
                days,
                name: "Mi rutina semanal"
            });
        }

        setOpenModalPlan(false);
    };

    const templatesForPlan = [...templates, { id: "", name: "Descanso" }];


    if(!user) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-natural ">
                <main className="flex flex-1 w-full flex-col gap-2 items-center p-4 bg-white dark:bg-natural max-w-7xl">
                    <h1 className="text-4xl font-bold">Inicia sesión para ver tus rutinas</h1>
                </main>
            </div>
        );
    }

if (templates.length === 0) {
    return (
        <div className="flex flex-col flex-1 bg-natural">
            <main className="flex flex-1 w-full flex-col p-4 max-w-7xl mx-auto">
                <p className="uppercase text-[10px] text-secondary font-black tracking-[0.2em] mb-1">
                    Arma tu rutina
                </p>
                <h1 className="text-4xl font-bold text-white mb-8">Mi Rutina</h1>

                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 gap-6">
                    <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-600 shadow-xl">
                        <Plus size={40} strokeWidth={1} />
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-zinc-400 text-base leading-relaxed">
                            Aún no tienes rutinas creadas.<br/> 
                            Comienza diseñando tu primer entrenamiento.
                        </p>
                    </div>

                    <Button 
                        onClick={handleCreate}
                        className=" max-w-md"
                    >
                        Crear nueva rutina
                    </Button>
                </div>
            </main>
        </div>
    );
}

    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural ">
            <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural max-w-7xl overflow-y-auto max-h-[85vh] md:max-h-[90vh]">
                <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Arma tu rutina</p>
                <h1 className="text-4xl font-bold">Mi Rutina</h1>

                <div className="flex flex-col gap-4 items-center w-full py-4 ">
                    {templates.map((workout) => (
                        <WorkoutCard 
                            key={workout.id} 
                            workout={workout} 
                            deleteTemplate={handleModalDelete} 
                        />
                    ))}
                    <Card className="w-full flex gap-4 items-center justify-center border-dashed border-2 border-stone-300 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={handleCreate}>
                        <Plus className="w-6 h-6 text-stone-600" />
                        <p className="text-lg text-stone-600">
                            Crear nueva rutina
                        </p>
                    </Card>

                    <Button 
                        onClick={handlePlan} 
                        className="text-sm font-medium w-full text-center py-4 rounded-md flex items-center justify-center transition-colors bg-green-600 hover:bg-green-800 text-black border-none"
                    >
                        Organizar semana
                    </Button>
                </div>

                {selectedId && openModal && (
                    <Modal
                        onClose={() => {
                            setOpenModal(false);
                            setSelectedId(null);
                        }}
                        className="max-w-xl"
                    >
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">¿Estas seguro de eliminar la rutina <span className="font-bold text-red-600">{selectedName}</span>?</h2>
                            <p className="text-sm text-secondary">Esta acción no se puede deshacer.</p>
                            <div className="flex gap-4 w-full justify-end">
                                <button 
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                                    onClick={() => {
                                        deleteTemplate(selectedId);
                                        setOpenModal(false);
                                        setSelectedId(null);
                                    }}
                                >
                                    Eliminar
                                </button>
                                <button 
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors cursor-pointer"
                                    onClick={() => {
                                        setOpenModal(false);
                                        setSelectedId(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {openModalPlan && (
                    <Modal
                        onClose={() => {
                            setOpenModalPlan(false);
                        }}
                        className="max-w-xl"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between w-full">                                
                                <h2 className="text-xl font-semibold">Planificar semana</h2>
                                <button
                                    className="p-2 rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
                                    onClick={() => {
                                        setOpenModalPlan(false);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-4 py-6 w-full">
                            {days.map((day, index) => (
                                <div key={index} className="flex items-center gap-4 w-full justify-between">
                                    <p className="min-w-32">{day.label}</p>
                                    <CustomSelect
                                        options={templatesForPlan.map(t => ({ 
                                            id: t.id, 
                                            name: t.name 
                                        }))}
                                        value={plan[index] || ""}
                                        onChange={(value) => {
                                            setPlan(prev => ({
                                                ...prev,
                                                [index]: value || null
                                            }));
                                        }}
                                        defaultValue="Seleccionar rutina"
                                    />

                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 w-full ">
                            <Button
                                onClick={handleSaveRoutine}
                            >
                                Guardar rutina
                            </Button>
                        </div>

                    </Modal>
                )}
            </main>
        </div>
    );
}