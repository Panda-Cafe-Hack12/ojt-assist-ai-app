"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SearchHistoryChartProps {
  searchData: {
    categoryName: string
    searchCount: number
  }[]
}

export function SearchHistoryChart({ searchData }: SearchHistoryChartProps) {
  return (
    <ChartContainer
      config={{
        searchCount: {
          label: "検索回数",
          color: "#c084fc",
        },
      }}
      className="h-full"
    >
      <BarChart
        accessibilityLayer
        data={searchData.map((item) => ({
          category: item.categoryName,
          searchCount: item.searchCount,
        }))}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="searchCount" fill="var(--color-searchCount)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
