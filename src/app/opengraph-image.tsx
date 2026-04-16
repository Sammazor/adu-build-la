import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ADU Build LA — ADU Design & Build Specialists in Los Angeles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0c0a09",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Amber radial glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "300px",
            background:
              "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(245,158,11,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "#1c1917",
              border: "1px solid #44403c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                background: "#f59e0b",
                borderRadius: "3px",
              }}
            />
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            ADU Build LA
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#fff",
            fontSize: "56px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "820px",
            marginBottom: "24px",
          }}
        >
          ADU Design & Build Specialists in Los Angeles
        </div>

        {/* Subline */}
        <div
          style={{
            color: "#a8a29e",
            fontSize: "24px",
            lineHeight: 1.4,
            maxWidth: "680px",
            marginBottom: "48px",
          }}
        >
          Custom ADUs starting from $150,000 — design, permitting, and construction under one roof.
        </div>

        {/* Bottom badges */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["4.9 ★ Google Rating", "Licensed & Insured", "200+ ADUs Built", "15+ Years"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  borderRadius: "40px",
                  padding: "8px 20px",
                  color: "#fbbf24",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
