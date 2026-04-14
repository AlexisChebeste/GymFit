"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

type WeightHistory = {
  date: string;
  weight: number;
};

interface StatsChartProps {
  data: WeightHistory[];
  goalWeight: number;
}

export default function WeightChart({ data, goalWeight }: StatsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 text-zinc-500">
        No hay datos todavía 
      </div>
    );
  }

  const first = data[0];
  const last = data[data.length - 1];

  const totalChange = last.weight - first.weight;

  const enhancedData = data.map((d, i) => ({
    ...d,
    baseline:
      first.weight +
      ((last.weight - first.weight) * i) / (data.length - 1 || 1),
    goal: goalWeight,
  }));

  const isGood = totalChange < 0; // si es pérdida de peso

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;

    const isFirst = payload.date === first.date;
    const isLast = payload.date === last.date;

    if (isFirst || isLast) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={6}
          stroke="#39FF14"
          strokeWidth={2}
          fill={isLast ? "#39FF14" : "#18181b"}
        />
      );
    }

    return <circle cx={cx} cy={cy} r={3} fill="#666" />;
  };

  

  return (
    <div className="w-full h-72 flex flex-col gap-2">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          Progreso
        </span>
        <span className="text-xs text-zinc-400">
          Objetivo: {goalWeight} kg
        </span>
        <span
          className={`text-sm font-semibold ${
            isGood ? "text-green-500" : "text-red-500"
          }`}
        >
          {totalChange > 0 ? "+" : ""}
          {totalChange.toFixed(1)} kg
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={enhancedData}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#39FF14" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#39FF14" stopOpacity={0} />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

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
            tickFormatter={(value) => {
              const d = new Date(value);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
          />

          <YAxis
            stroke="#888"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
          />

          <Tooltip
            cursor={{ stroke: "#aaa", strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;

              const weightData = payload.find(p => p.dataKey === "weight");

              if (!weightData) return null;

              return (
                <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                  <p className="text-xs text-zinc-400 mb-1">
                    {label ? new Date(label).toLocaleDateString() : ""}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    Peso: {Number(weightData.value).toFixed(1)} kg
                  </p>
                </div>
              );
            }}
          />

          <Area
            type="monotone"
            dataKey="weight"
            fill="url(#colorWeight)"
            stroke="none"
          />


          <Line
            type="linear"
            dataKey="baseline"
            stroke="#39FF14"
            strokeDasharray="4 4"
            dot={false}
            opacity={0.3}
          />

          <Line
            type="monotone"
            dataKey="weight"
            fill="#39FF14"
            stroke="#fff"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 7 }}
            filter="url(#glow)"
            isAnimationActive={true}
            animationDuration={600}
          />

          
          <Line
            type="linear"
            dataKey="goal"
            stroke="#888"
            strokeDasharray="2 6"
            dot={false}
            opacity={0.5}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}