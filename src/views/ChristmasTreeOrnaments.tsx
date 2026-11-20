import { useEffect, useState, type FormEvent } from "react";
import { Bell, Circle, LoaderCircle, Snowflake, Star } from "lucide-react";
import { toast } from "sonner";
import { manageChristmasTreeOrnament, type ChristmasOrnament, type OrnamentKind } from "../services/christmasTree";

const ornamentOptions = [
  { kind: "star", label: "별", Icon: Star, color: "fill-amber-300 text-amber-700" },
  { kind: "bell", label: "종", Icon: Bell, color: "fill-orange-300 text-orange-800" },
  { kind: "snowflake", label: "눈송이", Icon: Snowflake, color: "text-sky-700" },
  { kind: "bauble", label: "장식 볼", Icon: Circle, color: "fill-rose-400 text-rose-800" },
] as const;

type Props = {
  isDemo: boolean;
  onUpdate: (ornaments: ChristmasOrnament[], highlightedId: string | null) => void;
};

export default function ChristmasTreeOrnaments({ isDemo, onUpdate }: Props) {
  const [ownOrnament, setOwnOrnament] = useState<ChristmasOrnament | null>(null);
  const [selected, setSelected] = useState<OrnamentKind>("star");
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isDemo) return;
    const controller = new AbortController();
    manageChristmasTreeOrnament(null, false, controller.signal)
      .then((ornaments) => {
        if (controller.signal.aborted) return;
        const own = ornaments.find((ornament) => ornament.is_mine) ?? null;
        setOwnOrnament(own);
        if (own) setSelected(own.kind);
        onUpdate(ornaments, null);
        setLoadState("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadState("error");
      });
    return () => controller.abort();
  }, [isDemo, loadAttempt, onUpdate]);

  async function updateOrnament(remove: boolean) {
    if (isDemo || loadState !== "ready" || saving) return;
    setSaving(true);
    try {
      const ornaments = await manageChristmasTreeOrnament(remove ? null : selected, remove);
      const own = ornaments.find((ornament) => ornament.is_mine) ?? null;
      setOwnOrnament(own);
      onUpdate(ornaments, own?.id ?? null);
      toast.success(remove ? "오너먼트를 떼었어요." : ownOrnament ? "오너먼트를 바꿨어요." : "오너먼트를 달았어요.");
    } catch {
      toast.error("장식을 저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected !== ownOrnament?.kind) void updateOrnament(false);
  }

  return (
    <section className="rounded-3xl border border-[#e1e6db] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="flex items-center gap-3 text-lg font-extrabold text-[#243b31]">
        <Star className="size-5 shrink-0 text-[#2d674d]" aria-hidden="true" />
        오너먼트 달기
      </h2>
      {isDemo ? (
        <p className="mt-2 text-sm text-[#55695e]">로그인하면 장식을 하나 달 수 있어요.</p>
      ) : loadState === "error" ? (
        <div className="mt-3 space-y-2 text-sm text-[#55695e]">
          <p role="status">오너먼트를 불러오지 못했어요.</p>
          <button type="button" onClick={() => { setLoadState("loading"); setLoadAttempt((attempt) => attempt + 1); }} className="rounded-xl bg-[#e8f1ea] px-4 py-2.5 font-bold text-[#214d3a]">
            다시 불러오기
          </button>
        </div>
      ) : loadState === "loading" ? (
        <p role="status" className="mt-3 flex items-center gap-2 text-sm text-[#55695e]">
          <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />
          불러오는 중이에요.
        </p>
      ) : (
        <form className="mt-2 space-y-3" onSubmit={submit}>
          <p className="text-sm leading-5 text-[#55695e]">
            {ownOrnament
              ? `내 장식 · ${ornamentOptions.find(({ kind }) => kind === ownOrnament.kind)?.label}`
              : "회원 한 분당 장식 하나를 달 수 있어요."}
          </p>
          <fieldset disabled={saving}>
            <legend className="sr-only">장식 종류</legend>
            <div className="grid grid-cols-4 gap-1.5">
              {ornamentOptions.map(({ kind, label, Icon, color }) => (
                <label key={kind}>
                  <input type="radio" name="ornament-kind" value={kind} checked={selected === kind} onChange={() => setSelected(kind)} className="peer sr-only" />
                  <span className="flex min-h-15 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-[#e1e6db] px-1 text-center text-[11px] leading-tight font-bold text-[#355144] peer-checked:border-[#2d674d] peer-checked:bg-[#e8f1ea] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2d674d] peer-disabled:cursor-default">
                    <Icon className={`size-5 ${color}`} aria-hidden="true" />
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex gap-2">
            <button type="submit" disabled={saving || selected === ownOrnament?.kind} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#26583f] px-3 text-sm font-bold text-white hover:bg-[#194530] disabled:opacity-55">
              {saving && <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />}
              {saving ? "저장 중" : ownOrnament ? "장식 바꾸기" : "장식 달기"}
            </button>
            {ownOrnament && (
              <button type="button" disabled={saving} onClick={() => void updateOrnament(true)} className="rounded-xl bg-[#f1f5ef] px-3 text-sm font-bold text-[#355144] hover:bg-[#e8f1ea] disabled:opacity-55">
                떼기
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
