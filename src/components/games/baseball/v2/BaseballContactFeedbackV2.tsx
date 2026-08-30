import { baseballContactFeedbackForEventV2 } from "../../../../utils/games/baseball/contactFeedback.ts";
import type { VisualEvent } from "../../../../utils/games/baseball/types.ts";

export interface BaseballContactFeedbackV2Props {
  event: VisualEvent;
}

export function BaseballContactFeedbackV2({ event }: BaseballContactFeedbackV2Props) {
  const feedback = baseballContactFeedbackForEventV2(event);
  if (!feedback) return null;

  return (
    <aside
      className="bbv2-contact-feedback"
      data-timing={feedback.timing}
      data-contact-quality={feedback.quality}
      role="status"
      aria-live="polite"
    >
      <span data-tone={feedback.timingTone}>{feedback.timingLabel} TIMING</span>
      <strong data-tone={feedback.contactTone}>{feedback.contactLabel}</strong>
      <small>PCI OVERLAP · {feedback.pciPercent}%</small>
    </aside>
  );
}

export default BaseballContactFeedbackV2;
