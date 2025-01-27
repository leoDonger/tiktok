// import Image from "next/image";
// import { prisma } from "@/lib/prisma";
// import { getS3PresignedUrl } from "@/lib/video";
// import MoreVideoButton from "./components/MoreVideoButton";
// import LikeButton from "./components/LikeButton";
// import VideoCard from "./components/VideoCard";

// const DEMO_USER_ID = "demo-user-123";

// async function fetchVideos() {
//   const videos = await prisma.video.findMany({
//     orderBy: { createdAt: "desc" },
//     include: {
//       likes: true,
//     },
//   });

//   const withPresignedUrls = await Promise.all(
//     videos.map(async (video) => {
//       const presignedUrl = await getS3PresignedUrl(video.s3Key, 3600); // 1-hour link
//       return {
//         ...video,
//         presignedUrl,
//       };
//     })
//   );

//   return withPresignedUrls;
// }

// export default async function Home() {
//   const videos = await fetchVideos();

//   return (
//     <main style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
//       <h1>My TikTok Clone</h1>

//       <MoreVideoButton />

//       <div style={{ marginTop: "2rem" }}>
//         {videos.map((video) => {
//           const userAlreadyLiked = video.likes.some(
//             (like) => like.userId === DEMO_USER_ID
//           );

//           return (
//             <div
//               key={video.id}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 padding: "1rem",
//                 marginBottom: "1.5rem",
//               }}
//             >
//               <h3 style={{ margin: "0 0 8px" }}>{video.caption}</h3>

//               <VideoCard src={video.presignedUrl} />

//               <div style={{ marginTop: "8px" }}>
//                 <LikeButton
//                   videoId={video.id}
//                   initialLiked={userAlreadyLiked}
//                 />
//                 <span style={{ marginLeft: "8px" }}>
//                   Likes: {video.likes.length}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </main>
//   );
// }


import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getS3PresignedUrl } from "@/lib/video";
import VideoCard from "./components/VideoCard";
import LikeButton from "./components/LikeButton";
import MoreVideoButton from "./components/MoreVideoButton";

const DEMO_USER_ID = "demo-user-123";

const clipsContainerStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: "#f9f9f9",
  position: "relative",
  overflowY: "scroll",
  WebkitOverflowScrolling: "touch" as any,
  scrollbarWidth: "none",      
  msOverflowStyle: "none",    
};

async function getVideos() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    include: { likes: true }, 
  });

  const videosWithSignedUrls = await Promise.all(
    videos.map(async (v) => {
      const presignedUrl = await getS3PresignedUrl(v.s3Key, 3600); // 1 hour
      return {
        id: v.id,
        caption: v.caption,
        s3Key: v.s3Key,
        presignedUrl,
        likesCount: v.likes.length,
      };
    })
  );

  return videosWithSignedUrls;
}

export default async function HomePage() {
  const videos = await getVideos();

  return (
    <main style={{ margin: 0, padding: 0 }}>
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
          src="/next.svg"
          alt="User Profile"
          width={40}
          height={40}
          style={{ marginRight: "16px" }}
        />
        <h1 style={{ fontSize: "1.2rem", margin: 0 }}>TikTok Clone</h1>

          <div style={{ marginLeft: "auto" }}>
            <MoreVideoButton />
          </div>
        </header>

        {/* -- Scrollable feed area -- */}
        <div
          id="clips-container"
          style={clipsContainerStyle}>
          {videos.map((vid) => (
            <div
              key={vid.id}
              style={{
                position: "relative",
                height: "100vh",
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "306px", height: "704px" }}>
                <VideoCard
                  src={vid.presignedUrl}
                />
              </div>

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
                <div
                  style={{
                    background: "white",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LikeButton videoId={vid.id} initialLiked={false} />
                </div>
                <span style={{ fontSize: "0.8rem" }}>{vid.likesCount}</span>

                <div
                  style={{
                    background: "white",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  💬
                </div>
                <span style={{ fontSize: "0.8rem" }}>0</span>

                <div
                  style={{
                    background: "white",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ↗
                </div>
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
                {vid.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
