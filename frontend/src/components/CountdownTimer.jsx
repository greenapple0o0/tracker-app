import React, { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setUTCHours(24, 0, 0, 0);
      const diff = nextReset - now;

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", top: 20, right: 20, background: "#6c63ff", color: "#fff", padding: "10px 15px", borderRadius: "8px", fontWeight: "bold" }}>
      Reset in: {timeLeft}
    </div>
  );
}
