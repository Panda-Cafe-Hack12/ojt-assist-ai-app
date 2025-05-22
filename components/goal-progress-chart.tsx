"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"

interface GoalProgressChartProps {
  completionRate: number
  totalReadPages: number
  totalPages: number
}

export function GoalProgressChart({ completionRate, totalReadPages, totalPages }: GoalProgressChartProps) {
  const data = [
    { name: "完了", value: completionRate },
    { name: "残り", value: 100 - completionRate },
  ]

  const COLORS = ["#9333ea", "#f3f4f6"] // Subtle purple for completed, light gray for remaining

  return (
    <div className="w-full max-w-xs">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox) return null
                const { cx, cy }:any = viewBox
                return (
                  <>
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold"
                      fill="#9333ea" // Subtle purple
                    >
                      {`${completionRate}%`}
                    </text>
                    <text
                      x={cx}
                      y={cy + 25}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs"
                      fill="#6b7280"
                    >
                      {`${totalReadPages}/${totalPages} ページ`}
                    </text>
                  </>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center">
        <div className="text-sm font-medium">頑張ってますね！</div>
        <div className="text-sm text-muted-foreground">あとすこし！</div>
      </div>
    </div>
  )
}
