# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # Start dev server (http://localhost:3000)
pnpm build          # Production build (use `npx next build` if pnpm install hook fails)
pnpm start          # Start production server
pnpm lint           # Run ESLint
```

## Tech Stack

- **Next.js 16** (App Router, Turbopack default) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (CSS-based config via `@import "tailwindcss"`, no `tailwind.config.js`)
- **pnpm** (package manager), **PostCSS** with `@tailwindcss/postcss` plugin
- **marked** (Markdown parsing) + **shiki** (code syntax highlighting)
- **SWR** (client-side data fetching), **Zustand** (client state)
- **Giscus** (comments), **Busuanzi** (visitor counter), **Live2D** (shizuku model)

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── layout.tsx          # Root layout (Nav + main + Footer + Busuanzi script)
│   ├── page.tsx            # Homepage (hero + blog list + embedded music player + pictures)
│   ├── globals.css         # Tailwind + prose styles
│   ├── blog/               # Blog list (server) + [slug]/ detail (client)
│   ├── write/              # Write page placeholder (GitHub auth needed)
│   ├── about/              # About page
│   ├── friends/            # Friend links page
│   ├── projects/           # Project showcase
│   ├── sitemap.ts          # Dynamic sitemap
│   └── rss.xml/route.ts    # RSS feed
├── components/             # Shared UI components (nav, footer, giscus-comment, live2d)
├── hooks/                  # Custom hooks (use-blog-index — SWR)
├── lib/                    # Core libraries
│   ├── load-blog.ts        # Fetch blog config.json + index.md by slug
│   ├── load-music.ts       # Fetch public/music/index.json
│   ├── load-pictures.ts    # Fetch public/pictures/index.json
│   └── markdown-renderer.ts# Markdown → HTML + TOC (marked + shiki)
└── config/
    └── site.ts             # Site configuration (nav, social, giscus)
```

## Content Architecture

Blog posts stored as Markdown in `public/blogs/`, fetched at runtime via `fetch()`:

```
public/blogs/
├── index.json              # [{ slug, title, tags, date, summary, category, cover, hidden }]
└── {slug}/
    ├── index.md            # Markdown content
    └── config.json         # Metadata (same fields as index)
```

Music and pictures are configured via JSON files:

```
public/music/index.json      # [{ title, neteaseId }] — NetEase Cloud Music song IDs
public/pictures/index.json   # [{ slug, title, image, date, tags }]
```

Homepage embeds a NetEase outchain iframe player for the first song in the list.

## Routes

| Path | Page | Type |
|------|------|------|
| `/` | Homepage (hero + articles + music + pictures) | Server |
| `/blog` | Blog list | Server |
| `/blog/[slug]` | Article detail | Client |
| `/write` | Write article (placeholder) | Client |
| `/about` | About | Server |
| `/friends` | Friend links | Server |
| `/projects` | Projects | Server |
| `/rss.xml` | RSS feed | Route handler |
| `/sitemap.xml` | Sitemap | Route handler |

## Key Patterns

- **Server components by default**; add `"use client"` only for interactivity (SWR, useState, usePathname)
- **Data fetching**: Server components use direct `fetch()` with `cache: "no-store"`; client uses SWR hooks
- **Markdown pipeline**: `marked.parse()` → shiki highlight → `dangerouslySetInnerHTML`; TOC extracted via `marked.lexer()`
- **Styling**: Tailwind CSS v4 with CSS custom properties (`--background`, `--foreground`, `--primary`) in `:root`
- **Nav** hides on `/write` page; no mobile hamburger menu (desktop-only `hidden sm:flex`)
- **Visitor counter**: Busuanzi script in layout, displayed in footer as `总访问量 <span id="busuanzi_value_site_pv">-</span> 次`
