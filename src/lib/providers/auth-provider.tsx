"use client";

import { createContext, useContext, useState } from "react";
import { AuthUser } from "../schemas/auth";
import { logoutAction } from "../actions/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAction();
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
