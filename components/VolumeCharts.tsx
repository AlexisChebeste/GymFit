"use client";

import { LineChartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type BestSet = {
  date: string;
  volume: number;
};

interface VolumeChartProps {
  data: BestSet[];
}

export default function VolumeChart({ data }: VolumeChartProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full gap-2">
        <div className="p-3 bg-zinc-800/30 rounded-full text-zinc-600">
          <LineChartIcon size={24} strokeWidth={1.5} />
        </div>
        <p className="text-sm text-zinc-500 font-medium">No hay datos de volumen todavía</p>
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Registrá tu primera sesión</p>
      </div>
    );
  }

  if (!mounted) {
    return <div className="w-full h-64" />;
  }

  return (
    <div className="w-full min-h-64" >
      <ResponsiveContainer width="100%"  height={256}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#333"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="#888"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#888"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
          />

          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #333",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#aaa" }}
            formatter={(value, _name, item) => {
              if (item && item.payload && item.payload.date) 
                 
              return [`${value} kg`, "Volumen total sesión"];
            }}
          />

          <Line
            type="monotone"
            dataKey="volume"
            stroke="#39FF14"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}