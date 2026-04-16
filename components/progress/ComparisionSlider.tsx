"use client";

import { useState } from "react";

type Props = {
  before: string;
  after: string;
};

export default function ComparisonSlider({ before, after }: Props) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-xl">
      
      {/* AFTER */}
      <img
        src={after}
        className="absolute w-full h-full object-cover"
      />

      {/* BEFORE (clip dinámico) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={before}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%]"
      />
    </div>
  );
}