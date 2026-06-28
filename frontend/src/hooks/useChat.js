import { useState, useCallback, useRef } from "react";
import {
  sendMessage,
  getSessions,
  getSession,
  deleteSession,
} from "../utils/api";
import { useAuth } from "../context/AuthContext";

export const useChat = () => {
  const { token } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    difficulty: "medium",
    topic: "General",
  });
  const [sessionTitle, setSessionTitle] = useState("New Chat");

  const abortRef = useRef(null);

  const loadSessions = useCallback(async () => {
    if (!token) return;

    try {
      const res = await getSessions(token);
      setSessions(res.data || []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError(err?.message || String(err));
    }
  }, [token]);

  const loadSession = useCallback(
    async (sessionId) => {
      if (!token) return;

      try {
        const res = await getSession(sessionId, token);

        const session = res.data;

        setActiveSessionId(sessionId);
        setMessages(session.messages || []);
        setSettings({
          difficulty: session.difficulty,
          topic: session.topic,
        });
        setSessionTitle(session.title || "Chat");
        setError(null);
      } catch (err) {
        console.error("Failed to load session:", err);
        setError(err?.message || String(err));
      }
    },
    [token]
  );

  const startNewChat = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
    setSessionTitle("New Chat");
  }, []);

  const sendChat = useCallback(
    async (text) => {
      console.log("TOKEN FROM useChat:", token);

      if (!text.trim() || isLoading) return;

      const userMessage = {
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const payload = {
          message: text.trim(),
          sessionId: activeSessionId || undefined,
          difficulty: settings.difficulty,
          topic: settings.topic,
        };

        const res = await sendMessage(payload, token);

        const { sessionId: newSessionId, response, title } = res.data;

        const botMessage = {
          role: "assistant",
          content: response,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);

        if (!activeSessionId) {
          setActiveSessionId(newSessionId);
          setSessionTitle(title || "New Chat");
          await loadSessions();
        } else if (title) {
          setSessionTitle(title);
        }
      } catch (err) {
        console.error("Send chat error:", err);
        setError(err?.message || String(err));

        // remove optimistic message
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeSessionId,
      isLoading,
      settings,
      loadSessions,
      token,
    ]
  );

  const removeSession = useCallback(
    async (sessionId) => {
      try {
        await deleteSession(sessionId, token);

        setSessions((prev) =>
          prev.filter((s) => s.sessionId !== sessionId)
        );

        if (activeSessionId === sessionId) {
          startNewChat();
        }
      } catch (err) {
        console.error("Remove session error:", err);
        setError(err?.message || String(err));
      }
    },
    [activeSessionId, startNewChat, token]
  );

  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  return {
    sessions,
    activeSessionId,
    messages,
    isLoading,
    error,
    settings,
    sessionTitle,
    loadSessions,
    loadSession,
    startNewChat,
    sendChat,
    removeSession,
    updateSettings,
    setError,
  };
};
