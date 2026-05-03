"use client";

import { useRef, useState } from "react";

type Props = {
  before: string;
  after: string;
};

export default function ComparisonSlider({ before, after }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percent = (x / rect.width) * 100;

    percent = Math.max(0, Math.min(100, percent));
    setPosition(percent);
  };

  // Mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    updatePosition(e.clientX);
  };

  // Touch
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-2xl bg-black select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setDragging(false)}
    >
      {/* AFTER (fondo blur opcional) */}
      <img
        src={after}
        className="absolute inset-0 w-full h-full object-cover object-center blur-2xl scale-110 opacity-20"
        draggable={false}
      />

      {/* AFTER real */}
      <img
        src={after}
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />

      {/* BEFORE recortado */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          width: `${position}%`,
          transition: dragging ? "none" : "width 0.2s ease-out",
        }}
      >
        {/* blur fondo */}
        <img
          src={before}
          className="absolute inset-0 w-full h-full object-cover object-center blur-2xl scale-110 opacity-20"
          draggable={false}
        />

        {/* imagen real */}
        <img
          src={before}
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
      </div>

      {/* HANDLE */}
      <div
        className="absolute top-0 bottom-0 flex items-center justify-center"
        style={{
          left: `${position}%`,
          transform: "translateX(-50%)",
        }}
      >
        {/* línea */}
        <div className="w-0.5 h-full bg-white/80 shadow-lg" />

        {/* botón estilo iOS */}
        <div
          onMouseDown={() => setDragging(true)}
          onTouchStart={() => setDragging(true)}
          className="absolute w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-black/50 rounded-full" />
            <div className="w-0.5 h-4 bg-black/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* etiquetas */}
      <div className="absolute top-3 left-3 text-xs bg-black/60 px-2 py-1 rounded">
        Antes
      </div>
      <div className="absolute top-3 right-3 text-xs bg-black/60 px-2 py-1 rounded">
        Después
      </div>
    </div>
  );
}