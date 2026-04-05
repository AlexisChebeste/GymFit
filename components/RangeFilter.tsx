import React from "react";

const ranges = ["30D", "3M", "6M", "ALL"];

type Range = typeof ranges[number];

interface RangeFilterProps {
  value: Range;
  onChange: React.Dispatch<React.SetStateAction<Range>>;
}

export default function RangeFilter({ value, onChange }: RangeFilterProps) {
  return (
    <div className="flex gap-2 ">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-3 py-1 rounded-lg text-sm transition ${
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