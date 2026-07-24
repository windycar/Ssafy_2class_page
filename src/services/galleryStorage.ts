import type { Photo, PhotoCategory, PhotoComment } from "../types/photo";
import { requireSupabase } from "../lib/supabase";

type PhotoRow = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  storage_path: string | null;
  taken_at: string;
  uploaded_by: string;
  category: Exclude<PhotoCategory, "all">;
  likes: number;
  liked_by: string[];
  created_at: string;
};

type CommentRow = {
  id: string;
  photo_id: string;
  author: string;
  content: string;
  created_at: string;
};

const toComment = (comment: CommentRow): PhotoComment => ({
  id: comment.id,
  author: comment.author,
  content: comment.content,
  createdAt: comment.created_at,
});

const toPhoto = (photo: PhotoRow, comments: PhotoComment[]): Photo => ({
  id: photo.id,
  title: photo.title,
  description: photo.description,
  imageUrl: photo.image_url,
  storagePath: photo.storage_path ?? undefined,
  takenAt: photo.taken_at,
  uploadedBy: photo.uploaded_by,
  category: photo.category,
  likes: photo.likes,
  likedBy: photo.liked_by ?? [],
  comments,
  createdAt: photo.created_at,
});

export async function getGalleryPhotos(): Promise<Photo[]> {
  const client = requireSupabase();
  const { data: photoRows, error: photoError } = await client
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (photoError) throw photoError;
  if (!photoRows?.length) return [];

  const photoIds = photoRows.map((photo) => photo.id);
  const { data: commentRows, error: commentError } = await client
    .from("gallery_comments")
    .select("*")
    .in("photo_id", photoIds)
    .order("created_at", { ascending: true });

  if (commentError) throw commentError;

  const commentsByPhoto = new Map<string, PhotoComment[]>();
  (commentRows as CommentRow[] ?? []).forEach((comment) => {
    const comments = commentsByPhoto.get(comment.photo_id) ?? [];
    comments.push(toComment(comment));
    commentsByPhoto.set(comment.photo_id, comments);
  });

  return (photoRows as PhotoRow[]).map((photo) => toPhoto(photo, commentsByPhoto.get(photo.id) ?? []));
}

export async function uploadImage(file: File, photoId: string) {
  const client = requireSupabase();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `${photoId}.${extension}`;

  const { error } = await client.storage
    .from("gallery-images")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (error) throw error;

  return {
    storagePath,
    imageUrl: client.storage.from("gallery-images").getPublicUrl(storagePath).data.publicUrl,
  };
}

export async function createGalleryPhoto(photo: Photo) {
  const client = requireSupabase();
  const { error } = await client.from("gallery_photos").insert({
    id: photo.id,
    title: photo.title,
    description: photo.description,
    image_url: photo.imageUrl,
    storage_path: photo.storagePath ?? null,
    taken_at: photo.takenAt,
    uploaded_by: photo.uploadedBy,
    category: photo.category,
    likes: photo.likes,
    liked_by: photo.likedBy,
    created_at: photo.createdAt,
  });

  if (error) throw error;
}

export async function updateGalleryLikes(photoId: string, likes: number) {
  const client = requireSupabase();
  const { error } = await client.from("gallery_photos").update({ likes }).eq("id", photoId);
  if (error) throw error;
}

export async function createGalleryComment(photoId: string, comment: PhotoComment) {
  const client = requireSupabase();
  const { error } = await client.from("gallery_comments").insert({
    id: comment.id,
    photo_id: photoId,
    author: comment.author,
    content: comment.content,
    created_at: comment.createdAt,
  });

  if (error) throw error;
}

export async function deleteGalleryPhoto(photo: Photo) {
  const client = requireSupabase();
  const { error } = await client.from("gallery_photos").delete().eq("id", photo.id);
  if (error) throw error;

  if (photo.storagePath) {
    const { error: storageError } = await client.storage.from("gallery-images").remove([photo.storagePath]);
    if (storageError) throw storageError;
  }
}
