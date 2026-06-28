import axios from "axios";
import API_URL from "../config/api";

const RAILWAY_FALLBACK =
  "https://smart-study-planner-production-032d.up.railway.app";

// Resolve backend URL
const resolveApiOrigin = () => {
  if (API_URL) return API_URL;

  if (typeof window === "undefined") return "/api";

  const host = window.location.hostname || "";

  if (host.endsWith("vercel.app") || host.endsWith("now.sh")) {
    return RAILWAY_FALLBACK;
  }

  // Local development
  return "";
};

const createAxios = (authToken = null) => {
  const origin = resolveApiOrigin();
  const baseURL = origin ? `${origin}/api` : "/api";

  const instance = axios.create({
    baseURL,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
      ...(authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {}),
    },
  });

  // Request Interceptor (Debug)
  instance.interceptors.request.use(
    (config) => {
      console.log("➡️ Request:", config.url);
      console.log("🔑 Token:", authToken);

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error("API Error:", error.response);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        (error.code === "ECONNABORTED"
          ? "Request timed out."
          : "Network Error");

      return Promise.reject(new Error(message));
    }
  );

  return instance;
};

// ==============================
// Chat APIs
// ==============================

export const sendMessage = (payload, token) =>
  createAxios(token).post("/chat", payload);

export const getSessions = (token) =>
  createAxios(token).get("/chat/sessions");

export const getSession = (sessionId, token) =>
  createAxios(token).get(`/chat/sessions/${sessionId}`);

export const deleteSession = (sessionId, token) =>
  createAxios(token).delete(`/chat/sessions/${sessionId}`);

export const generateQuiz = (topic, difficulty, token) =>
  createAxios(token).post("/chat/quiz", {
    topic,
    difficulty,
  });

export const updateSettings = (sessionId, settings, token) =>
  createAxios(token).patch(
    `/chat/sessions/${sessionId}/settings`,
    settings
  );

export default createAxios;