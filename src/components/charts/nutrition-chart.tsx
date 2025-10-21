"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { NutrientInfo } from "@/lib/data"

interface NutritionChartProps {
  nutrients: NutrientInfo;
}

export default function NutritionChart({ nutrients }: NutritionChartProps) {
  const data = [
    { name: "Protein", value: nutrients.protein, fill: "hsl(var(--chart-1))" },
    { name: "Carbs", value: nutrients.carbs, fill: "hsl(var(--chart-2))" },
    { name: "Fat", value: nutrients.fat, fill: "hsl(var(--chart-4))" },
  ];

  return (
    <div className="h-[150px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: -10 }}>
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip 
            cursor={{fill: 'hsl(var(--accent))'}}
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} unit="g" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
