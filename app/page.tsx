"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/pulse/app-header";
import { StatCards } from "@/components/pulse/stat-cards";
import { InsightCard, InsightCardSkeleton } from "@/components/pulse/insight-card";
import { FeedPanel, FeedPanelSkeleton } from "@/components/pulse/feed-panel";
import { MapOverlay, MapOverlaySkeleton } from "@/components/pulse/map-overlay";
import { TrendGraph, TrendGraphSkeleton } from "@/components/pulse/trend-graph";
import { AlertsPanel } from "@/components/pulse/alerts-panel";
import { ScannerPanel, ScannerPanelSkeleton } from "@/components/pulse/scanner-panel";
import { ReportsPanel } from "@/components/pulse/reports-panel";
import { SettingsForm } from "@/components/pulse/settings-form";
import {
  mockPosts,
  mockInsights,
  mockAlerts,
  mockHeatmapData,
  mockTrendData,
  mockSentimentTrend,
  mockScannerSources,
  defaultUserSettings,
} from "@/lib/mock-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function PulseObserverPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const unreadAlerts = mockAlerts.filter((a) => !a.read).length;

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "map", label: "Map" },
    { id: "scanner", label: "Scanner" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader
        unreadAlerts={unreadAlerts}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onMenuToggle={() => setMobileMenuOpen(true)}
      />

      {/* Mobile Navigation Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <main className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-6">
        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stat Cards Row */}
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[100px] bg-card rounded-xl border animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <StatCards />
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Insights + Alerts */}
              <div className="lg:col-span-2 space-y-6">
                {/* Top Insights */}
                <section>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full" />
                    Top Insights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {isLoading
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <InsightCardSkeleton key={i} />
                        ))
                      : mockInsights.map((insight) => (
                          <InsightCard key={insight.id} insight={insight} />
                        ))}
                  </div>
                </section>

                {/* Trend Graph */}
                {isLoading ? (
                  <TrendGraphSkeleton height={220} />
                ) : (
                  <TrendGraph
                    data={mockTrendData}
                    title="Activity Trend"
                    description="Incident reports over the past 30 days"
                    variant="area"
                    height={220}
                  />
                )}

                {/* Map Preview */}
                {isLoading ? (
                  <MapOverlaySkeleton />
                ) : (
                  <MapOverlay
                    posts={mockPosts}
                    heatmapData={mockHeatmapData}
                  />
                )}
              </div>

              {/* Right Column: Feed + Alerts */}
              <div className="space-y-6">
                {isLoading ? (
                  <>
                    <div className="h-[200px] bg-card rounded-xl border animate-pulse" />
                    <FeedPanelSkeleton />
                  </>
                ) : (
                  <>
                    <AlertsPanel alerts={mockAlerts} />
                    <FeedPanel
                      posts={mockPosts}
                      title="Live Feed"
                      maxHeight="420px"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map View */}
        {activeTab === "map" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {isLoading ? (
              <MapOverlaySkeleton />
            ) : (
              <MapOverlay
                posts={mockPosts}
                heatmapData={mockHeatmapData}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <FeedPanelSkeleton />
              ) : (
                <FeedPanel
                  posts={mockPosts}
                  title="Geo-Tagged Feed"
                  maxHeight="400px"
                />
              )}
              {isLoading ? (
                <TrendGraphSkeleton />
              ) : (
                <TrendGraph
                  data={mockSentimentTrend}
                  title="Sentiment Over Time"
                  description="Community sentiment score trend"
                  variant="line"
                  color="var(--chart-2)"
                  height={200}
                />
              )}
            </div>
          </div>
        )}

        {/* Scanner View */}
        {activeTab === "scanner" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {isLoading ? (
                <ScannerPanelSkeleton />
              ) : (
                <ScannerPanel sources={mockScannerSources} />
              )}
              {isLoading ? (
                <FeedPanelSkeleton />
              ) : (
                <FeedPanel
                  posts={mockPosts}
                  title="Recently Parsed"
                  maxHeight="500px"
                />
              )}
            </div>
          </div>
        )}

        {/* Reports View */}
        {activeTab === "reports" && (
          <div className="animate-in fade-in duration-500">
            <ReportsPanel
              trendData={mockTrendData}
              sentimentData={mockSentimentTrend}
              posts={mockPosts}
            />
          </div>
        )}

        {/* Settings View */}
        {activeTab === "settings" && (
          <div className="max-w-2xl animate-in fade-in duration-500">
            <SettingsForm settings={defaultUserSettings} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>The Local Pulse Observer</span>
          <span>Community Intelligence Tool</span>
        </div>
      </footer>
    </div>
  );
}
