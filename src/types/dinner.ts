export type DinnerStatus = "attending" | "absent" | "late";
export type DinnerMode = "attendance" | "availability";

export interface DinnerPollInput {
  title: string;
  mode: DinnerMode;
  location: string;
  location_url: string;
  event_date: string | null;
  event_time: string;
  date_start: string | null;
  date_end: string | null;
  deadline: string | null;
  notice: string;
}

export interface DinnerPoll extends DinnerPollInput {
  id: string;
  is_closed: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DinnerResponseInput {
  status: DinnerStatus;
  available_dates: string[];
  arrival_time: string | null;
  note: string;
}

export interface DinnerResponse extends DinnerResponseInput {
  poll_id: string;
  member_id: number;
  participant_name: string;
  updated_at: string;
}

export const DINNER_STATUS_LABELS: Record<DinnerStatus, string> = {
  attending: "참여",
  absent: "불참",
  late: "늦참",
};
