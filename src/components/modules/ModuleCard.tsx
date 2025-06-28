import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Monitor, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ModuleResponse } from "@/lib/schemas/modules";

interface ModuleCardProps {
  module: ModuleResponse;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const lockerCount = module.lockers?.length || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{module.name}</CardTitle>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Monitor className="w-3 h-3" />
          {module.deviceId}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {module.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {module.location}
            </div>
          )}

          {module.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {module.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">
                {lockerCount} {lockerCount === 1 ? "Locker" : "Lockers"}
              </span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {module.createdAt.toLocaleDateString()}
              </div>
            </div>

            <Link href={`/module/${module.id}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                View Details
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
