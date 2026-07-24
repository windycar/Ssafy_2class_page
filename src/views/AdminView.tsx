import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { getGalleryPhotos } from "../services/galleryStorage";
import { getAnonymousPosts, type AnonymousPost } from "../services/anonymousBoard";
import type { Photo } from "../types/photo";

export default function AdminView() {
  const { isAdmin, logout, request } = useAdmin();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [posts, setPosts] = useState<AnonymousPost[]>([]);
  useEffect(() => { if (isAdmin) { getGalleryPhotos().then(setPhotos); getAnonymousPosts().then(setPosts); } }, [isAdmin]);
  if (!isAdmin) return <div className="py-24 text-center text-gray-500">G2 버튼에서 관리자 비밀번호를 입력하세요.</div>;
  const editPhoto = async (photo: Photo) => { const title = window.prompt("사진 제목", photo.title); if (title === null) return; const description = window.prompt("사진 설명", photo.description); if (description === null) return; await request("gallery.update", { id: photo.id, title, description }); setPhotos((list) => list.map((item) => item.id === photo.id ? { ...item, title, description } : item)); };
  const removePhoto = async (id: string) => { if (!window.confirm("사진을 삭제할까요?")) return; await request("gallery.delete", { id }); setPhotos((list) => list.filter((item) => item.id !== id)); };
  const editPost = async (post: AnonymousPost) => { const title = window.prompt("제목", post.title); if (title === null) return; const content = window.prompt("내용", post.content); if (content === null) return; await request("board.update", { id: post.id, title, content }); setPosts((list) => list.map((item) => item.id === post.id ? { ...item, title, content, updatedAt: new Date().toISOString() } : item)); };
  const removePost = async (id: string) => { if (!window.confirm("게시글을 삭제할까요?")) return; await request("board.delete", { id }); setPosts((list) => list.filter((item) => item.id !== id)); };
  return <div className="space-y-7"><div className="flex justify-between"><div><h1 className="text-xl font-extrabold">G2 관리자</h1><p className="text-sm text-gray-500">사진첩과 익명 게시판을 관리합니다.</p></div><button onClick={logout} className="text-sm text-red-500">관리자 로그아웃</button></div><section><h2 className="font-bold mb-3">사진첩</h2><div className="space-y-2">{photos.map((photo) => <div key={photo.id} className="flex gap-3 bg-white border border-border p-3 rounded-xl"><img src={photo.imageUrl} className="w-16 h-16 object-cover rounded-lg" /><div className="flex-1"><b>{photo.title}</b><p className="text-sm text-gray-500">{photo.description}</p></div><button onClick={() => editPhoto(photo)} className="text-sm">수정</button><button onClick={() => removePhoto(photo.id)} className="text-sm text-red-500">삭제</button></div>)}</div></section><section><h2 className="font-bold mb-3">익명 게시판</h2><div className="space-y-2">{posts.map((post) => <div key={post.id} className="flex gap-3 bg-white border border-border p-3 rounded-xl"><div className="flex-1"><b>{post.title}</b><p className="text-sm text-gray-500 line-clamp-1">{post.content}</p></div><button onClick={() => editPost(post)} className="text-sm">수정</button><button onClick={() => removePost(post.id)} className="text-sm text-red-500">삭제</button></div>)}</div></section></div>;
}
