"use client";
import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { marked } from "marked";

function AuthGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ok" | "no">("loading");
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setState(d.authed ? "ok" : "no"))
      .catch(() => setState("no"));
  }, []);
  if (state === "loading") return <div className="text-center py-32 text-text-secondary font-mono text-sm">验证中...</div>;
  if (state === "no") return (
    <div className="text-center py-24">
      <p className="font-display text-xl text-text mb-4">需要登录</p>
      <p className="text-sm text-text-secondary font-mono mb-8">请使用 GitHub 登录后写作</p>
      <a href="/api/auth/github"
        className="inline-block px-6 py-3 bg-accent text-[#F2E3C6] text-sm font-mono tracking-wider hover:brightness-110 transition-all">
        使用 GitHub 登录
      </a>
    </div>
  );
  return <>{children}</>;
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto py-16 text-center text-text-secondary font-mono text-sm">加载中...</div>}>
      <AuthGate>
        <WriteForm />
      </AuthGate>
    </Suspense>
  );
}

function WriteForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const editSlug = sp.get("slug");
  const [loading, setLoading] = useState(!!editSlug);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState(editSlug || "");
  const [cover, setCover] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Load existing post for editing
  useEffect(() => {
    if (!editSlug) return;
    (async () => {
      try {
        const r = await fetch(`/api/write?slug=${encodeURIComponent(editSlug)}`);
        if (!r.ok) throw new Error("Not found");
        const data = await r.json();
        setTitle(data.title || "");
        setSlug(data.slug || editSlug);
        setCover(data.cover || "");
        setCategory(data.category || "");
        setTags((data.tags || []).join(", "));
        setSummary(data.summary || "");
        setContent(data.content || "");
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [editSlug]);

  const autoSlug = useCallback((t: string) => {
    return t.toLowerCase().replace(/[^\w一-鿿\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "";
  }, []);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (editSlug) return;
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(v));
    }
  };

  const html = marked.parse(content || "", { breaks: true }) as string;

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    return data.url;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      const url = await uploadFile(file);
      setCover(url);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      const url = await uploadFile(file);
      const ta = contentRef.current;
      if (ta) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const imgMd = `\n![image](${url})\n`;
        setContent(content.slice(0, start) + imgMd + content.slice(end));
        setTimeout(() => ta.focus(), 0);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const publish = async () => {
    if (!title.trim()) { setError("请输入标题"); return; }
    if (!content.trim()) { setError("请输入正文"); return; }
    if (!slug.trim()) { setError("slug 不能为空"); return; }
    setPublishing(true);
    setError("");
    try {
      const r = await fetch("/api/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim(),
          title: title.trim(),
          category: category.trim(),
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          summary: summary.trim(),
          cover: cover || undefined,
          content,
          date: new Date().toISOString().slice(0, 10),
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      router.push(`/blog/${data.slug}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 pb-4 border-b border-border">
          <h1 className="font-display text-xl font-bold text-text">编辑文章</h1>
        </header>
        <div className="text-center py-16 text-text-secondary font-mono text-sm">加载中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6 pb-4 border-b border-border">
        <h1 className="font-display text-xl font-bold text-text">
          {editSlug ? `编辑：${title || editSlug}` : "写文章"}
        </h1>
        {editSlug && (
          <p className="text-xs text-text-secondary font-mono mt-1">
            修改后重新发布将覆盖原文章
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-text-secondary tracking-wider mb-1">标题 *</label>
            <input value={title} onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border text-text text-sm focus:outline-none focus:border-accent transition-colors" placeholder="文章标题" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-secondary tracking-wider mb-1">Slug *</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border text-text text-sm focus:outline-none focus:border-accent transition-colors font-mono" placeholder="my-post-slug" disabled={!!editSlug} />
            </div>
            <div>
              <label className="block text-xs font-mono text-text-secondary tracking-wider mb-1">分类</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border text-text text-sm focus:outline-none focus:border-accent transition-colors" placeholder="技术笔记" />
            </div>
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-xs font-mono text-text-secondary tracking-wider mb-1">封面图</label>
            <div className="flex gap-2 items-center">
              <input value={cover} onChange={(e) => setCover(e.target.value)}
                className="flex-1 px-3 py-2 bg-card border border-border text-text text-sm focus:outline-none focus:border-accent transition-colors font-mono" placeholder="图片 URL 或上传" />
              <button onClick={() => fileRef.current?.click()}
                className="px-3 py-2 border border-border text-text-secondary text-xs font-mono hover:bg-accent-glow transition-colors flex-shrink-0">
                上传
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </div>
            {cover && (
              <div className="mt-2 relative inline-block">
                <img src={cover} alt="cover" className="h-24 object-cover border border-border" />
                <button onClick={() => setCover("")}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-[#F2E3C6] text-xs leading-none rounded-full">×</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-text-secondary tracking-wider mb-1">标签（逗号分隔）</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border text-text text-sm focus:outline-none focus:border-accent transition-colors" placeholder="Next.js, 博客, 教程" />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-secondary tracking-wider mb-1">摘要</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2}
              className="w-full px-3 py-2 bg-card border border-border text-text text-sm focus:outline-none focus:border-accent transition-colors resize-none" placeholder="文章摘要..." />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono text-text-secondary tracking-wider">正文（Markdown）*</label>
              <button onClick={() => imgRef.current?.click()}
                className="text-xs font-mono text-accent hover:underline">
                + 插入图片
              </button>
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleInsertImage} />
            </div>
            <textarea ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)} rows={16}
              className="w-full px-3 py-2 bg-card border border-border text-text text-sm focus:outline-none focus:border-accent transition-colors font-mono resize-y" placeholder="用 Markdown 写文章..." />
          </div>

          {error && <p className="text-accent text-sm font-mono">{error}</p>}

          <div className="flex gap-3">
            <button onClick={publish} disabled={publishing}
              className="px-6 py-2.5 bg-accent text-[#F2E3C6] text-sm font-mono tracking-wider hover:brightness-110 transition-all disabled:opacity-50">
              {publishing ? "发布中..." : (editSlug ? "保存修改" : "发布")}
            </button>
            <button onClick={() => router.back()}
              className="px-6 py-2.5 border border-border text-text-secondary text-sm font-mono tracking-wider hover:bg-accent-glow transition-colors">
              取消
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:border-l lg:border-border lg:pl-6">
          <label className="block text-xs font-mono text-text-secondary tracking-wider mb-3">预览</label>
          <div ref={previewRef}
            className="prose prose-sm max-w-none"
            style={{ fontSize: ".9rem" }}
            dangerouslySetInnerHTML={{ __html: html || '<p class="text-text-secondary font-mono text-xs">暂无内容</p>' }} />
        </div>
      </div>
    </div>
  );
}
