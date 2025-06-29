import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Settings, BarChart3, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Manage Modules",
      description: "View and configure your locker modules",
      icon: Package,
      href: "/module",
      primary: true,
    },
    {
      title: "View Analytics",
      description: "Check usage statistics and reports",
      icon: BarChart3,
      href: "/analytics",
      disabled: true,
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      href: "/users",
      disabled: true,
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: Settings,
      href: "/settings",
      disabled: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;

            if (action.disabled) {
              return (
                <div
                  key={action.title}
                  className="flex items-center gap-3 p-3 border rounded-lg opacity-50 cursor-not-allowed"
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Coming soon
                  </div>
                </div>
              );
            }

            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant={action.primary ? "default" : "outline"}
                  className="w-full justify-start gap-3 h-auto p-3"
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-80">
                      {action.description}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
