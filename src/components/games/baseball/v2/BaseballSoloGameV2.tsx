import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import confetti from "canvas-confetti";

import baseballArenaFacing from "../../../../assets/games/baseball-arena-facing.png";
import baseballArenaSwingFacing from "../../../../assets/games/baseball-arena-swing-facing.png";
import baseballBallBody from "../../../../assets/games/baseball-ball-body-v2.png";
import baseballBatterActionsBlue from "../../../../assets/games/baseball-batter-actions-blue.png";
import baseballBattingField from "../../../../assets/games/baseball-batting-field.png";
import baseballCameraHomeRun from "../../../../assets/games/baseball-camera-home-run.png";
import baseballCameraInfield from "../../../../assets/games/baseball-camera-infield.png";
import baseballCameraPitcherEmpty from "../../../../assets/games/baseball-camera-pitcher-empty.png";
import baseballFielderActionsRed from "../../../../assets/games/baseball-fielder-actions-red.png";
import baseballPitcherActionsRed from "../../../../assets/games/baseball-pitcher-actions-red.png";
import baseballPitchChangeup10 from "../../../../assets/games/baseball-pitch-changeup-10.png";
import baseballPitchCurve10 from "../../../../assets/games/baseball-pitch-curve-10.png";
import baseballPitchFastball10 from "../../../../assets/games/baseball-pitch-fastball-10.png";
import baseballPitchSlider10 from "../../../../assets/games/baseball-pitch-slider-10.png";
import { useBaseballSoloController } from "../../../../hooks/useBaseballSoloController.ts";
import {
  getCurrentBatter,
  getCurrentPitcher,
} from "../../../../utils/games/baseball/gameState.ts";
import {
  createPitchVisualFrame,
  DEFAULT_PITCH_STAGE_PROJECTION,
  derivePitchStageProjection,
  projectBattedBallToCamera,
  projectRunnerAdvance,
  type PitchSpriteSample,
  type PitchStageProjection,
} from "../../../../utils/games/baseball/presentation.ts";
import type {
  BaseballCameraMode,
  BattedBall,
  BaseballGameState,
  BaseballPlayResultCode,
  OfficialPlayResult,
  PitchFlightState,
  VisualEvent,
} from "../../../../utils/games/baseball/types.ts";
import {
  BaseballControlsV2,
  type BaseballControlModeV2,
  type BaseballControlPhaseV2,
} from "./BaseballControlsV2.tsx";
import { BaseballHudV2 } from "./BaseballHudV2.tsx";
import {
  BaseballEventOverlayV2,
  BaseballFinalOverlayV2,
  BaseballHalfInningOverlayV2,
  BaseballIntroOverlayV2,
  type BaseballEventToneV2,
} from "./BaseballOverlaysV2.tsx";
import {
  BaseballStageV2,
  type BaseballBallPresentationV2,
  type BaseballPresentationPointV2,
  type BaseballRunnerPresentationV2,
  type BaseballTrailPointsV2,
} from "./BaseballStageV2.tsx";
import "../../../../styles/baseball-v2.css";

const USER_TEAM_INDEX = 1;
const AIM_KEY_STEP = 0.035;
const BATTED_TRAIL_PROGRESS_GAP = 0.042;

const PITCH_NAMES = {
  fourSeam: "포심 직구",
  twoSeam: "투심",
  slider: "슬라이더",
  curve: "커브",
  changeup: "체인지업",
  fork: "포크",
  cutter: "커터",
} as const;

const HOME_RUN_CODES = new Set<BaseballPlayResultCode>([
  "HOME_RUN_LEFT",
  "HOME_RUN_CENTER",
  "HOME_RUN_RIGHT",
]);

const HIT_CODES = new Set<BaseballPlayResultCode>([
  "SINGLE_LEFT",
  "SINGLE_CENTER",
  "SINGLE_RIGHT",
  "INFIELD_SINGLE",
  "DOUBLE_LEFT",
  "DOUBLE_CENTER",
  "DOUBLE_RIGHT",
  "TRIPLE",
  ...HOME_RUN_CODES,
]);

const OUT_CODES = new Set<BaseballPlayResultCode>([
  "STRIKEOUT_LOOKING",
  "STRIKEOUT_SWINGING",
  "GROUND_OUT_1B",
  "GROUND_OUT_2B",
  "GROUND_OUT_SS",
  "GROUND_OUT_3B",
  "FLY_OUT_LF",
  "FLY_OUT_CF",
  "FLY_OUT_RF",
  "LINE_OUT",
  "POP_OUT",
  "DOUBLE_PLAY",
  "FIELDER_CHOICE",
  "SAC_FLY",
]);

const RESULT_LABELS: Readonly<Record<BaseballPlayResultCode, string>> = {
  BALL: "볼",
  CALLED_STRIKE: "스트라이크",
  SWINGING_STRIKE: "헛스윙 스트라이크",
  FOUL: "파울",
  WALK: "볼넷",
  STRIKEOUT_LOOKING: "루킹 삼진",
  STRIKEOUT_SWINGING: "헛스윙 삼진",
  GROUND_OUT_1B: "1루수 땅볼 아웃",
  GROUND_OUT_2B: "2루수 땅볼 아웃",
  GROUND_OUT_SS: "유격수 땅볼 아웃",
  GROUND_OUT_3B: "3루수 땅볼 아웃",
  FLY_OUT_LF: "좌익수 플라이 아웃",
  FLY_OUT_CF: "중견수 플라이 아웃",
  FLY_OUT_RF: "우익수 플라이 아웃",
  LINE_OUT: "직선타 아웃",
  POP_OUT: "뜬공 아웃",
  SINGLE_LEFT: "좌전 안타",
  SINGLE_CENTER: "중전 안타",
  SINGLE_RIGHT: "우전 안타",
  INFIELD_SINGLE: "내야 안타",
  DOUBLE_LEFT: "좌중간 2루타",
  DOUBLE_CENTER: "중앙 2루타",
  DOUBLE_RIGHT: "우중간 2루타",
  TRIPLE: "3루타",
  HOME_RUN_LEFT: "좌월 홈런!",
  HOME_RUN_CENTER: "중월 홈런!",
  HOME_RUN_RIGHT: "우월 홈런!",
  DOUBLE_PLAY: "병살타",
  FIELDER_CHOICE: "야수 선택",
  SAC_FLY: "희생 플라이",
  ERROR: "수비 실책",
};

const shellStyle: CSSProperties = {
  boxSizing: "border-box",
  width: "min(100%, 1440px)",
  margin: "0 auto",
  padding: "12px clamp(8px, 2vw, 24px) 24px",
};

const topBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "10px",
};

const exitButtonStyle: CSSProperties = {
  border: "1px solid rgba(15, 23, 42, 0.16)",
  borderRadius: "999px",
  padding: "8px 14px",
  color: "#0f2742",
  background: "rgba(255, 255, 255, 0.9)",
  fontWeight: 850,
  cursor: "pointer",
};

export interface BaseballSoloGameV2Props {
  onExit: () => void;
  playerName?: string;
  seed?: number;
  className?: string;
}

interface EventCopy {
  title: string;
  detail: string;
  tone: BaseballEventToneV2;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(
    "input, textarea, select, button, a, [contenteditable='true'], [role='button'], [role='link']",
  ));
}

function toPoint(sample: PitchSpriteSample): BaseballPresentationPointV2 {
  return {
    x: sample.position.xPercent,
    y: sample.position.yPercent,
    scale: sample.scale,
    opacity: sample.opacity,
    rotationDeg: sample.rotation,
  };
}

function pitchingPoint(
  sample: PitchSpriteSample,
  trajectory: PitchFlightState,
  projection: PitchStageProjection,
): BaseballPresentationPointV2 {
  const rawStart = {
    x: projection.leftPercent + trajectory.start.x * projection.widthPercent,
    y: projection.topPercent + trajectory.start.y * projection.heightPercent,
  };
  const target = {
    x: projection.leftPercent + trajectory.target.x * projection.widthPercent,
    y: projection.topPercent + trajectory.target.y * projection.heightPercent,
  };
  const rawLine = {
    x: lerp(rawStart.x, target.x, sample.progress),
    y: lerp(rawStart.y, target.y, sample.progress),
  };
  const release = { x: 34, y: 62 };

  return {
    x: lerp(release.x, target.x, sample.progress) + sample.position.xPercent - rawLine.x,
    y: lerp(release.y, target.y, sample.progress) + sample.position.yPercent - rawLine.y,
    scale: lerp(1.12, 0.28, sample.perspectiveProgress),
    opacity: sample.opacity,
    rotationDeg: sample.rotation,
  };
}

function trailTuple(points: readonly BaseballPresentationPointV2[]): BaseballTrailPointsV2 {
  if (points.length !== 10) throw new Error("야구공 잔상은 정확히 10개여야 합니다.");
  return points as unknown as BaseballTrailPointsV2;
}

function createPitchPresentation(
  trajectory: PitchFlightState,
  progress: number,
  projection: PitchStageProjection,
  pitchingPerspective: boolean,
): BaseballBallPresentationV2 {
  const frame = createPitchVisualFrame(trajectory, progress, { projection });
  const project = (sample: PitchSpriteSample) => (
    pitchingPerspective
      ? pitchingPoint(sample, trajectory, projection)
      : toPoint(sample)
  );

  return {
    body: project(frame.body),
    trail: trailTuple(frame.trails.map(project)),
    pitchType: trajectory.pitchType,
    visible: true,
  };
}

function createBattedPresentation(
  ball: BattedBall,
  progress: number,
  camera: BaseballCameraMode,
): BaseballBallPresentationV2 {
  const normalized = clamp(progress, 0, 1);
  const samplePoint = (sampleProgress: number, opacityScale = 1): BaseballPresentationPointV2 => {
    const sample = projectBattedBallToCamera(ball, sampleProgress, camera);
    return {
      x: sample.position.xPercent,
      y: sample.position.yPercent,
      scale: sample.scale,
      opacity: sample.opacity * opacityScale,
      rotationDeg: sample.rotation,
    };
  };
  const trails = Array.from({ length: 10 }, (_, index) => {
    const age = (index + 1) / 10;
    return samplePoint(
      Math.max(0, normalized - BATTED_TRAIL_PROGRESS_GAP * (index + 1)),
      lerp(0.48, 0.06, age),
    );
  });

  return {
    body: samplePoint(normalized),
    trail: trailTuple(trails),
    visible: true,
  };
}

function resultTone(official: OfficialPlayResult | null): BaseballEventToneV2 {
  if (!official) return "neutral";
  if (HOME_RUN_CODES.has(official.code)) return "home-run";
  if (official.runsScored > 0) return "score";
  if (HIT_CODES.has(official.code) || official.code === "ERROR") return "hit";
  if (OUT_CODES.has(official.code)) return "out";
  if (["CALLED_STRIKE", "SWINGING_STRIKE", "FOUL"].includes(official.code)) return "strike";
  return "neutral";
}

function eventCopy(
  event: VisualEvent,
  official: OfficialPlayResult | null,
  game: BaseballGameState,
): EventCopy {
  const resultLabel = official ? RESULT_LABELS[official.code] : "플레이 진행";
  const lastLog = game.playByPlay[game.playByPlay.length - 1]?.message ?? resultLabel;
  const tone = resultTone(official);

  switch (event.kind) {
    case "CONTACT":
      return { title: "타격!", detail: "배트와 공이 만났습니다.", tone };
    case "BALL_FLIGHT":
      return { title: "타구 추적", detail: "실제 타구 궤적을 추적하고 있습니다.", tone };
    case "FIELD_RESULT":
      return { title: resultLabel, detail: "수비 판정이 확정됐습니다.", tone };
    case "RUNNER_ADVANCE":
      return { title: "주자 진루", detail: "주자와 송구의 도착 시간을 계산합니다.", tone };
    case "RUN_SCORE":
      return {
        title: `${official?.runsScored ?? 0}점 득점!`,
        detail: "주자가 홈플레이트를 밟았습니다.",
        tone: HOME_RUN_CODES.has(official?.code ?? "BALL") ? "home-run" : "score",
      };
    case "SCOREBOARD_UPDATE":
      return {
        title: `${game.teams[0].runs} : ${game.teams[1].runs}`,
        detail: "공식 점수와 아웃 카운트를 반영했습니다.",
        tone,
      };
    case "PLAY_RESULT":
      return { title: resultLabel, detail: lastLog, tone };
    case "NEXT_BATTER":
      return { title: "다음 타자", detail: "다음 투타 대결을 준비합니다.", tone: "neutral" };
  }
}

function controlPhase(presentation: ReturnType<typeof useBaseballSoloController>["presentation"]): BaseballControlPhaseV2 {
  switch (presentation) {
    case "READY_FOR_PITCH": return "READY";
    case "PITCH_WINDUP": return "PITCH_WINDUP";
    case "PITCH_FLIGHT": return "PITCH_FLIGHT";
    case "EVENT_PLAYBACK": return "EVENT_PLAYBACK";
    case "BETWEEN_PLAYS": return "BETWEEN_PLAYS";
    case "HALF_INNING": return "HALF_INNING";
    case "FINAL": return "FINAL";
    case "INTRO": return "READY";
  }
}

function scoreLabel(game: BaseballGameState) {
  return `${game.teams[0].shortName} ${game.teams[0].runs} : ${game.teams[1].runs} ${game.teams[1].shortName}`;
}

function staticRunnerPresentations(game: BaseballGameState): BaseballRunnerPresentationV2[] {
  const bases = [
    { runner: game.bases.first, x: 73, y: 65, label: "1루" },
    { runner: game.bases.second, x: 50, y: 42, label: "2루" },
    { runner: game.bases.third, x: 27, y: 65, label: "3루" },
  ];
  return bases.flatMap(({ runner, x, y, label }) => runner ? [{
    playerId: runner.playerId,
    name: runner.name,
    point: { x, y, scale: 0.84, opacity: 1 },
    baseLabel: label,
  }] : []);
}

function runnerPresentations(
  authoritativeGame: BaseballGameState,
  presentationGame: BaseballGameState,
  event: VisualEvent | null,
  eventProgress: number,
): BaseballRunnerPresentationV2[] {
  const resolution = authoritativeGame.activePlay?.runners;
  if (
    !event
    || !resolution
    || (event.kind !== "RUNNER_ADVANCE" && event.kind !== "RUN_SCORE")
  ) {
    return staticRunnerPresentations(presentationGame);
  }

  const elapsedMs = event.kind === "RUN_SCORE"
    ? Number.MAX_SAFE_INTEGER
    : event.durationMs * clamp(eventProgress, 0, 1);
  return resolution.advances
    .filter((advance) => advance.result !== "HOLD")
    .map((advance) => {
      const sample = projectRunnerAdvance(advance, elapsedMs);
      const destination = sample.toBase === 4 ? "홈" : `${sample.toBase}루`;
      const label = sample.status === "OUT"
        ? "아웃"
        : sample.status === "SCORE"
          ? "득점"
          : sample.status === "SAFE"
            ? destination
            : `${sample.fromBase === 0 ? "타석" : `${sample.fromBase}루`} → ${destination}`;
      return {
        playerId: sample.runnerId,
        name: advance.runnerName,
        point: {
          x: sample.position.xPercent,
          y: sample.position.yPercent,
          scale: 0.9,
          opacity: sample.status === "OUT" ? 0.5 : 1,
        },
        baseLabel: label,
      };
    });
}

function overlayForEvent(
  event: VisualEvent,
  official: OfficialPlayResult | null,
  game: BaseballGameState,
  onSkip: () => void,
) {
  if (
    event.kind === "CONTACT"
    || event.kind === "BALL_FLIGHT"
    || event.kind === "RUNNER_ADVANCE"
  ) return null;
  const copy = eventCopy(event, official, game);
  const homeRun = official ? HOME_RUN_CODES.has(official.code) : false;
  return (
    <BaseballEventOverlayV2
      resultCode={event.kind === "PLAY_RESULT" ? official?.code : undefined}
      kicker={event.kind.replaceAll("_", " ")}
      title={copy.title}
      detail={copy.detail}
      tone={copy.tone}
      imageSrc={
        homeRun && event.kind === "PLAY_RESULT"
          ? baseballArenaSwingFacing
          : event.kind === "FIELD_RESULT"
            ? baseballFielderActionsRed
            : undefined
      }
      imageAlt={
        homeRun && event.kind === "PLAY_RESULT"
          ? "홈런 스윙 장면"
          : event.kind === "FIELD_RESULT"
            ? "내야 수비 동작"
            : undefined
      }
      primaryLabel={event.skippable ? "장면 건너뛰기" : undefined}
      primaryEnabled={event.skippable}
      onPrimaryAction={event.skippable ? onSkip : undefined}
    />
  );
}

function isFieldCamera(camera: BaseballCameraMode) {
  return !["BATTER", "PITCHER", "CONTACT", "DUGOUT", "REPLAY"].includes(camera);
}

function cameraBackground(
  camera: BaseballCameraMode,
  perspective: "BATTING" | "PITCHING" | "FIELD",
) {
  if (camera === "HOME_RUN") return baseballCameraHomeRun;
  if ([
    "INFIELD",
    "LEFT_FIELD",
    "CENTER_FIELD",
    "RIGHT_FIELD",
    "BASE_RUNNING",
    "RUN_SCORED",
  ].includes(camera)) {
    return baseballCameraInfield;
  }
  if (perspective === "BATTING") return baseballBattingField;
  if (perspective === "PITCHING") return baseballCameraPitcherEmpty;
  return baseballCameraInfield;
}

export function BaseballSoloGameV2({
  onExit,
  playerName = "1P",
  seed,
  className,
}: BaseballSoloGameV2Props) {
  const controller = useBaseballSoloController({
    visitorName: "CPU",
    homeName: playerName,
    seed,
  });
  const stageShellRef = useRef<HTMLDivElement>(null);
  const celebratedHomeRunsRef = useRef(new Set<string>());
  const [pitchProjection, setPitchProjection] = useState<PitchStageProjection>({
    ...DEFAULT_PITCH_STAGE_PROJECTION,
  });

  const {
    game,
    displayGame,
    presentation,
    aim,
    setAim,
    selectedPitchType,
    setSelectedPitchType,
    swingType,
    setSwingType,
    currentVisualEvent,
    currentVisualEventKey,
    currentVisualEventProgress,
    pitchProgress,
    pitchPulseProgress,
    pitchTimingQuality,
    officialResult,
    primaryAction,
    startNewGame,
    skip,
    advance,
  } = controller;

  const userBatting = game.battingTeam === USER_TEAM_INDEX;
  const userPitching = !userBatting;
  const lastPlayEntry = game.playByPlay[game.playByPlay.length - 1];
  const eventWasUserBatting = lastPlayEntry?.battingTeam === USER_TEAM_INDEX;
  const cameraMode: BaseballCameraMode = currentVisualEvent?.camera
    ?? (userBatting ? "BATTER" : "PITCHER");
  const perspective = currentVisualEvent
    ? isFieldCamera(cameraMode)
      ? "FIELD"
      : eventWasUserBatting
        ? "BATTING"
        : "PITCHING"
    : userBatting
      ? "BATTING"
      : "PITCHING";
  const backgroundSrc = cameraBackground(cameraMode, perspective);
  const showStrikeZone = presentation === "READY_FOR_PITCH"
    || presentation === "PITCH_WINDUP"
    || presentation === "PITCH_FLIGHT";

  useLayoutEffect(() => {
    if (!showStrikeZone) return;
    const shell = stageShellRef.current;
    if (!shell) return;
    const measure = () => {
      const stage = shell.querySelector<HTMLElement>(".bbv2-stage");
      const zone = shell.querySelector<HTMLElement>(".bbv2-strike-zone");
      if (!stage || !zone) return;
      const next = derivePitchStageProjection(
        stage.getBoundingClientRect(),
        zone.getBoundingClientRect(),
      );
      if (!next) return;
      setPitchProjection((previous) => (
        Math.abs(previous.leftPercent - next.leftPercent) < 0.01
        && Math.abs(previous.topPercent - next.topPercent) < 0.01
        && Math.abs(previous.widthPercent - next.widthPercent) < 0.01
        && Math.abs(previous.heightPercent - next.heightPercent) < 0.01
          ? previous
          : next
      ));
    };

    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    const stage = shell.querySelector<HTMLElement>(".bbv2-stage");
    const zone = shell.querySelector<HTMLElement>(".bbv2-strike-zone");
    if (stage) observer?.observe(stage);
    if (zone) observer?.observe(zone);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [perspective, showStrikeZone]);

  const canAim = presentation === "READY_FOR_PITCH"
    || (userBatting && (presentation === "PITCH_WINDUP" || presentation === "PITCH_FLIGHT"));
  const shortcutCanRun = presentation === "INTRO"
    || presentation === "BETWEEN_PLAYS"
    || presentation === "HALF_INNING"
    || (presentation === "READY_FOR_PITCH" && userPitching)
    || (presentation === "PITCH_FLIGHT" && userBatting)
    || (presentation === "EVENT_PLAYBACK" && currentVisualEvent?.skippable === true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat
        || event.isComposing
        || event.altKey
        || event.ctrlKey
        || event.metaKey
        || event.shiftKey
        || isInteractiveTarget(event.target)
      ) {
        return;
      }

      if (event.code === "Space" || event.key === " ") {
        if (!shortcutCanRun) return;
        event.preventDefault();
        primaryAction();
        return;
      }
      if (!canAim || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        return;
      }
      event.preventDefault();
      setAim((current) => ({
        x: clamp(
          current.x + (event.key === "ArrowLeft" ? -AIM_KEY_STEP : event.key === "ArrowRight" ? AIM_KEY_STEP : 0),
          0.03,
          0.97,
        ),
        y: clamp(
          current.y + (event.key === "ArrowUp" ? -AIM_KEY_STEP : event.key === "ArrowDown" ? AIM_KEY_STEP : 0),
          0.03,
          0.97,
        ),
      }));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canAim, primaryAction, setAim, shortcutCanRun]);

  useEffect(() => {
    if (
      !currentVisualEventKey
      || currentVisualEvent?.kind !== "RUN_SCORE"
      || !officialResult
      || !HOME_RUN_CODES.has(officialResult.code)
      || celebratedHomeRunsRef.current.has(officialResult.playId)
    ) {
      return;
    }
    celebratedHomeRunsRef.current.add(officialResult.playId);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    void confetti({
      particleCount: reducedMotion ? 36 : 150,
      spread: reducedMotion ? 46 : 96,
      origin: { y: 0.62 },
      colors: ["#1259aa", "#ffffff", "#ef4444", "#fde047"],
      disableForReducedMotion: true,
    });
  }, [currentVisualEvent, currentVisualEventKey, officialResult]);

  const activePitch = game.activePlay?.pitch;
  const pitchBall = useMemo(() => (
    presentation === "PITCH_FLIGHT" && activePitch
      ? createPitchPresentation(
          activePitch.trajectory,
          pitchProgress,
          pitchProjection,
          userPitching,
        )
      : null
  ), [activePitch, pitchProgress, pitchProjection, presentation, userPitching]);

  const battedBall = useMemo(() => {
    const ball = game.activePlay?.battedBall;
    return currentVisualEvent?.kind === "BALL_FLIGHT" && ball
      ? createBattedPresentation(ball, currentVisualEventProgress, cameraMode)
      : null;
  }, [cameraMode, currentVisualEvent, currentVisualEventProgress, game.activePlay?.battedBall]);

  const runners = useMemo(
    () => runnerPresentations(game, displayGame, currentVisualEvent, currentVisualEventProgress),
    [currentVisualEvent, currentVisualEventProgress, displayGame, game],
  );

  const strikeZoneTarget = presentation === "READY_FOR_PITCH"
    || (userBatting && (presentation === "PITCH_WINDUP" || presentation === "PITCH_FLIGHT"))
    || (userPitching && presentation === "PITCH_WINDUP")
      ? aim
      : null;
  const batterIsSwinging = presentation === "EVENT_PLAYBACK"
    && currentVisualEvent?.sequence === 0
    && officialResult !== null
    && officialResult.code !== "BALL"
    && officialResult.code !== "CALLED_STRIKE"
    && officialResult.code !== "WALK";
  const pitcherIsThrowing = presentation === "PITCH_WINDUP";
  const activePlayKey = game.activePlay?.playId ?? currentVisualEventKey ?? "idle";

  const availablePitches = useMemo(
    () => getCurrentPitcher(game).pitching?.pitches.map((pitch) => pitch.type) ?? [],
    [game],
  );
  const batter = getCurrentBatter(displayGame);
  const pitcher = getCurrentPitcher(displayGame);

  let overlay: ReactNode = null;
  if (presentation === "INTRO") {
    overlay = (
      <BaseballIntroOverlayV2
        eyebrow="SOLO · HOME 1P"
        title="PLAY BALL!"
        description="1회초, 홈팀 1P가 먼저 수비합니다. 조준한 뒤 Space로 투구하세요."
        batter={batter}
        pitcher={pitcher}
        backgroundSrc={baseballArenaFacing}
        onContinue={advance}
      />
    );
  } else if (presentation === "EVENT_PLAYBACK" && currentVisualEvent) {
    overlay = overlayForEvent(currentVisualEvent, officialResult, displayGame, skip);
  } else if (presentation === "HALF_INNING") {
    overlay = (
      <BaseballHalfInningOverlayV2
        inning={displayGame.inning}
        half={displayGame.half}
        battingTeamName={displayGame.teams[displayGame.battingTeam].name}
        scoreLabel={scoreLabel(displayGame)}
        backgroundSrc={backgroundSrc}
        onContinue={advance}
      />
    );
  } else if (presentation === "FINAL") {
    overlay = (
      <BaseballFinalOverlayV2
        game={displayGame}
        backgroundSrc={baseballArenaSwingFacing}
        onRematch={startNewGame}
        onExit={onExit}
      />
    );
  }

  const mode: BaseballControlModeV2 = ["INTRO", "EVENT_PLAYBACK", "BETWEEN_PLAYS", "HALF_INNING", "FINAL"]
    .includes(presentation)
    ? "BETWEEN"
    : userBatting
      ? "BATTING"
      : "PITCHING";
  const eventCanSkip = presentation === "EVENT_PLAYBACK" && Boolean(currentVisualEvent?.skippable);
  const phase: BaseballControlPhaseV2 = eventCanSkip
    ? "BETWEEN_PLAYS"
    : presentation === "PITCH_WINDUP" && userBatting
      ? "AIMING"
      : controlPhase(presentation);
  const primaryActionEnabled = presentation === "INTRO"
    || presentation === "BETWEEN_PLAYS"
    || presentation === "HALF_INNING"
    || (presentation === "READY_FOR_PITCH" && userPitching)
    || (presentation === "PITCH_FLIGHT" && userBatting)
    || eventCanSkip;
  const primaryLabel = presentation === "READY_FOR_PITCH"
    ? userPitching ? "투구" : "CPU 투구 준비 중"
    : presentation === "PITCH_FLIGHT"
      ? userBatting ? "스윙!" : "CPU 타격 중"
      : presentation === "BETWEEN_PLAYS"
        ? "다음 투구 / 다음 타석"
        : presentation === "HALF_INNING"
          ? "공수교대"
          : presentation === "EVENT_PLAYBACK"
            ? eventCanSkip ? "장면 건너뛰기" : "판정 재생 중"
            : presentation === "FINAL"
              ? "경기 종료"
              : "경기 시작";
  const instruction = presentation === "READY_FOR_PITCH" && userPitching
    ? `조준 · 타이밍 ${pitchTimingQuality} · Space로 투구`
    : presentation === "PITCH_FLIGHT" && userBatting
      ? "방향키/포인터로 조준하고 Space로 스윙"
      : presentation === "BETWEEN_PLAYS"
        ? "Space를 눌러 다음 플레이로 이동"
        : currentVisualEvent
          ? `${currentVisualEvent.kind.replaceAll("_", " ")} · 카메라 ${cameraMode}`
          : "Space 또는 화면 버튼으로 진행";

  const pitchMeter = presentation === "READY_FOR_PITCH" && userPitching ? (
    <div
      style={{
        position: "absolute",
        right: "16px",
        bottom: "16px",
        width: "min(300px, 42%)",
        padding: "9px 11px",
        border: "1px solid rgba(255,255,255,.3)",
        borderRadius: "10px",
        color: "white",
        background: "rgba(3,20,38,.84)",
        boxShadow: "0 8px 24px rgba(0,0,0,.28)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 900 }}>
        <span>PITCH TIMING</span><strong>{pitchTimingQuality}</strong>
      </div>
      <div style={{ position: "relative", height: "8px", marginTop: "7px", borderRadius: "99px", background: "linear-gradient(90deg,#ef4444,#facc15,#22c55e,#facc15,#ef4444)" }}>
        <i
          style={{
            position: "absolute",
            top: "-4px",
            left: `${pitchPulseProgress * 100}%`,
            width: "4px",
            height: "16px",
            borderRadius: "4px",
            background: "white",
            boxShadow: "0 0 8px white",
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </div>
  ) : null;
  const pitchReadout = activePitch && (
    presentation === "PITCH_WINDUP"
    || presentation === "PITCH_FLIGHT"
  ) ? (
    <div
      className={`bbv2-pitch-readout bbv2-pitch-readout--${activePitch.pitchType}`}
      aria-live="polite"
    >
      <small>NOW PITCHING</small>
      <strong>{PITCH_NAMES[activePitch.pitchType]}</strong>
      <em>{activePitch.velocityKmh.toFixed(1)} km/h</em>
    </div>
  ) : null;
  const stageEffects = pitchMeter || pitchReadout ? (
    <>
      {pitchMeter}
      {pitchReadout}
    </>
  ) : null;

  return (
    <main className={className} style={shellStyle} aria-label="야구 솔로 경기">
      <header style={topBarStyle}>
        <button type="button" style={exitButtonStyle} onClick={onExit}>← 게임 나가기</button>
        <div style={{ textAlign: "right" }}>
          <strong style={{ display: "block", color: "#0f2742", fontSize: "15px" }}>광주 2반 BASEBALL · SOLO</strong>
          <small style={{ color: "#41617f", fontWeight: 750 }}>홈 1P · 3이닝 · 동점 시 연장</small>
        </div>
      </header>

      <div ref={stageShellRef}>
        <BaseballStageV2
          assets={{
            backgroundSrc,
            backgroundAlt: perspective === "BATTING" ? "타자 시점 야구장" : perspective === "PITCHING" ? "투수 시점 야구장" : "수비 시점 야구장",
            ballSrc: baseballBallBody,
            batterSprite: perspective === "FIELD" ? undefined : {
              src: baseballBatterActionsBlue,
              frameCount: 4,
              frameIndex: 0,
              motion: batterIsSwinging ? "SWING" : "IDLE",
              animationKey: activePlayKey,
            },
            pitcherSprite: perspective === "PITCHING" ? {
              src: baseballPitcherActionsRed,
              frameCount: 5,
              frameIndex: presentation === "PITCH_FLIGHT" ? 4 : 0,
              motion: pitcherIsThrowing ? "PITCH" : "IDLE",
              animationKey: activePlayKey,
            } : undefined,
            pitchTrailAtlases: {
              fourSeam: baseballPitchFastball10,
              twoSeam: baseballPitchFastball10,
              slider: baseballPitchSlider10,
              curve: baseballPitchCurve10,
              changeup: baseballPitchChangeup10,
              fork: baseballPitchCurve10,
              cutter: baseballPitchSlider10,
            },
          }}
          cameraMode={cameraMode}
          perspective={perspective}
          pitchBall={battedBall ? null : pitchBall}
          battedBall={pitchBall ? null : battedBall}
          runners={runners}
          showStrikeZone={showStrikeZone}
          strikeZoneTarget={strikeZoneTarget}
          aimEnabled={canAim && showStrikeZone}
          onAimChange={(point) => setAim({
            x: clamp(point.x, 0.03, 0.97),
            y: clamp(point.y, 0.03, 0.97),
          })}
          hud={<BaseballHudV2 game={displayGame} />}
          overlay={overlay}
          effects={stageEffects}
          ariaLabel={`${displayGame.inning}회${displayGame.half === "top" ? "초" : "말"} 야구 경기장`}
        />
      </div>

      <BaseballControlsV2
        mode={mode}
        phase={phase}
        selectedPitch={selectedPitchType}
        selectedSwing={swingType}
        availablePitches={availablePitches}
        primaryActionLabel={primaryLabel}
        instruction={instruction}
        disabled={presentation === "INTRO" || presentation === "FINAL"}
        primaryActionEnabled={primaryActionEnabled}
        primaryActionBusy={presentation === "PITCH_WINDUP"}
        onSelectPitch={setSelectedPitchType}
        onSelectSwing={setSwingType}
        onPrimaryAction={primaryAction}
      />

      <p style={{ margin: "9px 4px 0", color: "#4b647b", fontSize: "12px", fontWeight: 700 }}>
        포인터 또는 방향키로 존을 조준합니다. Space는 투구·스윙·다음 플레이에 사용되며, 입력창과 버튼에 초점이 있으면 단축키가 작동하지 않습니다.
      </p>
    </main>
  );
}

export default BaseballSoloGameV2;
