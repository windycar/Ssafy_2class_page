export type ActivityType = "team" | "dinner" | "gallery" | "groundRule";

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  createdAt: string;
}
