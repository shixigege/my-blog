"use client";

import { useState } from "react";

export function FriendApplyForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  const mailtoLink = `mailto:1174880175@qq.com?subject=${encodeURIComponent(
    `友链申请：${name || "未填写"}`
  )}&body=${encodeURIComponent(
    `站点名称：${name}\n站点地址：${url}\n站点简介：${desc}\n联系邮箱：${email}\n站点头像：${avatar}`
  )}`;

  return (
    <>
      {/* 申请友链 */}
      <section className="border-t-2 border-border pt-8 mt-8">
        <h2 className="font-display text-lg font-bold text-text mb-4">申请友链</h2>
        <div className="border border-border p-6 bg-accent-glow/10">
          <p className="text-base text-text-secondary mb-4 leading-relaxed">
            如果你拥有一个独立博客或技术站点，欢迎交换友链。请先在我的站点添加链接，然后填写以下信息提交申请。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[
              { label: "站点名称", val: "你的博客名称" },
              { label: "站点地址", val: "https://your-blog.com" },
              { label: "站点简介", val: "一句话描述你的站点" },
              { label: "联系邮箱", val: "your@email.com" },
              { label: "站点头像", val: "https://your-blog.com/avatar.png" },
            ].map((item) => (
              <div key={item.label} className="text-sm text-text-secondary font-mono tracking-wider">
                <span className="text-accent">▸</span> {item.label}：{item.val}
              </div>
            ))}
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(mailtoLink, "_blank");
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[.75rem] text-accent font-mono tracking-widest mb-1 uppercase">站点名称 *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的博客名称"
                  required
                  className="w-full border border-border bg-card px-3 py-2.5 text-base text-text placeholder:text-text-secondary/40 outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[.75rem] text-accent font-mono tracking-widest mb-1 uppercase">站点地址 *</label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-blog.com"
                  required
                  className="w-full border border-border bg-card px-3 py-2.5 text-base text-text placeholder:text-text-secondary/40 outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[.75rem] text-accent font-mono tracking-widest mb-1 uppercase">站点简介</label>
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="一句话描述你的站点"
                  className="w-full border border-border bg-card px-3 py-2.5 text-base text-text placeholder:text-text-secondary/40 outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[.75rem] text-accent font-mono tracking-widest mb-1 uppercase">联系邮箱</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  className="w-full border border-border bg-card px-3 py-2.5 text-base text-text placeholder:text-text-secondary/40 outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[.75rem] text-accent font-mono tracking-widest mb-1 uppercase">站点头像</label>
              <input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://your-blog.com/avatar.png"
                className="w-full border border-border bg-card px-3 py-2.5 text-base text-text placeholder:text-text-secondary/40 outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              className="border border-accent text-accent px-6 py-2.5 text-base font-mono tracking-wider hover:bg-accent hover:text-white transition-colors"
            >
              提交申请 ↗
            </button>
          </form>
          <p className="text-sm text-text-secondary font-mono tracking-wider mt-4">
            提交后将通过邮件发送申请，我会尽快处理。
          </p>
        </div>
      </section>

      {/* 申请须知 */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-text mb-4">友链须知</h2>
        <div className="border border-border p-6">
          <ul className="space-y-2 text-base text-text-secondary">
            {[
              "博客内容原创、有料，非采集站",
              "站点能正常访问，无违规内容",
              "已在我的站点添加友链",
            ].map((rule, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent flex-shrink-0">◆</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
