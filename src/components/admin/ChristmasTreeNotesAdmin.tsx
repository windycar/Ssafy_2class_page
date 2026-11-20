import { useEffect, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../../context/AdminContext";
import { CHRISTMAS_NOTE_LIMIT, type ChristmasNote } from "../../services/christmasTree";

type AdminNote = ChristmasNote & { is_sample: boolean; created_at: string };
type AdminNoteAuthor = { name: string; login_id: string; class_name: string };
type AdminNoteAuthorRow = { id: string; author: AdminNoteAuthor | null };
type NoteAction = { kind: "edit" | "delete"; note: AdminNote };

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function ChristmasTreeNotesAdmin({ refreshVersion, showAuthors }: { refreshVersion: number; showAuthors: boolean }) {
  const { request } = useAdmin();
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [authorsByNoteId, setAuthorsByNoteId] = useState(new Map<string, AdminNoteAuthor | null>());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [action, setAction] = useState<NoteAction | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    request<{ notes: AdminNote[] }>("christmasTree.list")
      .then(({ notes }) => { if (!cancelled) setNotes(notes); })
      .catch(() => { if (!cancelled) setLoadError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [request, refreshVersion, retry]);

  useEffect(() => {
    setAuthorsByNoteId(new Map());
    if (!showAuthors) return;
    let cancelled = false;
    request<{ authors: AdminNoteAuthorRow[] }>("christmasTree.authors")
      .then(({ authors }) => {
        if (!cancelled) setAuthorsByNoteId(new Map(authors.map(({ id, author }) => [id, author])));
      })
      .catch(() => {
        if (!cancelled) toast.error("실제 작성자를 불러오지 못했습니다.");
      });
    return () => { cancelled = true; };
  }, [request, refreshVersion, showAuthors]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action || saving) return;
    const content = draft.trim();
    if (action.kind === "edit" && (!content || Array.from(content).length > CHRISTMAS_NOTE_LIMIT)) return;

    const { id } = action.note;
    setSaving(true);
    try {
      if (action.kind === "edit") {
        const { note } = await request<{ note: AdminNote }>("christmasTree.update", { id, content });
        setNotes((current) => current.map((item) => item.id === id ? note : item));
        toast.success("포스트잇을 수정했습니다.");
      } else {
        await request("christmasTree.delete", { id });
        setNotes((current) => current.filter((item) => item.id !== id));
        toast.success("포스트잇을 삭제했습니다.");
      }
      setAction(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "포스트잇을 변경하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  const editing = action?.kind === "edit";

  return (
    <section aria-labelledby="admin-tree-heading" className="space-y-3">
      <h2 id="admin-tree-heading" className="text-lg font-extrabold text-gray-900">포스트잇 관리</h2>
      {loading ? (
        <p role="status" className="flex items-center justify-center gap-2 rounded-2xl bg-white p-10 text-sm text-gray-500">
          <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />
          포스트잇을 불러오는 중입니다.
        </p>
      ) : loadError ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
          <p>포스트잇을 불러오지 못했습니다.</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 rounded-lg bg-blue-50 px-3 py-2 font-bold text-blue-800">
            다시 불러오기
          </button>
        </div>
      ) : notes.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">등록된 포스트잇이 없습니다.</p>
      ) : notes.map((note) => {
        const author = showAuthors ? authorsByNoteId.get(note.id) : null;
        return (
          <article key={note.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="min-w-0 flex-1">
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">{note.content}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className={note.is_sample ? "rounded-full bg-amber-50 px-2 py-0.5 font-bold text-amber-800" : "font-semibold"}>
                  {note.is_sample ? "임시 예시" : note.author_name || "익명"}
                </span>
                <time dateTime={note.created_at}>{dateFormatter.format(new Date(note.created_at))}</time>
              </div>
              {author && (
                <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 rounded-xl bg-gray-50 px-3 py-2 text-xs">
                  <strong className="text-red-700">실제 작성자 {author.name}</strong>
                  <span className="font-semibold text-red-600">@{author.login_id} · {author.class_name.replaceAll("_", " ")}</span>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setDraft(note.content); setAction({ kind: "edit", note }); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <Pencil className="size-4" aria-hidden="true" /> 수정
              </button>
              <button type="button" onClick={() => setAction({ kind: "delete", note })} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                <Trash2 className="size-4" aria-hidden="true" /> 삭제
              </button>
            </div>
          </article>
        );
      })}

      <Dialog.Root open={action !== null} onOpenChange={(open) => { if (!open && !saving) setAction(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-extrabold text-gray-900">{editing ? "포스트잇 수정" : "포스트잇 삭제"}</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-gray-600">
              {editing ? "트리에 표시되는 내용을 수정합니다." : "이 포스트잇을 트리에서 삭제할까요?"}
            </Dialog.Description>
            <form className="mt-4 space-y-4" onSubmit={submit}>
              {editing ? (
                <div>
                  <textarea aria-label="포스트잇 내용" value={draft} disabled={saving} rows={4}
                    onChange={(event) => setDraft(Array.from(event.target.value).slice(0, CHRISTMAS_NOTE_LIMIT).join(""))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm leading-6 text-gray-900 focus-visible:outline-2 focus-visible:outline-[#1259AA]"
                  />
                  <p className="text-right text-xs text-gray-500">{Array.from(draft).length} / {CHRISTMAS_NOTE_LIMIT}자</p>
                </div>
              ) : (
                <p className="max-h-36 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-700">{action?.note.content}</p>
              )}
              <div className="flex justify-end gap-2">
                <Dialog.Close disabled={saving} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 disabled:opacity-50">취소</Dialog.Close>
                <button type="submit" disabled={saving || (editing && !draft.trim())} className={`rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-50 ${editing ? "bg-[#1259AA] hover:bg-[#0d4a8f]" : "bg-red-700 hover:bg-red-800"}`}>
                  {saving ? "처리 중" : editing ? "수정 저장" : "삭제"}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
