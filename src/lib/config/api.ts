export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  endpoints: {
    auth: {
      login: "/api/v1/admin/auth/login",
      register: "/api/v1/admin/auth/register",
    },
    modules: {
      list: "/api/v1/admin/modules",
      create: "/api/v1/admin/modules",
      byId: (id: string) => `/api/v1/admin/modules/${id}`,
      update: (id: string) => `/api/v1/admin/modules/${id}`,
      delete: (id: string) => `/api/v1/admin/modules/${id}`,
      lockers: (id: string) => `/api/v1/admin/modules/${id}/lockers`,
    },
    lockers: {
      byId: (id: string) => `/api/v1/admin/lockers/${id}`,
      status: "/api/v1/admin/lockers/status",
      stats: "/api/v1/admin/lockers/stats",
      unlock: (id: string) => `/api/v1/admin/lockers/${id}/unlock`,
      rentals: (id: string) => `/api/v1/admin/lockers/${id}/rentals`,
    },
    rentals: {
      list: "/api/v1/rentals",
      forceCheckout: "/api/v1/admin/rentals/force-checkout",
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
