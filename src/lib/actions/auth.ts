"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  LoginSchema,
  RegisterAdminSchema,
  AuthResponseSchema,
  type LoginRequest,
  type RegisterAdminRequest,
} from "../schemas/auth";
import {
  API_CONFIG,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
} from "../config/api";

export async function loginAction(data: LoginRequest) {
  try {
    // Validate input
    const validatedData = LoginSchema.parse(data);

    // Make API request to your server
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/v1/admin/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Login failed",
      };
    }

    const authResponse = await response.json();
    const validatedResponse = AuthResponseSchema.parse(authResponse);

    // Set the server-signed JWT token in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(
      AUTH_COOKIE_NAME,
      validatedResponse.token,
      AUTH_COOKIE_OPTIONS
    );

    return {
      success: true,
      user: validatedResponse.user,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Logout failed",
    };
  }
}

export async function redirectToLogin() {
  redirect("/login");
}

export async function redirectToDashboard() {
  redirect("/dashboard");
}

export async function registerAction(data: RegisterAdminRequest) {
  try {
    // Validate input
    const validatedData = RegisterAdminSchema.parse(data);

    // Make API request to your server
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/v1/admin/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Registration failed",
      };
    }

    const authResponse = await response.json();
    const validatedResponse = AuthResponseSchema.parse(authResponse);

    // Set the server-signed JWT token in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(
      AUTH_COOKIE_NAME,
      validatedResponse.token,
      AUTH_COOKIE_OPTIONS
    );

    return {
      success: true,
      user: validatedResponse.user,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}
