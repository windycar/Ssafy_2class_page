import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";

export interface BaseballOverlayFrameV2Props {
  kind: "intro" | "event" | "half" | "final" | "waiting";
  label: string;
  children: ReactNode;
  backgroundSrc?: string;
  modal?: boolean;
  live?: "polite" | "assertive";
  className?: string;
}

function joinClassNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((element) => element.getAttribute("aria-hidden") !== "true");
}

export function BaseballOverlayFrameV2({
  kind,
  label,
  children,
  backgroundSrc,
  modal = false,
  live,
  className,
}: BaseballOverlayFrameV2Props) {
  const frameRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!modal) return undefined;
    const frame = frameRef.current;
    if (!frame) return undefined;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    frame.focus({ preventScroll: true });

    return () => {
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [modal]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!modal || event.key !== "Tab") return;
    const frame = frameRef.current;
    if (!frame) return;

    const focusableElements = getFocusableElements(frame);
    if (focusableElements.length === 0) {
      event.preventDefault();
      frame.focus({ preventScroll: true });
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;
    const focusIsOutside = !(activeElement instanceof Node) || !frame.contains(activeElement);

    if (event.shiftKey && (activeElement === first || activeElement === frame || focusIsOutside)) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && (activeElement === last || activeElement === frame || focusIsOutside)) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <section
      ref={frameRef}
      className={joinClassNames("bbv2-overlay", `bbv2-overlay--${kind}`, className)}
      role={modal ? "dialog" : "status"}
      aria-modal={modal ? true : undefined}
      aria-label={label}
      aria-live={live}
      tabIndex={modal ? -1 : undefined}
      onKeyDown={handleKeyDown}
    >
      {backgroundSrc ? (
        <img className="bbv2-overlay__background" src={backgroundSrc} alt="" draggable={false} />
      ) : null}
      <div className="bbv2-overlay__shade" aria-hidden="true" />
      <div className="bbv2-overlay__content">{children}</div>
    </section>
  );
}
