"use client";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function AvatarDisplay({
  author,
  fallback,
  className = "w-20 h-20 md:w-24 md:h-24",
}: {
  author: string;
  fallback: string;
  className?: string;
}) {
  const avatarSrc = fallback.startsWith("/") ? BASE + fallback : fallback;

  return avatarSrc ? (
    <img
      src={avatarSrc}
      alt={author}
      className={`${className} rounded-full border-2 border-rule-strong object-cover shadow-sm p-0.5 bg-paper`}
    />
  ) : (
    <div
      className={`${className} rounded-full border-2 border-rule-strong bg-card flex items-center justify-center text-ink font-serif text-2xl shadow-sm`}
    >
      {author[0]}
    </div>
  );
}
