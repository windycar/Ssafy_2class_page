import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Clock3, ImageIcon, KeyRound, LoaderCircle, MessageSquareText, Pencil, Plus, RefreshCw, ShieldCheck, Trash2, UserCheck, UserRoundCog, UserX, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../context/AdminContext";
import { getGalleryPhotos } from "../services/galleryStorage";
import { bangRoomStorage } from "../services/storage/bangRoomStorage";
import type { BangRoom } from "../types/bang";
import type { Photo } from "../types/photo";
import teamImage from "../assets/home/quick-menu/team.png";

type Tab = "members" | "board" | "rooms" | "gallery";

type AdminMember = {
  id: number;
  student_id: number | null;
  name: string;
  username: string;
  login_id: string;
  class_name: string;
  role: "member" | "admin";
  is_active: boolean;
  must_change_password: boolean;
  last_login_at: string | null;
  created_at: string;
  auth_provisioned: boolean;
};

type AdminPost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: { id: number; name: string; username: string; login_id: string; class_name: string } | null;
};

type MembersResponse = { ok: boolean; members: AdminMember[] };
type BoardResponse = { ok: boolean; posts: AdminPost[] };
type RoomsResponse = { ok: boolean; rooms: BangRoom[] };

const ROOM_STATUS: Record<BangRoom["status"], string> = {
  recruiting: "모집 중", full: "모집 완료", ready: "시작 대기", playing: "게임 중",
  finished: "종료", cancelled: "취소",
};

function formatDate(value: string | null) {
  if (!value) return "기록 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 정보 없음";
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}
export default function AdminView() {
  const { isAdmin, logout, request } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("members");
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [rooms, setRooms] = useState<BangRoom[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [workingId, setWorkingId] = useState<string | number | null>(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: "", loginId: "", username: "", className: "광주_2반", studentId: "" });

  const loadAll = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [membersResult, boardResult, roomsResult, galleryResult] = await Promise.all([
        request<MembersResponse>("members.list"),
        request<BoardResponse>("board.list"),
        request<RoomsResponse>("bang.rooms.list"),
        getGalleryPhotos(),
      ]);
      setMembers(membersResult.members);
      setPosts(boardResult.posts);
      const mergedRooms = new Map(bangRoomStorage.getRooms().map((room) => [room.id, room]));
      roomsResult.rooms.forEach((room) => mergedRooms.set(room.id, room));
      setRooms([...mergedRooms.values()]);
      setPhotos(galleryResult);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "관리자 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, request]);

  useEffect(() => { void loadAll(); }, [loadAll]);

  const stats = useMemo(() => ({
    activeMembers: members.filter((member) => member.is_active && member.role === "member").length,
    pendingPasswords: members.filter((member) => member.must_change_password && member.role === "member").length,
  }), [members]);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
        <ShieldCheck className="mx-auto h-10 w-10 text-red-400" />
        <h1 className="mt-4 text-xl font-black">관리자 권한이 없습니다.</h1>
        <p className="mt-2 text-sm text-gray-500">관리자 계정으로 다시 로그인하세요.</p>
        <button onClick={() => navigate("/")} className="mt-5 rounded-xl bg-[#1259AA] px-5 py-2.5 text-sm font-bold text-white">홈으로</button>
      </div>
    );
  }

  const createMember = async (event: FormEvent) => {
    event.preventDefault();
    setWorkingId("new-member");
    try {
      const result = await request<{ ok: boolean; member: AdminMember }>("members.create", {
        name: memberForm.name,
        loginId: memberForm.loginId,
        username: memberForm.username,
        className: memberForm.className,
        studentId: memberForm.studentId ? Number(memberForm.studentId) : null,
      });
      setMembers((list) => [...list, result.member].sort((a, b) => a.name.localeCompare(b.name, "ko")));
      setMemberForm({ name: "", loginId: "", username: "", className: "광주_2반", studentId: "" });
      setShowMemberForm(false);
      toast.success(`${result.member.name} 회원을 추가했습니다. 초기 비밀번호는 1234입니다.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "회원을 추가하지 못했습니다.");
    } finally {
      setWorkingId(null);
    }
  };

  const toggleMember = async (member: AdminMember) => {
    const nextActive = !member.is_active;
    if (!window.confirm(`${member.name} 계정을 ${nextActive ? "활성화" : "비활성화"}할까요?`)) return;
    setWorkingId(member.id);
    try {
      await request("members.setActive", { id: member.id, isActive: nextActive });
      setMembers((list) => list.map((item) => item.id === member.id ? { ...item, is_active: nextActive } : item));
      toast.success("회원 상태를 변경했습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "회원 상태를 변경하지 못했습니다.");
    } finally { setWorkingId(null); }
  };

  const resetPassword = async (member: AdminMember) => {
    if (!window.confirm(`${member.name} 님의 비밀번호를 1234로 초기화할까요?`)) return;
    setWorkingId(`reset-${member.id}`);
    try {
      await request("members.resetPassword", { id: member.id });
      setMembers((list) => list.map((item) => item.id === member.id ? { ...item, must_change_password: true } : item));
      toast.success("비밀번호를 1234로 초기화했습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "비밀번호를 초기화하지 못했습니다.");
    } finally { setWorkingId(null); }
  };

  const editPost = async (post: AdminPost) => {
    const title = window.prompt("제목", post.title);
    if (title === null) return;
    const content = window.prompt("내용", post.content);
    if (content === null) return;
    try {
      await request("board.update", { id: post.id, title, content });
      setPosts((list) => list.map((item) => item.id === post.id ? { ...item, title, content, updated_at: new Date().toISOString() } : item));
      toast.success("게시글을 수정했습니다.");
    } catch { toast.error("게시글을 수정하지 못했습니다."); }
  };

  const removePost = async (post: AdminPost) => {
    if (!window.confirm(`"${post.title}" 글을 삭제할까요?`)) return;
    setWorkingId(post.id);
    try {
      await request("board.delete", { id: post.id });
      setPosts((list) => list.filter((item) => item.id !== post.id));
      toast.success("게시글을 삭제했습니다.");
    } catch { toast.error("게시글을 삭제하지 못했습니다."); }
    finally { setWorkingId(null); }
  };

  const removeRoom = async (room: BangRoom) => {
    if (!window.confirm(`"${room.title}" 게임방과 채팅 기록을 삭제할까요?`)) return;
    setWorkingId(room.id);
    try {
      await request("bang.room.delete", { id: room.id });
      bangRoomStorage.deleteCachedRoom(room.id);
      setRooms((list) => list.filter((item) => item.id !== room.id));
      toast.success("게임방을 삭제했습니다.");
    } catch { toast.error("게임방을 삭제하지 못했습니다."); }
    finally { setWorkingId(null); }
  };

  const editPhoto = async (photo: Photo) => {
    const title = window.prompt("사진 제목", photo.title);
    if (title === null) return;
    const description = window.prompt("사진 설명", photo.description);
    if (description === null) return;
    try {
      await request("gallery.update", { id: photo.id, title, description });
      setPhotos((list) => list.map((item) => item.id === photo.id ? { ...item, title, description } : item));
      toast.success("사진 정보를 수정했습니다.");
    } catch { toast.error("사진 정보를 수정하지 못했습니다."); }
  };

  const removePhoto = async (photo: Photo) => {
    if (!window.confirm(`"${photo.title}" 사진을 삭제할까요?`)) return;
    try {
      await request("gallery.delete", { id: photo.id });
      setPhotos((list) => list.filter((item) => item.id !== photo.id));
      toast.success("사진을 삭제했습니다.");
    } catch { toast.error("사진을 삭제하지 못했습니다."); }
  };

  const tabs: { id: Tab; label: string; count: number; icon: typeof UsersRound }[] = [
    { id: "members", label: "회원 관리", count: members.length, icon: UsersRound },
    { id: "board", label: "익명 게시판", count: posts.length, icon: MessageSquareText },
    { id: "rooms", label: "게임방", count: rooms.length, icon: UserRoundCog },
    { id: "gallery", label: "사진첩", count: photos.length, icon: ImageIcon },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#123b68] to-[#1259AA] p-6 text-white shadow-lg sm:p-8">
        <img src={teamImage} alt="" className="absolute -right-2 top-1/2 hidden h-44 w-44 -translate-y-1/2 object-contain opacity-80 drop-shadow-2xl sm:block" />
        <div className="relative max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-blue-200"><ShieldCheck className="h-5 w-5" /> G2 ADMIN CONSOLE</div>
          <h1 className="text-2xl font-black sm:text-3xl">회원과 커뮤니티를 한곳에서 관리합니다.</h1>
          <p className="mt-2 text-sm text-blue-100">활성 회원 {stats.activeMembers}명 · 비밀번호 변경 대기 {stats.pendingPasswords}명</p>
          <div className="mt-5 flex gap-2">
            <button onClick={() => void loadAll()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold hover:bg-white/20 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />전체 새로고침</button>
            <button onClick={() => { void logout(); navigate("/login"); }} className="rounded-xl border border-white/20 px-4 py-2 text-xs font-bold hover:bg-white/10">관리자 로그아웃</button>
          </div>
        </div>
      </section>

      <nav className="grid grid-cols-2 gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:grid-cols-4">
        {tabs.map((item) => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => setTab(item.id)} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${tab === item.id ? "bg-[#1259AA] text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}><Icon className="h-4 w-4" />{item.label}<span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === item.id ? "bg-white/20" : "bg-gray-100"}`}>{item.count}</span></button>;
        })}
      </nav>

      {loading && members.length === 0 ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-white py-20 text-sm text-gray-400"><LoaderCircle className="h-5 w-5 animate-spin" />관리자 데이터를 불러오는 중입니다.</div>
      ) : tab === "members" ? (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
            <div><h2 className="font-black text-gray-900">회원 명단</h2><p className="mt-1 text-xs text-gray-400">새 회원의 초기 비밀번호는 1234입니다.</p></div>
            <button onClick={() => setShowMemberForm((value) => !value)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1259AA] px-4 py-2 text-sm font-bold text-white"><Plus className="h-4 w-4" />회원 추가</button>
          </div>
          {showMemberForm && (
            <form onSubmit={createMember} className="grid gap-3 border-b border-blue-100 bg-blue-50/70 p-5 sm:grid-cols-2 lg:grid-cols-5">
              <input required value={memberForm.name} onChange={(event) => setMemberForm((form) => ({ ...form, name: event.target.value }))} placeholder="이름 *" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              <input required value={memberForm.loginId} onChange={(event) => setMemberForm((form) => ({ ...form, loginId: event.target.value.toLowerCase() }))} placeholder="로그인 아이디 *" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              <input value={memberForm.username} onChange={(event) => setMemberForm((form) => ({ ...form, username: event.target.value }))} placeholder="표시 아이디 (@...)" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              <input required value={memberForm.className} onChange={(event) => setMemberForm((form) => ({ ...form, className: event.target.value }))} placeholder="소속 반 *" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              <div className="flex gap-2"><input type="number" value={memberForm.studentId} onChange={(event) => setMemberForm((form) => ({ ...form, studentId: event.target.value }))} placeholder="교육생 번호" className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm" /><button disabled={workingId === "new-member"} className="rounded-xl bg-[#1259AA] px-4 text-sm font-bold text-white disabled:opacity-50">등록</button></div>
            </form>
          )}
          <div className="divide-y divide-gray-100">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col gap-3 p-4 hover:bg-gray-50/70 lg:flex-row lg:items-center">
                <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-sm font-black ${member.role === "admin" ? "bg-violet-100 text-violet-700" : member.is_active ? "bg-blue-100 text-[#1259AA]" : "bg-gray-100 text-gray-400"}`}>{member.name[0]}</div>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><b className="text-sm text-gray-900">{member.name}</b>{member.role === "admin" && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-black text-violet-700">관리자</span>}{!member.is_active && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">비활성</span>}{member.must_change_password && member.role === "member" && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">비밀번호 변경 대기</span>}</div><p className="mt-1 text-xs text-gray-400">{member.class_name.replace("_", " ")} · @{member.login_id} · 최근 접속 {formatDate(member.last_login_at)}</p></div>
                {member.role !== "admin" && <div className="flex gap-2"><button onClick={() => void resetPassword(member)} disabled={workingId === `reset-${member.id}`} className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50"><KeyRound className="h-3.5 w-3.5" />1234 초기화</button><button onClick={() => void toggleMember(member)} disabled={workingId === member.id} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold ${member.is_active ? "border-red-200 text-red-600 hover:bg-red-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}>{member.is_active ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}{member.is_active ? "비활성화" : "활성화"}</button></div>}
              </div>
            ))}
          </div>
        </section>
      ) : tab === "board" ? (
        <section className="space-y-3">
          {posts.map((post) => <article key={post.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start"><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><h2 className="font-black text-gray-900">{post.title}</h2><span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">화면에는 익명</span></div><p className="line-clamp-2 whitespace-pre-wrap text-sm text-gray-600">{post.content}</p><div className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-xs"><b className="text-gray-700">실제 작성자: {post.author?.name ?? "기존 글 · 작성자 기록 없음"}</b>{post.author && <span className="ml-2 text-gray-400">@{post.author.login_id} · {post.author.class_name.replace("_", " ")}</span>}<span className="ml-2 text-gray-400">등록 {formatDate(post.created_at)}</span></div></div><div className="flex gap-2"><button onClick={() => void editPost(post)} className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50" aria-label="수정"><Pencil className="h-4 w-4" /></button><button onClick={() => void removePost(post)} className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50" aria-label="삭제"><Trash2 className="h-4 w-4" /></button></div></div></article>)}
        </section>
      ) : tab === "rooms" ? (
        <section className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {rooms.length === 0 ? <p className="py-16 text-center text-sm text-gray-400">저장된 게임방이 없습니다.</p> : rooms.map((room) => <div key={room.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">{ROOM_STATUS[room.status]}</span><b>{room.title || "이름 없는 게임방"}</b></div><p className="mt-1 text-xs text-gray-400"><UsersRound className="mr-1 inline h-3.5 w-3.5" />{room.players.length}/{room.maxPlayers}명 <Clock3 className="ml-2 mr-1 inline h-3.5 w-3.5" />{formatDate(room.createdAt)}</p></div><button onClick={() => void removeRoom(room)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"><Trash2 className="h-3.5 w-3.5" />삭제</button></div>)}
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => <article key={photo.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><img src={photo.imageUrl} alt={photo.title} className="h-40 w-full object-cover" /><div className="p-4"><b>{photo.title}</b><p className="mt-1 line-clamp-2 text-sm text-gray-500">{photo.description}</p><div className="mt-3 flex justify-end gap-2"><button onClick={() => void editPhoto(photo)} className="text-xs font-bold text-[#1259AA]">수정</button><button onClick={() => void removePhoto(photo)} className="text-xs font-bold text-red-500">삭제</button></div></div></article>)}
        </section>
      )}
    </div>
  );
}
