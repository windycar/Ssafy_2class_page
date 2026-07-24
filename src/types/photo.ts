export type PhotoCategory = "all" | "class" | "project" | "event" | "lunch" | "dinner" | "etc";

export interface PhotoComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  storagePath?: string;
  batchId?: string;
  takenAt: string;
  uploadedBy: string;
  category: PhotoCategory;
  likes: number;
  likedBy: string[];
  comments: PhotoComment[];
  createdAt: string;
}
