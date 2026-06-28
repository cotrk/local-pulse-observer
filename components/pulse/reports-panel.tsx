"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { TrendData, PostMetadata } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  PieChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ReportsPanelProps {
  trendData: TrendData[];
  sentimentData: TrendData[];
  posts: PostMetadata[];
  className?: string;
}

const CHART_COLORS = [
  "hsl(250, 70%, 55%)",
  "hsl(145, 60%, 45%)",
  "hsl(40, 90%, 55%)",
  "hsl(0, 75%, 55%)",
  "hsl(200, 65%, 50%)",
  "hsl(30, 85%, 55%)",
  "hsl(180, 60%, 45%)",
];

export function ReportsPanel({
  trendData,
  sentimentData,
  posts,
  className,
}: ReportsPanelProps) {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("trends");

  const categoryBreakdown = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return [];
    const counts: Record<string, number> = {};
    for (const post of posts) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [posts]);

  const sentimentBreakdown = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return [];
    const counts: Record<string, number> = {};
    for (const post of posts) {
      counts[post.sentiment] = (counts[post.sentiment] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [posts]);

  const filteredTrend = useMemo(() => {
    if (!trendData || !Array.isArray(trendData)) return [];
    const days = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30;
    return trendData.slice(-days);
  }, [trendData, timeRange]);

  const filteredSentiment = useMemo(() => {
    if (!sentimentData || !Array.isArray(sentimentData)) return [];
    const days = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30;
    return sentimentData.slice(-days);
  }, [sentimentData, timeRange]);

  const trendStats = useMemo(() => {
    if (!filteredTrend.length) return { avg: 0, change: 0, direction: "stable" as const };
    const values = filteredTrend.map((d) => d.value);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const change = Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
    const direction = change > 5 ? "rising" as const : change < -5 ? "declining" as const : "stable" as const;
    return { avg, change, direction };
  }, [filteredTrend]);

  function handleExport() {
    const data = {
      exportedAt: new Date().toISOString(),
      timeRange,
      trendData: filteredTrend,
      sentimentData: filteredSentiment,
      categoryBreakdown,
      stats: trendStats,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pulse-report-${timeRange}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="14d">14 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 bg-transparent"
          onClick={handleExport}
        >
          <Download className="h-3 w-3" />
          Export
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground mb-1">
              Avg. Activity
            </div>
            <div className="text-xl font-bold font-mono">{trendStats.avg}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground mb-1">
              Trend
            </div>
            <div className="flex items-center gap-1.5">
              {trendStats.direction === "rising" ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : trendStats.direction === "declining" ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-xl font-bold font-mono">
                {trendStats.change > 0 ? "+" : ""}
                {trendStats.change}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground mb-1">
              Categories
            </div>
            <div className="text-xl font-bold font-mono">
              {categoryBreakdown.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Historical Analysis
              </CardTitle>
              <TabsList className="h-8">
                <TabsTrigger value="trends" className="text-xs gap-1 px-2.5">
                  <TrendingUp className="h-3 w-3" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="sentiment" className="text-xs gap-1 px-2.5">
                  <BarChart3 className="h-3 w-3" />
                  Sentiment
                </TabsTrigger>
                <TabsTrigger value="breakdown" className="text-xs gap-1 px-2.5">
                  <PieChart className="h-3 w-3" />
                  Breakdown
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="trends" className="mt-0">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredTrend}>
                    <defs>
                      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(250, 70%, 55%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(250, 70%, 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      className="fill-muted-foreground"
                      tickFormatter={(v) => {
                        const d = new Date(v);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                    />
                    <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(250, 70%, 55%)"
                      strokeWidth={2}
                      fill="url(#trendFill)"
                      name="Activity"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="sentiment" className="mt-0">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredSentiment}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      className="fill-muted-foreground"
                      tickFormatter={(v) => {
                        const d = new Date(v);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                    />
                    <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(145, 60%, 45%)"
                      radius={[4, 4, 0, 0]}
                      name="Sentiment Score"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="breakdown" className="mt-0">
              <div className="h-[280px] flex items-center gap-6">
                <div className="flex-1 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {categoryBreakdown.map((_, index) => (
                          <Cell
                            key={index}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 min-w-[120px]">
                  {categoryBreakdown.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                      <span className="capitalize">{item.name}</span>
                      <span className="ml-auto font-mono text-muted-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
