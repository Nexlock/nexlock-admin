"use server";

import { cookies } from "next/headers";
import { API_CONFIG, AUTH_COOKIE_NAME } from "../config/api";
import type { ModuleResponse, ModuleStatus } from "../schemas/modules";

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

  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
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
      if (key === "createdAt" || key === "updatedAt") {
        transformed[key] = typeof value === "string" ? new Date(value) : value;
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

export async function getModulesAction(): Promise<ModuleResponse[]> {
  return makeAuthenticatedRequest<ModuleResponse[]>("/api/v1/admin/modules");
}

export async function getModuleByIdAction(id: string): Promise<ModuleResponse> {
  return makeAuthenticatedRequest<ModuleResponse>(
    `/api/v1/admin/modules/${id}`
  );
}

export async function updateModuleAction(
  id: string,
  data: { name?: string; description?: string; location?: string }
): Promise<ModuleResponse> {
  return makeAuthenticatedRequest<ModuleResponse>(
    `/api/v1/admin/modules/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function getModuleStatusAction(id: string): Promise<ModuleStatus> {
  return makeAuthenticatedRequest<ModuleStatus>(
    `/api/v1/admin/modules/${id}/status`
  );
}
