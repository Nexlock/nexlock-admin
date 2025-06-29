"use client";

import { useState } from "react";
import { ModuleInfoCard } from "@/components/modules/ModuleInfoCard";
import { ModuleStatusCard } from "@/components/modules/ModuleStatusCard";
import type { ModuleResponse } from "@/lib/schemas/modules";

interface ModulePageClientProps {
  module: ModuleResponse;
}

export function ModulePageClient({
  module: initialModule,
}: ModulePageClientProps) {
  const [module, setModule] = useState<ModuleResponse>(initialModule);

  const handleModuleUpdate = (updatedModule: ModuleResponse) => {
    setModule(updatedModule);
  };

  return (
    <div className="space-y-6">
      <ModuleInfoCard module={module} onUpdate={handleModuleUpdate} />
      <ModuleStatusCard moduleId={module.id} />
    </div>
  );
}
