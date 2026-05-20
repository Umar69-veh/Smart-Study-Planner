import React from "react";

const STARTER_PROMPTS = [
  { emoji: "⚛️", title: "Explain Quantum Entanglement", sub: "Simple analogy + examples" },
  { emoji: "🔁", title: "What is recursion?", sub: "With code examples in Python" },
  { emoji: "📐", title: "Explain Bayes' Theorem", sub: "Step-by-step with a real example" },
  { emoji: "🧬", title: "How does DNA replication work?", sub: "Visual walkthrough" },
  { emoji: "🌍", title: "What caused World War I?", sub: "Key causes and timeline" },
  { emoji: "📊", title: "Quiz me on Data Structures", sub: "Arrays, linked lists, trees" },
];

export default function WelcomeScreen({ onSend }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        animation: "fadeIn 0.5s ease",
      }}
    >
      {/* Hero */}
      <div
        style={{
          width: 72, height: 72,
          background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
          borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36,
          marginBottom: 20,
          boxShadow: "var(--glow-primary)",
        }}
      >
        🧠
      </div>

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          textAlign: "center",
          marginBottom: 8,
          background: "linear-gradient(135deg, var(--text-primary), var(--accent-primary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Your AI Study Partner
      </h2>

      <p
        style={{
          color: "var(--text-muted)",
          textAlign: "center",
          fontSize: 14,
          maxWidth: 380,
          lineHeight: 1.7,
          marginBottom: 36,
        }}
      >
        Ask any academic question. Get clear explanations, real examples, and instant quizzes.
        Adjust difficulty to match your level.
      </p>

      {/* Feature pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
        {["💬 Context-aware", "📚 Multi-subject", "🎯 Adjustable difficulty", "📝 Quiz generator"].map((f) => (
          <span
            key={f}
            style={{
              padding: "5px 12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 20,
              fontSize: 12,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Starter prompts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 10,
          width: "100%",
          maxWidth: 680,
        }}
      >
        {STARTER_PROMPTS.map((p) => (
          <button
            key={p.title}
            onClick={() => onSend(p.title)}
            style={{
              padding: "12px 14px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              textAlign: "left",
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-primary)";
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.background = "var(--bg-elevated)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 4 }}>{p.emoji}</div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", marginBottom: 2 }}>
              {p.title}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
