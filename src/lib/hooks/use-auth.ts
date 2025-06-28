"use client";

import { useAuth } from "../providers/auth-provider";

export function useAuthUser() {
  const { user, isLoading, logout, setUser } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.type === "admin",
    logout,
    setUser,
  };
}
