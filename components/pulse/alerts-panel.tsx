"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Alert, AlertPriority } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info,
  Shield,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/format";

interface AlertsPanelProps {
  alerts: Alert[];
  className?: string;
}

const priorityConfig: Record<
  AlertPriority,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  critical: {
    icon: <Flame className="h-4 w-4" />,
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/20",
  },
  high: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "text-warning",
    bg: "bg-warning/10 border-warning/20",
  },
  medium: {
    icon: <Info className="h-4 w-4" />,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  low: {
    icon: <Bell className="h-4 w-4" />,
    color: "text-muted-foreground",
    bg: "bg-muted border-border",
  },
};

export function AlertsPanel({ alerts: initialAlerts, className }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState(initialAlerts);

  const unreadCount = alerts.filter((a) => !a.read).length;

  function dismissAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  function markAsRead(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  }

  function markAllRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            AI Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={markAllRead}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No active alerts
          </div>
        ) : (
          alerts.map((alert) => {
            const config = priorityConfig[alert.priority];
            return (
              <div
                key={alert.id}
                className={cn(
                  "group relative flex gap-3 p-3 rounded-lg border transition-all duration-200",
                  config.bg,
                  !alert.read && "ring-1 ring-ring/10",
                  "hover:shadow-sm"
                )}
                onClick={() => markAsRead(alert.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") markAsRead(alert.id);
                }}
              >
                <div className={cn("shrink-0 mt-0.5", config.color)}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className={cn(
                          "text-sm leading-tight",
                          !alert.read ? "font-semibold" : "font-medium"
                        )}
                      >
                        {alert.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 px-1 capitalize"
                    >
                      {alert.category}
                    </Badge>
                    <span>{formatDistanceToNow(alert.timestamp)}</span>
                    {!alert.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
