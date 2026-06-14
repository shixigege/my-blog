"use client";
import { useEffect, useState } from "react";

interface ImageItem {
  name: string;
  url: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/upload");
      if (!r.ok) { const d = await r.json(); throw new Error(d.error || "Failed to load"); }
      const data = await r.json();
      setImages(data.images || []);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      if (!r.ok) { const d = await r.json(); throw new Error(d.error || "Upload failed"); }
      await load();
    } catch (e: any) { setError(e.message); }
    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (name: string) => {
    if (!confirm("删除这张图片？")) return;
    setError("");
    const r = await fetch(`/api/upload?filename=${encodeURIComponent(name)}`, { method: "DELETE" });
    if (!r.ok) { const d = await r.json(); setError(d.error); }
    await load();
  };

  const handleSetAvatar = async (url: string) => {
    setError("");
    const r = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: url }),
    });
    if (!r.ok) { const d = await r.json(); setError(d.error); return; }
    setCopied("avatar");
    setTimeout(() => setCopied(""), 2000);
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6 pb-4 border-b border-border">
        <h1 className="font-display text-xl font-bold text-text">图片管理</h1>
        <p className="text-xs text-text-secondary font-mono mt-1">{images.length} 张图片</p>
      </header>

      {/* Upload */}
      <div className="mb-6">
        <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-text-secondary text-sm font-mono hover:bg-accent-glow transition-colors cursor-pointer">
          {uploading ? "上传中..." : "+ 上传图片"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        {error && <p className="mt-2 text-accent text-xs font-mono">{error}</p>}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-text-secondary font-mono text-sm">加载中...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-text-secondary font-mono text-sm border border-border">
          暂无图片，点击上方按钮上传
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.name} className="border border-border bg-card overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#1A1410]">
                <img src={img.url} alt={img.name}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
              </div>
              <div className="p-2 space-y-1">
                <p className="text-[.6rem] text-text-secondary font-mono truncate">{img.name}</p>
                <div className="flex gap-1 flex-wrap">
                  <button onClick={() => copyUrl(img.url)}
                    className="text-[.55rem] font-mono px-1.5 py-0.5 border border-border text-text-secondary hover:bg-accent-glow transition-colors">
                    {copied === img.url ? "已复制" : "复制 URL"}
                  </button>
                  <button onClick={() => handleSetAvatar(img.url)}
                    className="text-[.55rem] font-mono px-1.5 py-0.5 border border-accent/30 text-accent hover:bg-accent-glow transition-colors">
                    {copied === "avatar" ? "已设置" : "设为头像"}
                  </button>
                  <button onClick={() => handleDelete(img.name)}
                    className="text-[.55rem] font-mono px-1.5 py-0.5 border border-accent/20 text-accent hover:bg-accent-glow transition-colors">
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
