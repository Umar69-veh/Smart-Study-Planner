import React from "react";

export default function WelcomePage({ onLogin, onSignup }) {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 24,
          alignItems: "center",
        }}
        className="welcome-grid"
      >
        <div>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              boxShadow: "var(--glow-primary)",
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
            }}
          >
            Welcome to Smart Study Planner
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.8, maxWidth: 520 }}>
            Your AI-powered study assistant for smarter learning.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
            <button
              onClick={onLogin}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Login
            </button>
            <button
              onClick={onSignup}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: "linear-gradient(135deg, var(--accent-primary), #9b8fff)",
                color: "white",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                boxShadow: "0 10px 30px rgba(124,106,247,0.25)",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Sign Up
            </button>
          </div>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {["💬 AI chat", "📚 Study planning", "🎯 Quizzes", "🧠 Personalized help"].map((x) => (
              <span
                key={x}
                style={{
                  padding: "6px 12px",
                  borderRadius: 9999,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: 12.5,
                  color: "var(--text-secondary)",
                  fontWeight: 650,
                }}
              >
                {x}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, rgba(124,106,247,0.08), transparent)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 24,
            padding: 18,
            boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {[{ h: "Learn faster", p: "Get explanations, examples, and quizzes." }, { h: "Stay organized", p: "Track topics and progress." }, { h: "Always ready", p: "Ask in seconds and continue anytime." }].map(
              (card) => (
                <div
                  key={card.h}
                  style={{
                    padding: 14,
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(124,106,247,0.15)",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, letterSpacing: "-0.03em" }}>
                    {card.h}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>{card.p}</div>
                </div>
              )
            )}
          </div>

          <div style={{ marginTop: 18, color: "var(--text-muted)", fontSize: 12.5, lineHeight: 1.7 }}>
            By signing up, you’ll be able to access the AI chat and keep your study sessions.
          </div>
        </div>
      </div>
    </div>
  );
}

