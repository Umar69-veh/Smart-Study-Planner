import axios from "axios";
import API_URL from "../config/api";

const RAILWAY_FALLBACK = "https://smart-study-planner-production-032d.up.railway.app";

// Compute API origin at runtime. This avoids build-time inlining problems when
// VITE_API_URL wasn't provided during the build on Vercel.
const resolveApiOrigin = () => {
  if (API_URL) return API_URL;
  if (typeof window === "undefined") return "/api";

  const host = window.location.hostname || "";
  // If running on a Vercel app domain and no VITE_API_URL was set at build time,
  // default to the Railway backend.
  if (host.endsWith("vercel.app") || host.endsWith("now.sh")) {
    return RAILWAY_FALLBACK;
  }

  // Local dev - use relative path to proxy (Vite dev server)
  return ""; // empty means use relative URLs ('/api/...')
};

const createAxios = () => {
  const origin = resolveApiOrigin();
  const baseURL = origin ? `${origin}/api` : "/api";

  const instance = axios.create({
    baseURL,
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.response.use(
    (res) => res.data,
    (err) => {
      const message =
        err.response?.data?.error ||
        (err.code === "ECONNABORTED" ? "Request timed out. Please try again." : "Network error. Is the server running?");
      return Promise.reject(new Error(message));
    }
  );

  return instance;
};

export const sendMessage = (payload) => createAxios().post("/chat", payload);
export const getSessions = () => createAxios().get("/chat/sessions");
export const getSession = (sessionId) => createAxios().get(`/chat/sessions/${sessionId}`);
export const deleteSession = (sessionId) => createAxios().delete(`/chat/sessions/${sessionId}`);
export const generateQuiz = (topic, difficulty) =>
  createAxios().post("/chat/quiz", { topic, difficulty });
export const updateSettings = (sessionId, settings) =>
  createAxios().patch(`/chat/sessions/${sessionId}/settings`, settings);

export default createAxios();
