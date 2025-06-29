import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Unlock,
  User,
  Clock,
  AlertTriangle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import type { LockerResponse, LockerStatus } from "@/lib/schemas/lockers";

interface LockerCardProps {
  locker: LockerResponse;
  status?: LockerStatus;
  moduleId: string;
}

export function LockerCard({ locker, status, moduleId }: LockerCardProps) {
  const hasActiveRental = !!locker.currentRental;
  const isExpired =
    locker.currentRental &&
    new Date(locker.currentRental.expiresAt) < new Date();
  const isOffline = !status?.isOnline;

  const getStatusBadge = () => {
    if (isOffline) {
      return <Badge variant="destructive">Offline</Badge>;
    }
    if (hasActiveRental && locker.currentRental) {
      if (isExpired) {
        return <Badge variant="destructive">Expired</Badge>;
      }
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          {locker.currentRental.isLocked ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Unlock className="w-3 h-3" />
          )}
          {locker.currentRental.isLocked ? "Locked" : "Unlocked"}
        </Badge>
      );
    }
    return <Badge variant="outline">Available</Badge>;
  };

  const getTimeRemaining = () => {
    if (!locker.currentRental) return null;

    const now = new Date();
    const expiresAt = new Date(locker.currentRental.expiresAt);
    const timeDiff = expiresAt.getTime() - now.getTime();

    if (timeDiff <= 0) return "Expired";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Locker {locker.lockerId}
        </CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {hasActiveRental && locker.currentRental && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {locker.currentRental.user.name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className={isExpired ? "text-red-600 font-medium" : ""}>
                  {getTimeRemaining()}
                </span>
              </div>

              {isExpired && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Rental expired - requires attention</span>
                </div>
              )}
            </div>
          )}

          {isOffline && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>
                Device offline - last seen:{" "}
                {status?.lastUpdate
                  ? new Date(status.lastUpdate).toLocaleString()
                  : "Never"}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              {status?.isOccupied ? "Occupied" : "Empty"}
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/module/${moduleId}/lockers/${locker.id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Settings className="w-3 h-3" />
                  Manage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
