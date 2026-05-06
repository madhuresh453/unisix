"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/authService";

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {}
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("uni6ctf_token");
    const storedUser = window.localStorage.getItem("uni6ctf_user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  async function persistSession(result) {
    window.localStorage.setItem("uni6ctf_token", result.token);
    window.localStorage.setItem("uni6ctf_user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result;
  }

  async function signIn(payload) {
    const result = await authService.login(payload);
    return persistSession(result);
  }

  async function signUp(payload) {
    const result = await authService.register(payload);
    return persistSession(result);
  }

  function signOut() {
    window.localStorage.removeItem("uni6ctf_token");
    window.localStorage.removeItem("uni6ctf_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, signIn, signUp, signOut }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
