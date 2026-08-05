import { useEffect, useState } from "react";
import { CalendarDays, EyeOff, LoaderCircle, MessageSquarePlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { createAnonymousPost, getAnonymousPosts, softenAnonymousTone, type AnonymousPost } from "../services/anonymousBoard";
import boardImage from "../assets/board/anonymous-board.png";

function formatRegisteredAt(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(value));
}

export default function AnonymousBoardView() {
  const [posts, setPosts] = useState<AnonymousPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAnonymousPosts()
      .then(setPosts)
      .catch(() => toast.error("게시글을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!title.trim() || !content.trim()) return toast.error("제목과 내용을 입력하세요.");
    setSubmitting(true);
    try {
      const post = await createAnonymousPost(title.trim(), softenAnonymousTone(content));
      setPosts((current) => [post, ...current]);
      setTitle("");
      setContent("");
      toast.success("익명으로 등록했습니다.");
    } catch {
      toast.error("게시글을 등록하지 못했습니다. 로그인 상태를 확인하세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-5 top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full bg-white/10 sm:block" />
        <img src={boardImage} alt="" className="absolute right-5 top-1/2 hidden h-36 w-36 -translate-y-1/2 rounded-[2rem] object-cover opacity-95 shadow-2xl ring-1 ring-white/20 sm:block" />
        <div className="relative max-w-xl">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold"><EyeOff className="h-3.5 w-3.5" />MEMBERS ONLY</div>
          <h1 className="text-2xl font-black sm:text-3xl">익명 게시판</h1>
          <p className="mt-2 text-sm leading-6 text-violet-100">회원 화면에는 이름이 표시되지 않습니다. 등록일은 서버가 자동 기록하며, 안전 관리를 위해 관리자만 실제 작성자를 확인할 수 있습니다.</p>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3"><h2 className="font-black text-gray-900">새 익명 글</h2><span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"><ShieldCheck className="h-4 w-4" />익명 표시</span></div>
        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} placeholder="제목을 입력하세요" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100" />
        <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={1000} placeholder="서로 존중하는 내용으로 작성해 주세요." className="min-h-32 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100" />
        <div className="flex items-center justify-between gap-3"><p className="text-xs text-gray-400">{content.length}/1000 · 날짜는 등록 시 자동 저장됩니다.</p><button onClick={() => void submit()} disabled={submitting} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-violet-700 disabled:opacity-60">{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MessageSquarePlus className="h-4 w-4" />}{submitting ? "등록 중" : "익명 등록"}</button></div>
      </section>

      <section className="space-y-3">
        {loading ? <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400"><LoaderCircle className="h-5 w-5 animate-spin" />게시글을 불러오는 중입니다.</div> : posts.length === 0 ? <p className="py-16 text-center text-sm text-gray-400">아직 게시글이 없습니다.</p> : posts.map((post) => (
          <article key={post.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <h2 className="font-black text-gray-900">{post.title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">{post.content}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3 text-xs text-gray-400"><span className="inline-flex items-center gap-1 font-bold text-violet-500"><EyeOff className="h-3.5 w-3.5" />익명</span><span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />등록 {formatRegisteredAt(post.createdAt)}</span></div>
          </article>
        ))}
      </section>
    </div>
  );
}
