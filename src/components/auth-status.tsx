"use client";
import { useEffect, useState } from "react";

export function AuthStatus() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setAuthed(d.authed))
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (authed) {
    return (
      <button
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          setAuthed(false);
        }}
        className="text-[.7rem] text-text-secondary font-mono tracking-wider hover:text-accent transition-colors"
        title="退出登录"
      >
        ◆退出
      </button>
    );
  }

  return (
    <a
      href="/api/auth/github"
      className="text-[.7rem] text-text-secondary font-mono tracking-wider hover:text-accent transition-colors"
      title="GitHub 登录"
    >
      ◆登录
    </a>
  );
}
