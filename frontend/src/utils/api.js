import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor for error normalization
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.error ||
      (err.code === "ECONNABORTED" ? "Request timed out. Please try again." : "Network error. Is the server running?");
    return Promise.reject(new Error(message));
  }
);

export const sendMessage = (payload) => api.post("/chat", payload);
export const getSessions = () => api.get("/chat/sessions");
export const getSession = (sessionId) => api.get(`/chat/sessions/${sessionId}`);
export const deleteSession = (sessionId) => api.delete(`/chat/sessions/${sessionId}`);
export const generateQuiz = (topic, difficulty) => api.post("/chat/quiz", { topic, difficulty });
export const updateSettings = (sessionId, settings) =>
  api.patch(`/chat/sessions/${sessionId}/settings`, settings);

export default api;
