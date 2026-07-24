import { GitBranch } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="bg-white border-t border-[#1259AA]/10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-[#1259AA] flex items-center justify-center">
            <span className="text-white font-black text-[10px]">S</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            삼성 청년 SW아카데미 · 광주 2반
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
            <GitBranch className="w-3.5 h-3.5 text-[#1259AA]" />
            feature/gwangju-2ban
          </span>
          <code className="text-[11px] text-[#1259AA] font-mono bg-[#1259AA]/8 px-2.5 py-1 rounded-lg border border-[#1259AA]/15">
            console.log(&quot;광주 2반 화이팅!&quot;);
          </code>
        </div>
      </div>
    </footer>
  );
}
