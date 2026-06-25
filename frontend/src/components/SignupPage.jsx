import React, { useMemo, useState } from "react";

const passwordStrength = (password) => {
  const p = String(password || "");
  return {
    minLen: p.length >= 8,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[^A-Za-z0-9]/.test(p),
  };
};

const allOk = (rules) => Object.values(rules).every(Boolean);

export default function SignupPage({ onSignup, onSwitchToLogin, error }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);

  const emailOk = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);
  const rules = useMemo(() => passwordStrength(password), [password]);
  const pwOk = useMemo(() => allOk(rules), [rules]);
  const confirmOk = useMemo(() => confirmPassword && confirmPassword === password, [confirmPassword, password]);

  const submit = async () => {
    setLocalError(null);

    if (!firstName.trim()) return setLocalError("First name is required.");
    if (!lastName.trim()) return setLocalError("Last name is required.");
    if (!emailOk) return setLocalError("Enter a valid email address.");
    if (!password) return setLocalError("Password cannot be empty.");
    if (!pwOk) return setLocalError("Password does not meet complexity requirements.");
    if (!confirmOk) return setLocalError("Confirm password must match password.");
    if (!recaptchaChecked) return setLocalError("Please verify that you are not a robot.");

    try {
      setLoading(true);
      await onSignup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        recaptchaToken: true,
        rememberMe,
      });
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
          maxWidth: 520,
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
            ✨
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, letterSpacing: "-0.03em", fontSize: 22 }}>
              Create your account
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>Join Smart Study Planner</div>
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
            }}
          >
            {error || localError}
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} placeholder="John" />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} placeholder="Doe" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} type="email" placeholder="you@example.com" />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                type={showPw ? "text" : "password"}
                placeholder="Minimum 8 characters..."
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} style={smallBtnStyle}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>

            <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
              <div>Must include:</div>
              <div>• {rules.minLen ? "✅" : "❌"} 8+ chars</div>
              <div>• {rules.upper ? "✅" : "❌"} uppercase</div>
              <div>• {rules.lower ? "✅" : "❌"} lowercase</div>
              <div>• {rules.number ? "✅" : "❌"} number</div>
              <div>• {rules.special ? "✅" : "❌"} special character</div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              type={showPw ? "text" : "password"}
              placeholder="Re-enter password"
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "var(--text-muted)" }}>
              <input type="checkbox" checked={recaptchaChecked} onChange={(e) => setRecaptchaChecked(e.target.checked)} />
              I am not a robot
            </label>
            <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "var(--text-muted)" }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
            </label>
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
            {loading ? "Creating account..." : "Sign Up"}
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
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
              style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: 800 }}
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 12.5,
  color: "var(--text-secondary)",
  fontFamily: "var(--font-display)",
  fontWeight: 800,
};

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

