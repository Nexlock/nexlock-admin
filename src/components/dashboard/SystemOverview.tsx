import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Wifi, WifiOff, Package, Lock, Users } from "lucide-react";

export function SystemOverview() {
  // This would typically come from props or API data
  const stats = {
    totalModules: 0,
    onlineModules: 0,
    totalLockers: 0,
    activeRentals: 0,
    systemStatus: "operational" as const,
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Modules</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalModules}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wifi className="w-3 h-3" />
                {stats.onlineModules} online
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Lockers</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalLockers}</div>
              <div className="text-xs text-muted-foreground">Total units</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Active Rentals</span>
              </div>
              <div className="text-2xl font-bold">{stats.activeRentals}</div>
              <div className="text-xs text-muted-foreground">Current users</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">System Status</span>
              </div>
              <Badge variant="default" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Operational
              </Badge>
              <div className="text-xs text-muted-foreground">
                All systems normal
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Welcome to your NexLock admin dashboard! Here you can:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Manage your locker modules and their configurations</li>
              <li>Monitor real-time locker status and occupancy</li>
              <li>Handle admin operations like emergency unlocks</li>
              <li>View rental history and user activity</li>
            </ul>
            <p className="pt-2">
              Start by visiting the <strong>Modules</strong> section to set up
              your first locker module.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
