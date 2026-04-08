"use client"

import { TrendingUp } from "lucide-react";
import { Card } from "./Card";
import { Trend } from "@/hooks/useMeasurements";

export default function MetricCard({ label, value, change, unit, trend, range }: { label: string; value: string | number; change?: string; unit: string; trend: Trend; range: "7D" | "30D" | "90D" }) {

    const color = trend === "up_good"
        ? "text-green-500"
        : trend === "down_good"
        ? "text-green-500"
        : "text-zinc-500";

    return (
        <Card className="px-6 py-4 flex flex-col gap-2 justify-between w-full">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-secondary font-bold">{label}</p>
            <h2 className="text-4xl font-bold">
              {value}
              <span className="text-lg font-normal text-muted-foreground uppercase italic ml-2">{unit}</span> 
            </h2>
            {change !== undefined && (
              <div className="flex text-sm gap-2 items-center">
                <TrendingUp className={color} size={16} />
                <span className={`font-medium ${color}`}>{change} {unit}  {
                  range === "7D" ? "los ultimos 7 dias" : range === "30D" ? "el último mes" : "los últimos 90 días"
                }</span>
              </div>
            )}
            </div>
        </Card>
    )
}