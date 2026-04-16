"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { PhotoType } from "@/hooks/useProgressPhotos";

type Props = {
  onClose: () => void;
  onSave: (
    files: Record<PhotoType, File | null>
  ) => Promise<void>;
};

export default function ProgressPhotoModal({ onClose, onSave }: Props) {
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
    <div className="flex flex-col gap-2 items-center">
      <div className="w-32 h-40 bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
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
    <Modal onClose={onClose} className="max-w-lg">
      <div className="flex flex-col gap-6">

        <h2 className="text-xl font-bold">Nuevo progreso</h2>

        <div className="flex justify-between gap-4">
          {renderBox("front", "Frente")}
          {renderBox("side", "Lado")}
          {renderBox("back", "Espalda")}
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