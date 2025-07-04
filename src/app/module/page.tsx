import React from "react";
import { ModulesPageClient } from "@/components/modules/ModulesPageClient";
import { getModulesAction } from "@/lib/actions/modules";
import type { ModuleResponse } from "@/lib/schemas/modules";

const ModulesPage = async () => {
  let modules: ModuleResponse[];
  let error = null;

  try {
    modules = await getModulesAction();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch modules";
    modules = [];
  }

  return <ModulesPageClient initialModules={modules} initialError={error} />;
};

export default ModulesPage;
