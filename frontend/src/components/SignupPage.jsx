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
    [email],
  );

  const pwOk = useMemo(() => password.trim().length > 0, [password]);

  const confirmOk = useMemo(
    () => confirmPassword && confirmPassword === password,
    [confirmPassword, password],
  );

  const submit = async () => {
    setLocalError(null);

    if (!firstName.trim()) return setLocalError("First name is required.");
    if (!lastName.trim()) return setLocalError("Last name is required.");
    if (!emailOk) return setLocalError("Enter a valid email address.");
    if (!pwOk) return setLocalError("Password cannot be empty.");
    if (!confirmOk)
      return setLocalError("Confirm password must match password.");

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
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* ================= NAVBAR ================= */}

      <header
        style={{
          height: 74,
          background: "#FFFFFF",
          borderBottom: "1px solid #D1D5DB",
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
                fontFamily: "inherit",
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
              background: "#FFFFFF",

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
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
          minHeight: "calc(100vh - 74px)",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 450,
            background: "#FFFFFF",
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
              color: "#9CA3AF",
              marginBottom: 30,
            }}
          >
            Sign up to start learning with Smart Study Planner
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
                  color: "#fff",
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
                  color: "#fff",
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
                  background: "#FFFFFF",

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
              background: "linear-gradient(90deg,#23427C,#34C38F)",
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


