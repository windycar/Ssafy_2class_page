import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, LockKeyhole, Pencil, Pin, Plus, StickyNote, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import christmasTreeArt from "../assets/home/quick-menu/christmas-tree.png";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "../app/components/ui/alert-dialog";
import { useAuth } from "../hooks/useAuth";
import {
  CHRISTMAS_NOTE_LIMIT,
  CHRISTMAS_NOTES_PER_MEMBER,
  deleteChristmasTreeNote,
  getChristmasTreeNotes,
  getChristmasTreePhotoDetail,
  saveChristmasTreeNote,
  type ChristmasNote,
  type ChristmasOrnament,
  type OrnamentDesign,
  type OrnamentKind,
  type OrnamentPosition,
  type SceneOrnament,
} from "../services/christmasTree";
import ChristmasTreeOrnaments from "./ChristmasTreeOrnaments";

// Reload the embedded scene when its message format changes so an open tab uses the matching renderer.
const TREE_SCENE_URL = `${import.meta.env.BASE_URL}ssafy-code-tree.html?embed=1&v=8`;
const DEMO_NOTES: ChristmasNote[] = [
  { id: "demo-1", content: "어려운 문제도 같이 풀어서 즐거웠어요. 우리 반 모두 따뜻한 연말 보내요!", author_name: null, is_sample: true },
  { id: "demo-2", content: "매일 아침 인사해 줘서 고마워요. 메리 크리스마스!", author_name: null, is_sample: true },
  { id: "demo-3", content: "내년에도 서로 응원하면서 함께 성장해요 🎄", author_name: null, is_sample: true },
];

type TreeNotes = Awaited<ReturnType<typeof getChristmasTreeNotes>>;
type NoteEditor = { kind: "add" } | { kind: "edit"; noteId: string };
type OrnamentPlacement = OrnamentDesign & { id: string };
type PendingPlacement = { id: string; resolve: (position: OrnamentPosition | null) => void };

export default function ChristmasTreeView() {
  const { currentUser, isDemo } = useAuth();
  return <ChristmasTree key={isDemo ? "demo" : currentUser?.authId} isDemo={isDemo} />;
}

function ChristmasTree({ isDemo }: { isDemo: boolean }) {
  const scene = useRef<HTMLIFrameElement>(null);
  const pendingNoteId = useRef<string | null>(null);
  const pendingPlacement = useRef<PendingPlacement | null>(null);
  const [tree, setTree] = useState<TreeNotes | null>(isDemo ? { notes: DEMO_NOTES, ownNotes: [] } : null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [draft, setDraft] = useState("");
  const [showName, setShowName] = useState(false);
  const [editor, setEditor] = useState<NoteEditor | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newNoteId, setNewNoteId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<ChristmasNote | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<ChristmasNote | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [ornaments, setOrnaments] = useState<SceneOrnament[]>([]);
  const [ornamentArt, setOrnamentArt] = useState<Partial<Record<OrnamentKind, string>>>({});
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [photoDetail, setPhotoDetail] = useState<{ id: string; image: string } | null>(null);
  const [highlightedOrnamentId, setHighlightedOrnamentId] = useState<string | null>(null);
  const [ornamentPlacement, setOrnamentPlacement] = useState<OrnamentPlacement | null>(null);

  const notes = tree?.notes;
  const selectedPhoto = ornaments.find((ornament) => ornament.id === selectedPhotoId && ornament.kind === "custom");
  const detailedImage = photoDetail && photoDetail.id === selectedPhoto?.id ? photoDetail.image : null;
  const displayedPhoto = detailedImage ?? selectedPhoto?.image_data;
  const hasPhotos = ornaments.some((ornament) => ornament.kind === "custom");
  const noteCount = notes?.length ?? 0;
  const draftLength = Array.from(draft).length;
  const ownedCount = tree?.ownNotes.length ?? 0;
  const canAdd = ownedCount < CHRISTMAS_NOTES_PER_MEMBER;
  const editing = editor?.kind === "edit";
  const showComposer = editing || (canAdd && (ownedCount === 0 || editor?.kind === "add"));

  useEffect(() => {
    if (isDemo) return;
    const controller = new AbortController();

    getChristmasTreeNotes(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        const { notes, ownNotes } = result;
        const ownedById = new Map(ownNotes.map((note) => [note.id, note]));
        const listedIds = new Set(notes.map(({ id }) => id));
        const mergedNotes = [
          ...ownNotes.filter(({ id }) => !listedIds.has(id)),
          ...notes.map((note) => ownedById.get(note.id) ?? note),
        ];
        setTree({ notes: mergedNotes, ownNotes });
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      });
    return () => controller.abort();
  }, [isDemo, loadAttempt]);

  const updateOrnaments = useCallback((items: ChristmasOrnament[], highlightedId: string | null) => {
    setOrnaments(items.map(({ id, kind, height, azimuth, image_data }) => ({ id, kind, height, azimuth, image_data })));
    setHighlightedOrnamentId(highlightedId);
    if (highlightedId) scene.current?.scrollIntoView({ block: "nearest" });
  }, []);

  const pickOrnamentPosition = useCallback((design: OrnamentDesign) => {
    if (pendingPlacement.current) return Promise.resolve(null);
    const id = crypto.randomUUID();
    scene.current?.scrollIntoView({ block: "start" });
    scene.current?.focus({ preventScroll: true });
    setOrnamentPlacement({ id, ...design });
    return new Promise<OrnamentPosition | null>((resolve) => {
      pendingPlacement.current = { id, resolve };
    });
  }, []);

  const finishPlacement = useCallback((position: OrnamentPosition | null) => {
    const placement = pendingPlacement.current;
    if (!placement) return;
    pendingPlacement.current = null;
    setOrnamentPlacement(null);
    placement.resolve(position);
  }, []);

  const sendSceneItems = useCallback(() => {
    scene.current?.contentWindow?.postMessage({
      type: "ssafy-tree:notes",
      notes: notes ?? [],
      newNoteId,
      ornaments,
      highlightedOrnamentId,
      ornamentPlacement,
    }, "*"); // The sandboxed scene has an opaque origin.
  }, [notes, newNoteId, ornaments, highlightedOrnamentId, ornamentPlacement]);

  useEffect(sendSceneItems, [sendSceneItems]);

  useEffect(() => {
    function receiveSceneMessage(event: MessageEvent) {
      if (event.source !== scene.current?.contentWindow) return;
      const { type, id, height, azimuth, artwork } = event.data ?? {};
      if (type === "ssafy-tree:ornament-art" && artwork && typeof artwork === "object") {
        setOrnamentArt(artwork);
        return;
      }
      if (type === "ssafy-tree:open-note") {
        const note = notes?.find((item) => item.id === id);
        if (note) setSelectedNote(note);
      }
      if (type === "ssafy-tree:open-photo" && !pendingPlacement.current &&
        ornaments.some((item) => item.id === id && item.kind === "custom" && item.image_data)) {
        setPhotoDetail(null);
        setSelectedPhotoId(id);
      }
      if (!pendingPlacement.current || pendingPlacement.current.id !== id) return;
      if (type === "ssafy-tree:cancel-ornament") finishPlacement(null);
      if (type === "ssafy-tree:place-ornament" && typeof height === "number" && height >= 0.03 && height <= 0.94 &&
        typeof azimuth === "number" && azimuth >= 0 && azimuth < 2 * Math.PI) {
        finishPlacement({ height, azimuth });
      }
    }
    window.addEventListener("message", receiveSceneMessage);
    return () => window.removeEventListener("message", receiveSceneMessage);
  }, [notes, ornaments, finishPlacement]);

  useEffect(() => () => { pendingPlacement.current?.resolve(null); }, []);

  useEffect(() => {
    if (!selectedPhotoId) return;
    const controller = new AbortController();
    getChristmasTreePhotoDetail(selectedPhotoId, controller.signal)
      .then((image) => {
        if (!controller.signal.aborted) setPhotoDetail(image ? { id: selectedPhotoId, image } : null);
      })
      .catch(() => {}); // The saved preview stays available when the larger image cannot be loaded.
    return () => controller.abort();
  }, [selectedPhotoId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (isDemo || !tree || !showComposer || !content || draftLength > CHRISTMAS_NOTE_LIMIT || submitting) return;

    setSubmitting(true);
    try {
      const noteId = editor?.kind === "edit" ? editor.noteId : (pendingNoteId.current ??= crypto.randomUUID());
      const result = await saveChristmasTreeNote(noteId, content, showName, editing);
      if (result.status !== "saved") {
        toast.error(result.status === "full" ? "포스트잇은 두 장까지 붙일 수 있어요." : "이 포스트잇은 이미 삭제되었어요.");
        resetEditor();
        setTree(null);
        setLoadAttempt((attempt) => attempt + 1);
        return;
      }

      const { note } = result;
      const nextNotes = editing
        ? tree.notes.map((current) => current.id === note.id ? note : current)
        : [note, ...tree.notes.filter(({ id }) => id !== note.id)];
      const nextOwnNotes = editing
        ? tree.ownNotes.map((current) => current.id === note.id ? note : current)
        : [...tree.ownNotes.filter(({ id }) => id !== note.id), note];
      setTree({ notes: nextNotes, ownNotes: nextOwnNotes });
      setSelectedNote((selected) => selected?.id === note.id ? note : selected);
      resetEditor();
      if (editing) {
        toast.success("포스트잇을 수정했어요.");
      } else {
        setNewNoteId(note.id);
        scene.current?.scrollIntoView({ block: "nearest" });
        const alreadySaved = note.content !== content || Boolean(note.author_name) !== showName;
        toast.success(alreadySaved ? "이미 붙인 포스트잇을 불러왔어요." : "트리에 포스트잇을 붙였어요.");
      }
    } catch {
      toast.error(editing ? "포스트잇 수정을 저장하지 못했어요. 다시 시도해 주세요." : "포스트잇을 붙이지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetEditor() {
    pendingNoteId.current = null;
    setEditor(null);
    setDraft("");
    setShowName(false);
  }

  function startEditing(note: ChristmasNote) {
    setDraft(note.content);
    setShowName(Boolean(note.author_name));
    setEditor({ kind: "edit", noteId: note.id });
    setNewNoteId(null);
  }

  async function confirmDelete() {
    if (isDemo || !tree || !noteToDelete || deleting || submitting) return;
    const { id } = noteToDelete;
    setDeleting(true);
    try {
      const removed = await deleteChristmasTreeNote(id);
      const remainingNotes = tree.notes.filter((note) => note.id !== id);
      setTree({ notes: remainingNotes, ownNotes: tree.ownNotes.filter((note) => note.id !== id) });
      setSelectedNote((selected) => selected?.id === id ? null : selected);
      setNewNoteId((newId) => newId === id ? null : newId);
      setNoteToDelete(null);
      if (removed) toast.success("포스트잇을 삭제했어요.");
      else toast.info("이미 삭제된 포스트잇이에요.");
    } catch {
      toast.error("포스트잇을 삭제하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3.5 sm:gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#dfece5] sm:size-14">
          <img src={christmasTreeArt} alt="" className="size-10 object-contain drop-shadow-sm sm:size-12" draggable={false} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#152b26] sm:text-3xl">크리스마스 트리</h1>
          <p className="mt-1 text-sm leading-5 text-[#51685e]">우리 반에 전하고 싶은 말을 포스트잇으로 남겨보세요.</p>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:grid-rows-[auto_1fr]">
        <section aria-label="포스트잇과 오너먼트가 붙은 트리" className="min-w-0 overflow-hidden rounded-3xl border border-[#20372f] bg-[#040810] shadow-xl shadow-[#132b22]/10 lg:row-span-2">
          <iframe
            ref={scene}
            onLoad={sendSceneItems}
            title="SSAFY 크리스마스 트리"
            src={TREE_SCENE_URL}
            sandbox="allow-scripts"
            className="block h-[clamp(440px,120vw,600px)] w-full scroll-mt-20 border-0 lg:h-[clamp(630px,calc(100dvh-4rem),780px)]"
          />
          <div className="flex min-h-15 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-[#233532] bg-[#0b161b] px-4 py-3 text-sm sm:px-5">
            <p className="text-[#c0d4cd]" aria-live="polite">
              {tree ? `${isDemo ? "예시 포스트잇" : "붙은 포스트잇"} ${noteCount}장` : loadError ? "포스트잇을 불러오지 못했어요." : "포스트잇을 불러오는 중이에요."}
            </p>
            {ornaments.length > 0 && <p className="text-[#c0d4cd]">오너먼트 {ornaments.length}개</p>}
            {(hasPhotos || noteCount > 0) && (
              <p className="text-[#a9c1b8]">{hasPhotos ? "폴라로이드를 누르면 사진을 크게 볼 수 있어요." : "트리를 돌려 포스트잇을 읽어보세요."}</p>
            )}
          </div>
          {notes && notes.length > 0 && (
            <details className="border-t border-[#233532] bg-[#0b161b] px-4 py-3 text-sm text-[#d6e8dd] sm:px-5">
              <summary className="w-fit cursor-pointer font-semibold">포스트잇 목록</summary>
              <ul className="mt-3 grid max-h-64 gap-1 overflow-y-auto sm:grid-cols-2">
                {notes.map((note) => (
                  <li key={note.id} className="min-w-0">
                    <button type="button" onClick={() => setSelectedNote(note)} className="w-full min-w-0 rounded-lg px-3 py-2 text-left hover:bg-white/10">
                      <span className="block truncate">{note.content}</span>
                      <span className="block truncate text-xs text-[#a9c1b8]">{note.is_sample ? "예시" : note.author_name || "익명"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>

        <section className="rounded-3xl border border-[#e1e6db] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <StickyNote className="mt-0.5 size-5 shrink-0 text-[#2d674d]" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold text-[#243b31]">{editing ? "포스트잇 수정" : ownedCount > 0 ? "내 포스트잇" : "포스트잇 붙이기"}</h2>
              {ownedCount === 0 && <p className="mt-1 text-sm leading-5 text-[#55695e]">회원 한 분당 두 장까지 남길 수 있어요.</p>}
            </div>
            {!isDemo && tree && ownedCount > 0 && (
              <p className="shrink-0 rounded-full bg-[#e8f1ea] px-2.5 py-1 text-xs font-bold text-[#214d3a]" aria-live="polite">
                {ownedCount} / {CHRISTMAS_NOTES_PER_MEMBER}장
              </p>
            )}
          </div>

          {isDemo ? (
            <p className="flex items-center gap-2 rounded-xl bg-[#f1f5ef] px-3 py-3 text-sm leading-5 text-[#355144]">
              <LockKeyhole className="size-4 shrink-0" aria-hidden="true" />
              회원으로 로그인하면 포스트잇을 붙일 수 있어요.
            </p>
          ) : loadError ? (
            <button type="button" onClick={() => { setLoadError(false); setLoadAttempt((attempt) => attempt + 1); }} className="rounded-xl bg-[#e8f1ea] px-4 py-2.5 text-sm font-bold text-[#214d3a]">
              다시 불러오기
            </button>
          ) : !tree ? (
            <p role="status" className="flex items-center gap-2 text-sm text-[#55695e]">
              <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />
              불러오는 중이에요.
            </p>
          ) : (
            <>
              {ownedCount > 0 && (
                <div className="space-y-3">
                  {tree.ownNotes.map((note) => (
                    <article key={note.id} className="rounded-[3px] bg-[#ffefb6] px-4 pt-3 pb-2 text-[#3f321b] shadow-sm">
                      <p className="whitespace-pre-wrap leading-7 break-words">{note.content}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="min-w-0 truncate text-sm font-semibold text-[#695632]">{note.author_name || "익명"}</p>
                        <div className="flex shrink-0 gap-0.5">
                          <button type="button" onClick={() => startEditing(note)} disabled={showComposer} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-[#57421d] hover:bg-black/5 disabled:opacity-45">
                            <Pencil className="size-3.5" aria-hidden="true" /> 수정
                          </button>
                          <button type="button" onClick={() => setNoteToDelete(note)} disabled={showComposer} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-red-800 hover:bg-red-900/10 disabled:opacity-45">
                            <Trash2 className="size-3.5" aria-hidden="true" /> 삭제
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {canAdd && !showComposer && (
                <button type="button" onClick={() => setEditor({ kind: "add" })} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#26583f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#194530]">
                  <Plus className="size-4" aria-hidden="true" /> 한 장 더 붙이기
                </button>
              )}
              {showComposer && (
                <form onSubmit={submit} className="space-y-4">
                  <div className="relative mt-6 rounded-[3px] bg-[#ffefb6] shadow-[1px_5px_12px_#50401322]">
                    <span aria-hidden="true" className="absolute -top-2.5 left-1/2 h-5 w-17 -translate-x-1/2 -rotate-3 bg-[#d6ad67]/45" />
                    <textarea
                      aria-label="포스트잇 내용"
                      aria-describedby="christmas-note-limit"
                      value={draft}
                      onChange={(event) => setDraft(Array.from(event.target.value).slice(0, CHRISTMAS_NOTE_LIMIT).join(""))}
                      disabled={submitting}
                      autoFocus={editor !== null}
                      placeholder="우리 반 친구들에게 한마디…"
                      rows={5}
                      className="block w-full resize-y rounded-[3px] px-4 pt-5 pb-2 text-base leading-7 text-[#3f321b] outline-none placeholder:text-[#75613a] focus-visible:ring-2 focus-visible:ring-[#80612f]"
                    />
                    <p id="christmas-note-limit" className="px-4 pb-3 text-right text-xs tabular-nums text-[#695632]">{draftLength} / {CHRISTMAS_NOTE_LIMIT}자</p>
                  </div>
                  <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-[#355144]">
                    <input type="checkbox" checked={showName} onChange={(event) => setShowName(event.target.checked)} disabled={submitting} className="size-4 accent-[#26583f]" />
                    포스트잇에 내 이름 표시
                  </label>
                  <div className="flex gap-2">
                    {editor && (
                      <button type="button" onClick={resetEditor} disabled={submitting} className="rounded-xl bg-[#e8f1ea] px-4 py-2.5 text-sm font-bold text-[#214d3a] hover:bg-[#dbe9df] disabled:opacity-55">
                        취소
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={submitting || !draft.trim() || draftLength > CHRISTMAS_NOTE_LIMIT}
                      className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#26583f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#194530] disabled:opacity-55"
                    >
                      {submitting ? <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" /> : editing ? <Pencil className="size-4" aria-hidden="true" /> : <Pin className="size-4" aria-hidden="true" />}
                      {submitting ? "저장 중" : editing ? "수정 저장" : "트리에 붙이기"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </section>
        <ChristmasTreeOrnaments
          isDemo={isDemo}
          artwork={ornamentArt}
          onUpdate={updateOrnaments}
          pickPosition={pickOrnamentPosition}
          cancelPlacement={() => finishPlacement(null)}
        />
      </div>

      <Dialog.Root open={selectedNote !== null} onOpenChange={(open) => { if (!open) setSelectedNote(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#02090b]/70" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-xl bg-[#ffefb6] p-6 text-[#3f321b] shadow-2xl">
            <Dialog.Title className="pr-10 text-lg font-extrabold">포스트잇</Dialog.Title>
            <Dialog.Description className="mt-4 whitespace-pre-wrap break-words text-base leading-7">{selectedNote?.content}</Dialog.Description>
            <p className="mt-4 text-right text-sm font-semibold text-[#695632]">
              {selectedNote?.is_sample ? "예시" : selectedNote?.author_name || "익명"}
            </p>
            <Dialog.Close aria-label="포스트잇 닫기" className="absolute top-3 right-3 rounded-lg p-2.5 hover:bg-black/5">
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={Boolean(selectedPhoto?.image_data)} onOpenChange={(open) => {
        if (!open) {
          setSelectedPhotoId(null);
          setPhotoDetail(null);
        }
      }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#02090b]/80" />
          <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-1.5rem)] w-[min(48rem,calc(100%-1.5rem),86dvh)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-[#f7f0e4] p-4 shadow-2xl sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3 text-[#393126]">
              <Dialog.Title className="font-extrabold">사진 오너먼트</Dialog.Title>
              <Dialog.Close aria-label="사진 닫기" className="-my-2 -mr-1 grid size-9 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-2">
                <X className="size-5" aria-hidden="true" />
              </Dialog.Close>
            </div>
            {displayedPhoto && (
              <figure className="w-full bg-[#fffdf4] p-2 pb-6 shadow-md sm:p-3 sm:pb-8">
                <img src={displayedPhoto} alt="트리에 달린 사진" onError={detailedImage ? () => setPhotoDetail(null) : undefined} className="block max-h-[68dvh] w-full object-contain" />
              </figure>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AlertDialog open={noteToDelete !== null} onOpenChange={(open) => { if (!open && !deleting) setNoteToDelete(null); }}>
        <AlertDialogContent className="max-h-[85dvh] overflow-auto rounded-xl sm:max-w-md">
          <AlertDialogTitle>내 포스트잇 삭제</AlertDialogTitle>
          <AlertDialogDescription>이 포스트잇을 트리에서 삭제할까요?</AlertDialogDescription>
          <p className="max-h-36 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#ffefb6] p-3 text-sm leading-6 text-[#3f321b]">{noteToDelete?.content}</p>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
            <button type="button" onClick={() => void confirmDelete()} disabled={deleting} className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-55">
              {deleting ? "삭제 중" : "삭제"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
