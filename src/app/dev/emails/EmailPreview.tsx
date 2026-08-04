"use client";
import { useState } from "react";

/**
 * The preview chrome. Client-side only so the background toggle and the
 * HTML/text switch work without a round trip.
 *
 * Each template renders in an IFRAME with srcDoc, not injected into this
 * page: an email is a whole document with its own <body> styles, and
 * dropping that into the app would let the two stylesheets fight.
 */

export type PreviewTemplate = {
  id: string;
  name: string;
  audience: "visitor" | "sales";
  subject: string;
  note: string;
  html: string;
  text: string;
};

type Mode = "light" | "dark";

export function EmailPreview({ templates }: { templates: PreviewTemplate[] }) {
  const [mode, setMode] = useState<Mode>("light");
  const [showText, setShowText] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: mode === "dark" ? "#1b1b1b" : "#f2f2f0" }}>
      <header style={bar}>
        <div>
          <strong style={{ fontSize: 15 }}>Email previews</strong>
          <span style={{ marginLeft: 10, color: "#666", fontSize: 13 }}>
            dev only · nothing is sent
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            style={btn(mode === "dark")}
          >
            {mode === "light" ? "Light background" : "Dark background"}
          </button>
          <button type="button" onClick={() => setShowText((v) => !v)} style={btn(showText)}>
            {showText ? "Plain text" : "HTML"}
          </button>
        </div>
      </header>

      {mode === "dark" && (
        <p style={warn}>
          Approximation only. Gmail and Outlook each invert differently and
          neither exposes its algorithm. This catches a logo that vanishes or
          text that inverts to nothing; it will not catch anything subtler. Real
          verification is a send to a real inbox.
        </p>
      )}

      <div style={{ padding: "0 20px 60px" }}>
        {templates.map((t) => (
          <section key={t.id} style={{ marginTop: 28 }}>
            <div style={meta}>
              <strong style={{ fontSize: 14 }}>{t.name}</strong>
              <span style={pill}>{t.audience === "visitor" ? "to visitor" : "to sales@"}</span>
              <span style={{ color: "#666", fontSize: 13 }}>
                Subject: <em>{t.subject}</em> · {t.note}
              </span>
            </div>

            {showText ? (
              <pre style={{ ...frame, ...pre, color: mode === "dark" ? "#ddd" : "#222" }}>
                {t.text}
              </pre>
            ) : (
              <iframe
                title={t.name}
                srcDoc={
                  mode === "dark"
                    ? t.html.replace(
                        "</head>",
                        // a crude stand-in for client inversion: flip the
                        // whole document, then flip images back so the logo
                        // does not come out as a negative
                        `<style>html{filter:invert(1) hue-rotate(180deg);background:#111}img{filter:invert(1) hue-rotate(180deg)}</style></head>`
                      )
                    : t.html
                }
                style={{ ...frame, height: t.audience === "visitor" ? 1150 : 520 }}
              />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

const bar: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "12px 20px",
  background: "#fff",
  borderBottom: "1px solid #ddd",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const btn = (active: boolean): React.CSSProperties => ({
  padding: "7px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  border: "1px solid #ccc",
  background: active ? "#232220" : "#fff",
  color: active ? "#fff" : "#232220",
  cursor: "pointer",
});

const warn: React.CSSProperties = {
  margin: 0,
  padding: "10px 20px",
  background: "#3a2f16",
  color: "#f0d9a8",
  fontSize: 13,
  lineHeight: 1.5,
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const meta: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 8,
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  color: "#232220",
};

const pill: React.CSSProperties = {
  fontSize: 11,
  padding: "2px 8px",
  border: "1px solid #ccc",
  background: "#fff",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const frame: React.CSSProperties = {
  width: "100%",
  maxWidth: 760,
  border: "1px solid #ccc",
  background: "#fff",
};

const pre: React.CSSProperties = {
  margin: 0,
  padding: 20,
  whiteSpace: "pre-wrap",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 13,
  lineHeight: 1.6,
  background: "transparent",
};

export default EmailPreview;
