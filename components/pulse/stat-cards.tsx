"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  MapPin,
  Scan,
  Brain,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ label, value, change, icon, className }: StatCardProps) {
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
          </div>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            {change > 0 ? (
              <>
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success font-medium">+{change}%</span>
              </>
            ) : change < 0 ? (
              <>
                <TrendingDown className="h-3 w-3 text-destructive" />
                <span className="text-destructive font-medium">{change}%</span>
              </>
            ) : (
              <>
                <Minus className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">0%</span>
              </>
            )}
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Active Insights"
        value={4}
        change={25}
        icon={<Brain className="h-4 w-4" />}
      />
      <StatCard
        label="Data Sources"
        value={6}
        change={0}
        icon={<Scan className="h-4 w-4" />}
      />
      <StatCard
        label="Incidents Today"
        value={8}
        change={-12}
        icon={<Activity className="h-4 w-4" />}
      />
      <StatCard
        label="Neighborhoods"
        value={12}
        change={8}
        icon={<MapPin className="h-4 w-4" />}
      />
    </div>
  );
}
