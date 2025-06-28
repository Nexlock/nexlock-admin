"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockerCard } from "@/components/lockers/LockerCard";
import { LockerStatsComponent } from "@/components/lockers/LockerStats";
import { LoadingSpinner } from "@/components/modules/LoadingSpinner";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  AlertCircle,
  Filter,
  Download,
} from "lucide-react";
import { lockersApi } from "@/lib/api/lockers";
import { modulesApi } from "@/lib/api/modules";
import type {
  LockerResponse,
  LockerStatus,
  LockerStats,
} from "@/lib/schemas/lockers";
import type { ModuleResponse } from "@/lib/schemas/modules";

const LockersPage = async ({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) => {
  const { moduleId } = await params;
  const router = useRouter();
  const [module, setModule] = useState<ModuleResponse | null>(null);
  const [lockers, setLockers] = useState<LockerResponse[]>([]);
  const [statuses, setStatuses] = useState<LockerStatus[]>([]);
  const [stats, setStats] = useState<LockerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "occupied" | "offline"
  >("all");

  const fetchData = async () => {
    try {
      setError(null);
      const [moduleData, lockersData, statusesData, statsData] =
        await Promise.all([
          modulesApi.getModuleById(moduleId),
          lockersApi.getLockersByModule(moduleId),
          lockersApi.getLockerStatuses(moduleId),
          lockersApi.getLockerStats(moduleId),
        ]);

      setModule(moduleData);
      setLockers(lockersData);
      setStatuses(statusesData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const getLockerStatus = (lockerId: string) => {
    return statuses.find((s) => s.lockerId === lockerId);
  };

  const filteredLockers = lockers.filter((locker) => {
    const matchesSearch =
      locker.lockerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locker.currentRental?.user.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      locker.currentRental?.user.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const status = getLockerStatus(locker.lockerId);

    switch (statusFilter) {
      case "available":
        return !locker.currentRental && status?.isOnline;
      case "occupied":
        return !!locker.currentRental;
      case "offline":
        return !status?.isOnline;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading lockers...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
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
          <AlertDescription>{error || "Module not found"}</AlertDescription>
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
              {module.name} - Lockers
            </h1>
            <p className="text-muted-foreground">
              Manage individual lockers and their rentals
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && <LockerStatsComponent stats={stats} />}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Lockers</CardTitle>
            <Badge variant="secondary">
              {filteredLockers.length} of {lockers.length} lockers
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by locker ID or renter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            {/* Lockers Grid */}
            {filteredLockers.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {lockers.length === 0
                    ? "No lockers found"
                    : "No matching lockers"}
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {lockers.length === 0
                    ? "This module doesn't have any lockers configured yet."
                    : "Try adjusting your search terms or filters."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLockers.map((locker) => (
                  <LockerCard
                    key={locker.id}
                    locker={locker}
                    status={getLockerStatus(locker.lockerId)}
                    moduleId={moduleId}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LockersPage;
