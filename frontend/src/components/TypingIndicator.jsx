import React from "react";

export default function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        animation: "fadeSlideUp 0.3s ease",
      }}
    >
      <div
        style={{
          width: 32, height: 32,
          borderRadius: 10,
          background: "linear-gradient(135deg, #1e2a3a, #2a3a4a)",
          border: "1px solid var(--border-medium)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, flexShrink: 0,
        }}
      >
        🧠
      </div>

      <div>
        <div style={{ fontSize: 11.5, fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--accent-secondary)", marginBottom: 4 }}>
          StudyMind
        </div>
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "4px 16px 16px 16px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            display: "flex", gap: 5, alignItems: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 7, height: 7,
                borderRadius: "50%",
                background: "var(--accent-primary)",
                animation: `bounce 1.2s ease ${i * 0.2}s infinite`,
              }}
            />
          ))}
          <span style={{ marginLeft: 6, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
            Thinking...
          </span>
        </div>
      </div>
    </div>
  );
}
