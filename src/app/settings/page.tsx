'use client';

import { useApp } from '@/context/app-provider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-provider';

export default function SettingsPage() {
  const { reminderSettings, updateReminderSettings } = useApp();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Please sign in to access settings.</p>
      </div>
    );
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Practice Reminders</CardTitle>
          <CardDescription>
            Configure when you want to receive daily email reminders to practice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders-enabled">Enable Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive a daily email to keep your practice streak going.
              </p>
            </div>
            <Switch
              id="reminders-enabled"
              checked={reminderSettings.enabled}
              onCheckedChange={(checked) => updateReminderSettings({ enabled: checked })}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="reminder-time">Reminder Time</Label>
            <Select
              disabled={!reminderSettings.enabled}
              value={reminderSettings.hour.toString()}
              onValueChange={(value) => updateReminderSettings({ hour: parseInt(value, 10) })}
            >
              <SelectTrigger id="reminder-time" className="w-[180px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {formatHour(hour)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Current Timezone: <span className="text-foreground font-medium">{reminderSettings.timezone}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Timezone is automatically detected from your browser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
