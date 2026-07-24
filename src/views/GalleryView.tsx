import { useEffect, useRef, useState } from "react";
import { Camera, Heart, MessageCircle, Plus, X, ChevronLeft, ChevronRight, Search, Upload, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { STUDENTS } from "../data/students";
import { useModal } from "../hooks/useModal";
import { PHOTO_CATEGORIES } from "../config/constants";
import { formatDate, formatRelative } from "../utils/formatDate";
import { createId } from "../utils/createId";
import type { Photo, PhotoCategory, PhotoComment } from "../types/photo";
import { supabase } from "../lib/supabase";
import {
  createGalleryComment,
  createGalleryPhoto,
  deleteGalleryPhoto,
  getGalleryPhotos,
  updateGalleryLikes,
  uploadImage,
} from "../services/galleryStorage";

export default function GalleryView() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>("all");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const uploadModal = useModal();
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", takenAt: "", uploadedBy: "", category: "event" as PhotoCategory, previewUrl: "", file: null as File | null, files: [] as File[] });
  const fileRef = useRef<HTMLInputElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    getGalleryPhotos()
      .then(setPhotos)
      .catch(() => toast.error("사진 목록을 불러오지 못했습니다."));
  }, []);

  const ensureSupabase = () => {
    if (supabase) return true;
    toast.error("Supabase 설정이 필요합니다.");
    return false;
  };

  const filtered = photos.filter((p) => {
    const catMatch = selectedCategory === "all" || p.category === selectedCategory;
    const searchMatch = !search || p.title.includes(search) || p.description.includes(search) || p.uploadedBy.includes(search);
    return catMatch && searchMatch;
  });

  const detailPhoto = photos.find((p) => p.id === detailId) ?? null;
  const albumKey = (photo: Photo) => photo.batchId ?? photo.title.replace(/\s\(\d+\)$/, "");
  const detailAlbum = detailPhoto
    ? photos.filter((photo) => albumKey(photo) === albumKey(detailPhoto))
    : [];
  const detailIndex = detailAlbum.findIndex((photo) => photo.id === detailId);
  const displayPhotos = filtered.filter((photo, index) => filtered.findIndex((item) => albumKey(item) === albumKey(photo)) === index);

  const handleLike = async (id: string) => {
    const photo = photos.find((item) => item.id === id);
    if (!photo || !ensureSupabase()) return;
    await updateGalleryLikes(id, photo.likes + 1);
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleAddComment = async (photoId: string) => {
    if (!commentAuthor) { toast.error("작성자를 선택해 주세요."); return; }
    if (!commentText.trim()) { toast.error("댓글을 입력해 주세요."); return; }
    const comment: PhotoComment = { id: createId("c"), author: commentAuthor, content: commentText, createdAt: new Date().toISOString() };
    if (!ensureSupabase()) return;
    await createGalleryComment(photoId, comment);
    setPhotos((prev) => prev.map((p) => p.id === photoId ? { ...p, comments: [...p.comments, comment] } : p));
    setCommentText("");
    toast.success("댓글이 등록되었습니다.");
  };

  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm("사진을 삭제할까요?")) return;
    const photo = photos.find((item) => item.id === id);
    if (!photo || !ensureSupabase()) return;
    await deleteGalleryPhoto(photo);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (detailId === id) setDetailId(null);
    setOpenMenuId(null);
    toast.success("삭제되었습니다.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadForm((p) => ({ ...p, file, files, previewUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uploadForm.title.trim()) { toast.error("제목을 입력해 주세요."); return; }
    if (!uploadForm.uploadedBy) { toast.error("등록자를 선택해 주세요."); return; }
    const newPhoto: Photo = {
      id: createId("photo"),
      title: uploadForm.title,
      description: uploadForm.description,
      imageUrl: uploadForm.previewUrl || `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&auto=format`,
      takenAt: uploadForm.takenAt || new Date().toISOString().slice(0, 10),
      uploadedBy: uploadForm.uploadedBy,
      category: uploadForm.category,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    if (!ensureSupabase()) return;
    const files = uploadForm.files.length > 0
      ? uploadForm.files
      : uploadForm.file ? [uploadForm.file] : [];
    const batchId = files.length > 1 ? createId("batch") : undefined;
    const storedPhotos: Photo[] = [];
    if (files.length === 0) {
      await createGalleryPhoto(newPhoto);
      storedPhotos.push(newPhoto);
    } else {
      for (const [index, file] of files.entries()) {
        const photo = {
          ...(index === 0
          ? newPhoto
          : { ...newPhoto, id: createId("photo"), title: `${newPhoto.title} (${index + 1})` }),
          batchId,
        };
        const storedPhoto = { ...photo, ...(await uploadImage(file, photo.id)) };
        await createGalleryPhoto(storedPhoto);
        storedPhotos.push(storedPhoto);
      }
    }
    setPhotos((prev) => [...storedPhotos, ...prev]);
    setUploadForm({ title: "", description: "", takenAt: "", uploadedBy: "", category: "event", previewUrl: "", file: null, files: [] });
    uploadModal.close();
    toast.success("사진이 등록되었습니다!");
  };

  const handleLikeRemote = async (id: string) => {
    const photo = photos.find((item) => item.id === id);
    if (!photo || !ensureSupabase()) return;

    try {
      await updateGalleryLikes(id, photo.likes + 1);
      setPhotos((prev) => prev.map((item) => item.id === id ? { ...item, likes: item.likes + 1 } : item));
    } catch {
      toast.error("좋아요를 저장하지 못했습니다.");
    }
  };

  const handleAddCommentRemote = async (photoId: string) => {
    if (!commentAuthor || !commentText.trim() || !ensureSupabase()) return;
    const comment: PhotoComment = {
      id: createId("c"),
      author: commentAuthor,
      content: commentText,
      createdAt: new Date().toISOString(),
    };

    try {
      await createGalleryComment(photoId, comment);
      setPhotos((prev) => prev.map((photo) => photo.id === photoId ? { ...photo, comments: [...photo.comments, comment] } : photo));
      setCommentText("");
      toast.success("댓글을 등록했습니다.");
    } catch {
      toast.error("댓글을 저장하지 못했습니다.");
    }
  };

  const handleDeletePhotoRemote = async (id: string) => {
    if (!window.confirm("이 사진을 삭제할까요?")) return;
    const photo = photos.find((item) => item.id === id);
    if (!photo || !ensureSupabase()) return;

    try {
      await deleteGalleryPhoto(photo);
      setPhotos((prev) => prev.filter((item) => item.id !== id));
      if (detailId === id) setDetailId(null);
      setOpenMenuId(null);
      toast.success("사진을 삭제했습니다.");
    } catch {
      toast.error("사진을 삭제하지 못했습니다.");
    }
  };

  const handleUploadRemote = async () => {
    if (!uploadForm.title.trim() || !uploadForm.uploadedBy || !ensureSupabase()) return;

    const photo: Photo = {
      id: createId("photo"),
      title: uploadForm.title,
      description: uploadForm.description,
      imageUrl: uploadForm.previewUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&auto=format",
      takenAt: uploadForm.takenAt || new Date().toISOString().slice(0, 10),
      uploadedBy: uploadForm.uploadedBy,
      category: uploadForm.category,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const storedPhoto = uploadForm.file
        ? { ...photo, ...(await uploadImage(uploadForm.file, photo.id)) }
        : photo;
      await createGalleryPhoto(storedPhoto);
      setPhotos((prev) => [storedPhoto, ...prev]);
      setUploadForm({ title: "", description: "", takenAt: "", uploadedBy: "", category: "event", previewUrl: "", file: null, files: [] });
      uploadModal.close();
      toast.success("사진을 등록했습니다.");
    } catch {
      toast.error("사진을 업로드하지 못했습니다.");
    }
  };

  const catLabel = (cat: string) => PHOTO_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200">
          <Camera className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">광주 2반 사진첩</h1>
          <p className="text-sm text-gray-500">수업, 프로젝트, 행사에서 만든 우리 반의 추억을 기록해요.</p>
        </div>
        <button onClick={uploadModal.open} className="ml-auto flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors text-sm shadow-sm">
          <Plus className="w-4 h-4" />사진 추가
        </button>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white" placeholder="제목, 설명, 등록자로 검색..." />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PHOTO_CATEGORIES.map((cat) => (
            <button key={cat.value} onClick={() => setSelectedCategory(cat.value as PhotoCategory)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${selectedCategory === cat.value ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-border text-gray-600 hover:bg-emerald-50"}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="font-semibold text-gray-700">{filtered.length}장</span>
        {search && <span>"{search}" 검색 결과</span>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-16 flex flex-col items-center text-center">
          <Camera className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">사진이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {displayPhotos.map((photo) => (
            <div key={photo.id} className="group relative bg-gray-100 rounded-2xl overflow-hidden aspect-square cursor-pointer" onClick={() => setDetailId(photo.id)}>
              <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-semibold truncate">{photo.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-white/80 text-xs"><Heart className="w-3 h-3" />{photo.likes}</span>
                  <span className="flex items-center gap-1 text-white/80 text-xs"><MessageCircle className="w-3 h-3" />{photo.comments.length}</span>
                </div>
              </div>
              {/* Category badge */}
              <span className="absolute top-2 left-2 text-xs font-semibold bg-black/40 text-white px-2 py-0.5 rounded-full">{catLabel(photo.category)}</span>
              {/* Menu */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setOpenMenuId(openMenuId === photo.id ? null : photo.id)} className="w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
                {openMenuId === photo.id && (
                  <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-border py-1 z-10 min-w-[100px]">
                    <button onClick={() => handleDeletePhoto(photo.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detailPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setDetailId(null)}>
          <div className="bg-white rounded-2xl overflow-hidden w-[90vw] h-[84vh] flex flex-col md:flex-row shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative md:w-[74%] bg-gray-900 flex-shrink-0">
              <img src={detailPhoto.imageUrl} alt={detailPhoto.title} className="w-full h-80 md:h-full object-contain" />
              <button onClick={() => setDetailId(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"><X className="w-4 h-4" /></button>
              {detailIndex > 0 && (
                <button onClick={() => setDetailId(detailAlbum[detailIndex - 1].id)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"><ChevronLeft className="w-5 h-5" /></button>
              )}
              {detailIndex < detailAlbum.length - 1 && (
                <button onClick={() => setDetailId(detailAlbum[detailIndex + 1].id)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"><ChevronRight className="w-5 h-5" /></button>
              )}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-bold text-gray-800 mb-1">{detailPhoto.title}</h3>
                <p className="text-xs text-gray-500">{detailPhoto.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{formatDate(detailPhoto.takenAt)} 촬영</span>
                  <span>등록자: {detailPhoto.uploadedBy}</span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{catLabel(detailPhoto.category)}</span>
                </div>
                <button onClick={() => handleLike(detailPhoto.id)} className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                  <Heart className="w-4 h-4" />{detailPhoto.likes}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {detailPhoto.comments.map((c) => (
                  <div key={c.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-700">{c.author}</span>
                      <span className="text-xs text-gray-400">{formatRelative(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{c.content}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border space-y-2">
                <select value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
                  <option value="">작성자 선택</option>
                  {STUDENTS.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <input value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddComment(detailPhoto.id)} className="flex-1 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="댓글을 입력하세요..." />
                  <button onClick={() => handleAddComment(detailPhoto.id)} className="bg-emerald-600 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">등록</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={uploadModal.close}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800">사진 등록</h2>
              <button onClick={uploadModal.close}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            {/* Dropzone */}
            <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-emerald-50 transition-colors" onClick={() => fileRef.current?.click()}>
              {uploadForm.previewUrl ? (
                <img src={uploadForm.previewUrl} alt="미리보기" className="w-full h-32 object-cover rounded-xl" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">클릭하거나 드래그해서 이미지를 업로드하세요</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
              {uploadForm.files.length > 1 && (
                <p className="mt-2 text-xs font-semibold text-emerald-600">{uploadForm.files.length}장 선택됨</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">제목 *</label>
              <input value={uploadForm.title} onChange={(e) => setUploadForm((p) => ({ ...p, title: e.target.value }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="사진 제목" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">설명</label>
              <input value={uploadForm.description} onChange={(e) => setUploadForm((p) => ({ ...p, description: e.target.value }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="간단한 설명" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1">촬영 날짜</label>
                <input type="date" value={uploadForm.takenAt} onChange={(e) => setUploadForm((p) => ({ ...p, takenAt: e.target.value }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1">카테고리</label>
                <select value={uploadForm.category} onChange={(e) => setUploadForm((p) => ({ ...p, category: e.target.value as PhotoCategory }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
                  {PHOTO_CATEGORIES.filter((c) => c.value !== "all").map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">등록자 *</label>
              <select value={uploadForm.uploadedBy} onChange={(e) => setUploadForm((p) => ({ ...p, uploadedBy: e.target.value }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
                <option value="">선택</option>
                {STUDENTS.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleUpload} className="flex-1 bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors">사진 등록</button>
              <button onClick={uploadModal.close} className="flex-1 bg-white border border-border text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
