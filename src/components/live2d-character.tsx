"use client";

import { useEffect, useRef } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const CDN = [
  "https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.js",
  BASE + "/live2d/live2d.min.js",
  "https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism2.min.js",
];

const MODEL_URL =
  "https://unpkg.com/live2d-widget-model-luoxiaohei@1.0.2/assets/luoxiaohei.model.json";

const W = 400;
const H = 440;

export function Live2DCharacter() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    if (!el) return;

    // 清空容器，防止 StrictMode 残留
    el.innerHTML = "";

    async function init() {
      for (const src of CDN) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = src;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error(`加载失败: ${src}`));
          document.head.appendChild(s);
        });
        if (cancelled) return;
      }

      const PIXI = (window as any).PIXI;
      const app = new PIXI.Application({
        width: W,
        height: H,
        backgroundAlpha: 0,
        view: document.createElement("canvas"),
      });
      if (cancelled) { app.destroy(); return; }

      const canvas = app.view as HTMLCanvasElement;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      canvas.className = "mx-auto block";
      el!.appendChild(canvas);

      const model = await PIXI.live2d.Live2DModel.from(MODEL_URL);
      if (cancelled) { app.destroy(true, { children: true }); return; }

      model.anchor.set(0.5, 0.5);
      model.x = W / 2;
      model.y = H / 2;
      model.scale.set(0.45);
      app.stage.addChild(model);

      // 鼠标跟随 — 头部转动（通过原生 DOM 事件，避免 PixiJS v7 事件兼容问题）
      canvas.addEventListener("pointermove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        try {
          model.internalModel.coreModel.setParameterValue("PARAM_ANGLE_X", (x - 0.5) * 60);
          model.internalModel.coreModel.setParameterValue("PARAM_ANGLE_Y", (y - 0.5) * 60);
        } catch { /* model params not ready */ }
      });

      // 点击触发动作
      model.on("pointerdown", () => {
        try { model.motion("tap"); } catch { /* ok */ }
      });
    }

    init();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="live2d-frame px-10 py-6 inline-block">
      <span className="corner corner-tl">◈</span>
      <span className="corner corner-tr">◈</span>
      <span className="corner corner-bl">◈</span>
      <span className="corner corner-br">◈</span>
      <div className="text-[.8rem] text-accent font-mono tracking-widest mb-2 text-center">
        ◆ 报 童 ◆
      </div>
      <div ref={ref} style={{ width: W, height: H }} />
      <div className="text-center text-[.55rem] text-text-secondary font-mono tracking-wider mt-2">
        轻触角色互动
      </div>
    </div>
  );
}
