import { PhotoType, useProgressPhotos } from "@/hooks/useProgressPhotos";
import { useUser } from "@/hooks/useUser";
import { Plus } from "lucide-react";
import { useState } from "react";
import ComparisonSlider from "./ComparisionSlider";
import ProgressPhotoModal from "./UploadProgressModal";

const viewMap = {
  Frente: "front",
  Espalda: "back",
  Lado: "side",
} as const;

type ViewType = keyof typeof viewMap;

export type FormPhotos = {
  weight: number;
  note: string;
  muscle_mass: number;
  body_fat: number;
};

export default function PhotosTab() {

    const { user } = useUser();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [formPhotos, setFormPhotos] = useState<FormPhotos>({
        weight: 0,
        note: "",
        muscle_mass: 0,
        body_fat: 0,
    })

    const {
        entries,
        createEntry,
        uploadPhoto,
        loading
    } = useProgressPhotos(user?.id ?? "");

    const [selectedView, setSelectedView] = useState<ViewType>("Frente");

    const key = viewMap[selectedView];

    const handleSaveProgress = async (
    files: Record<PhotoType, File | null>
    ) => {
        if (!user) return;

        const entry = await createEntry({
            weight: formPhotos.weight,
            note: formPhotos.note,
            muscle_mass: formPhotos.muscle_mass,
            body_fat: formPhotos.body_fat,
        });

        if (!entry) return;

        for (const type of ["front", "side", "back"] as PhotoType[]) {
            const file = files[type];
            if (file) {
            await uploadPhoto(file, entry.id, type);
            }
        }
    };
    if (!user) return null;

    if (loading) {
        return (
            <div className="flex-1 w-full animate-pulse rounded-xl bg-zinc-800 h-96" />
        );
    }

    const last = entries.at(-1);
    const prev = entries.at(-2);

    return (
        <div className="flex flex-col gap-4 flex-1 w-full pt-6">
    
            {last && prev && last.photos[key] && prev.photos[key] && (
                <div className="w-full flex flex-col items-center">
            
                    <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-3">
                        Comparación
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

                    {/* IZQUIERDA */}
                    <div className="hidden lg:flex flex-col justify-center text-sm text-gray-400">
                        <p>Peso anterior</p>
                        <p className="text-xl text-white font-semibold">
                        {prev?.weight ?? "--"} kg
                        </p>
                    </div>

                    {/* CENTRO (SLIDER) */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-md h-[800px]">
                        <ComparisonSlider
                            before={prev.photos[key]!}
                            after={last.photos[key]!}
                        />
                        </div>
                    </div>

                    {/* DERECHA */}
                    <div className="hidden lg:flex flex-col justify-center text-sm text-gray-400 text-right">
                        <p>Peso actual</p>
                        <p className="text-xl text-white font-semibold">
                        {last?.weight ?? "--"} kg
                        </p>
                    </div>

                    </div>

                    <p className="text-sm text-secondary mt-2 text-center">
                        {selectedView} — {prev.date} vs {last.date}
                    </p>

                </div>
            )}

            <div className="flex gap-2 items-center">
                {Object.keys(viewMap).map((label) => (
                    <div
                        key={label}
                        className={`px-4 py-1 font-medium rounded-full text-sm cursor-pointer ${
                            selectedView === label
                                ? "bg-primary text-black scale-105"
                                : "bg-zinc-800 text-gray-400"
                        }`}
                        onClick={() => setSelectedView(label as ViewType)}
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
                {entries.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 p-20 border-2 border-dashed border-gray-500 rounded-xl">
                        No hay fotos disponibles.
                    </div>
                ) : (
                    entries.map((entry, i) => (
                    <div
                        key={i}
                        className="w-full h-full bg-zinc-800 rounded-xl flex items-center justify-center"
                    >
                        {entry.photos[key] ? (
                            <img
                                src={entry.photos[key]}
                                alt="Foto de progreso"
                                loading="lazy"
                                className="w-full h-full object-contain rounded-xl"
                            />
                        ) : (
                            <div className="text-gray-500">Sin foto</div>
                        )}

                    </div>
                )))}


            </div>

            <button className="bg-primary text-black py-3 rounded-lg font-semibold cursor-pointer w-full flex items-center justify-center gap-2 "
                onClick={() => {
                    setModalOpen(true)
                    setFormPhotos({
                        weight: 0,
                        note: "",
                        muscle_mass: 0,
                        body_fat: 0,
                    })
                }}
            >   
                <Plus size={16} />
                Subir progreso
            </button>

            {modalOpen && (
                <ProgressPhotoModal 
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveProgress}
                    formData={formPhotos}
                    setFormData={setFormPhotos}
                />
            )}

        </div>
    );
}