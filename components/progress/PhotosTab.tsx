import { PhotoType, useProgressPhotos } from "@/hooks/useProgressPhotos";
import { useUser } from "@/hooks/useUser";
import { Plus } from "lucide-react";
import { useState } from "react";

const viewMap = {
  Frente: "front",
  Espalda: "back",
  Lado: "side",
} as const;

type ViewType = keyof typeof viewMap;

export default function PhotosTab() {

    const { user } = useUser();

    const {
        entries,
        createEntry,
        uploadPhoto
    } = useProgressPhotos(user?.id ?? null);

    const [selectedView, setSelectedView] = useState<ViewType>("Frente");

    const key = viewMap[selectedView];

    const handleUpload = async (file: File, type: PhotoType) => {
        if (!user) return;

        let entry = entries.at(-1);

        if (!entry) {
            const newEntry = await createEntry();
            if (!newEntry) return;
            entry = newEntry;
        }

        if (!entry) return;

        await uploadPhoto(file, entry.id, type);
    };

    if (!user) return null;

    return (
        <div className="flex flex-col gap-4 flex-1 w-full pt-6">
            
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
                    ))

                }
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* fotos */}
                {entries.map((entry, i) => (
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
                ))}
            </div>

            <button className="bg-primary text-black py-3 rounded-lg font-semibold cursor-pointer w-full flex items-center justify-center gap-2 "
                onClick={() => handleUpload(new File([], "photo.jpg"), viewMap[selectedView])}
            >   
                <Plus size={16} />
                Subir foto
            </button>
        </div>
    );
}