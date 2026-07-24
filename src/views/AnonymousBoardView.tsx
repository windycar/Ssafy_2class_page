import { useEffect, useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { createId } from "../utils/createId";
import { createAnonymousPost, getAnonymousPosts, softenAnonymousTone, type AnonymousPost } from "../services/anonymousBoard";

export default function AnonymousBoardView() {
  const [posts, setPosts] = useState<AnonymousPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postDate, setPostDate] = useState("");

  useEffect(() => {
    if (!supabase) return;
    getAnonymousPosts().then(setPosts).catch(() => toast.error("게시글을 불러오지 못했습니다."));
  }, []);

  const submit = async () => {
    if (!title.trim() || !content.trim()) return toast.error("제목과 내용을 입력하세요.");
    if (!supabase) return toast.error("Supabase 설정이 필요합니다.");
    const createdAt = postDate ? new Date(`${postDate}T12:00:00`).toISOString() : new Date().toISOString();
    const post = { id: createId("post"), title: title.trim(), content: softenAnonymousTone(content), createdAt, updatedAt: createdAt };
    try {
      await createAnonymousPost(post);
      setPosts((current) => [post, ...current]);
      setTitle("");
      setContent("");
      setPostDate("");
      toast.success("익명으로 등록했습니다.");
    } catch {
      toast.error("게시글을 등록하지 못했습니다.");
    }
  };

  return <div className="max-w-3xl mx-auto space-y-5">
    <div><h1 className="text-xl font-extrabold text-gray-900">익명 게시판</h1><p className="text-sm text-gray-500">이름 없이 자유롭게 이야기해요. 문장 끝맺음은 자동으로 조금씩 정리됩니다.</p></div>
    <section className="bg-white border border-border rounded-2xl p-5 space-y-3">
      <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} placeholder="제목" className="w-full border border-border rounded-xl px-3 py-2 text-sm" />
      <div><label className="text-xs font-semibold text-gray-500 block mb-1">작성 날짜</label><input type="date" value={postDate} onChange={(event) => setPostDate(event.target.value)} className="border border-border rounded-xl px-3 py-2 text-sm" /></div>
      <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={1000} placeholder="내용" className="w-full min-h-28 border border-border rounded-xl px-3 py-2 text-sm resize-y" />
      <button onClick={submit} className="flex items-center gap-2 bg-violet-600 text-white font-semibold px-4 py-2 rounded-xl text-sm"><MessageSquarePlus className="w-4 h-4" />익명 등록</button>
    </section>
    <section className="space-y-3">{posts.length === 0 ? <p className="text-center text-sm text-gray-400 py-12">아직 게시글이 없습니다.</p> : posts.map((post) => <article key={post.id} className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold text-gray-800">{post.title}</h2><p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{post.content}</p><p className="mt-3 text-xs text-gray-400">익명 · 등록일 {new Date(post.createdAt).toLocaleDateString("ko-KR")}</p></article>)}</section>
  </div>;
}
