"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Unlock,
  UserX,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { lockersApi } from "@/lib/api/lockers";
import type { LockerResponse } from "@/lib/schemas/lockers";

interface LockerControlsProps {
  locker: LockerResponse;
  onUpdate?: () => void;
}

export function LockerControls({ locker, onUpdate }: LockerControlsProps) {
  const [loading, setLoading] = useState(false);
  const [unlockReason, setUnlockReason] = useState("");
  const [checkoutReason, setCheckoutReason] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const hasActiveRental = !!locker.currentRental;
  const isExpired =
    locker.currentRental &&
    new Date(locker.currentRental.expiresAt) < new Date();

  const handleAdminUnlock = async () => {
    if (!unlockReason.trim()) {
      setMessage({
        type: "error",
        text: "Please provide a reason for unlocking",
      });
      return;
    }

    try {
      setLoading(true);
      await lockersApi.adminUnlock(locker.id, {
        lockerId: locker.id,
        reason: unlockReason,
      });

      setMessage({ type: "success", text: "Locker unlocked successfully" });
      setUnlockReason("");
      onUpdate?.();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to unlock locker",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForceCheckout = async () => {
    if (!locker.currentRental) return;

    if (!checkoutReason.trim()) {
      setMessage({
        type: "error",
        text: "Please provide a reason for force checkout",
      });
      return;
    }

    try {
      setLoading(true);
      await lockersApi.forceCheckout({
        rentalId: locker.currentRental.id,
        reason: checkoutReason,
      });

      setMessage({ type: "success", text: "Rental checked out successfully" });
      setCheckoutReason("");
      onUpdate?.();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to checkout rental",
      });
    } finally {
      setLoading(false);
    }
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
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Admin Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Current Rental Status */}
        {hasActiveRental && locker.currentRental ? (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Current Rental</h4>
              <Badge variant={isExpired ? "destructive" : "secondary"}>
                {isExpired ? "Expired" : "Active"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <strong>User:</strong> {locker.currentRental.user.name} (
                {locker.currentRental.user.email})
              </div>
              <div>
                <strong>Started:</strong>{" "}
                {new Date(locker.currentRental.startDate).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className={isExpired ? "text-red-600 font-medium" : ""}>
                  {getTimeRemaining()}
                </span>
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {locker.currentRental.isLocked ? "Locked" : "Unlocked"}
              </div>
            </div>

            {isExpired && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This rental has expired and may require manual intervention.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="p-4 border rounded-lg text-center text-muted-foreground">
            No active rental
          </div>
        )}

        {/* Admin Unlock */}
        <div className="space-y-3">
          <Label htmlFor="unlock-reason">Emergency Unlock</Label>
          <Textarea
            id="unlock-reason"
            placeholder="Provide a reason for emergency unlock..."
            value={unlockReason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setUnlockReason(e.target.value)
            }
            rows={2}
          />
          <Button
            onClick={handleAdminUnlock}
            disabled={loading || !unlockReason.trim()}
            variant="outline"
            className="w-full gap-2"
          >
            <Unlock className="w-4 h-4" />
            Emergency Unlock
          </Button>
        </div>

        {/* Force Checkout */}
        {hasActiveRental && locker.currentRental && (
          <div className="space-y-3">
            <Label htmlFor="checkout-reason">Force Checkout</Label>
            <Textarea
              id="checkout-reason"
              placeholder="Provide a reason for force checkout..."
              value={checkoutReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setCheckoutReason(e.target.value)
              }
              rows={2}
            />
            <Button
              onClick={handleForceCheckout}
              disabled={loading || !checkoutReason.trim()}
              variant="destructive"
              className="w-full gap-2"
            >
              <UserX className="w-4 h-4" />
              Force Checkout
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          All admin actions are logged for security and audit purposes.
        </div>
      </CardContent>
    </Card>
  );
}
