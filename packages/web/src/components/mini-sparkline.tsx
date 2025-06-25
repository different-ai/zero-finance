"use client";

interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
}

export function MiniSparkline({ data, width = 100, height = 24, stroke = "currentColor" }: MiniSparklineProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="text-primary/60">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}