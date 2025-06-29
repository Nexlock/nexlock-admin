import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockerDetailsClient } from "@/components/lockers/LockerDetailsClient";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  getLockerByIdAction,
  getLockerStatusesAction,
} from "@/lib/actions/lockers";
import type { LockerResponse, LockerStatus } from "@/lib/schemas/lockers";

const LockerDetailsPage = async ({
  params,
}: {
  params: Promise<{ moduleId: string; lockerId: string }>;
}) => {
  const { moduleId, lockerId } = await params;

  let locker: LockerResponse | undefined;
  let status: LockerStatus | null = null;
  let error: string | null = null;

  try {
    const [lockerData, statusesData] = await Promise.all([
      getLockerByIdAction(lockerId),
      getLockerStatusesAction(),
    ]);

    locker = lockerData;
    const foundStatus = statusesData.find(
      (s) => s.lockerId === lockerData.lockerId
    );
    status = foundStatus || null;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch locker data";
  }

  if (error || !locker) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href={`/module/${moduleId}/lockers`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Locker not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <LockerDetailsClient
      lockerId={lockerId}
      locker={locker}
      initialStatus={status}
    />
  );
};

export default LockerDetailsPage;
