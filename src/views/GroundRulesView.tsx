import { useState } from "react";
import { Shield, Heart, Plus, Trash2, Edit2, Check, X, Search, Pin, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { INITIAL_GROUND_RULES } from "../data/groundRules";
import { STUDENTS } from "../data/students";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { GROUND_RULE_CATEGORIES } from "../config/constants";
import { createId } from "../utils/createId";
import type { GroundRule, GroundRuleCategory } from "../types/groundRule";
import type { SortOrder } from "../types/common";

const CAT_COLORS: Record<GroundRuleCategory, string> = {
  time: "bg-blue-100 text-blue-700",
  life: "bg-emerald-100 text-emerald-700",
  care: "bg-rose-100 text-rose-700",
  social: "bg-amber-100 text-amber-700",
  facility: "bg-violet-100 text-violet-700",
  etc: "bg-gray-100 text-gray-600",
};

const catLabel = (cat: GroundRuleCategory) => GROUND_RULE_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;

interface RuleFormState {
  content: string;
  author: string;
  category: GroundRuleCategory;
  tags: string;
}

const EMPTY_FORM: RuleFormState = { content: "", author: "", category: "etc", tags: "" };

const VISIBLE_STEP = 8;

export default function GroundRulesView() {
  const [rules, setRules] = useLocalStorage<GroundRule[]>("ground-rules", INITIAL_GROUND_RULES);
  const [filter, setFilter] = useState<GroundRuleCategory | "all">("all");
  const [sort, setSort] = useState<SortOrder>("latest");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RuleFormState>(EMPTY_FORM);
  const [visible, setVisible] = useState(VISIBLE_STEP);

  const filtered = rules
    .filter((r) => {
      const catMatch = filter === "all" || r.category === filter;
      const searchMatch = !search || r.content.includes(search) || r.author.includes(search);
      return catMatch && searchMatch;
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sort === "likes") return b.likes - a.likes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const visibleRules = filtered.slice(0, visible);

  const handleSubmit = () => {
    if (!form.content.trim()) { toast.error("규칙 내용을 입력해 주세요."); return; }
    if (!form.author) { toast.error("작성자를 선택해 주세요."); return; }
    const tags = form.tags.split(/\s+/).filter(Boolean).map((t) => t.startsWith("#") ? t : `#${t}`);

    if (editingId) {
      setRules((prev) => prev.map((r) => r.id === editingId ? { ...r, content: form.content, author: form.author, category: form.category, tags } : r));
      toast.success("규칙이 수정되었습니다.");
      setEditingId(null);
    } else {
      const newRule: GroundRule = {
        id: createId("gr"),
        content: form.content,
        author: form.author,
        category: form.category,
        likes: 0,
        likedBy: [],
        isPinned: false,
        tags,
        createdAt: new Date().toISOString(),
      };
      setRules((prev) => [newRule, ...prev]);
      toast.success("새 그라운드 룰이 추가되었습니다!");
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleEdit = (rule: GroundRule) => {
    setForm({ content: rule.content, author: rule.author, category: rule.category, tags: rule.tags.join(" ") });
    setEditingId(rule.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("이 규칙을 삭제할까요?")) return;
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("삭제되었습니다.");
  };

  const handleLike = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const handlePin = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, isPinned: !r.isPinned } : r));
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 rounded-3xl p-6 sm:p-8 overflow-hidden">
        <div className="hidden sm:block absolute right-8 top-1/2 -translate-y-1/2 text-white/10 text-6xl font-black select-none">
          Rule
        </div>
        {/* Tiger mascot (SVG) */}
        <div className="hidden sm:flex absolute right-16 top-4 bottom-4 items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl select-none">
            🐯
          </div>
        </div>
        <div className="relative max-w-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white border border-white/30">
              광주 2반, 오늘도 화이팅!
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">광주 2반 그라운드 룰</h1>
          <p className="text-violet-200 text-sm">우리 반이 함께 정하고 함께 지키는 약속</p>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-white/70 text-sm">총 <span className="font-bold text-white">{rules.length}개</span> 규칙</span>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 space-y-3">
          <h2 className="font-bold text-gray-800 text-sm">{editingId ? "규칙 수정" : "새로운 그라운드 룰 제안하기"}</h2>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">규칙 내용 *</label>
            <input value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="예: 수업 중 핸드폰은 무음으로..." />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">작성자 *</label>
              <select value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white">
                <option value="">선택</option>
                {STUDENTS.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">카테고리</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as GroundRuleCategory }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white">
                {GROUND_RULE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">태그 (선택)</label>
              <input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="#친목 #배려" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex items-center gap-1.5 bg-violet-600 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-violet-700 transition-colors">
              <Check className="w-3.5 h-3.5" />{editingId ? "수정 완료" : "추가하기"}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }} className="flex items-center gap-1.5 bg-white border border-border text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              <X className="w-3.5 h-3.5" />취소
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" placeholder="규칙 내용 검색..." />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setFilter("all")} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === "all" ? "bg-violet-600 text-white" : "bg-white border border-border text-gray-600 hover:bg-violet-50"}`}>전체</button>
          {GROUND_RULE_CATEGORIES.map((cat) => (
            <button key={cat.value} onClick={() => setFilter(cat.value as GroundRuleCategory)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === cat.value ? "bg-violet-600 text-white" : "bg-white border border-border text-gray-600 hover:bg-violet-50"}`}>{cat.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOrder)} className="border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white">
            <option value="latest">최신순</option>
            <option value="likes">공감순</option>
          </select>
          {!showForm && (
            <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }} className="flex items-center gap-2 bg-violet-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors text-sm shadow-sm">
              <Plus className="w-4 h-4" />규칙 추가
            </button>
          )}
        </div>
      </div>

      {/* Rule List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 flex flex-col items-center text-center">
          <Shield className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">해당하는 규칙이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {visibleRules.map((rule, idx) => (
            <div key={rule.id} className={`bg-white rounded-2xl border ${rule.isPinned ? "border-violet-300 bg-violet-50/30" : "border-border"} shadow-sm p-4 sm:p-5 flex items-start gap-4`}>
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center font-extrabold text-violet-700 text-sm">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  {rule.isPinned && <Pin className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-1" />}
                  <p className="text-sm sm:text-base font-semibold text-gray-800">{rule.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CAT_COLORS[rule.category]}`}>{catLabel(rule.category)}</span>
                  <span className="text-xs text-gray-400">{rule.author}</span>
                  {rule.tags.map((tag) => <span key={tag} className="text-xs text-violet-500 font-medium">{tag}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleLike(rule.id)} className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50">
                  <Heart className="w-3.5 h-3.5" />{rule.likes}
                </button>
                <button onClick={() => handlePin(rule.id)} className={`p-1.5 rounded-lg hover:bg-violet-50 transition-colors ${rule.isPinned ? "text-violet-500" : "text-gray-300 hover:text-violet-400"}`} aria-label="중요 표시">
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleEdit(rule)} className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors" aria-label="수정">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(rule.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="삭제">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length > visible && (
            <button onClick={() => setVisible((v) => v + VISIBLE_STEP)} className="w-full py-3 bg-white border border-border rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <ChevronDown className="w-4 h-4" />더보기 ({filtered.length - visible}개)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
