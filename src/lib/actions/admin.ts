"use server";

import { cookies } from "next/headers";
import { API_CONFIG, AUTH_COOKIE_NAME } from "../config/api";
import type { AuthUser } from "../schemas/auth";

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
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error: ${response.status} ${response.statusText}`,
      errorText
    );
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getCurrentAdminAction(): Promise<AuthUser> {
  return makeAuthenticatedRequest<AuthUser>("/api/v1/admin/me");
}
