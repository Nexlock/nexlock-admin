import { apiClient } from "./client";
import type { ModuleResponse } from "../schemas/modules";

export const modulesApi = {
  async getModules(): Promise<ModuleResponse[]> {
    return apiClient.get<ModuleResponse[]>("/api/v1/admin/modules");
  },

  async getModuleById(id: string): Promise<ModuleResponse> {
    return apiClient.get<ModuleResponse>(`/api/v1/admin/modules/${id}`);
  },

  async updateModule(
    id: string,
    data: { name?: string; description?: string; location?: string }
  ): Promise<ModuleResponse> {
    return apiClient.put<ModuleResponse>(`/api/v1/admin/modules/${id}`, data);
  },
};
