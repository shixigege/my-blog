"use client";

import { useEffect, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const CDN = [
  "https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.js",
  BASE + "/live2d/live2d.min.js",
  "https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism2.min.js",
];

const MODEL_URL =
  "https://unpkg.com/live2d-widget-model-luoxiaohei@1.0.2/assets/luoxiaohei.model.json";

const QUOTES = [
  "今日编译通过，0 Errors, 0 Warnings。",
  "主编正在敲代码，递上一份刚出炉的技术报。",
  "Talk is cheap, show me the code.",
  "轻戳我一下，会有特殊动作哦！",
  "慢下来，读一篇有深度的专稿吧。",
  "夜深了，主编记得给报馆关灯~",
];

export function Newsboy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";

    async function init() {
      try {
        for (const src of CDN) {
          if (!document.querySelector(`script[src="${src}"]`)) {
            await new Promise<void>((resolve, reject) => {
              const s = document.createElement("script");
              s.src = src;
              s.async = true;
              s.onload = () => resolve();
              s.onerror = () => reject(new Error(`CDN load error: ${src}`));
              document.head.appendChild(s);
            });
          }
          if (cancelled) return;
        }

        const PIXI = (window as any).PIXI;
        if (!PIXI || !PIXI.live2d) {
          throw new Error("Pixi Live2D plugin not ready");
        }

        const size = 240;
        const app = new PIXI.Application({
          width: size,
          height: size,
          backgroundAlpha: 0,
          view: document.createElement("canvas"),
        });

        if (cancelled) {
          app.destroy();
          return;
        }

        const canvas = app.view as HTMLCanvasElement;
        canvas.style.width = "100%";
        canvas.style.maxWidth = `${size}px`;
        canvas.style.height = "auto";
        canvas.style.display = "block";
        canvas.style.margin = "0 auto";
        el!.appendChild(canvas);

        const model = await PIXI.live2d.Live2DModel.from(MODEL_URL);
        if (cancelled) {
          app.destroy(true, { children: true });
          return;
        }

        model.anchor.set(0.5, 0.5);
        model.x = size / 2;
        model.y = size / 2 + 10;
        model.scale.set(0.28);
        app.stage.addChild(model);

        // 视线与头部轻微跟随
        canvas.addEventListener("pointermove", (e) => {
          const rect = canvas.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = 1 - (e.clientY - rect.top) / rect.height;
          try {
            model.internalModel.coreModel.setParameterValue("PARAM_ANGLE_X", (x - 0.5) * 45);
            model.internalModel.coreModel.setParameterValue("PARAM_ANGLE_Y", (y - 0.5) * 45);
          } catch {
            /* ignore */
          }
        });

        // 点击互动
        canvas.addEventListener("pointerdown", () => {
          try {
            model.motion("tap");
          } catch {
            /* ignore */
          }
          setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        });

        if (!cancelled) setLoaded(true);
      } catch (err) {
        console.warn("Live2D failed to load:", err);
        if (!cancelled) setError(true);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="classified-box p-4 text-center my-4 relative select-none">
      <span className="corner-ornament corner-tl">◈</span>
      <span className="corner-ornament corner-tr">◈</span>
      <span className="corner-ornament corner-bl">◈</span>
      <span className="corner-ornament corner-br">◈</span>

      {/* 栏目标题 */}
      <div className="flex items-center justify-center gap-2 mb-2 pb-1.5 border-b border-rule">
        <span className="text-[0.68rem] font-mono tracking-widest text-vermilion uppercase font-semibold">
          ◈ 特派报童 · NEWSBOY ◈
        </span>
      </div>

      {/* Live2D 挂载点 */}
      <div className="relative min-h-[180px] flex items-center justify-center">
        {!loaded && !error && (
          <div className="text-xs font-mono text-ink-muted animate-pulse">
            [ 报童整理报刊中... ]
          </div>
        )}
        {error && (
          <div className="text-xs font-serif text-ink-muted py-8">
            <span className="block text-2xl mb-1">🐾</span>
            罗小黑去送外勤晚报了~
          </div>
        )}
        <div ref={containerRef} className="w-full flex justify-center" />
      </div>

      {/* 气泡台词 */}
      <div
        onClick={() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length)}
        className="mt-2 text-[0.78rem] font-serif text-ink-secondary bg-paper border border-rule px-2.5 py-1.5 cursor-pointer hover:border-vermilion transition-colors leading-snug"
        title="点击切换台词"
      >
        <span className="text-vermilion mr-1 font-mono">“</span>
        {QUOTES[quoteIndex]}
        <span className="text-vermilion ml-1 font-mono">”</span>
      </div>
    </div>
  );
}
