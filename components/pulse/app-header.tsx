"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Bell,
  Menu,
  Moon,
  Sun,
  Search,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";

interface AppHeaderProps {
  unreadAlerts: number;
  onMenuToggle?: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "map", label: "Map" },
  { id: "scanner", label: "Scanner" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

export function AppHeader({
  unreadAlerts,
  onMenuToggle,
  activeTab,
  onTabChange,
}: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <button
              className="flex items-center gap-2.5 group"
              onClick={() => onTabChange("dashboard")}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <Activity className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold leading-none tracking-tight">
                  Local Pulse
                </h1>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  Observer
                </p>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all duration-200",
                    activeTab === item.id
                      ? "text-foreground font-medium bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              onClick={() => onTabChange("dashboard")}
            >
              <Bell className="h-4 w-4" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full px-1">
                  {unreadAlerts}
                </span>
              )}
            </Button>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Live Status Bar */}
      <div className="border-t bg-muted/30">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 flex items-center justify-between h-7">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span>Live monitoring active</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="hidden sm:inline">Last scan: 2m ago</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-5 text-[10px] font-mono">
              6 sources
            </Badge>
            <Badge variant="outline" className="h-5 text-[10px] font-mono">
              8 incidents
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
