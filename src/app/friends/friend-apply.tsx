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
    <section className="pt-6 border-t-2 border-rule-strong space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold font-mono tracking-widest text-ink uppercase flex items-center gap-2">
          <span className="text-vermilion">◈</span>
          <span>刊登申请 · CLASSIFIED APPLICATION</span>
        </h2>
        <span className="text-xs font-mono text-ink-muted">MAILTO PROTOCOL</span>
      </div>

      <div className="classified-box p-5 sm:p-6 space-y-5">
        <p className="text-xs sm:text-sm font-serif text-ink-secondary leading-relaxed">
          若您拥有原创内容丰富、持续维护的独立博客或极客主页，热烈欢迎交换刊登。
          请先在贵站添加本报链接，随后填写下方填单，点击提交将调用邮件客户端发送申请。
        </p>

        {/* 本报信息提示 */}
        <div className="p-3 bg-paper border border-rule text-xs font-mono text-ink-secondary space-y-1">
          <div className="text-[0.68rem] text-vermilion font-bold uppercase mb-1">
            本报预设信息：
          </div>
          <div>名称：shixigege&apos;s Blog</div>
          <div>地址：https://shixigege.github.io/my-blog/</div>
          <div>简介：计算机专业学生， 技术 / 随想 / 日常</div>
        </div>

        {/* 申请表单 */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            window.open(mailtoLink, "_blank");
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.72rem] font-mono text-ink-muted mb-1 uppercase tracking-wider">
                贵站名称 *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：极客快讯"
                required
                className="w-full border border-rule bg-paper px-3 py-2 text-sm font-serif text-ink placeholder:text-ink-muted/50 outline-none focus:border-vermilion transition-colors"
              />
            </div>

            <div>
              <label className="block text-[0.72rem] font-mono text-ink-muted mb-1 uppercase tracking-wider">
                贵站网址 *
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                type="url"
                className="w-full border border-rule bg-paper px-3 py-2 text-sm font-mono text-ink placeholder:text-ink-muted/50 outline-none focus:border-vermilion transition-colors"
              />
            </div>

            <div>
              <label className="block text-[0.72rem] font-mono text-ink-muted mb-1 uppercase tracking-wider">
                一句话简述
              </label>
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="一句话介绍您的主页与专栏"
                className="w-full border border-rule bg-paper px-3 py-2 text-sm font-serif text-ink placeholder:text-ink-muted/50 outline-none focus:border-vermilion transition-colors"
              />
            </div>

            <div>
              <label className="block text-[0.72rem] font-mono text-ink-muted mb-1 uppercase tracking-wider">
                联络邮箱
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-name@domain.com"
                type="email"
                className="w-full border border-rule bg-paper px-3 py-2 text-sm font-mono text-ink placeholder:text-ink-muted/50 outline-none focus:border-vermilion transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.72rem] font-mono text-ink-muted mb-1 uppercase tracking-wider">
              站点头像 URL
            </label>
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full border border-rule bg-paper px-3 py-2 text-sm font-mono text-ink placeholder:text-ink-muted/50 outline-none focus:border-vermilion transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-mono tracking-widest uppercase bg-rule-strong text-paper hover:bg-vermilion transition-colors cursor-pointer"
            >
              提交刊登申请 &rarr;
            </button>
            <span className="text-[0.7rem] font-mono text-ink-muted">
              * 提交后将唤起本地邮件客户端
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
