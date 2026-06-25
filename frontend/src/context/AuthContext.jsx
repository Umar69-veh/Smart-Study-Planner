import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import API_URL from "../config/api";
import axios from "axios";

const AuthContext = createContext(null);

const RAILWAY_FALLBACK = "https://smart-study-planner-production-032d.up.railway.app";

const resolveApiOrigin = () => {
  if (API_URL) return API_URL;
  if (typeof window === "undefined") return "/api";

  const host = window.location.hostname || "";
  if (host.endsWith("vercel.app") || host.endsWith("now.sh")) return RAILWAY_FALLBACK;
  return "";
};

const createAxios = () => {
  const origin = resolveApiOrigin();
  const baseURL = origin ? `${origin}/api` : "/api";

  return axios.create({
    baseURL,
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
  });
};

const api = createAxios();
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ssp_auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const TOKEN_KEY = "ssp_auth_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TOKEN_KEY);
      if (saved) {
        setToken(saved);
        // We don't verify token here; backend will. Decode payload would be nicer, but keep it simple.
      }
    } catch {
      // ignore
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthError(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setAuthError(null);
    const res = await api.post("/auth/login", { email, password });
    const { token: t, user: u } = res.data?.data || {};
    if (!t) throw new Error("Login failed. No token returned.");

    setToken(t);
    setUser(u || null);

    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, t);
    } else {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        // ignore
      }
    }

    return { token: t, user: u };
  }, []);

  const signup = useCallback(async (payload) => {
    setAuthError(null);
    const res = await api.post("/auth/signup", payload);
    const { token: t, user: u } = res.data?.data || {};
    if (!t) throw new Error("Signup failed. No token returned.");

    setToken(t);
    setUser(u || null);

    if (payload?.rememberMe) {
      localStorage.setItem(TOKEN_KEY, t);
    } else {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        // ignore
      }
    }

    return { token: t, user: u };
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      authLoading,
      authError,
      setAuthError,
      login,
      signup,
      logout,
      isAuthenticated: !!token,
    }),
    [token, user, authLoading, authError, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;

