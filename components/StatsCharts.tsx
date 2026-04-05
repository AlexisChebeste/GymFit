"use client";

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
  rawDate: string;
  weight: number;
  reps: number;
  rir?: number;
  score: number;
};

interface StatsChartProps {
  data: BestSet[];
}

export default function StatsChart({ data }: StatsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 text-zinc-500">
        No hay datos todavía 📭
      </div>
    );
  }

  return (
    <div className="w-full h-64" >
      <ResponsiveContainer width="100%" aspect={2} >
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
              const payload = item?.payload as BestSet | undefined;
              const score =
                typeof value === "number" ? value : Number(value ?? 0);

              return [
                `Score: ${score.toFixed(0)}`,
                `${payload?.weight ?? 0}kg x ${payload?.reps ?? 0} reps (RIR ${payload?.rir ?? 0})`,
              ];
            }}
          />

          <Line
            type="monotone"
            dataKey="score"
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