import React from "react";

const DIFFICULTIES = [
  { value: "simple", label: "Simple", emoji: "🌱", desc: "ELI10 mode" },
  { value: "medium", label: "Medium", emoji: "📘", desc: "High school+" },
  { value: "advanced", label: "Advanced", emoji: "🎓", desc: "College level" },
];

const TOPICS = [
  { value: "General", emoji: "🌐" },
  { value: "Mathematics", emoji: "📐" },
  { value: "Computer Science", emoji: "💻" },
  { value: "Science", emoji: "🔬" },
  { value: "History", emoji: "📜" },
  { value: "Language", emoji: "✍️" },
  { value: "Other", emoji: "📚" },
];

export default function SettingsBar({ settings, onUpdate, disabled }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        padding: "8px 16px",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-subtle)",
        overflowX: "auto",
        flexWrap: "wrap",
      }}
    >
      {/* Difficulty */}
      <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Level:
        </span>
        <select
          value={settings.difficulty}
          disabled={disabled}
          onChange={(e) => onUpdate({ difficulty: e.target.value })}
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 20,
            color: "var(--text-secondary)",
            padding: "4px 10px",
            fontSize: 11.5,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            cursor: disabled ? "not-allowed" : "pointer",
            outline: "none",
          }}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.emoji} {d.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: 1, height: 20, background: "var(--border-subtle)", flexShrink: 0 }} />

      {/* Topic */}
      <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Topic:
        </span>
        <select
          value={settings.topic}
          disabled={disabled}
          onChange={(e) => onUpdate({ topic: e.target.value })}
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 20,
            color: "var(--text-secondary)",
            padding: "4px 10px",
            fontSize: 11.5,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            cursor: disabled ? "not-allowed" : "pointer",
            outline: "none",
          }}
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.emoji} {t.value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
