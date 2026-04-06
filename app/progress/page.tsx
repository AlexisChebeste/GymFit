"use client";

import MeasurementsTab from "@/components/progress/MeasurementsTab";
import PhotosTab from "@/components/progress/PhotosTab";
import { useState } from "react";

export default function ProgressPage() {
  const [tab, setTab] = useState<"measurements" | "photos">("measurements");

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural ">
        <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural overflow-y-auto max-h-[85vh]">
            <p className="uppercase text-sm text-secondary leading-5 tracking-widest">
                Controla tu progreso y mantente motivado
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                <h1 className="text-4xl font-bold">Progreso</h1>

                <div className="flex gap-2 bg-zinc-800 p-1 rounded-xl w-fit">
                    <button
                    onClick={() => setTab("measurements")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                        tab === "measurements"
                        ? "bg-primary text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                    >
                    Medidas
                    </button>

                    <button
                    onClick={() => setTab("photos")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                        tab === "photos"
                        ? "bg-primary text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                    >
                    Fotos
                    </button>
                </div>

            </div>

            {tab === "measurements" 
                ? 
                <MeasurementsTab /> 
                : 
                <PhotosTab />
            }
        </main>
    </div>
  );
}