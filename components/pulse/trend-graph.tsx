"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { TrendData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendGraphProps {
  data: TrendData[];
  title?: string;
  description?: string;
  variant?: "area" | "line" | "bar";
  color?: string;
  showTrend?: boolean;
  height?: number;
  className?: string;
}

function calculateTrend(
  data: TrendData[]
): { direction: "up" | "down" | "flat"; percentage: number } {
  if (data.length < 2) return { direction: "flat", percentage: 0 };

  const recentAvg =
    data.slice(-7).reduce((sum, d) => sum + d.value, 0) /
    Math.min(7, data.length);
  const previousAvg =
    data.slice(-14, -7).reduce((sum, d) => sum + d.value, 0) /
    Math.max(1, Math.min(7, data.slice(-14, -7).length));

  if (previousAvg === 0) return { direction: "flat", percentage: 0 };

  const change = ((recentAvg - previousAvg) / previousAvg) * 100;

  if (Math.abs(change) < 5)
    return { direction: "flat", percentage: Math.abs(change) };
  return {
    direction: change > 0 ? "up" : "down",
    percentage: Math.abs(change),
  };
}

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--popover-foreground)",
};

export function TrendGraph({
  data,
  title,
  description,
  variant = "area",
  color = "hsl(250, 70%, 55%)",
  showTrend = true,
  height = 200,
  className,
}: TrendGraphProps) {
  const safeData = data && Array.isArray(data) ? data : [];
  const trend = useMemo(() => calculateTrend(safeData), [safeData]);

  const TrendIcon =
    trend.direction === "up"
      ? TrendingUp
      : trend.direction === "down"
        ? TrendingDown
        : Minus;
  const trendColor =
    trend.direction === "up"
      ? "text-success"
      : trend.direction === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  const formattedData = safeData.map((d) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const gradientId = `trendFill-${(title || "default").replace(/\s+/g, "-")}`;

  return (
    <Card className={className}>
      {(title || showTrend) && (
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            {title && (
              <CardTitle className="text-base font-semibold">
                {title}
              </CardTitle>
            )}
            {showTrend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm",
                  trendColor
                )}
              >
                <TrendIcon className="h-4 w-4" />
                <span className="font-medium">
                  {trend.percentage.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className="pb-4">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            {variant === "area" ? (
              <AreaChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border"
                />
                <XAxis
                  dataKey="dateLabel"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  className="fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                  width={30}
                  className="fill-muted-foreground"
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  name="Activity"
                />
              </AreaChart>
            ) : variant === "line" ? (
              <LineChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border"
                />
                <XAxis
                  dataKey="dateLabel"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  className="fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                  width={30}
                  className="fill-muted-foreground"
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                  name="Score"
                />
              </LineChart>
            ) : (
              <BarChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border"
                />
                <XAxis
                  dataKey="dateLabel"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  className="fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                  width={30}
                  className="fill-muted-foreground"
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="value"
                  fill={color}
                  radius={[4, 4, 0, 0]}
                  name="Value"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendGraphSkeleton({ height = 200 }: { height?: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-3 w-48 bg-muted rounded animate-pulse mt-1" />
      </CardHeader>
      <CardContent>
        <div
          className="w-full bg-muted/50 rounded animate-pulse"
          style={{ height }}
        />
      </CardContent>
    </Card>
  );
}
