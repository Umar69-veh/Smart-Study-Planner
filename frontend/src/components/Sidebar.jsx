import React, { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

const TOPIC_ICONS = {
  General: "🌐",
  Mathematics: "📐",
  "Computer Science": "💻",
  Science: "🔬",
  History: "📜",
  Language: "✍️",
  Other: "📚",
};

export default function Sidebar({
  sessions,
  activeSessionId,
  onLoadSessions,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  onClose,
}) {
  useEffect(() => {
    onLoadSessions();
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
            display: "block",
          }}
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className="sidebar"
        style={{
          width: "var(--sidebar-width)",
          height: "100%",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 36, height: 36,
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}
            >
              🧠
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, letterSpacing: "-0.03em" }}>
                StudyMind
              </h1>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>AI Study Assistant</p>
            </div>
          </div>

          <button
            onClick={onNewChat}
            style={{
              width: "100%",
              padding: "9px 14px",
              background: "linear-gradient(135deg, var(--accent-primary), #9b8fff)",
              border: "none",
              borderRadius: "var(--radius-md)",
              color: "white",
              font: "600 13px var(--font-display)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "var(--transition)",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <span style={{ fontSize: 15 }}>+</span> New Chat
          </button>
        </div>

        {/* Sessions list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {sessions.length === 0 ? (
            <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              No chat history yet.
              <br />Start a conversation!
            </div>
          ) : (
            sessions.map((session) => (
              <SessionItem
                key={session.sessionId}
                session={session}
                isActive={session.sessionId === activeSessionId}
                onSelect={() => onSelectSession(session.sessionId)}
                onDelete={() => onDeleteSession(session.sessionId)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: 11,
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          Powered by Claude AI · StudyMind v1.0
        </div>
      </aside>
    </>
  );
}

function SessionItem({ session, isActive, onSelect, onDelete }) {
  const [showDelete, setShowDelete] = React.useState(false);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "var(--radius-md)",
        marginBottom: 2,
        background: isActive ? "var(--bg-hover)" : "transparent",
        border: isActive ? "1px solid var(--border-medium)" : "1px solid transparent",
        transition: "var(--transition)",
      }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <button
        onClick={onSelect}
        style={{
          width: "100%",
          padding: "9px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>
          {TOPIC_ICONS[session.topic] || "📚"}
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              fontSize: 12.5,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: isActive ? "var(--font-display)" : "var(--font-body)",
            }}
          >
            {session.title}
          </p>
          <p style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 2 }}>
            {session.messageCount} msgs ·{" "}
            {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
          </p>
        </div>
      </button>

      {showDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{
            position: "absolute",
            right: 8, top: "50%",
            transform: "translateY(-50%)",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 6,
            width: 24, height: 24,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12,
            color: "var(--accent-danger)",
            transition: "var(--transition)",
            animation: "fadeIn 0.15s ease",
          }}
          title="Delete chat"
        >
          ✕
        </button>
      )}
    </div>
  );
}
