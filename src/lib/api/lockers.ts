import { apiClient } from "./client";
import type {
  LockerResponse,
  LockerStatus,
  LockerStats,
  AdminUnlockRequest,
  ForceCheckoutRequest,
} from "../schemas/lockers";

export const lockersApi = {
  async getLockersByModule(moduleId: string): Promise<LockerResponse[]> {
    return apiClient.get<LockerResponse[]>(
      `/api/v1/admin/modules/${moduleId}/lockers`
    );
  },

  async getLockerById(lockerId: string): Promise<LockerResponse> {
    return apiClient.get<LockerResponse>(`/api/v1/admin/lockers/${lockerId}`);
  },

  async getLockerStatuses(moduleId?: string): Promise<LockerStatus[]> {
    const endpoint = moduleId
      ? `/api/v1/admin/lockers/status?moduleId=${moduleId}`
      : `/api/v1/admin/lockers/status`;
    return apiClient.get<LockerStatus[]>(endpoint);
  },

  async getLockerStats(moduleId?: string): Promise<LockerStats> {
    const endpoint = moduleId
      ? `/api/v1/admin/lockers/stats?moduleId=${moduleId}`
      : `/api/v1/admin/lockers/stats`;
    return apiClient.get<LockerStats>(endpoint);
  },

  async adminUnlock(
    lockerId: string,
    data: AdminUnlockRequest
  ): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(
      `/api/v1/admin/lockers/${lockerId}/unlock`,
      data
    );
  },

  async forceCheckout(
    data: ForceCheckoutRequest
  ): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(
      `/api/v1/admin/rentals/force-checkout`,
      data
    );
  },

  async getRentalHistory(lockerId: string): Promise<LockerResponse["rentals"]> {
    return apiClient.get<LockerResponse["rentals"]>(
      `/api/v1/admin/lockers/${lockerId}/rentals`
    );
  },
};
