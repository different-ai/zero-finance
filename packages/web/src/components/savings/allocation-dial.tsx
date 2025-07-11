// No changes from previous version, tooltip added in SavingsPanel
"use client"

import type React from "react"
import { PieChart, Pie, Cell } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"

interface AllocationDialProps {
  percentage: number
  onPercentageChange: (newPercentage: number) => void
  size?: number
}

export default function AllocationDial({ percentage, onPercentageChange, size = 192 }: AllocationDialProps) {
  const isMobile = useIsMobile()
  const data = [
    { name: "Allocated", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ]
  const innerRadius = size * 0.3125
  const outerRadius = size * 0.46875

  let touchStartY = 0
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) touchStartY = e.touches[0].clientY
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMobile) {
      const touchEndY = e.touches[0].clientY
      const deltaY = touchStartY - touchEndY
      if (Math.abs(deltaY) > 10) {
        const change = deltaY > 0 ? 1 : -1
        let newPct = percentage + change
        if (newPct < 0) newPct = 0
        if (newPct > 100) newPct = 100
        onPercentageChange(Math.round(newPct / 10) * 10)
        touchStartY = touchEndY
      }
    }
  }

  return (
    <div
      className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      aria-label={`Allocation dial, current value ${percentage} percent. Swipe up or down on mobile to adjust.`}
      role="slider"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        let newPct = percentage
        if (e.key === "ArrowUp" || e.key === "ArrowRight") {
          newPct = Math.min(100, percentage + 10)
          e.preventDefault()
        } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
          newPct = Math.max(0, percentage - 10)
          e.preventDefault()
        }
        if (newPct !== percentage) {
          onPercentageChange(newPct)
        }
      }}
    >
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          cornerRadius={5}
          paddingAngle={percentage > 0 && percentage < 100 ? 2 : 0}
        >
          <Cell fill="#5668ff" stroke="none" /> <Cell fill="#e4e9ff" stroke="none" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl sm:text-4xl font-semibold text-gray-800">{percentage}%</span>
        <span className="text-xs text-gray-500 mt-1">ALLOCATED</span>
      </div>
    </div>
  )
}
