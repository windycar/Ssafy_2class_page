import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, Check, Clock3, ExternalLink, MapPin, Pencil, Plus, RefreshCw, Utensils, Vote } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import type { AuthUser } from "../types/auth";
import type { DinnerPoll, DinnerPollInput, DinnerResponse, DinnerResponseInput } from "../types/dinner";
import { cancelDinnerResponse, getDinnerPolls, getDinnerResponses, saveDinnerPoll, saveDinnerResponse, setDinnerPollClosed } from "../services/dinnerStorage";
import { formatDinnerDate, isDinnerPollOpen } from "../utils/dinnerPoll";
import { getDinnerDemoData } from "../data/dinnerDemoData";
import DinnerPollForm from "../components/dinner/DinnerPollForm";
import DinnerResponseForm from "../components/dinner/DinnerResponseForm";
import DinnerPollResults from "../components/dinner/DinnerPollResults";

const errorMessage = (cause: unknown) => cause instanceof Error ? cause.message : "회식 투표를 불러오지 못했습니다. 다시 시도해 주세요.";

export default function DinnerVoteView() {
  const { currentUser } = useAuth();
  return currentUser ? <DinnerPage key={currentUser.authId || "demo"} user={currentUser} /> : null;
}

function DinnerPage({ user }: { user: AuthUser }) {
  const isDemo = user.isDemo === true;
  const isAdmin = !isDemo && user.role === "admin" && user.isActive;
  const [polls, setPolls] = useState<DinnerPoll[]>([]);
  const [responses, setResponses] = useState<DinnerResponse[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<"create" | "edit" | null>(null);
  const [managing, setManaging] = useState(false);
  const [now, setNow] = useState(Date.now());
  const selectedRef = useRef("");
  const requestRef = useRef(0);
  const alive = useRef(true);

  const refresh = useCallback(async (pollId = selectedRef.current) => {
    const requestId = ++requestRef.current;
    setRefreshing(true);
    try {
      const demo = isDemo ? getDinnerDemoData() : null;
      const nextPolls = demo?.polls ?? await getDinnerPolls(user);
      const nextId = nextPolls.some(p => p.id === pollId) ? pollId : nextPolls.find(p => isDinnerPollOpen(p))?.id ?? nextPolls[0]?.id ?? "";
      const nextResponses = demo?.responses ?? (nextId ? await getDinnerResponses(user, nextId) : []);
      if (!alive.current || requestId !== requestRef.current) return;
      selectedRef.current = nextId;
      setSelectedId(nextId); setPolls(nextPolls); setResponses(nextResponses); setError(""); setNow(Date.now());
    } catch (cause) {
      if (alive.current && requestId === requestRef.current) setError(errorMessage(cause));
    } finally {
      if (alive.current && requestId === requestRef.current) { setRefreshing(false); setLoading(false); }
    }
  }, [isDemo, user]);

  useEffect(() => {
    alive.current = true;
    void refresh();
    const onRefresh = () => { if (document.visibilityState !== "hidden") void refresh(); };
    window.addEventListener("focus", onRefresh);
    window.addEventListener("online", onRefresh);
    document.addEventListener("visibilitychange", onRefresh);
    const timer = window.setInterval(onRefresh, 30000);
    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      alive.current = false; ++requestRef.current;
      window.removeEventListener("focus", onRefresh); window.removeEventListener("online", onRefresh);
      document.removeEventListener("visibilitychange", onRefresh);
      window.clearInterval(timer); window.clearInterval(clock);
    };
  }, [refresh]);

  const poll = polls.find(item => item.id === selectedId);
  const open = poll ? isDinnerPollOpen(poll, now) : false;
  const ownResponse = responses.find(response => response.member_id === user.memberId);

  function selectPoll(id: string) {
    if (id === selectedRef.current || refreshing || managing || form) return;
    setLoading(true); setResponses([]); selectedRef.current = id; setSelectedId(id);
    void refresh(id);
  }

  async function savePoll(input: DinnerPollInput) {
    const saved = await saveDinnerPoll(user, input, form === "edit" ? poll?.id : undefined);
    setForm(null); selectedRef.current = saved.id;
    toast.success("회식 투표를 저장했습니다."); await refresh(saved.id);
  }

  async function saveResponse(input: DinnerResponseInput) {
    if (!poll || isDemo) return;
    setManaging(true);
    try { await saveDinnerResponse(user, poll, input); toast.success("참여 응답을 저장했습니다."); await refresh(poll.id); }
    finally { setManaging(false); }
  }

  async function cancelResponse() {
    if (!poll || isDemo) return;
    setManaging(true);
    try { await cancelDinnerResponse(user, poll.id); toast.success("내 응답을 취소했습니다."); await refresh(poll.id); }
    finally { setManaging(false); }
  }

  async function toggleClosed() {
    if (!poll || !isAdmin) return;
    setManaging(true);
    try { await setDinnerPollClosed(user, poll.id, !poll.is_closed); toast.success(poll.is_closed ? "투표를 다시 열었습니다." : "투표를 마감했습니다."); await refresh(poll.id); }
    catch (cause) { toast.error(errorMessage(cause)); }
    finally { setManaging(false); }
  }

  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-3xl bg-[#0b1d3a] p-6 text-white sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-amber-400/10 blur-2xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <div><span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-200"><Utensils className="h-3.5 w-3.5" />함께 먹는 우리 반</span>
          <h1 className="text-2xl font-extrabold sm:text-3xl">회식 참여 투표</h1><p className="mt-2 text-sm leading-6 text-blue-100/70">날짜와 장소를 확인하고 참여 여부를 알려 주세요.<br />날짜를 조율할 때는 가능한 날을 모두 골라 주세요.</p></div>
        <div className="flex gap-2"><button type="button" onClick={() => void refresh()} disabled={refreshing || managing || Boolean(form)} aria-label="회식 투표 새로고침" className="rounded-xl border border-white/20 bg-white/10 p-3 hover:bg-white/20 disabled:opacity-40"><RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} /></button>
          {isAdmin && <button type="button" onClick={() => setForm("create")} disabled={refreshing || managing || Boolean(form)} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-extrabold text-amber-950 hover:bg-amber-300 disabled:opacity-40"><Plus className="h-4 w-4" />투표 만들기</button>}</div>
      </div>
    </section>

    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><span>{error}</span><button type="button" onClick={() => void refresh()} disabled={refreshing} className="font-bold underline">다시 불러오기</button></div>}
    {form && <DinnerPollForm key={form === "edit" ? poll?.id : "new"} poll={form === "edit" ? poll : undefined} hasResponses={responses.length > 0} onSave={savePoll} onCancel={() => setForm(null)} />}
    {polls.length > 0 && <nav aria-label="회식 투표 목록" className="flex gap-2 overflow-x-auto pb-2">{polls.map(item => <button key={item.id} type="button" onClick={() => selectPoll(item.id)} aria-current={item.id === selectedId ? "page" : undefined} disabled={refreshing || managing || Boolean(form)} className={`shrink-0 rounded-xl border px-4 py-3 text-left text-sm font-bold disabled:cursor-wait ${item.id === selectedId ? "border-[#1259AA] bg-[#1259AA] text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}><span className="mr-2 text-[10px] opacity-70">{isDinnerPollOpen(item, now) ? "진행 중" : "마감"}</span>{item.title}</button>)}</nav>}

    {loading ? <div role="status" className="py-20 text-center text-sm text-gray-500">회식 투표를 불러오는 중…</div> : !poll ? !error && <section className="rounded-3xl border border-dashed border-gray-200 bg-white px-5 py-16 text-center"><Vote className="mx-auto mb-4 h-12 w-12 text-blue-200" /><h2 className="text-lg font-extrabold text-gray-700">아직 등록된 회식 투표가 없습니다.</h2><p className="mt-2 text-sm text-gray-400">{isAdmin ? "위의 ‘투표 만들기’에서 날짜·시간·장소를 등록해 주세요." : "관리자가 투표를 올리면 이곳에서 참여할 수 있습니다."}</p></section> : <>
      <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex gap-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${open ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{open ? "투표 진행 중" : "투표 마감"}</span><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{poll.mode === "attendance" ? "날짜 확정" : "날짜 조율"}</span></div><h2 className="break-words text-xl font-extrabold text-gray-900">{poll.title}</h2></div>
          {isAdmin && <div className="flex gap-2"><button type="button" onClick={() => setForm("edit")} disabled={managing || refreshing || Boolean(form)} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 disabled:opacity-40"><Pencil className="h-3.5 w-3.5" />수정</button><button type="button" onClick={() => void toggleClosed()} disabled={managing || refreshing || Boolean(form) || (!poll.is_closed && !open)} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 disabled:opacity-40">{managing ? "처리 중…" : poll.is_closed ? "다시 열기" : "투표 마감"}</button></div>}
        </div>
        <dl className="mt-5 grid gap-4 rounded-2xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
          <div><dt className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-400"><CalendarDays className="h-3.5 w-3.5" />{poll.mode === "attendance" ? "회식 날짜" : "후보 날짜 범위"}</dt><dd className="font-bold text-gray-800">{poll.event_date ? formatDinnerDate(poll.event_date) : `${formatDinnerDate(poll.date_start!)} ~ ${formatDinnerDate(poll.date_end!)}`}</dd></div>
          <div><dt className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-400"><Clock3 className="h-3.5 w-3.5" />{poll.mode === "availability" ? "예정 시간" : "회식 시간"}</dt><dd className="font-bold text-gray-800">{poll.event_time.slice(0, 5)} <span className="text-xs font-normal text-gray-400">한국 시간</span></dd></div>
          <div><dt className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-400"><MapPin className="h-3.5 w-3.5" />장소</dt><dd className="break-words font-bold text-gray-800">{poll.location}{/^https?:\/\//i.test(poll.location_url) && <a href={poll.location_url} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-xs text-[#1259AA] underline">장소 보기<ExternalLink className="h-3 w-3" /></a>}</dd></div>
          <div><dt className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-400"><Check className="h-3.5 w-3.5" />투표 마감</dt><dd className="font-bold text-gray-800">{poll.deadline ? new Date(poll.deadline).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) : poll.mode === "attendance" ? "관리자 마감 또는 회식 시작 전까지" : "관리자 마감 전까지"}</dd></div>
        </dl>
        {poll.notice && <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">{poll.notice}</p>}
      </section>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]"><DinnerResponseForm key={poll.id} poll={poll} response={ownResponse} open={open} isDemo={isDemo} onSave={saveResponse} onCancel={cancelResponse} /><DinnerPollResults poll={poll} responses={responses} /></div>
      <p className="text-center text-xs text-gray-400">참여 현황은 30초마다 갱신됩니다. 다른 화면에서 돌아오면 자동으로 다시 확인합니다.</p>
    </>}
  </div>;
}
