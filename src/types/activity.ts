export type ActivityType = "team" | "coffee" | "gallery" | "groundRule";

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  createdAt: string;
}
