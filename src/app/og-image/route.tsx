import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B3A6B",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "sans-serif",
          }}
        >
          Pharm Way Group
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 30,
            fontWeight: 400,
            color: "#DCE5FA",
            fontFamily: "sans-serif",
          }}
        >
          Global Pharma, Local Success
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
