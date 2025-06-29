"use server";

import { cookies } from "next/headers";
import { API_CONFIG, AUTH_COOKIE_NAME } from "../config/api";
import type {
  LockerResponse,
  LockerStatus,
  LockerStats,
  AdminUnlockRequest,
  ForceCheckoutRequest,
} from "../schemas/lockers";

async function makeAuthenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(`Making request to: ${API_CONFIG.baseUrl}${endpoint}`);

  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  console.log(`Response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error: ${response.status} ${response.statusText}`,
      errorText
    );
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Transform date strings to Date objects
  if (Array.isArray(data)) {
    return data.map(transformDates) as T;
  } else {
    return transformDates(data) as T;
  }
}

function transformDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(transformDates);
  }

  if (typeof obj === "object") {
    const transformed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Handle all date fields
      if (
        key === "createdAt" ||
        key === "updatedAt" ||
        key === "startDate" ||
        key === "expiresAt" ||
        key === "lastUpdate"
      ) {
        transformed[key] =
          value && typeof value === "string" ? new Date(value) : value;
      } else if (typeof value === "object") {
        transformed[key] = transformDates(value);
      } else {
        transformed[key] = value;
      }
    }
    return transformed;
  }

  return obj;
}

export async function getLockersByModuleAction(
  moduleId: string
): Promise<LockerResponse[]> {
  return makeAuthenticatedRequest<LockerResponse[]>(
    `/api/v1/admin/modules/${moduleId}/lockers`
  );
}

export async function getLockerByIdAction(
  lockerId: string
): Promise<LockerResponse> {
  return makeAuthenticatedRequest<LockerResponse>(
    `/api/v1/admin/lockers/${lockerId}`
  );
}

export async function getLockerStatusesAction(
  moduleId?: string
): Promise<LockerStatus[]> {
  const endpoint = moduleId
    ? `/api/v1/admin/lockers/status?moduleId=${moduleId}`
    : `/api/v1/admin/lockers/status`;
  return makeAuthenticatedRequest<LockerStatus[]>(endpoint);
}

export async function getLockerStatsAction(
  moduleId?: string
): Promise<LockerStats> {
  const endpoint = moduleId
    ? `/api/v1/admin/lockers/stats?moduleId=${moduleId}`
    : `/api/v1/admin/lockers/stats`;
  return makeAuthenticatedRequest<LockerStats>(endpoint);
}

export async function adminUnlockAction(
  lockerId: string,
  data: AdminUnlockRequest
): Promise<{ success: boolean }> {
  return makeAuthenticatedRequest<{ success: boolean }>(
    `/api/v1/admin/lockers/${lockerId}/unlock`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function forceCheckoutAction(
  data: ForceCheckoutRequest
): Promise<{ success: boolean }> {
  return makeAuthenticatedRequest<{ success: boolean }>(
    `/api/v1/admin/rentals/force-checkout`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function getRentalHistoryAction(
  lockerId: string
): Promise<LockerResponse["rentals"]> {
  return makeAuthenticatedRequest<LockerResponse["rentals"]>(
    `/api/v1/admin/lockers/${lockerId}/rentals`
  );
}
