"use client"

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "./Card";
import { Trend } from "@/hooks/useMeasurements";

interface MetricCardProps {
    metric: {
        key: string;
        label: string;
        value: number;
        unit: string;
        change?: number;
        trend?: Trend;
    };
    range: "7D" | "30D" | "90D";
}

export default function MetricCard({ metric, range }: MetricCardProps) {

    const color = metric.trend === "up_good"
        ? "text-green-500"
        : metric.trend === "down_good"
        ? "text-green-500"
        : "text-zinc-500";

    return (
        <Card className={`px-6 py-4 flex flex-col gap-2 justify-between w-full`}>
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-secondary font-bold">{metric.label}</p>
            <h2 className="text-4xl font-bold">
              {metric.value}
              <span className="text-lg font-normal text-muted-foreground uppercase italic ml-2">{metric.unit}</span> 
            </h2>
            {metric.change !== undefined && (
              <div className="flex text-sm gap-2 items-center">
                
                {metric.trend === "up_good" && <TrendingUp className="text-green-500" size={16} />}
                {metric.trend === "down_good" && <TrendingDown className="text-green-500" size={16} />}
                {metric.trend === "neutral" && <Minus className="text-zinc-500" size={16} />}
                <span className={`font-medium ${color}`}>{metric.change} {metric.unit}  {
                  range === "7D" ? "los ultimos 7 dias" : range === "30D" ? "el último mes" : "los últimos 90 días"
                }</span>
              </div>
            )}
            </div>
        </Card>
    )
}