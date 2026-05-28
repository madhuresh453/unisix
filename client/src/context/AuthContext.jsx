"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/authService";

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  refreshUser: async () => {}
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const storedToken = window.localStorage.getItem("uni6ctf_token");
      const storedUser = window.localStorage.getItem("uni6ctf_user");

      if (storedToken) setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          window.localStorage.removeItem("uni6ctf_user");
        }
      }

      if (!storedToken) {
        if (active) setLoading(false);
        return;
      }

      try {
        const meResult = await authService.me();
        if (!active) return;
        setUser(meResult.user);
        window.localStorage.setItem("uni6ctf_user", JSON.stringify(meResult.user));
      } catch {
        if (!active) return;
        window.localStorage.removeItem("uni6ctf_token");
        window.localStorage.removeItem("uni6ctf_user");
        setToken(null);
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  async function persistSession(result) {
    window.localStorage.setItem("uni6ctf_token", result.token);
    setToken(result.token);
    const meResult = await authService.me().catch(() => ({ user: result.user }));
    window.localStorage.setItem("uni6ctf_user", JSON.stringify(meResult.user));
    setUser(meResult.user);
    return { ...result, user: meResult.user };
  }

  async function signIn(payload) {
    const result = await authService.login(payload);
    return persistSession(result);
  }

  async function signUp(payload) {
    const result = await authService.register(payload);
    return persistSession(result);
  }

  function signOut({ redirectTo = "/" } = {}) {
    window.localStorage.removeItem("uni6ctf_token");
    window.localStorage.removeItem("uni6ctf_user");
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined" && redirectTo) {
      window.location.assign(redirectTo);
    }
  }

  async function refreshUser() {
    if (!token) return null;
    const meResult = await authService.me();
    window.localStorage.setItem("uni6ctf_user", JSON.stringify(meResult.user));
    setUser(meResult.user);
    return meResult.user;
  }

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user?.adminAccess);

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated, isAdmin, signIn, signUp, signOut, refreshUser }),
    [user, token, loading, isAuthenticated, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
