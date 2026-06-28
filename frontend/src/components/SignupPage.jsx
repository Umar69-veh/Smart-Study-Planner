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
  const [rememberMe, setRememberMe] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  const pwOk = useMemo(() => password.trim().length > 0, [password]);

  const confirmOk = useMemo(
    () => confirmPassword && confirmPassword === password,
    [confirmPassword, password]
  );

  const submit = async () => {
    setLocalError(null);

    if (!firstName.trim()) return setLocalError("First name is required.");
    if (!lastName.trim()) return setLocalError("Last name is required.");
    if (!emailOk) return setLocalError("Enter a valid email address.");
    if (!pwOk) return setLocalError("Password cannot be empty.");
    if (!confirmOk) return setLocalError("Confirm password must match password.");

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
              background: "linear-gradient(135deg,#7c6af7,#56cfb2)",
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

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <button
            onClick={onSwitchToLogin}
            style={{
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
              padding: "12px 22px",
              borderRadius: 14,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Sign In
          </button>

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
        </div>
      </header>

      {/* ================= SIGNUP AREA ================= */}

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
            Create Account
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginBottom: 30,
            }}
          >
            Sign up to start learning with Smart Study Planner
          </p>

          {(error || localError) && (
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

          {/* First / Last */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
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

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
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
          </div>

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

            <div style={{ display: "flex", gap: 10 }}>
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

          {/* Confirm */}

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#374151",
                fontWeight: 600,
              }}
            >
              Confirm Password
            </label>

            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPw ? "text" : "password"}
              placeholder="Re-enter password"
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
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <span />
          </div>

          {/* SIGN UP */}

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
            {loading ? "Creating..." : "Sign Up"}
          </button>

          {/* Bottom text */}

          <div
            style={{
              textAlign: "center",
              marginTop: 18,
              color: "#6B7280",
            }}
          >
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
              style={{
                color: "#7C6AF7",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Log In
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

