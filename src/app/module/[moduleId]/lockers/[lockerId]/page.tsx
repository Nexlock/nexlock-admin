"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockerControls } from "@/components/lockers/LockerControls";
import { RentalHistory } from "@/components/lockers/RentalHistory";
import { LoadingSpinner } from "@/components/modules/LoadingSpinner";
import {
  ArrowLeft,
  Lock,
  Unlock,
  User,
  Clock,
  MapPin,
  Activity,
  AlertCircle,
  WifiOff,
  Wifi,
} from "lucide-react";
import { lockersApi } from "@/lib/api/lockers";
import type { LockerResponse, LockerStatus } from "@/lib/schemas/lockers";

const LockerDetailsPage = async ({
  params,
}: {
  params: Promise<{ moduleId: string; lockerId: string }>;
}) => {
  const { moduleId, lockerId } = await params;
  const router = useRouter();
  const [locker, setLocker] = useState<LockerResponse | null>(null);
  const [status, setStatus] = useState<LockerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [lockerData, statusesData] = await Promise.all([
        lockersApi.getLockerById(lockerId),
        lockersApi.getLockerStatuses(),
      ]);

      setLocker(lockerData);
      const lockerStatus = statusesData.find(
        (s) => s.lockerId === lockerData.lockerId
      );
      setStatus(lockerStatus || null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch locker data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lockerId]);

  const handleUpdate = () => {
    fetchData();
  };

  const hasActiveRental = !!locker?.currentRental;
  const isExpired =
    locker?.currentRental &&
    new Date(locker.currentRental.expiresAt) < new Date();
  const isOffline = !status?.isOnline;

  const getTimeRemaining = () => {
    if (!locker?.currentRental) return null;

    const now = new Date();
    const expiresAt = new Date(locker.currentRental.expiresAt);
    const timeDiff = expiresAt.getTime() - now.getTime();

    if (timeDiff <= 0) return "Expired";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading locker details...</p>
        </div>
      </div>
    );
  }

  if (error || !locker) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Locker not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Locker {locker.lockerId}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              {locker.module && (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>{locker.module.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status ? (
            <Badge
              variant={status.isOnline ? "default" : "destructive"}
              className="gap-1"
            >
              {status.isOnline ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              {status.isOnline ? "Online" : "Offline"}
            </Badge>
          ) : (
            <Badge variant="outline">Unknown</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Locker Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Locker Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Current Status
                  </div>
                  <div className="flex items-center gap-2">
                    {hasActiveRental ? (
                      <>
                        {locker.currentRental?.isLocked ? (
                          <Lock className="w-4 h-4 text-red-600" />
                        ) : (
                          <Unlock className="w-4 h-4 text-green-600" />
                        )}
                        <span className="font-medium">
                          {locker.currentRental?.isLocked
                            ? "Locked"
                            : "Unlocked"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Available</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Occupancy
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={status?.isOccupied ? "secondary" : "outline"}
                    >
                      {status?.isOccupied ? "Occupied" : "Empty"}
                    </Badge>
                  </div>
                </div>

                {hasActiveRental && locker.currentRental && (
                  <>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Current Renter
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{locker.currentRental.user.name}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Time Remaining
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span
                          className={
                            isExpired ? "text-red-600 font-medium" : ""
                          }
                        >
                          {getTimeRemaining()}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {isExpired && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This rental has expired and may require manual intervention.
                  </AlertDescription>
                </Alert>
              )}

              {isOffline && (
                <Alert variant="destructive">
                  <WifiOff className="h-4 w-4" />
                  <AlertDescription>
                    Locker is offline. Last seen:{" "}
                    {status?.lastUpdate
                      ? new Date(status.lastUpdate).toLocaleString()
                      : "Never"}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Rental History */}
          <RentalHistory rentals={locker.rentals} />
        </div>

        {/* Admin Controls Sidebar */}
        <div>
          <LockerControls locker={locker} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
};

export default LockerDetailsPage;
