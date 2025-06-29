import { apiClient } from "./client";
import type { ModuleResponse, ModuleStatus } from "../schemas/modules";

export const modulesApi = {
  getModules(token?: string): Promise<ModuleResponse[]> {
    return apiClient.get<ModuleResponse[]>("/api/v1/admin/modules", token);
  },

  getModuleById(id: string, token?: string): Promise<ModuleResponse> {
    return apiClient.get<ModuleResponse>(`/api/v1/admin/modules/${id}`, token);
  },

  updateModule(
    id: string,
    data: { name?: string; description?: string; location?: string },
    token?: string
  ): Promise<ModuleResponse> {
    return apiClient.put<ModuleResponse>(
      `/api/v1/admin/modules/${id}`,
      data,
      token
    );
  },

  getModuleStatus(moduleId: string, token?: string): Promise<ModuleStatus> {
    return apiClient.get<ModuleStatus>(
      `/api/v1/admin/modules/${moduleId}/status`,
      token
    );
  },
};
