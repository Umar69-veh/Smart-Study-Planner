import React, { useMemo, useState } from "react";

export default function LoginPage({ onLogin, onSwitchToSignup, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const pwRulesOk = useMemo(() => password.trim().length > 0, [password]);
  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  const submit = async () => {
    setLocalError(null);

    if (!emailOk) return setLocalError("Enter a valid email address.");
    if (!pwRulesOk) return setLocalError("Password cannot be empty.");

    try {
      setLoading(true);
      await onLogin({
        email: email.trim(),
        password,
        rememberMe,
      });
    } catch (e) {
      setLocalError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* ================= NAVBAR ================= */}

      <header
        style={{
          height: 74,
          background: "var(--bg-primary)",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 60px",
          width: "100%",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background:
                "linear-gradient(135deg,#7c6af7,#56cfb2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: "bold",
            }}
          >
            📚
          </div>

          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#111827",
                fontFamily: "var(--font-display)",
              }}
            >
              Smart Study Planner
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              AI Powered Learning
            </div>
          </div>
        </div>

        <button
          style={{
            background: "linear-gradient(90deg,#23427C,#34C38F)",
            color: "#fff",
            border: "none",
            padding: "12px 22px",
            borderRadius: 14,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Get Started
        </button>
      </header>

      {/* ================= LOGIN AREA ================= */}

      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
          minHeight: "calc(100vh - 74px)",
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: 450,
            background: "var(--bg-primary)",
            borderRadius: 24,
            padding: 35,

            boxShadow: "0 15px 40px rgba(0,0,0,.08)",
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#237541ff",
            }}
          >
            Welcome Back
          </h1>


          <p
            style={{
              color: "#6b7280",
              marginBottom: 30,
            }}
          >
            Sign in to continue using Smart Study Planner
          </p>
          {(error || localError) && (
            <div
              style={{
                background: "rgba(240, 106, 106, 0.12)",
                color: "#f06a6a",
                padding: "12px",
                borderRadius: 12,
                marginBottom: 20,
                fontSize: 14,
              }}
            >
              {error || localError}
            </div>
          )}

          {/* Email */}

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
              color: "#374151",
              fontWeight: 600,
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Example@gmail.com"
            style={{
                width: "100%",
                padding: "14px",
                borderRadius: 14,
                border: "1px solid #D1D5DB",
                outline: "none",
                fontSize: 15,
                background: "var(--bg-primary)",
                color: "#111827",
              }}

              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124, 106, 247, 0.15)";
                e.currentTarget.style.borderColor = "#7c6af7";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#D1D5DB";
              }}
            />
          </div>

          {/* Password */}

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              Password
            </label>

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPw ? "text" : "password"}
                placeholder="Enter password"
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 14,
                  border: "1px solid var(--border-subtle)",
                  outline: "none",
                  fontSize: 15,
                background: "var(--bg-primary)",
                color: "#111827",

                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 3px var(--glow-primary)";
                  e.currentTarget.style.borderColor = "var(--accent-primary)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                }}
              />

              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  width: 70,
                  borderRadius: 14,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-elevated)",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-elevated)";
                }}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 25,
              fontSize: 14,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--text-muted)",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "var(--accent-primary)" }}
              />
              Remember me
            </label>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  color: "var(--accent-primary)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Forgot Password?
              </a>
          </div>

          {/* LOGIN */}

          <button
            onClick={submit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              background:
                "linear-gradient(90deg,#23427C,#34C38F)",
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Signup */}

          <div
            style={{
              textAlign: "center",
              marginTop: 24,
              color: "var(--text-muted)",
            }}
          >
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToSignup();
              }}
              style={{
                color: "var(--accent-primary)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Create Account
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}