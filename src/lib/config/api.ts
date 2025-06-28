export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  endpoints: {
    auth: {
      login: "/api/v1/admin/login",
      register: "/api/v1/admin/register",
    },
    modules: {
      list: "/api/v1/admin/modules",
      create: "/api/v1/admin/modules",
      delete: (id: string) => `/api/v1/admin/modules/${id}`,
    },
    rentals: {
      list: "/api/v1/rentals",
    },
  },
} as const;

export const AUTH_COOKIE_NAME = "nexlock-admin-token";
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: "/",
};
