"use client";

import { useState } from "react";
import { ModuleInfoCard } from "@/components/modules/ModuleInfoCard";
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

  return <ModuleInfoCard module={module} onUpdate={handleModuleUpdate} />;
}
