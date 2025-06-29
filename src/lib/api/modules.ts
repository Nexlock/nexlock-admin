import { apiClient } from "./client";
import type { ModuleResponse } from "../schemas/modules";

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
};
