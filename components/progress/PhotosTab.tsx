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

export default function PhotosTab() {

    const { user } = useUser();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

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

        const entry = await createEntry();

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
                <div className="w-full">
                    <p className="text-xs uppercase text-secondary mb-2">
                    Comparación
                    </p>

                    <ComparisonSlider
                    before={prev.photos[key]!}
                    after={last.photos[key]!}
                    />

                    <p className="text-sm text-secondary mb-2 text-center">
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
                        className="aspect-square bg-zinc-800 rounded-xl flex items-center justify-center"
                    >
                        {entry.photos[key] ? (
                            <img
                                src={entry.photos[key]}
                                alt="Foto de progreso"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        ) : (
                            <div className="text-gray-500">Sin foto</div>
                        )}

                    </div>
                )))}


            </div>

            <button className="bg-primary text-black py-3 rounded-lg font-semibold cursor-pointer w-full flex items-center justify-center gap-2 "
                onClick={() => setModalOpen(true)}
            >   
                <Plus size={16} />
                Subir progreso
            </button>

            {modalOpen && (
                <ProgressPhotoModal 
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveProgress}
                />
            )}

        </div>
    );
}