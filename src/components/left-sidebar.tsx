import Link from "next/link";

const CATEGORIES = [
  "开发",
  "文艺随笔",
  "技术笔记",
  "阅读笔记",
  "随感",
  "读书",
  "设计",
];

export function LeftSidebar() {
  return (
    <aside className="left-sidebar">

      {/* 笔墨统计 */}
      <div className="stats-card">
        <h4>笔墨统计</h4>
        <div className="stat-row">
          <span>文章</span>
          <span className="num">6</span>
        </div>
        <div className="stat-row">
          <span>分类</span>
          <span className="num">6</span>
        </div>
        <div className="stat-row">
          <span>标签</span>
          <span className="num">8</span>
        </div>
        <div className="stat-row">
          <span>创刊</span>
          <span className="num">2026</span>
        </div>
      </div>

      {/* 分类导航 */}
      <div>
        <h4 className="section-label">分类</h4>
        <ul className="nav-mini">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link href={`/tags/${encodeURIComponent(cat)}`}>{cat}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
