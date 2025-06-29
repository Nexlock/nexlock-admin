import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, API_CONFIG } from "../config/api";
import type { AuthUser } from "../schemas/auth";

export async function getTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const token = await getTokenFromCookies();

    if (!token) {
      return null;
    }

    // Let the server verify the token by making an API call
    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/admin/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user as AuthUser;
  } catch {
    // Token is invalid or expired, server rejected it
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.type !== "admin") {
    throw new Error("Admin access required");
  }

  return user;
}
