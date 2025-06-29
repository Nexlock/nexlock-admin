import { apiClient } from "./client";
import type {
  LockerResponse,
  LockerStatus,
  LockerStats,
  AdminUnlockRequest,
  ForceCheckoutRequest,
} from "../schemas/lockers";

export const lockersApi = {
  getLockersByModule(
    moduleId: string,
    token?: string
  ): Promise<LockerResponse[]> {
    return apiClient.get<LockerResponse[]>(
      `/api/v1/admin/modules/${moduleId}/lockers`,
      token
    );
  },

  getLockerById(lockerId: string, token?: string): Promise<LockerResponse> {
    return apiClient.get<LockerResponse>(
      `/api/v1/admin/lockers/${lockerId}`,
      token
    );
  },

  getLockerStatuses(
    moduleId?: string,
    token?: string
  ): Promise<LockerStatus[]> {
    const endpoint = moduleId
      ? `/api/v1/admin/lockers/status?moduleId=${moduleId}`
      : `/api/v1/admin/lockers/status`;
    return apiClient.get<LockerStatus[]>(endpoint, token);
  },

  getLockerStats(moduleId?: string, token?: string): Promise<LockerStats> {
    const endpoint = moduleId
      ? `/api/v1/admin/lockers/stats?moduleId=${moduleId}`
      : `/api/v1/admin/lockers/stats`;
    return apiClient.get<LockerStats>(endpoint, token);
  },

  adminUnlock(
    lockerId: string,
    data: AdminUnlockRequest,
    token?: string
  ): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(
      `/api/v1/admin/lockers/${lockerId}/unlock`,
      data,
      token
    );
  },

  forceCheckout(
    data: ForceCheckoutRequest,
    token?: string
  ): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(
      `/api/v1/admin/rentals/force-checkout`,
      data,
      token
    );
  },

  getRentalHistory(
    lockerId: string,
    token?: string
  ): Promise<LockerResponse["rentals"]> {
    return apiClient.get<LockerResponse["rentals"]>(
      `/api/v1/admin/lockers/${lockerId}/rentals`,
      token
    );
  },
};
