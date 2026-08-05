import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Edit2, Heart, LoaderCircle, Pin, Plus, Search, Shield, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { GROUND_RULE_CATEGORIES } from "../config/constants";
import { useAdmin } from "../context/AdminContext";
import { useAuth } from "../hooks/useAuth";
import { createGroundRule, deleteGroundRule, getGroundRules, setGroundRuleLike, updateGroundRule } from "../services/groundRules";
import type { SortOrder } from "../types/common";
import type { GroundRule, GroundRuleCategory } from "../types/groundRule";
import { createId } from "../utils/createId";
import rulesImage from "../assets/home/quick-menu/rules.png";

const CAT_COLORS: Record<GroundRuleCategory, string> = {
  time: "bg-blue-100 text-blue-700", life: "bg-emerald-100 text-emerald-700",
  care: "bg-rose-100 text-rose-700", social: "bg-amber-100 text-amber-700",
  facility: "bg-violet-100 text-violet-700", etc: "bg-gray-100 text-gray-600",
};
const catLabel = (category: GroundRuleCategory) => GROUND_RULE_CATEGORIES.find((item) => item.value === category)?.label ?? category;
const VISIBLE_STEP = 8;
type RuleForm = { content: string; category: GroundRuleCategory; tags: string };
const EMPTY_FORM: RuleForm = { content: "", category: "etc", tags: "" };

export default function GroundRulesView() {
  const { currentUser } = useAuth();
  const { isAdmin } = useAdmin();
  const [rules, setRules] = useState<GroundRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<GroundRuleCategory | "all">("all");
  const [sort, setSort] = useState<SortOrder>("latest");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RuleForm>(EMPTY_FORM);
  const [visible, setVisible] = useState(VISIBLE_STEP);
  const [workingId, setWorkingId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    getGroundRules(currentUser.authId)
      .then(setRules)
      .catch(() => toast.error("그라운드 룰을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const filtered = useMemo(() => rules
    .filter((rule) => (filter === "all" || rule.category === filter) && (!search || rule.content.includes(search) || rule.author.includes(search)))
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sort === "likes") return b.likes - a.likes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }), [filter, rules, search, sort]);
  const visibleRules = filtered.slice(0, visible);
  const canManage = (rule: GroundRule) => Boolean(currentUser && (isAdmin || rule.createdBy === currentUser.authId));

  if (!currentUser) return null;

  const handleSubmit = async () => {
    if (!form.content.trim()) return toast.error("규칙 내용을 입력해 주세요.");
    const tags = form.tags.split(/\s+/).filter(Boolean).map((tag) => tag.startsWith("#") ? tag : `#${tag}`);
    setWorkingId(editingId ?? "new");
    try {
      if (editingId) {
        const existing = rules.find((rule) => rule.id === editingId);
        if (!existing || !canManage(existing)) throw new Error("수정 권한이 없습니다.");
        const updated = { ...existing, content: form.content.trim(), category: form.category, tags };
        await updateGroundRule(updated);
        setRules((list) => list.map((rule) => rule.id === editingId ? updated : rule));
        toast.success("규칙을 수정했습니다.");
      } else {
        const now = new Date().toISOString();
        const newRule: GroundRule = {
          id: createId("gr"), content: form.content.trim(), author: currentUser.name,
          category: form.category, likes: 0, likedBy: [], isPinned: false, tags,
          createdAt: now, updatedAt: now, createdBy: currentUser.authId,
          createdByMemberId: currentUser.memberId, isLiked: false,
        };
        await createGroundRule(newRule);
        setRules((list) => [newRule, ...list]);
        toast.success("새 그라운드 룰을 제안했습니다.");
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "규칙을 저장하지 못했습니다.");
    } finally { setWorkingId(null); }
  };

  const handleEdit = (rule: GroundRule) => {
    if (!canManage(rule)) return toast.error("작성자 또는 관리자만 수정할 수 있습니다.");
    setForm({ content: rule.content, category: rule.category, tags: rule.tags.join(" ") });
    setEditingId(rule.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (rule: GroundRule) => {
    if (!canManage(rule)) return toast.error("작성자 또는 관리자만 삭제할 수 있습니다.");
    if (!window.confirm("이 규칙을 삭제할까요?")) return;
    setWorkingId(rule.id);
    try {
      await deleteGroundRule(rule.id);
      setRules((list) => list.filter((item) => item.id !== rule.id));
      toast.success("규칙을 삭제했습니다.");
    } catch { toast.error("규칙을 삭제하지 못했습니다."); }
    finally { setWorkingId(null); }
  };

  const handleLike = async (rule: GroundRule) => {
    if (workingId === `like-${rule.id}`) return;
    const nextLiked = !rule.isLiked;
    setWorkingId(`like-${rule.id}`);
    setRules((list) => list.map((item) => item.id === rule.id ? { ...item, isLiked: nextLiked, likes: item.likes + (nextLiked ? 1 : -1) } : item));
    try {
      await setGroundRuleLike(rule.id, currentUser.memberId, currentUser.authId, nextLiked);
    } catch {
      setRules((list) => list.map((item) => item.id === rule.id ? { ...item, isLiked: !nextLiked, likes: item.likes + (nextLiked ? -1 : 1) } : item));
      toast.error("공감을 저장하지 못했습니다.");
    } finally { setWorkingId(null); }
  };

  const handlePin = async (rule: GroundRule) => {
    if (!canManage(rule)) return;
    const updated = { ...rule, isPinned: !rule.isPinned };
    try {
      await updateGroundRule(updated);
      setRules((list) => list.map((item) => item.id === rule.id ? updated : item));
      toast.success(updated.isPinned ? "중요 규칙으로 고정했습니다." : "고정을 해제했습니다.");
    } catch { toast.error("고정 상태를 저장하지 못했습니다."); }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-purple-900 p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-8 top-1/2 hidden h-48 w-48 -translate-y-1/2 rounded-full bg-white/10 sm:block" />
        <img src={rulesImage} alt="" className="absolute right-5 top-1/2 hidden h-40 w-40 -translate-y-1/2 object-contain drop-shadow-2xl sm:block" />
        <div className="relative max-w-xl">
          <div className="mb-3 flex items-center gap-2"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Shield className="h-5 w-5" /></div><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">광주 2반, 함께 지키는 약속</span></div>
          <h1 className="text-2xl font-black sm:text-3xl">광주 2반 그라운드 룰</h1>
          <p className="mt-2 text-sm text-violet-200">제안과 공감이 계정에 연결되어 안전하게 저장됩니다.</p>
          <p className="mt-4 text-sm text-white/70">총 <b className="text-white">{rules.length}개</b> 규칙</p>
        </div>
      </section>

      {showForm && <section className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50 p-5">
        <div className="flex items-center justify-between"><h2 className="text-sm font-black text-gray-800">{editingId ? "규칙 수정" : "새로운 규칙 제안"}</h2><span className="text-xs font-bold text-violet-600">작성자 {currentUser.name}</span></div>
        <input value={form.content} onChange={(event) => setForm((value) => ({ ...value, content: event.target.value }))} maxLength={300} placeholder="예: 수업 중 휴대폰은 무음으로..." className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
        <div className="grid gap-3 sm:grid-cols-2"><select value={form.category} onChange={(event) => setForm((value) => ({ ...value, category: event.target.value as GroundRuleCategory }))} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm">{GROUND_RULE_CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select><input value={form.tags} onChange={(event) => setForm((value) => ({ ...value, tags: event.target.value }))} placeholder="#배려 #친목" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" /></div>
        <div className="flex gap-2"><button onClick={() => void handleSubmit()} disabled={workingId !== null} className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{workingId ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{editingId ? "수정 완료" : "추가하기"}</button><button onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600"><X className="h-4 w-4" />취소</button></div>
      </section>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-xs flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="규칙 검색" className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm" /></div>
        <div className="flex flex-wrap gap-1.5"><button onClick={() => setFilter("all")} className={`rounded-xl px-3 py-2 text-xs font-bold ${filter === "all" ? "bg-violet-600 text-white" : "border border-gray-200 bg-white text-gray-600"}`}>전체</button>{GROUND_RULE_CATEGORIES.map((category) => <button key={category.value} onClick={() => setFilter(category.value as GroundRuleCategory)} className={`rounded-xl px-3 py-2 text-xs font-bold ${filter === category.value ? "bg-violet-600 text-white" : "border border-gray-200 bg-white text-gray-600"}`}>{category.label}</button>)}</div>
        <div className="ml-auto flex gap-2"><select value={sort} onChange={(event) => setSort(event.target.value as SortOrder)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"><option value="latest">최신순</option><option value="likes">공감순</option></select>{!showForm && <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }} className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white"><Plus className="h-4 w-4" />규칙 추가</button>}</div>
      </div>

      {loading ? <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray-400"><LoaderCircle className="h-5 w-5 animate-spin" />규칙을 불러오는 중입니다.</div> : filtered.length === 0 ? <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">해당하는 규칙이 없습니다.</div> : <div className="space-y-2.5">{visibleRules.map((rule, index) => <article key={rule.id} className={`flex items-start gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-5 ${rule.isPinned ? "border-violet-300 ring-1 ring-violet-100" : "border-gray-200"}`}><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">{index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start gap-2">{rule.isPinned && <Pin className="mt-1 h-3.5 w-3.5 text-violet-500" />}<p className="font-bold text-gray-800">{rule.content}</p></div><div className="mt-2 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${CAT_COLORS[rule.category]}`}>{catLabel(rule.category)}</span><span className="text-xs text-gray-400">{rule.author}</span>{rule.tags.map((tag) => <span key={tag} className="text-xs font-bold text-violet-500">{tag}</span>)}</div></div><div className="flex flex-none items-center gap-1"><button onClick={() => void handleLike(rule)} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${rule.isLiked ? "bg-rose-50 text-rose-600" : "text-rose-400 hover:bg-rose-50"}`}><Heart className={`h-3.5 w-3.5 ${rule.isLiked ? "fill-current" : ""}`} />{rule.likes}</button>{canManage(rule) && <button onClick={() => void handlePin(rule)} className={`rounded-lg p-1.5 ${rule.isPinned ? "text-violet-600" : "text-gray-300 hover:text-violet-500"}`} aria-label="고정"><Pin className="h-3.5 w-3.5" /></button>}{canManage(rule) && <button onClick={() => handleEdit(rule)} className="rounded-lg p-1.5 text-gray-300 hover:text-blue-500" aria-label="수정"><Edit2 className="h-3.5 w-3.5" /></button>}{canManage(rule) && <button onClick={() => void handleDelete(rule)} className="rounded-lg p-1.5 text-gray-300 hover:text-red-500" aria-label="삭제"><Trash2 className="h-3.5 w-3.5" /></button>}</div></article>)}{filtered.length > visible && <button onClick={() => setVisible((count) => count + VISIBLE_STEP)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-500"><ChevronDown className="h-4 w-4" />더보기 ({filtered.length - visible}개)</button>}</div>}
    </div>
  );
}
