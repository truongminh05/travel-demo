"use client";
import { useEffect, useRef, useState } from "react";

export default function ReadTimer() {
  const started = useRef<number>(0);
  const [mins, setMins] = useState(0);

  useEffect(() => {
    started.current = Date.now();

    const onLeave = () => {
      const elapsed = Math.round((Date.now() - started.current) / 60000);
      setMins(elapsed);
      // TODO: nếu muốn, fetch('/api/track-read', { method:'POST', body: JSON.stringify({ elapsed }) })
    };

    window.addEventListener("beforeunload", onLeave);
    return () => {
      onLeave();
      window.removeEventListener("beforeunload", onLeave);
    };
  }, []);

  return <span>{mins > 0 ? `${mins} phút đọc` : "đang đọc…"}</span>;
}
