"use client";

import { useState } from "react";

export default function LikeButton({ videoId, initialLiked }: {
  videoId: string;
  initialLiked: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);

  const toggleLike = async () => {
    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
    }
  };

  return (
    <button onClick={toggleLike}>
      {liked ? "Unlike" : "Like"}
    </button>
  );
}
