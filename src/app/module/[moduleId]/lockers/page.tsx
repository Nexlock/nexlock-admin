import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockersPageClient } from "@/components/lockers/LockersPageClient";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  getLockersByModuleAction,
  getLockerStatusesAction,
  getLockerStatsAction,
} from "@/lib/actions/lockers";
import { getModuleByIdAction } from "@/lib/actions/modules";
import type { ModuleResponse } from "@/lib/schemas/modules";
import type {
  LockerResponse,
  LockerStatus,
  LockerStats,
} from "@/lib/schemas/lockers";

const LockersPage = async ({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) => {
  const { moduleId } = await params;

  let moduleData: ModuleResponse | undefined;
  let lockers: LockerResponse[];
  let statuses: LockerStatus[];
  let stats: LockerStats | null;
  let error: string | null = null;

  try {
    const [moduleResult, lockersData, statusesData, statsData] =
      await Promise.all([
        getModuleByIdAction(moduleId),
        getLockersByModuleAction(moduleId),
        getLockerStatusesAction(moduleId),
        getLockerStatsAction(moduleId),
      ]);

    moduleData = moduleResult;
    lockers = lockersData;
    statuses = statusesData;
    stats = statsData;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch data";
    lockers = [];
    statuses = [];
    stats = null;
  }

  if (error || !moduleData) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href={`/module/${moduleId}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Module not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <LockersPageClient
      moduleId={moduleId}
      module={moduleData}
      initialLockers={lockers}
      initialStatuses={statuses}
      initialStats={stats}
      initialError={error}
    />
  );
};

export default LockersPage;
