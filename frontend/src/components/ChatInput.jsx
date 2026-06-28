import React, { useState, useRef, useEffect } from "react";

const QUICK_PROMPTS = [
  { label: "📝 Quiz me", text: "Quiz me on what we just discussed" },
  { label: "🔁 Summarize", text: "Summarize the key points in bullet form" },
  { label: "💡 Example", text: "Give me a real-world example" },
  { label: "👶 ELI5", text: "Explain this like I'm 5 years old" },
];

export default function ChatInput({ onSend, isLoading, hasMessages }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        padding: "12px 16px 16px",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* Quick prompts (only when there are messages) */}
      {hasMessages && (
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p.label}
              onClick={() => onSend(p.text)}
              disabled={isLoading}
              style={{
                padding: "4px 10px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 20,
                color: "var(--text-secondary)",
                fontSize: 11.5,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "var(--transition)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = "var(--accent-primary)";
                  e.currentTarget.style.color = "var(--accent-primary)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-lg)",
          padding: "8px 8px 8px 14px",
          transition: "var(--transition)",
          boxShadow: "0 0 0 0 transparent",
        }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(124, 106, 247, 0.2)")}
        onBlur={(e) => (e.currentTarget.style.boxShadow = "0 0 0 0 transparent")}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... try 'Explain recursion with examples'"
          disabled={isLoading}
          rows={1}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            resize: "none",
            color: "var(--text-primary)",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            lineHeight: 1.5,
            padding: "4px 0",
            minHeight: 28,
            maxHeight: 160,
          }}
        />

        <button
          onClick={handleSend}
          disabled={isLoading || !value.trim()}
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            border: "none",
            background:
              isLoading || !value.trim()
                ? "var(--bg-hover)"
                : "linear-gradient(135deg, var(--accent-primary), #9b8fff)",
            cursor: isLoading || !value.trim() ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "var(--transition)",
            flexShrink: 0,
            boxShadow: value.trim() && !isLoading ? "0 4px 12px rgba(124, 106, 247, 0.4)" : "none",
          }}
          title="Send (Enter)"
        >
          {isLoading ? (
            <div
              style={{
                width: 16,
                height: 16,
                border: "2px solid rgba(255,255,255,0.25)",
                borderTopColor: "var(--text-inverse)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="var(--text-inverse)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="var(--text-inverse)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 8 }}>
        Press <kbd style={{ background: "var(--bg-tertiary)", padding: "1px 5px", borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: 10 }}>Enter</kbd> to send ·{" "}
        <kbd style={{ background: "var(--bg-tertiary)", padding: "1px 5px", borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: 10 }}>Shift+Enter</kbd> for newline
      </p>
    </div>
  );
}
