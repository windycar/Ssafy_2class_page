import { useCallback, useEffect, useState } from "react";
import {
  Clock3,
  ImageIcon,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../context/AdminContext";
import { getGalleryPhotos } from "../services/galleryStorage";
import { getAnonymousPosts, type AnonymousPost } from "../services/anonymousBoard";
import { bangRoomStorage } from "../services/storage/bangRoomStorage";
import type { BangRoom } from "../types/bang";
import type { Photo } from "../types/photo";

type BangRoomsResponse = {
  ok: boolean;
  rooms: BangRoom[];
};

const ROOM_STATUS: Record<
  BangRoom["status"],
  { label: string; className: string }
> = {
  recruiting: { label: "모집 중", className: "bg-emerald-50 text-emerald-700" },
  full: { label: "모집 완료", className: "bg-sky-50 text-sky-700" },
  ready: { label: "시작 대기", className: "bg-amber-50 text-amber-700" },
  playing: { label: "게임 중", className: "bg-red-50 text-red-700" },
  finished: { label: "종료", className: "bg-gray-100 text-gray-600" },
  cancelled: { label: "취소", className: "bg-gray-100 text-gray-500" },
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 정보 없음";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminView() {
  const { isAdmin, logout, request } = useAdmin();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [posts, setPosts] = useState<AnonymousPost[]>([]);
  const [rooms, setRooms] = useState<BangRoom[]>([]);
  const [serverRoomIds, setServerRoomIds] = useState<Set<string>>(() => new Set());
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    setRoomsLoading(true);
    const cachedRooms = bangRoomStorage.getRooms();
    setRooms(cachedRooms);

    try {
      const response = await request<BangRoomsResponse>("bang.rooms.list");
      const remoteIds = new Set(response.rooms.map((room) => room.id));
      const mergedRooms = new Map(cachedRooms.map((room) => [room.id, room]));
      response.rooms.forEach((room) => mergedRooms.set(room.id, room));

      setServerRoomIds(remoteIds);
      setRooms([...mergedRooms.values()]);
    } catch (error) {
      console.error(error);
      setServerRoomIds(new Set());
      if (cachedRooms.length > 0) {
        toast.warning("Supabase 목록을 불러오지 못해 이 브라우저의 게임방을 표시합니다.");
      } else {
        toast.error("게임방 목록을 불러오지 못했습니다.");
      }
    } finally {
      setRoomsLoading(false);
    }
  }, [request]);

  useEffect(() => {
    if (!isAdmin) return;

    void getGalleryPhotos()
      .then(setPhotos)
      .catch(() => toast.error("사진 목록을 불러오지 못했습니다."));
    void getAnonymousPosts()
      .then(setPosts)
      .catch(() => toast.error("게시글 목록을 불러오지 못했습니다."));
    void loadRooms();
  }, [isAdmin, loadRooms]);

  if (!isAdmin) {
    return (
      <div className="py-24 text-center text-gray-500">
        G2 버튼에서 관리자 비밀번호를 입력하세요.
      </div>
    );
  }

  const editPhoto = async (photo: Photo) => {
    const title = window.prompt("사진 제목", photo.title);
    if (title === null) return;
    const description = window.prompt("사진 설명", photo.description);
    if (description === null) return;

    try {
      await request("gallery.update", { id: photo.id, title, description });
      setPhotos((list) =>
        list.map((item) =>
          item.id === photo.id ? { ...item, title, description } : item,
        ),
      );
      toast.success("사진 정보를 수정했습니다.");
    } catch {
      toast.error("사진 정보를 수정하지 못했습니다.");
    }
  };

  const removePhoto = async (id: string) => {
    if (!window.confirm("사진을 삭제할까요?")) return;
    try {
      await request("gallery.delete", { id });
      setPhotos((list) => list.filter((item) => item.id !== id));
      toast.success("사진을 삭제했습니다.");
    } catch {
      toast.error("사진을 삭제하지 못했습니다.");
    }
  };

  const editPost = async (post: AnonymousPost) => {
    const title = window.prompt("제목", post.title);
    if (title === null) return;
    const content = window.prompt("내용", post.content);
    if (content === null) return;

    try {
      await request("board.update", { id: post.id, title, content });
      setPosts((list) =>
        list.map((item) =>
          item.id === post.id
            ? { ...item, title, content, updatedAt: new Date().toISOString() }
            : item,
        ),
      );
      toast.success("게시글을 수정했습니다.");
    } catch {
      toast.error("게시글을 수정하지 못했습니다.");
    }
  };

  const removePost = async (id: string) => {
    if (!window.confirm("게시글을 삭제할까요?")) return;
    try {
      await request("board.delete", { id });
      setPosts((list) => list.filter((item) => item.id !== id));
      toast.success("게시글을 삭제했습니다.");
    } catch {
      toast.error("게시글을 삭제하지 못했습니다.");
    }
  };

  const removeRoom = async (room: BangRoom) => {
    const confirmed = window.confirm(
      `"${room.title}" 게임방을 완전히 삭제할까요?\n참가자와 채팅 기록도 함께 삭제됩니다.`,
    );
    if (!confirmed) return;

    setDeletingRoomId(room.id);
    try {
      await request("bang.room.delete", { id: room.id });
      bangRoomStorage.deleteCachedRoom(room.id);
      setRooms((list) => list.filter((item) => item.id !== room.id));
      setServerRoomIds((ids) => {
        const nextIds = new Set(ids);
        nextIds.delete(room.id);
        return nextIds;
      });
      toast.success("게임방을 삭제했습니다.");
    } catch (error) {
      console.error(error);
      toast.error("게임방을 삭제하지 못했습니다.");
    } finally {
      setDeletingRoomId(null);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#1259AA]" />
            <h1 className="text-xl font-extrabold">G2 관리자</h1>
          </div>
          <p className="text-sm text-gray-500">
            게임방, 사진첩, 익명 게시판을 관리합니다.
          </p>
        </div>
        <button
          onClick={logout}
          className="self-start rounded-lg px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
        >
          관리자 로그아웃
        </button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#1259AA]/15 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-[#1259AA]" />
              <h2 className="font-extrabold text-gray-800">뱅 게임방 관리</h2>
              <span className="rounded-full bg-[#1259AA]/10 px-2 py-0.5 text-xs font-bold text-[#1259AA]">
                {rooms.length}개
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Supabase와 현재 브라우저에 저장된 게임방을 함께 표시합니다.
            </p>
          </div>
          <button
            onClick={() => void loadRooms()}
            disabled={roomsLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${roomsLoading ? "animate-spin" : ""}`} />
            새로고침
          </button>
        </div>

        {roomsLoading && rooms.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-gray-400">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            게임방을 불러오는 중입니다.
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-14 text-center">
            <UsersRound className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm font-semibold text-gray-400">
              현재 저장된 뱅 게임방이 없습니다.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {rooms.map((room) => {
              const status = ROOM_STATUS[room.status] ?? ROOM_STATUS.recruiting;
              const isServerRoom = serverRoomIds.has(room.id);
              const host =
                room.players.find((player) => player.studentId === room.hostStudentId)
                  ?.name ?? "알 수 없음";
              const isDeleting = deletingRoomId === room.id;

              return (
                <div
                  key={room.id}
                  className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-gray-50/70 lg:flex-row lg:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${status.className}`}
                      >
                        {status.label}
                      </span>
                      {!isServerRoom && (
                        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-extrabold text-orange-700">
                          이 브라우저에만 저장
                        </span>
                      )}
                      <h3 className="truncate font-extrabold text-gray-800">
                        {room.title || "이름 없는 게임방"}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <UsersRound className="h-3.5 w-3.5" />
                        {room.players.length}/{room.maxPlayers}명 · 방장 {host}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDate(room.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 truncate font-mono text-[11px] text-gray-300">
                      {room.id}
                    </p>
                  </div>
                  <button
                    onClick={() => void removeRoom(room)}
                    disabled={deletingRoomId !== null}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    {isDeleting ? "삭제 중" : "게임방 삭제"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-[#1259AA]" />
          <h2 className="font-bold">사진첩</h2>
          <span className="text-xs font-semibold text-gray-400">{photos.length}개</span>
        </div>
        <div className="space-y-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <b>{photo.title}</b>
                <p className="truncate text-sm text-gray-500">{photo.description}</p>
              </div>
              <button onClick={() => void editPhoto(photo)} className="text-sm">
                수정
              </button>
              <button
                onClick={() => void removePhoto(photo.id)}
                className="text-sm text-red-500"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-[#1259AA]" />
          <h2 className="font-bold">익명 게시판</h2>
          <span className="text-xs font-semibold text-gray-400">{posts.length}개</span>
        </div>
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3"
            >
              <div className="min-w-0 flex-1">
                <b>{post.title}</b>
                <p className="line-clamp-1 text-sm text-gray-500">{post.content}</p>
              </div>
              <button onClick={() => void editPost(post)} className="text-sm">
                수정
              </button>
              <button
                onClick={() => void removePost(post.id)}
                className="text-sm text-red-500"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
