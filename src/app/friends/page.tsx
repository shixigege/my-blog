import { promises as fs } from "fs";
import path from "path";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FriendApplyForm } from "./friend-apply";

export const metadata = { title: "友链" };

interface Friend {
  name: string;
  url: string;
  desc?: string;
  avatar?: string;
}

export default async function FriendsPage() {
  let friends: Friend[] = [];
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", "friends", "index.json"), "utf-8");
    friends = JSON.parse(raw);
  } catch {}

  return (
    <article>
      <header className="mb-8 pb-5 border-b-2 border-border">
        <div className="text-[.6rem] text-accent font-mono tracking-wider mb-2">[友链]</div>
        <h1 className="font-display text-2xl md:text-3xl text-text font-bold tracking-wide">友链</h1>
        <p className="text-xs text-text-secondary mt-2">朋友们的好地方</p>
      </header>

      {friends.length === 0 ? (
        <div className="py-16 text-center text-text-secondary border border-border p-8 mb-10">
          <p>暂无友链</p>
          <p className="text-xs mt-2 font-mono tracking-wider">期待与你建立连接</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {friends.map((f) => (
            <ScrollReveal key={f.name}>
              <a href={f.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-border hover:bg-accent-glow transition-colors group">
                <div className="w-12 h-12 rounded-full bg-accent-glow flex items-center justify-center text-accent font-display text-lg flex-shrink-0 border border-accent/20 overflow-hidden">
                  {f.avatar ? (
                    <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    f.name[0]
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
                    {f.name}
                  </h3>
                  {f.desc && <p className="text-xs text-text-secondary mt-0.5 truncate">{f.desc}</p>}
                  <p className="text-[.6rem] text-text-secondary/60 font-mono mt-1 truncate">{f.url}</p>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      )}

      <FriendApplyForm />

      <div className="text-right text-border text-sm mt-8">■</div>
    </article>
  );
}
