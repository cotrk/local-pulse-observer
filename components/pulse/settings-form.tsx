"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { UserSettings, IncidentCategory, AlertPriority } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Bell,
  Shield,
  MapPin,
  Save,
  RotateCcw,
  Mail,
  Smartphone,
  Clock,
  Eye,
  EyeOff,
  Database,
} from "lucide-react";
import { neighborhoods } from "@/lib/mock-data";

interface SettingsFormProps {
  settings: UserSettings;
  onSave?: (settings: UserSettings) => void;
  className?: string;
}

const allCategories: IncidentCategory[] = [
  "infrastructure",
  "safety",
  "environment",
  "community",
  "development",
  "traffic",
  "utilities",
];

const allPriorities: AlertPriority[] = ["critical", "high", "medium", "low"];

const priorityColors: Record<AlertPriority, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-primary/20 text-primary",
  low: "bg-muted text-muted-foreground",
};

export function SettingsForm({ settings, onSave, className }: SettingsFormProps) {
  const [form, setForm] = useState<UserSettings>(settings);
  const [saved, setSaved] = useState(false);

  function toggleCategory(cat: IncidentCategory) {
    setForm((prev) => ({
      ...prev,
      alertCategories: prev.alertCategories.includes(cat)
        ? prev.alertCategories.filter((c) => c !== cat)
        : [...prev.alertCategories, cat],
    }));
  }

  function togglePriority(pri: AlertPriority) {
    setForm((prev) => ({
      ...prev,
      alertPriorities: prev.alertPriorities.includes(pri)
        ? prev.alertPriorities.filter((p) => p !== pri)
        : [...prev.alertPriorities, pri],
    }));
  }

  function toggleNeighborhood(n: string) {
    setForm((prev) => ({
      ...prev,
      neighborhoods: prev.neighborhoods.includes(n)
        ? prev.neighborhoods.filter((nb) => nb !== n)
        : [...prev.neighborhoods, n],
    }));
  }

  function handleSave() {
    onSave?.(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setForm(settings);
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Alert Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alert Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Categories
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {allCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant={
                    form.alertCategories.includes(cat) ? "default" : "outline"
                  }
                  className="cursor-pointer capitalize transition-all hover:scale-105"
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Priority Levels
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {allPriorities.map((pri) => (
                <Badge
                  key={pri}
                  variant="outline"
                  className={cn(
                    "cursor-pointer capitalize transition-all hover:scale-105",
                    form.alertPriorities.includes(pri) && priorityColors[pri]
                  )}
                  onClick={() => togglePriority(pri)}
                >
                  {pri}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Neighborhoods */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Watched Neighborhoods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {neighborhoods.map((n) => (
              <Badge
                key={n}
                variant={form.neighborhoods.includes(n) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleNeighborhood(n)}
              >
                {n}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Email Notifications</Label>
            </div>
            <Switch
              checked={form.emailNotifications}
              onCheckedChange={(v) =>
                setForm((prev) => ({ ...prev, emailNotifications: v }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Push Notifications</Label>
            </div>
            <Switch
              checked={form.pushNotifications}
              onCheckedChange={(v) =>
                setForm((prev) => ({ ...prev, pushNotifications: v }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Digest Frequency</Label>
            </div>
            <Select
              value={form.digestFrequency}
              onValueChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  digestFrequency: v as UserSettings["digestFrequency"],
                }))
              }
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {form.privacyMode ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <Label className="text-sm">Privacy Mode</Label>
            </div>
            <Switch
              checked={form.privacyMode}
              onCheckedChange={(v) =>
                setForm((prev) => ({ ...prev, privacyMode: v }))
              }
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm">Data Retention</Label>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {form.dataRetentionDays} days
              </span>
            </div>
            <Slider
              value={[form.dataRetentionDays]}
              onValueChange={([v]) =>
                setForm((prev) => ({ ...prev, dataRetentionDays: v }))
              }
              min={7}
              max={365}
              step={7}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          onClick={handleSave}
          className="flex-1 gap-2"
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Settings"}
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
