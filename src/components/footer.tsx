export function Footer() {
  return (
    <footer className="text-center py-6 px-4">
      <div className="newspaper-container p-5">
        <div className="text-border text-[.55rem] tracking-[.5em] mb-3 select-none">◆ ◆ ◆</div>
        <p className="text-xs text-text-secondary font-mono tracking-wider">
          &copy; {new Date().getFullYear()} Allen&apos;s Blog · Powered by Next.js
        </p>
        <p className="mt-1 text-xs text-text-secondary font-mono">
          总访问 <span id="busuanzi_value_site_pv" className="text-accent font-medium">-</span> 次
        </p>
      </div>
    </footer>
  );
}
