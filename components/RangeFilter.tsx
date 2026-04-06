import React from "react";

const rangesDefault = ["30D", "3M", "6M"];

type Range = typeof rangesDefault[number];

interface RangeFilterProps {
  ranges?: Range[];
  value: Range;
  onChange: React.Dispatch<React.SetStateAction<Range>>;
}

export default function RangeFilter({ranges = rangesDefault, value, onChange }: RangeFilterProps) {
  return (
    <div className="flex gap-2 ">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-3 py-1 rounded-lg text-sm transition cursor-pointer ${
            value === range
              ? "bg-green-500 text-black font-semibold"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}