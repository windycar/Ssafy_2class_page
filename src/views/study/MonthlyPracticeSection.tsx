import { useEffect, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { MONTHLY_PRACTICE_SETS } from "../../data/monthlyPracticeSets";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";

function PracticeDocument({ setId, authId }: { setId: string; authId: string }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const session = (await supabase?.auth.getSession())?.data.session;
      if (!session || session.user.id !== authId) throw new Error("로그인 계정을 다시 확인해 주세요.");
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "monthly-practice.read", setId }),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || typeof result.content !== "string") {
        throw new Error(result.error || "모의고사 문제를 불러오지 못했습니다.");
      }
      if (!controller.signal.aborted) setContent(result.content.replace(/\r\n/g, "\n"));
    }

    void load().catch((cause: unknown) => {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : "모의고사 문제를 불러오지 못했습니다.");
      }
    });
    return () => controller.abort();
  }, [setId, authId]);

  if (error) return <p role="alert" className="text-sm text-rose-700">{error}</p>;
  if (!content) return <p role="status" className="text-sm text-slate-600">문제를 불러오는 중입니다.</p>;

  return (
    <div className="space-y-4 text-sm leading-7 text-slate-700">
      {content.split(/^(```|~~~)[^\S\n]*[^\n]*\n([\s\S]*?)^\1[\t ]*(?:\n|$)/m).map((part, index) => {
        if (index % 3 === 1) return null;
        if (index % 3 === 2) {
          return <pre key={index} className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100"><code>{part.trimEnd()}</code></pre>;
        }
        return part.trim().split(/\n\s*\n/).filter(Boolean).map((block, blockIndex) => {
          const key = `${index}-${blockIndex}`;
          const heading = block.match(/^#{1,6}\s+([^\n]+)$/);
          if (heading) return <h4 key={key} className="text-base font-black text-violet-950">{heading[1].replace(/[*`]/g, "")}</h4>;
          if (block === "---" || /^\[Notion 원본\]/.test(block)) return null;
          return <p key={key} className="whitespace-pre-wrap break-words">{block.replace(/\*\*|`/g, "")}</p>;
        });
      })}
    </div>
  );
}

export default function MonthlyPracticeSection({ round }: { round: number }) {
  const { currentUser } = useAuth();
  const [openSet, setOpenSet] = useState<string | null>(null);
  const sets = MONTHLY_PRACTICE_SETS[round];
  if (!sets || !currentUser?.authId) return null;

  return (
    <section aria-labelledby="monthly-practice-title">
      <h2 id="monthly-practice-title" className="mb-4 flex items-center gap-2 text-2xl font-black text-slate-950">
        <BookOpen className="h-5 w-5 text-violet-700" aria-hidden="true" /> 창작 모의고사
      </h2>
      <div className="space-y-3">
        {sets.map(({ id, title, topics }) => {
          const open = openSet === id;
          const panelId = `practice-${id}`;
          return (
            <article key={id} className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenSet(open ? null : id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-violet-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-600"
                >
                  <span>
                    <span className="block font-black text-violet-950">{title}</span>
                    <span className="mt-1 block text-sm font-normal text-slate-600">{topics}</span>
                  </span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-violet-700 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} hidden={!open} className="border-t border-violet-100 p-5 sm:p-6">
                {open && <PracticeDocument key={`${currentUser.authId}:${id}`} setId={id} authId={currentUser.authId} />}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
