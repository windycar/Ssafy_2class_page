import type {
  ContactQuality,
  ContactResolution,
  OfficialPlayResult,
  SwingTiming,
  VisualEvent,
} from "./types.ts";

export type BaseballContactFeedbackToneV2 = "early" | "perfect" | "late" | "weak" | "good";

export interface BaseballContactFeedbackV2 {
  timing: SwingTiming;
  quality: ContactQuality;
  timingLabel: string;
  contactLabel: string;
  timingTone: BaseballContactFeedbackToneV2;
  contactTone: BaseballContactFeedbackToneV2;
  pciPercent: number;
}

export type BaseballStageImpactV2 = "perfect" | "home-run" | "grand-slam";

const TIMINGS = new Set<SwingTiming>([
  "VERY_EARLY",
  "EARLY",
  "GOOD",
  "PERFECT",
  "LATE",
  "VERY_LATE",
]);
const QUALITIES = new Set<ContactQuality>(["NONE", "WEAK", "GOOD", "PERFECT"]);
const HOME_RUN_RESULTS = new Set([
  "HOME_RUN_LEFT",
  "HOME_RUN_CENTER",
  "HOME_RUN_RIGHT",
]);

const TIMING_LABELS: Readonly<Record<SwingTiming, string>> = {
  VERY_EARLY: "VERY EARLY",
  EARLY: "EARLY",
  GOOD: "GOOD",
  PERFECT: "PERFECT",
  LATE: "LATE",
  VERY_LATE: "VERY LATE",
};

const CONTACT_LABELS: Readonly<Record<ContactQuality, string>> = {
  NONE: "NO CONTACT",
  WEAK: "WEAK CONTACT",
  GOOD: "GOOD CONTACT",
  PERFECT: "PERFECT CONTACT",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function contactFromEvent(event: VisualEvent): ContactResolution | null {
  if (event.kind !== "CONTACT" || !isRecord(event.payload.contact)) return null;
  const contact = event.payload.contact;
  if (
    !TIMINGS.has(contact.timing as SwingTiming)
    || !QUALITIES.has(contact.quality as ContactQuality)
    || typeof contact.pciOverlap !== "number"
    || !Number.isFinite(contact.pciOverlap)
  ) return null;
  return contact as unknown as ContactResolution;
}

function timingTone(timing: SwingTiming): BaseballContactFeedbackToneV2 {
  if (timing === "PERFECT" || timing === "GOOD") return "perfect";
  if (timing === "VERY_EARLY" || timing === "EARLY") return "early";
  return "late";
}

function contactTone(quality: ContactQuality): BaseballContactFeedbackToneV2 {
  if (quality === "PERFECT") return "perfect";
  if (quality === "GOOD") return "good";
  return "weak";
}

export function baseballContactFeedbackForEventV2(
  event: VisualEvent,
): BaseballContactFeedbackV2 | null {
  const contact = contactFromEvent(event);
  if (!contact) return null;
  return {
    timing: contact.timing,
    quality: contact.quality,
    timingLabel: TIMING_LABELS[contact.timing],
    contactLabel: CONTACT_LABELS[contact.quality],
    timingTone: timingTone(contact.timing),
    contactTone: contactTone(contact.quality),
    pciPercent: Math.round(Math.min(1, Math.max(0, contact.pciOverlap)) * 100),
  };
}

export function baseballStageImpactForEventV2(
  event: VisualEvent | null | undefined,
  official: OfficialPlayResult | null | undefined,
): BaseballStageImpactV2 | null {
  if (!event || event.kind !== "CONTACT") return null;
  if (official && HOME_RUN_RESULTS.has(official.code)) {
    return official.runsScored >= 4 ? "grand-slam" : "home-run";
  }
  return baseballContactFeedbackForEventV2(event)?.quality === "PERFECT"
    ? "perfect"
    : null;
}

export function baseballStageImpactClassV2(
  event: VisualEvent | null | undefined,
  official: OfficialPlayResult | null | undefined,
) {
  const impact = baseballStageImpactForEventV2(event, official);
  return impact ? `bbv2-stage--impact-${impact}` : undefined;
}
