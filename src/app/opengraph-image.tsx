import { ImageResponse } from "next/og";
import { BUSINESS } from "@/lib/business";

export const alt = `${BUSINESS.name}, smoke and vape shop in ${BUSINESS.city}, ${BUSINESS.region}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated share image, used for link previews until a real storefront photo
// is added to /public.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(ellipse at top, #1f1f1f 0%, #000000 70%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {`Smoke & Vape Shop · ${BUSINESS.city}, ${BUSINESS.region}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, lineHeight: 1, letterSpacing: -3 }}>
            {BUSINESS.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 38,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Every major brand, in stock, in person.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <div>
            {`${BUSINESS.streetAddress}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`}
          </div>
          <div>{`Open 7 days · ${BUSINESS.telephone}`}</div>
        </div>
      </div>
    ),
    size,
  );
}
