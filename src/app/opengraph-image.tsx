import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#0c0b0a",
          color: "#f3eee6",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#e4d3bc" }}>AGES 21–35</div>
        <div style={{ display: "flex", fontSize: 132, lineHeight: 0.86, marginTop: 18 }}>THE MINGLE</div>
        <div style={{ display: "flex", fontSize: 40, fontStyle: "italic", marginTop: 12 }}>Are you ready to mingle?</div>
      </div>
    ),
    size,
  );
}
