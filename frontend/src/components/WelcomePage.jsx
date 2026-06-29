import React from "react";

const STARTER_PROMPTS = [
  { emoji: "⚛️", title: "Explain Quantum Entanglement", sub: "Simple analogy + examples" },
  { emoji: "🔁", title: "What is recursion?", sub: "With code examples in Python" },
  { emoji: "📐", title: "Explain Bayes' Theorem", sub: "Step-by-step with a real example" },
  { emoji: "🧬", title: "How does DNA replication work?", sub: "Visual walkthrough" },
  { emoji: "🌍", title: "What caused World War I?", sub: "Key causes and timeline" },
  { emoji: "📊", title: "Quiz me on Data Structures", sub: "Arrays, linked lists, trees" },
];

export default function WelcomePage({ onLogin, onSignup, onSend }) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 74px)",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        width: "100%",
      }}

    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          margin: "0 auto",
          display: "grid",
          gap: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
        className="welcome-grid"
      >
        <div>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              background: "#ffffff",
              boxShadow: "0 15px 40px rgba(0,0,0,.08)",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              marginBottom: 18,
            }}
          >
            🧠
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 46,
              lineHeight: 1.05,
              letterSpacing: "-0.06em",
              marginBottom: 12,
              color: "#10301cff",
              fontWeight: 600,
            }}
          >
            Welcome to Smart Study Planner
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16, lineHeight: 1.8, maxWidth: 520 }}>
            Your AI-powered study assistant for smarter learning.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
            <button
              onClick={onLogin}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                color: "#111827",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Login
            </button>
            <button
              onClick={onSignup}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: "linear-gradient(90deg,#23427C,#34C38F)",
                color: "#fff",
                cursor: "pointer",
              
                fontWeight: 600,
                boxShadow: "0 10px 30px rgba(124,106,247,0.15)",
              }}
            >
              Sign Up
            </button>
          </div>

          <div
            style={{
              marginTop: 22,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {[
              "💬 AI chat",
              "📚 Study planning",
              "🎯 Quizzes",
              "🧠 Personalized help",
            ].map((x) => (
              <span
                key={x}
                style={{
                  padding: "6px 12px",
                  borderRadius: 9999,
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  fontSize: 12.5,
                  color: "#6b7280",
fontWeight: 600,
                    }}
              >
                {x}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            padding: 18,
            boxShadow: "0 18px 60px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { h: "Learn faster", p: "Get explanations, examples, and quizzes." },
              { h: "Stay organized", p: "Track topics and progress." },
              { h: "Always ready", p: "Ask in seconds and continue anytime." },
            ].map((card) => (
              <div
                key={card.h}
                style={{
                  padding: 14,
                  borderRadius: 18,
                  background: "#ffffff",
                  border: "1px solid rgba(124,106,247,0.15)",
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.03em", color: "#111827" }}>
                  {card.h}
                </div>
                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>{card.p}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, color: "#6b7280", fontSize: 12.5, lineHeight: 1.7 }}>
            {onSend ? (
              <>Try starter prompts below to see the experience.</>
            ) : (
              <>By signing up, you’ll be able to access the AI chat and keep your study sessions.</>
            )}
          </div>

          {onSend && (
            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 10,
              }}
            >
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p.title}
                  onClick={() => onSend(p.title)}
                  style={{
                    padding: "12px 14px",
                    background: "#ffffff",
                    border: "1px solid rgba(124, 106, 247, 0.2)",
                    borderRadius: 12,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{p.emoji}</div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#111827",
                      fontFamily: "var(--font-display)",
                      marginBottom: 2,
                    }}
                  >
                    {p.title}
                  </p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>{p.sub}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


