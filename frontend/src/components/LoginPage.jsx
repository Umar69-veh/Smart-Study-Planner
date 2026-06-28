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
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ================= NAVBAR ================= */}

      <header
        style={{
          height: 74,
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 60px",
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 450,
            background: "#ffffff",
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
          </p>          {(error || localError) && (
            <div
              style={{
                background: "#FEE2E2",
                color: "#DC2626",
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
              }}
            />
          </div>

          {/* Password */}

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#374151",
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
                  border: "1px solid #D1D5DB",
                  outline: "none",
                  fontSize: 15,
                }}
              />

              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  width: 70,
                  borderRadius: 14,
                  border: "1px solid #D1D5DB",
                  background: "#fff",
                  cursor: "pointer",
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
                color: "#6B7280",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />
              Remember me
            </label>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                color: "#7C6AF7",
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
              color: "#6B7280",
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
                color: "#7C6AF7",
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