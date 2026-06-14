"use client";
import { useEffect, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function AvatarDisplay({ author, fallback }: { author: string; fallback: string }) {
  const [avatar, setAvatar] = useState(fallback.startsWith("/") ? BASE + fallback : fallback);

  useEffect(() => {
    fetch("/api/config").then((r) => r.json()).then((cfg) => {
      if (cfg.avatar) setAvatar(cfg.avatar);
    }).catch(() => {});
  }, []);

  return avatar ? (
    <img src={avatar} alt={author}
      className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-accent/30 object-cover shadow-[2px_2px_0_rgba(139,58,58,0.15)]" />
  ) : (
    <div className="w-20 h-20 md:w-20 md:h-20 rounded-full border-2 border-accent/30 bg-accent-glow flex items-center justify-center text-accent font-display text-3xl shadow-[2px_2px_0_rgba(139,58,58,0.15)]">
      {author[0]}
    </div>
  );
}
