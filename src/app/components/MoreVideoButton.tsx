"use client";
import React, { useState } from "react";

export default function RetrieveButton() {
  const [status, setStatus] = useState("");

  async function handleClick() {
    setStatus("Retrieving...");
    try {
      const res = await fetch("/api/cron", {
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`Success: ${data.message}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setStatus(`Request failed: ${error.message}`);
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled>Generate New Videos</button>
      {status && <p>{status}</p>}
    </div>
  );
}
