import React, { useMemo, useState } from "react";

export default function LoginPage({ onLogin, onSwitchToSignup, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const pwRulesOk = useMemo(() => password.trim().length > 0, [password]);
  const emailOk = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);

  const submit = async () => {
    setLocalError(null);
    if (!emailOk) return setLocalError("Enter a valid email address.");
    if (!pwRulesOk) return setLocalError("Password cannot be empty.");

    try {
      setLoading(true);
      await onLogin({ email: email.trim(), password, rememberMe });
    } catch (e) {
      setLocalError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 24,
          padding: 22,
          boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "var(--glow-primary)",
            }}
          >
            🔐
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, letterSpacing: "-0.03em", fontSize: 22 }}>
              Login
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>Access your Smart Study Planner</div>
          </div>
        </div>

        {(error || localError) && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              background: "rgba(240,106,106,0.1)",
              border: "1px solid rgba(240,106,106,0.25)",
              borderRadius: 14,
              color: "#f06a6a",
              fontSize: 13,
              overflowWrap: "anywhere",
            }}
          >
            {error || localError}
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12.5, color: "var(--text-secondary)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12.5, color: "var(--text-secondary)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Password
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPw ? "text" : "password"}
                placeholder="Your password"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={smallBtnStyle}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--text-muted)" }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember Me
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13, color: "var(--accent-primary)", textDecoration: "none" }}>
              Forgot Password?
            </a>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            style={{
              padding: "12px 14px",
              borderRadius: 18,
              border: "none",
              background: loading ? "var(--bg-hover)" : "linear-gradient(135deg, var(--accent-primary), #9b8fff)",
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "var(--transition)",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div style={{ display: "grid", gap: 10 }}>
            <button type="button" style={socialBtnStyle} onClick={() => {}} disabled>
              Continue with Google
            </button>
            <button type="button" style={socialBtnStyle} onClick={() => {}} disabled>
              Continue with Apple
            </button>
          </div>

          <div style={{ marginTop: 4, textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
            Don’t have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }} style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: 800 }}>
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 16,
  padding: "11px 12px",
  outline: "none",
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
};

const smallBtnStyle = {
  width: 74,
  padding: "10px 10px",
  borderRadius: 14,
  border: "1px solid var(--border-subtle)",
  background: "var(--bg-tertiary)",
  color: "var(--text-secondary)",
  cursor: "pointer",
  fontFamily: "var(--font-display)",
  fontWeight: 800,
};

const socialBtnStyle = {
  padding: "11px 14px",
  borderRadius: 18,
  border: "1px solid var(--border-subtle)",
  background: "var(--bg-elevated)",
  color: "var(--text-primary)",
  cursor: "not-allowed",
  fontFamily: "var(--font-display)",
  fontWeight: 900,
};

