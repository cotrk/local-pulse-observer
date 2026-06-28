"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ScannerSource } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Scan,
  RefreshCw,
  Globe,
  Users,
  FileText,
  Landmark,
  MessageSquare,
  Radio,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/format";

interface ScannerPanelProps {
  sources: ScannerSource[];
  className?: string;
}

const sourceIcons: Record<string, React.ReactNode> = {
  council_meeting: <Landmark className="h-4 w-4" />,
  social_media: <MessageSquare className="h-4 w-4" />,
  news_article: <FileText className="h-4 w-4" />,
  public_report: <FileText className="h-4 w-4" />,
  community_forum: <Users className="h-4 w-4" />,
  government_notice: <Globe className="h-4 w-4" />,
};

export function ScannerPanel({ sources, className }: ScannerPanelProps) {
  const [scannerSources, setScannerSources] = useState(sources);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const enabledCount = scannerSources.filter((s) => s.enabled).length;
  const totalPosts = scannerSources.reduce((acc, s) => acc + s.postsFound, 0);

  function handleToggle(id: string) {
    setScannerSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }

  function handleScanAll() {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScannerSources((prev) =>
            prev.map((s) =>
              s.enabled ? { ...s, lastScanned: new Date() } : s
            )
          );
          return 0;
        }
        return prev + 15;
      });
    }, 300);
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Council & Media Scanner
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {enabledCount}/{scannerSources.length} active
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1.5 bg-transparent"
                    onClick={handleScanAll}
                    disabled={isScanning}
                  >
                    <RefreshCw
                      className={cn(
                        "h-3 w-3",
                        isScanning && "animate-spin"
                      )}
                    />
                    {isScanning ? "Scanning..." : "Scan All"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Run all active scanners now</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {isScanning && (
          <Progress value={scanProgress} className="h-1 mt-2" />
        )}
      </CardHeader>
      <CardContent className="space-y-1.5">
        {scannerSources.map((source) => (
          <div
            key={source.id}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
              "hover:bg-muted/50",
              !source.enabled && "opacity-50"
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/80 text-muted-foreground shrink-0">
              {sourceIcons[source.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {source.name}
                </span>
                {source.enabled && source.lastScanned && (
                  <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                {source.lastScanned && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {formatDistanceToNow(source.lastScanned)}
                  </span>
                )}
                <span>{source.postsFound.toLocaleString()} posts</span>
              </div>
            </div>
            <Switch
              checked={source.enabled}
              onCheckedChange={() => handleToggle(source.id)}
              className="shrink-0 scale-90"
            />
          </div>
        ))}
        <div className="pt-3 border-t mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total data points indexed</span>
            <span className="font-mono font-semibold text-foreground">
              {totalPosts.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScannerPanelSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
          <div className="h-7 w-20 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5">
            <div className="w-8 h-8 bg-muted rounded-md animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            </div>
            <div className="w-9 h-5 bg-muted rounded-full animate-pulse" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
