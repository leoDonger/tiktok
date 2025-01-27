"use client";
import Image from "next/image";

export default function clipsPage() {
  const mockData = [
    {
      id: 1,
      videoSrc: "/sample1.mp4",
      caption: "Short #1",
      likes: 123,
      comments: 10,
    },
    {
      id: 2,
      videoSrc: "/sample2.mp4",
      caption: "Short #2",
      likes: 456,
      comments: 25,
    },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Image
          className="dark:invert"
          src="/vercel.svg"
          alt="Vercel logomark"
          width={20}
          height={20}
        />
        {/* <Image
        
          src="/profile-pic.png"
          alt="User Profile"
          width={40}
          height={40}
          style={{ borderRadius: "50%", marginRight: "8px" }}
        /> */}
        <h1 style={{ fontSize: "1.2rem", margin: 0 }}>My Shorts</h1>
      </header>

      <div
        id="clips-container"
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
          position: "relative",
        }}
      >
        {mockData.map((short) => (
          <div
            key={short.id}
            style={{
              position: "relative",
              height: "100vh",
              borderBottom: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              src={short.videoSrc}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              controls
            />

            <div
              style={{
                position: "absolute",
                right: "16px",
                bottom: "20%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <button
                style={{
                  background: "white",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                👍
              </button>
              <span style={{ fontSize: "0.8rem" }}>{short.likes}</span>

              <button
                style={{
                  background: "white",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                💬
              </button>
              <span style={{ fontSize: "0.8rem" }}>{short.comments}</span>

              <button
                style={{
                  background: "white",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ↗
              </button>
            </div>

            <div
              style={{
                position: "absolute",
                left: "16px",
                bottom: "16px",
                color: "#000",
                background: "rgba(255, 255, 255, 0.8)",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              {short.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
