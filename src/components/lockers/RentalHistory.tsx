import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, User, Clock, Calendar } from "lucide-react";
import type { LockerResponse } from "@/lib/schemas/lockers";

interface RentalHistoryProps {
  rentals: LockerResponse["rentals"];
  loading?: boolean;
}

export function RentalHistory({ rentals, loading }: RentalHistoryProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Rental History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 animate-pulse"
              >
                <div className="h-4 w-4 bg-muted rounded" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rentals || rentals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Rental History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <History className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No rental history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDuration = (start: Date, expiresAt: Date) => {
    const now = new Date();
    const isActive = now < expiresAt;

    if (isActive) {
      // Show remaining time for active rentals
      const diff = expiresAt.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
      }
      return `${minutes}m remaining`;
    } else {
      // Show total duration for expired rentals
      const diff = expiresAt.getTime() - start.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        return `${hours}h ${minutes}m duration`;
      }
      return `${minutes}m duration`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Rental History
          <Badge variant="secondary">{rentals.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rentals.map((rental) => {
            const isActive = new Date() < new Date(rental.expiresAt);
            const isExpired = !isActive;

            return (
              <div
                key={rental.id}
                className="flex items-start space-x-4 p-3 border rounded-lg"
              >
                <div className="flex-shrink-0">
                  <User className="w-4 h-4 text-muted-foreground mt-1" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{rental.user.name}</span>
                    <Badge variant={isActive ? "default" : "outline"}>
                      {isActive ? "Active" : "Expired"}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {rental.user.email}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(rental.startDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(
                        new Date(rental.startDate),
                        new Date(rental.expiresAt)
                      )}
                    </div>
                  </div>

                  <div className="text-xs">
                    {isActive ? "Expires" : "Expired"}:{" "}
                    {new Date(rental.expiresAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
