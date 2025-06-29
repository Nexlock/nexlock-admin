"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, Activity } from "lucide-react";
import { modulesApi } from "@/lib/api/modules";
import type { ModuleStatus } from "@/lib/schemas/modules";

interface ModuleStatusCardProps {
  moduleId: string;
  initialStatus?: ModuleStatus;
}

export function ModuleStatusCard({
  moduleId,
  initialStatus,
}: ModuleStatusCardProps) {
  const [status, setStatus] = useState<ModuleStatus | null>(
    initialStatus || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const newStatus = await modulesApi.getModuleStatus(moduleId);
      setStatus(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    if (!initialStatus) {
      fetchStatus();
    }

    // Poll for status updates every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [moduleId, initialStatus, fetchStatus]);

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            {loading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <p className="text-muted-foreground">Loading status...</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Module Status
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStatus}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Connection Status</span>
          <Badge
            variant={status.isOnline ? "default" : "secondary"}
            className={`gap-1 ${
              status.isOnline
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {status.isOnline ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            {status.isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        {status.lastSeen && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Last Seen</span>
            <span className="text-sm text-muted-foreground">
              {status.lastSeen.toLocaleString()}
            </span>
          </div>
        )}

        {status.lockerStatuses.length > 0 && (
          <div className="space-y-2">
            <span className="font-medium">Locker Status</span>
            <div className="grid gap-2">
              {status.lockerStatuses.map((lockerStatus) => (
                <div
                  key={lockerStatus.lockerId}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="font-mono text-sm">
                    Locker {lockerStatus.lockerId}
                  </span>
                  <Badge
                    variant={
                      lockerStatus.occupied ? "destructive" : "secondary"
                    }
                  >
                    {lockerStatus.occupied ? "Occupied" : "Available"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-2 border border-red-200 bg-red-50 rounded text-sm text-red-600">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
