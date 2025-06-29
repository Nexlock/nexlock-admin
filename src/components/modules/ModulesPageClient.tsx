"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { LoadingSpinner } from "@/components/modules/LoadingSpinner";
import { Search, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { modulesApi } from "@/lib/api/modules";
import type { ModuleResponse } from "@/lib/schemas/modules";

interface ModulesPageClientProps {
  initialModules: ModuleResponse[];
  initialError: string | null;
}

export function ModulesPageClient({
  initialModules,
  initialError,
}: ModulesPageClientProps) {
  const [modules, setModules] = useState<ModuleResponse[]>(initialModules);
  const [error, setError] = useState<string | null>(initialError);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await modulesApi.getModules();
      setModules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch modules");
    } finally {
      setRefreshing(false);
    }
  };

  const filteredModules = modules.filter(
    (module) =>
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
          <p className="text-muted-foreground">
            Manage your locker modules and their configurations
          </p>
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
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Module
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Modules</CardTitle>
            <Badge variant="secondary">
              {filteredModules.length} of {modules.length} modules
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search modules by name, device ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredModules.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {modules.length === 0
                    ? "No modules found"
                    : "No matching modules"}
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {modules.length === 0
                    ? "You haven't added any modules yet. Start by adding your first module."
                    : "Try adjusting your search terms to find the modules you're looking for."}
                </p>
                {modules.length === 0 && (
                  <Button className="mt-4 gap-2">
                    <Plus className="w-4 h-4" />
                    Add Your First Module
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredModules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
