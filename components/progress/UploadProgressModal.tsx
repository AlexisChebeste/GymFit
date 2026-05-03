"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { PhotoType } from "@/hooks/useProgressPhotos";
import { FormPhotos } from "./PhotosTab";

type Props = {
  onClose: () => void;
  onSave: (
    files: Record<PhotoType, File | null>
  ) => Promise<void>;
  formData: FormPhotos;
  setFormData: React.Dispatch<React.SetStateAction<FormPhotos>>;
};

export default function ProgressPhotoModal({ onClose, onSave, formData, setFormData }: Props) {
  const [files, setFiles] = useState<Record<PhotoType, File | null>>({
    front: null,
    side: null,
    back: null,
  });

  const [preview, setPreview] = useState<Record<PhotoType, string | null>>({
    front: null,
    side: null,
    back: null,
  });

  const [loading, setLoading] = useState(false);

  const handleSelect = (type: PhotoType, file: File) => {
    setFiles((prev) => ({ ...prev, [type]: file }));

    const url = URL.createObjectURL(file);
    setPreview((prev) => ({ ...prev, [type]: url }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onSave(files);
    setLoading(false);
    onClose();
  };

  const renderBox = (type: PhotoType, label: string) => (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="w-full h-46 bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
        {preview[type] ? (
          <img
            src={preview[type]!}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-gray-400">{label}</span>
        )}
      </div>

      <label className="text-xs cursor-pointer text-primary">
        Seleccionar
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleSelect(type, file);
          }}
        />
      </label>
    </div>
  );

  return (
    <Modal onClose={onClose} className="max-w-xl">
      <div className="flex flex-col gap-6">

        <h2 className="text-xl font-bold">Nuevo progreso</h2>

        <div className="flex justify-between gap-4 w-full">
          {renderBox("front", "Frente")}
          {renderBox("side", "Lado")}
          {renderBox("back", "Espalda")}
        </div>

        {/* Aquí podrías agregar campos para peso, nota, masa muscular y grasa corporal */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-secondary">Peso (kg)</label>
            <input
              type="number"
              value={formData.weight || ""}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 95.0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-secondary">Nota</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: Me siento más fuerte y con más energía"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">Masa muscular (kg)</label>
              <input
                type="number"
                value={formData.muscle_mass || ""}
                onChange={(e) => setFormData({ ...formData, muscle_mass: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 70.0"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">Grasa corporal (%)</label>
              <input
                type="number"
                value={formData.body_fat || ""}
                onChange={(e) => setFormData({ ...formData, body_fat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-md border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Ej: 10"
              />
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg font-semibold transition  ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-primary text-black hover:bg-primary/80 cursor-pointer"
          }`}
        >
          {loading ? "Guardando..." : "Guardar progreso"}
        </button>
      </div>
    </Modal>
  );
}