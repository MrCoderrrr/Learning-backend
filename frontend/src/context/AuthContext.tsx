import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../lib/api";

export type AuthUser = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore server logout failure and clear local session
    }
    queryClient.setQueryData(["currentUser"], null);
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  const value: AuthContextValue = {
    user: (data as AuthUser) ?? null,
    isLoading,
    refresh,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
