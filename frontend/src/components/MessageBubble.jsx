import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

export default function MessageBubble({ message, isLatest }) {
  const isUser = message.role === "user";
  const timestamp = message.timestamp ? format(new Date(message.timestamp), "h:mm a") : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 10,
        alignItems: "flex-start",
        animation: isLatest ? "fadeSlideUp 0.3s ease" : "none",
        marginBottom: 4,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          background: isUser
            ? "linear-gradient(135deg, var(--accent-primary), #9b8fff)"
            : "linear-gradient(135deg, #1e2a3a, #2a3a4a)",
          border: isUser ? "none" : "1px solid var(--border-medium)",
        }}
      >
        {isUser ? "👤" : "🧠"}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "80%", minWidth: 0 }}>
        {/* Name + time */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 4,
            flexDirection: isUser ? "row-reverse" : "row",
          }}
        >
          <span
            style={{
              fontSize: 11.5,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: isUser ? "var(--accent-primary)" : "var(--accent-secondary)",
              letterSpacing: "0.02em",
            }}
          >
            {isUser ? "You" : "StudyMind"}
          </span>
          <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{timestamp}</span>
        </div>

        {/* Bubble */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
            background: isUser
              ? "linear-gradient(135deg, var(--accent-primary), #8a7af5)"
              : "var(--bg-elevated)",
            border: isUser ? "none" : "1px solid var(--border-subtle)",
            color: isUser ? "white" : "var(--text-primary)",
            fontSize: 14,
            lineHeight: 1.65,
            boxShadow: isUser
              ? "0 4px 16px rgba(124, 106, 247, 0.25)"
              : "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {isUser ? (
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{message.content}</p>
          ) : (
            <div className="message-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
