"use client";

import dynamic from "next/dynamic";

export const Live2DCharacter = dynamic(
  () => import("@/components/live2d-character").then((m) => m.Live2DCharacter),
  { ssr: false, loading: () => <div className="h-[380px]" /> }
);
