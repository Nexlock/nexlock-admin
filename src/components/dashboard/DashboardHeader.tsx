import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Calendar } from "lucide-react";
import type { AuthUser } from "@/lib/schemas/auth";

interface DashboardHeaderProps {
  admin: AuthUser;
}

export function DashboardHeader({ admin }: DashboardHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Welcome back, {admin.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{admin.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last login: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Shield className="w-3 h-3" />
            Administrator
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
