"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Monitor,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Settings,
  Lock,
  Wifi,
  WifiOff,
} from "lucide-react";
import { modulesApi } from "@/lib/api/modules";
import type {
  ModuleResponse,
  UpdateModuleRequest,
} from "@/lib/schemas/modules";

interface ModuleInfoCardProps {
  module: ModuleResponse;
  onUpdate?: (updatedModule: ModuleResponse) => void;
}

export function ModuleInfoCard({ module, onUpdate }: ModuleInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: module.name,
    description: module.description || "",
    location: module.location || "",
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      const updateData: UpdateModuleRequest = {};

      if (formData.name !== module.name) updateData.name = formData.name;
      if (formData.description !== (module.description || "")) {
        updateData.description = formData.description;
      }
      if (formData.location !== (module.location || "")) {
        updateData.location = formData.location;
      }

      if (Object.keys(updateData).length > 0) {
        const updatedModule = await modulesApi.updateModule(
          module.id,
          updateData
        );
        onUpdate?.(updatedModule);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update module:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: module.name,
      description: module.description || "",
      location: module.location || "",
    });
    setIsEditing(false);
  };

  const lockerCount = module.lockers?.length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Module Information
              <Badge
                variant={module.isOnline ? "default" : "secondary"}
                className={`ml-2 gap-1 ${
                  module.isOnline
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {module.isOnline ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                {module.isOnline ? "Online" : "Offline"}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage module details and configuration
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={loading}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Module Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter module name"
              />
            ) : (
              <p className="font-medium">{module.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Device ID</Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {module.deviceId}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location"
              />
            ) : (
              <div className="flex items-center gap-2">
                {module.location ? (
                  <>
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{module.location}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">No location set</span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Lockers</Label>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {lockerCount} {lockerCount === 1 ? "Locker" : "Lockers"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          {isEditing ? (
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter module description"
              rows={3}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {module.description || "No description provided"}
            </p>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created: {module.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Updated: {module.updatedAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
