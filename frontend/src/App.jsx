import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import ChatInput from "./components/ChatInput";
import SettingsBar from "./components/SettingsBar";
import WelcomeScreen from "./components/WelcomeScreen";
import { useChat } from "./hooks/useChat";
import "./styles/globals.css";
import "./styles/responsive.css";

import { AuthProvider as AuthContextProvider, useAuth } from "./context/AuthContext";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

function AppInner() {
  const { user, logout, authLoading, login, signup } = useAuth();

  const {
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
  } = useChat();

  const messagesEndRef = useRef(null);
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authView, setAuthView] = useState("welcome");

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");

    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };


  useEffect(() => {
    if (authLoading) return;
    if (user) return;
    setAuthView("welcome");
  }, [authLoading, user]);

  if (authLoading) {
    return <div style={{ minHeight: "100%", padding: 24 }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div
        data-app-theme={theme}
        style={{
          height: "100%",
          minHeight: "100vh",
          display: "flex",
          background: "var(--bg-primary)",
        }}
      >
        {authView === "welcome" && (
          <WelcomePage
            onLogin={() => setAuthView("login")}
            onSignup={() => setAuthView("signup")}
          />
        )}

        {authView === "login" && (
          <LoginPage
            error={error}
            onLogin={async ({ email, password, rememberMe }) =>
              login({ email, password, rememberMe })
            }
            onSwitchToSignup={() => setAuthView("signup")}
          />
        )}

        {authView === "signup" && (
          <SignupPage
            error={error}
            onSignup={async (payload) => signup(payload)}
            onSwitchToLogin={() => setAuthView("login")}
          />
        )}
      </div>
    );
  }


  return (
    <div
      data-app-theme={theme}
      style={{
        height: "100%",
        display: "flex",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Ambient background blobs */}
      <div
        style={{
          position: "fixed",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,106,247,0.06) 0%, transparent 70%)",
          top: -100,
          right: -100,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(86,207,178,0.05) 0%, transparent 70%)",
          bottom: 0,
          left: 200,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onLoadSessions={loadSessions}
        onSelectSession={loadSession}
        onNewChat={startNewChat}
        onDeleteSession={removeSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <header
          style={{
            padding: "0 16px",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-subtle)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                maxWidth: 300,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {sessionTitle}
            </h2>

            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Hi, {user.firstName}
            </span>

            {activeSessionId && (
              <span
                style={{
                  fontSize: 10.5,
                  background: "rgba(86,207,178,0.12)",
                  color: "var(--accent-secondary)",
                  border: "1px solid rgba(86,207,178,0.25)",
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
              >
                {messages.length} msgs
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              style={iconBtnStyle}
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>

            <button
              onClick={toggleTheme}
              style={iconBtnStyle}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              onClick={logout}
              style={{ ...iconBtnStyle, width: 76 }}
              title="Logout"
            >
              Logout
            </button>
          </div>
        </header>

        <SettingsBar
          settings={settings}
          onUpdate={updateSettings}
          disabled={isLoading}
        />

        {error && (
          <div
            style={{
              padding: "10px 16px",
              background: "rgba(240,106,106,0.1)",
              borderBottom: "1px solid rgba(240,106,106,0.25)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: "fadeSlideUp 0.3s ease",
            }}
          >
            <span style={{ fontSize: 14 }}>⚠️</span>
              <p style={{ fontSize: 13, color: "var(--accent-danger)", flex: 1 }}>{error}</p>
            <button
              onClick={() => setError(null)}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-danger)",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.length === 0 ? (
            <WelcomeScreen onSend={sendChat} />
          ) : (
            <div style={{ padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  message={msg}
                  isLatest={i === messages.length - 1}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput
          onSend={sendChat}
          isLoading={isLoading}
          hasMessages={messages.length > 0}
        />
      </div>
    </div>
  );
}

const iconBtnStyle = {
  width: 32,
  height: 32,
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 8,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  transition: "var(--transition)",
};

export default function App() {
  return (
    <AuthContextProvider>
      <AppInner />
    </AuthContextProvider>
  );
}

