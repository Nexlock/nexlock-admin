"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ModuleInfoCard } from "@/components/modules/ModuleInfoCard";
import { LoadingSpinner } from "@/components/modules/LoadingSpinner";
import {
  ArrowLeft,
  Lock,
  Settings,
  Activity,
  AlertCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { modulesApi } from "@/lib/api/modules";
import type { ModuleResponse } from "@/lib/schemas/modules";

const ModuleInfoPage = async ({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) => {
  const { moduleId } = await params;
  const router = useRouter();
  const [module, setModule] = useState<ModuleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModule = async () => {
    try {
      setError(null);
      const data = await modulesApi.getModuleById(moduleId);
      setModule(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch module");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const handleModuleUpdate = (updatedModule: ModuleResponse) => {
    setModule(updatedModule);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading module details...</p>
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

  const lockerCount = module.lockers?.length || 0;

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
            <h1 className="text-3xl font-bold tracking-tight">{module.name}</h1>
            <p className="text-muted-foreground">
              Module ID: {module.deviceId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/module/${moduleId}/lockers`} passHref>
            <Button variant="outline" className="gap-2">
              <Lock className="w-4 h-4" />
              Manage Lockers
            </Button>
          </Link>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Module Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ModuleInfoCard module={module} onUpdate={handleModuleUpdate} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Lockers</span>
                <Badge variant="secondary">{lockerCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="outline" className="text-green-600">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Rentals</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="pt-2 border-t">
                <Link href={`/module/${moduleId}/lockers`} passHref>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Eye className="w-4 h-4" />
                    View All Lockers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleInfoPage;
