import type {
  BaseballPitchType,
  SwingType,
} from "../../../../utils/games/baseballEngine";

export type BaseballControlModeV2 = "PITCHING" | "BATTING" | "BETWEEN" | "SPECTATING";

export type BaseballControlPhaseV2 =
  | "READY"
  | "AIMING"
  | "PITCH_WINDUP"
  | "PITCH_FLIGHT"
  | "EVENT_PLAYBACK"
  | "BETWEEN_PLAYS"
  | "HALF_INNING"
  | "FINAL"
  | "ONLINE_WAITING";

export interface BaseballControlsV2Props {
  mode: BaseballControlModeV2;
  phase: BaseballControlPhaseV2;
  selectedPitch: BaseballPitchType;
  selectedSwing: SwingType;
  availablePitches?: readonly BaseballPitchType[];
  primaryActionLabel: string;
  instruction?: string;
  disabled?: boolean;
  primaryActionEnabled?: boolean;
  primaryActionBusy?: boolean;
  onSelectPitch: (pitch: BaseballPitchType) => void;
  onSelectSwing: (swing: SwingType) => void;
  onPrimaryAction: () => void;
  className?: string;
}

interface PitchOptionV2 {
  type: BaseballPitchType;
  label: string;
  detail: string;
}

interface SwingOptionV2 {
  type: SwingType;
  label: string;
  detail: string;
}

const PITCH_OPTIONS: readonly PitchOptionV2[] = [
  { type: "fourSeam", label: "포심", detail: "빠른 일직선" },
  { type: "twoSeam", label: "투심", detail: "팔쪽 무브먼트" },
  { type: "slider", label: "슬라이더", detail: "빠른 횡변화" },
  { type: "curve", label: "커브", detail: "큰 낙차" },
  { type: "changeup", label: "체인지업", detail: "타이밍 교란" },
  { type: "fork", label: "포크", detail: "후반 급강하" },
  { type: "cutter", label: "커터", detail: "짧은 역무브" },
] as const;

const ALL_PITCH_TYPES = PITCH_OPTIONS.map((option) => option.type);

const SWING_OPTIONS: readonly SwingOptionV2[] = [
  { type: "CONTACT", label: "CONTACT", detail: "정확도 우선" },
  { type: "NORMAL", label: "NORMAL", detail: "균형 스윙" },
  { type: "POWER", label: "POWER", detail: "장타 우선" },
] as const;

const SELECTABLE_PHASES: readonly BaseballControlPhaseV2[] = ["READY", "AIMING"];
const PRIMARY_PHASES: readonly BaseballControlPhaseV2[] = [
  "READY",
  "AIMING",
  "PITCH_FLIGHT",
  "BETWEEN_PLAYS",
  "HALF_INNING",
];

function joinClassNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

export function BaseballControlsV2({
  mode,
  phase,
  selectedPitch,
  selectedSwing,
  availablePitches = ALL_PITCH_TYPES,
  primaryActionLabel,
  instruction,
  disabled = false,
  primaryActionEnabled = true,
  primaryActionBusy = false,
  onSelectPitch,
  onSelectSwing,
  onPrimaryAction,
  className,
}: BaseballControlsV2Props) {
  const phaseAllowsSelection = SELECTABLE_PHASES.includes(phase);
  const phaseAllowsPrimary = phase === "PITCH_FLIGHT"
    ? mode === "BATTING"
    : PRIMARY_PHASES.includes(phase);
  const selectorsDisabled = disabled || !phaseAllowsSelection;
  const primaryDisabled = disabled
    || primaryActionBusy
    || !primaryActionEnabled
    || !phaseAllowsPrimary
    || mode === "SPECTATING";

  return (
    <section
      className={joinClassNames("bbv2-controls", className)}
      data-control-mode={mode}
      data-control-phase={phase}
      aria-label="야구 조작부"
      aria-busy={primaryActionBusy}
    >
      <div className="bbv2-controls__status">
        <small>{mode === "PITCHING" ? "PITCHING" : mode === "BATTING" ? "BATTING" : "GAME"}</small>
        <strong>{instruction ?? "스페이스바 또는 실행 버튼을 누르세요."}</strong>
      </div>

      <div
        className={joinClassNames(
          "bbv2-selector",
          "bbv2-selector--pitches",
          mode === "PITCHING" ? undefined : "is-hidden",
        )}
        role="radiogroup"
        aria-label="구종 선택"
        aria-hidden={mode === "PITCHING" ? undefined : true}
      >
        {PITCH_OPTIONS.map((option, index) => {
          const isAvailable = availablePitches.includes(option.type);
          const isSelected = selectedPitch === option.type;
          return (
            <button
              className={joinClassNames(
                "bbv2-selector-button",
                `bbv2-selector-button--pitch-${index + 1}`,
                isSelected ? "is-selected" : undefined,
              )}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.label}, ${option.detail}`}
              disabled={selectorsDisabled || !isAvailable || mode !== "PITCHING"}
              onClick={() => onSelectPitch(option.type)}
              key={option.type}
            >
              <span>{index + 1}</span>
              <strong>{option.label}</strong>
              <small>{isAvailable ? option.detail : "사용 불가"}</small>
            </button>
          );
        })}
      </div>

      <div
        className={joinClassNames(
          "bbv2-selector",
          "bbv2-selector--swings",
          mode === "BATTING" ? undefined : "is-hidden",
        )}
        role="radiogroup"
        aria-label="스윙 유형 선택"
        aria-hidden={mode === "BATTING" ? undefined : true}
      >
        {SWING_OPTIONS.map((option) => {
          const isSelected = selectedSwing === option.type;
          return (
            <button
              className={joinClassNames(
                "bbv2-selector-button",
                `bbv2-selector-button--${option.type.toLowerCase()}`,
                isSelected ? "is-selected" : undefined,
              )}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.label}, ${option.detail}`}
              disabled={selectorsDisabled || mode !== "BATTING"}
              onClick={() => onSelectSwing(option.type)}
              key={option.type}
            >
              <strong>{option.label}</strong>
              <small>{option.detail}</small>
            </button>
          );
        })}
      </div>

      {mode === "BETWEEN" || mode === "SPECTATING" ? (
        <div className="bbv2-controls__between" aria-live="polite">
          <span aria-hidden="true">◆</span>
          <strong>{mode === "SPECTATING" ? "상대의 플레이를 기다리는 중" : "다음 플레이 준비"}</strong>
        </div>
      ) : null}

      <button
        className="bbv2-primary-action"
        type="button"
        aria-keyshortcuts="Space"
        disabled={primaryDisabled}
        onClick={onPrimaryAction}
      >
        <span>SPACE</span>
        <strong>{primaryActionBusy ? "처리 중…" : primaryActionLabel}</strong>
      </button>
    </section>
  );
}
