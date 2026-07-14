import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const logo = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "logo-dark.png"),
).toString("base64")}`;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#262624",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} height={96} alt="Eureka" />
          <span
            style={{
              color: "#A3A099",
              fontSize: 20,
              letterSpacing: 4,
            }}
          >
            THE SCIENCE NETWORK
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#f5f4ef",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Every scroll teaches you
          </span>
          <span
            style={{
              color: "#96be85",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            something.
          </span>
        </div>

        <span style={{ color: "#a3a099", fontSize: 26, maxWidth: 900 }}>
          The social platform for science — where discoveries are verified and
          curiosity is the currency.
        </span>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
