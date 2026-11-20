import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Bell, CandyCane, Circle, Cookie, Gift, ImagePlus, LoaderCircle, Ribbon, Snowflake, Star } from "lucide-react";
import { toast } from "sonner";
import {
  manageChristmasTreeOrnaments,
  type ChristmasOrnament,
  type OrnamentDesign,
  type OrnamentKind,
  type OrnamentPosition,
  type OrnamentSlot,
} from "../services/christmasTree";
import { prepareOrnamentPhoto, ORNAMENT_IMAGE_MAX_BYTES, ORNAMENT_IMAGE_TYPES, type PreparedOrnamentPhoto } from "../utils/christmasTreeImage";

const ornamentOptions = [
  { kind: "star", label: "별", Icon: Star, color: "fill-amber-300 text-amber-700" },
  { kind: "bell", label: "종", Icon: Bell, color: "fill-orange-300 text-orange-800" },
  { kind: "snowflake", label: "눈송이", Icon: Snowflake, color: "text-sky-700" },
  { kind: "bauble", label: "장식 볼", Icon: Circle, color: "fill-rose-400 text-rose-800" },
  { kind: "candy", label: "사탕 지팡이", Icon: CandyCane, color: "text-red-700" },
  { kind: "ribbon", label: "리본", Icon: Ribbon, color: "fill-fuchsia-300 text-fuchsia-800" },
  { kind: "gift", label: "선물 상자", Icon: Gift, color: "fill-emerald-300 text-emerald-800" },
  { kind: "gingerbread", label: "진저브레드", Icon: Cookie, color: "fill-amber-400 text-amber-900" },
] as const;

type Props = {
  isDemo: boolean;
  onUpdate: (ornaments: ChristmasOrnament[], highlightedId: string | null) => void;
  pickPosition: (design: OrnamentDesign) => Promise<OrnamentPosition | null>;
  cancelPlacement: () => void;
};

export default function ChristmasTreeOrnaments({ isDemo, onUpdate, pickPosition, cancelPlacement }: Props) {
  const [ownOrnaments, setOwnOrnaments] = useState<ChristmasOrnament[]>([]);
  const [slot, setSlot] = useState<OrnamentSlot>(1);
  const [draftKind, setDraftKind] = useState<OrnamentKind | null>(null);
  const [draftPhoto, setDraftPhoto] = useState<PreparedOrnamentPhoto | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [operation, setOperation] = useState<"preparing-image" | "placing" | "saving" | null>(null);
  const ownOrnament = ownOrnaments.find((item) => item.own_slot === slot);
  const selected = draftKind ?? ownOrnament?.kind ?? "star";
  const image = selected === "custom" ? draftPhoto?.preview ?? ownOrnament?.image_data ?? null : null;
  const validDesign = selected !== "custom" || image !== null;
  const changedDesign = ownOrnament && (selected !== ownOrnament.kind || (selected === "custom" && draftPhoto !== null));

  useEffect(() => {
    if (isDemo) return;
    const controller = new AbortController();
    manageChristmasTreeOrnaments(undefined, controller.signal)
      .then((ornaments) => {
        if (controller.signal.aborted) return;
        setOwnOrnaments(ornaments.filter((ornament) => ornament.own_slot !== null));
        onUpdate(ornaments, null);
        setLoadState("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadState("error");
      });
    return () => controller.abort();
  }, [isDemo, loadAttempt, onUpdate]);

  function resetDraft() {
    setDraftKind(null);
    setDraftPhoto(null);
    setImageError(null);
  }

  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file || operation) return;
    if (!ORNAMENT_IMAGE_TYPES.includes(file.type)) {
      setImageError("JPG, PNG, WebP 사진을 골라 주세요.");
      return;
    }
    if (file.size > ORNAMENT_IMAGE_MAX_BYTES) {
      setImageError("10MB 이하 사진을 골라 주세요.");
      return;
    }

    setImageError(null);
    setOperation("preparing-image");
    try {
      setDraftPhoto(await prepareOrnamentPhoto(file));
    } catch {
      setImageError("사진을 열지 못했어요. 다른 파일을 골라 주세요.");
    } finally {
      setOperation(null);
    }
  }

  async function updateOrnament(action: "place" | "change" | "remove") {
    if (isDemo || loadState !== "ready" || operation) return;
    if (action !== "remove" && !validDesign) return;
    const design = { kind: selected, image_data: image };
    try {
      let position: OrnamentPosition | undefined;
      if (action === "place") {
        setOperation("placing");
        const picked = await pickPosition(design);
        if (!picked) return;
        position = picked;
      }
      setOperation("saving");
      const detail = selected === "custom" ? draftPhoto?.detail : undefined;
      const ornaments = await manageChristmasTreeOrnaments(action === "remove" ? { slot, remove: true } : { slot, design, position, detail });
      setOwnOrnaments(ornaments.filter((ornament) => ornament.own_slot !== null));
      resetDraft();
      const highlighted = action === "place" ? ornaments.find((ornament) => ornament.own_slot === slot) : null;
      onUpdate(ornaments, highlighted?.id ?? null);
      toast.success(action === "remove" ? "오너먼트를 떼었어요."
        : action === "change" ? selected === "custom" ? "오너먼트 사진을 저장했어요." : "오너먼트 종류를 바꿨어요."
        : ownOrnament ? "오너먼트를 옮겼어요." : "오너먼트를 달았어요.");
    } catch {
      toast.error("장식을 저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setOperation(null);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void updateOrnament("place");
  }

  return (
    <section className="rounded-3xl border border-[#e1e6db] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="flex items-center gap-3 text-lg font-extrabold text-[#243b31]">
        <Star className="size-5 shrink-0 text-[#2d674d]" aria-hidden="true" />
        오너먼트 달기
      </h2>
      {isDemo ? (
        <p className="mt-2 text-sm text-[#55695e]">로그인하면 장식을 두 개까지 달 수 있어요.</p>
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
          <p className="text-sm leading-5 text-[#55695e]" aria-live="polite">내 장식 {ownOrnaments.length} / 2개</p>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="내 장식 선택">
            {([1, 2] as const).map((number) => {
              const existing = ownOrnaments.find((item) => item.own_slot === number);
              const label = existing?.kind === "custom" ? "내 사진" : ornamentOptions.find(({ kind }) => existing?.kind === kind)?.label;
              return (
                <button key={number} type="button" disabled={operation !== null} aria-pressed={slot === number}
                  onClick={() => { if (slot !== number) { setSlot(number); resetDraft(); } }}
                  className="rounded-xl border border-[#e1e6db] px-2 py-2 text-sm font-bold text-[#355144] aria-pressed:border-[#2d674d] aria-pressed:bg-[#e8f1ea]">
                  {label ? `장식 ${number} · ${label}` : `장식 ${number} · 비어 있음`}
                </button>
              );
            })}
          </div>
          <fieldset disabled={operation !== null}>
            <legend className="sr-only">장식 종류</legend>
            <div className="grid grid-cols-4 gap-1.5">
              {ornamentOptions.map(({ kind, label, Icon, color }) => (
                <label key={kind}>
                  <input type="radio" name="ornament-kind" value={kind} checked={selected === kind} onChange={() => setDraftKind(kind)} className="peer sr-only" />
                  <span className="flex min-h-15 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-[#e1e6db] px-1 text-center text-[11px] leading-tight font-bold text-[#355144] peer-checked:border-[#2d674d] peer-checked:bg-[#e8f1ea] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2d674d] peer-disabled:cursor-default">
                    <Icon className={`size-5 ${color}`} aria-hidden="true" />
                    {label}
                  </span>
                </label>
              ))}
            </div>
            <label className="mt-1.5 block">
              <input type="radio" name="ornament-kind" value="custom" checked={selected === "custom"} onChange={() => setDraftKind("custom")} className="peer sr-only" />
              <span className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#a7bfb0] text-sm font-bold text-[#355144] peer-checked:border-solid peer-checked:border-[#2d674d] peer-checked:bg-[#e8f1ea] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2d674d] peer-disabled:cursor-default">
                <ImagePlus className="size-4" aria-hidden="true" /> 내 사진으로 만들기
              </span>
            </label>
          </fieldset>
          {selected === "custom" && (
            <div className="rounded-xl bg-[#f1f5ef] p-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 shrink-0 -rotate-[4deg] bg-[#fffdf4] p-1 pb-3 shadow-sm">
                  <span aria-hidden="true" className="absolute -top-1 left-1/2 h-2 w-4 -translate-x-1/2 rounded-[1px] bg-[#dfbd82]" />
                  <div className="flex aspect-square items-center justify-center overflow-hidden bg-[#e7e1d3] text-[#795c31]">
                    {image
                      ? <img src={image} alt="사진 오너먼트 미리보기" className="size-full object-cover" />
                      : <ImagePlus className="size-5" aria-hidden="true" />}
                  </div>
                </div>
                <div className="min-w-0">
                  <label className="inline-block">
                    <input type="file" accept={ORNAMENT_IMAGE_TYPES.join(",")} aria-describedby="ornament-image-formats" disabled={operation !== null} onChange={(event) => void selectImage(event)} className="peer sr-only" />
                    <span className="inline-flex min-h-9 cursor-pointer items-center rounded-lg bg-white px-2.5 text-xs font-bold text-[#214d3a] peer-focus-visible:outline-2 peer-focus-visible:outline-[#2d674d] peer-disabled:cursor-default peer-disabled:opacity-55">
                      {operation === "preparing-image" ? "사진 준비 중" : image ? "사진 바꾸기" : "사진 선택"}
                    </span>
                  </label>
                  <p id="ornament-image-formats" className="mt-1 text-xs leading-4 text-[#55695e]">JPG · PNG · WebP, 10MB 이하</p>
                </div>
              </div>
              {imageError && <p role="alert" className="mt-2 text-xs text-red-800">{imageError}</p>}
            </div>
          )}
          {operation === "placing" ? (
            <div className="flex items-center justify-between gap-2 rounded-xl bg-[#e8f1ea] px-3 py-2 text-sm text-[#214d3a]">
              <p role="status">트리에서 위치를 골라 주세요.</p>
              <button type="button" onClick={cancelPlacement} className="shrink-0 rounded-lg px-2 py-1.5 font-bold hover:bg-[#dbe9df]">취소</button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={operation !== null || !validDesign} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#26583f] px-2 text-sm font-bold text-white hover:bg-[#194530] disabled:opacity-55">
                {operation === "saving" && <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />}
                {operation === "saving" ? "저장 중" : ownOrnament ? "위치 옮기기" : "위치 고르기"}
              </button>
              {changedDesign && (
                <button type="button" disabled={operation !== null || !validDesign} onClick={() => void updateOrnament("change")} className="rounded-xl bg-[#e8f1ea] px-2 text-sm font-bold text-[#214d3a] hover:bg-[#dbe9df] disabled:opacity-55">
                  {selected === "custom" ? "사진 저장" : "종류 저장"}
                </button>
              )}
              {ownOrnament && (
                <button type="button" disabled={operation !== null} onClick={() => void updateOrnament("remove")} className="rounded-xl bg-[#f1f5ef] px-2 text-sm font-bold text-[#355144] hover:bg-[#e8f1ea] disabled:opacity-55">
                  떼기
                </button>
              )}
            </div>
          )}
        </form>
      )}
    </section>
  );
}
