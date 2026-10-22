import { promises as fs } from "fs";
import path from "path";
import { FriendApplyForm } from "./friend-apply";

export const metadata = { title: "同好友链" };

interface Friend {
  name: string;
  url: string;
  desc?: string;
  avatar?: string;
}

export default async function FriendsPage() {
  let friends: Friend[] = [];
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "friends", "index.json"),
      "utf-8"
    );
    friends = JSON.parse(raw);
  } catch {}

  return (
    <div className="w-full space-y-8">
      {/* 友链版头 */}
      <header className="border-b-2 border-rule-strong pb-4">
        <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2">
          <span className="text-vermilion font-semibold uppercase">
            REGISTRY · 同业同好通讯
          </span>
          <span>登记站点共 {friends.length} 处</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          报友同好录 · COMMUNITY
        </h1>
        <p className="text-xs sm:text-sm font-serif text-ink-secondary mt-1">
          与各路优秀的独立博主、技术极客和同行者交换油墨与思想。
        </p>
      </header>

      {/* 友链名片网格 */}
      {friends.length === 0 ? (
        <div className="py-16 text-center text-ink-muted font-serif border border-dashed border-rule">
          暂无已登记站点，欢迎在下方填写申请
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {friends.map((f) => (
            <a
              key={f.name}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="classified-box p-4 group block relative transition-all hover:-translate-y-0.5"
            >
              <span className="corner-ornament corner-tl">◈</span>
              <span className="corner-ornament corner-tr">◈</span>
              <span className="corner-ornament corner-bl">◈</span>
              <span className="corner-ornament corner-br">◈</span>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-rule-strong overflow-hidden bg-paper flex-shrink-0 flex items-center justify-center font-serif text-base font-bold text-ink">
                  {f.avatar ? (
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    f.name[0]
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-ink group-hover:text-vermilion transition-colors truncate">
                      {f.name}
                    </h3>
                    <span className="text-[0.68rem] font-mono text-ink-muted group-hover:text-vermilion">
                      &rarr;
                    </span>
                  </div>

                  {f.desc && (
                    <p className="text-xs font-serif text-ink-secondary mt-1 line-clamp-2 leading-relaxed">
                      {f.desc}
                    </p>
                  )}

                  <p className="text-[0.68rem] font-mono text-ink-muted mt-2 truncate">
                    {f.url.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* 申请入报表单 */}
      <FriendApplyForm />
    </div>
  );
}
