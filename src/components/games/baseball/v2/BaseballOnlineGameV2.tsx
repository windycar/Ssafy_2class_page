import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import baseballArenaFacing from "../../../../assets/games/baseball-arena-facing.png";
import baseballArenaSwingFacing from "../../../../assets/games/baseball-arena-swing-facing.png";
import baseballPitcherActionsRed from "../../../../assets/games/baseball-pitcher-actions-red.png";
import {
  BASEBALL_V2_BALL_SOURCE,
  BASEBALL_V2_BATTER_ACTION_SOURCES,
  BASEBALL_V2_CAMERA_BACKGROUND_SOURCES,
  BASEBALL_V2_FIELDER_SOURCES,
  BASEBALL_V2_RUNNER_SOURCES,
  BASEBALL_V2_SCOREBOARD_BACKGROUND_SOURCE,
} from "../../../../config/baseballV2Assets.ts";
import { useBaseballOnlineController } from "../../../../hooks/useBaseballOnlineController.ts";
import { useBaseballVisualPlayback } from "../../../../hooks/useBaseballVisualPlayback.ts";
import type { BaseballRoom } from "../../../../types/baseballRoom.ts";
import { resolveBaseballCameraBackground } from "../../../../utils/games/baseball/cameraBackground.ts";
import { cloneGameState } from "../../../../utils/games/baseball/gameState.ts";
import {
  createPitchVisualFrame,
  DEFAULT_PITCH_STAGE_PROJECTION,
  derivePitchStageProjection,
  projectBattedBallToCamera,
  type PitchSpriteSample,
  type PitchStageProjection,
} from "../../../../utils/games/baseball/presentation.ts";
import {
  createSoloVisualPlaybackPlan,
  resolveBaseballVisualPlaybackDisplayGame,
  type SoloVisualPlaybackPlan,
} from "../../../../utils/games/baseball/soloPresentation.ts";
import type {
  BaseballCameraMode,
  BaseballGameState,
  PitchQuality,
  PitchFlightState,
} from "../../../../utils/games/baseball/types.ts";
import {
  BaseballControlsV2,
  type BaseballControlModeV2,
  type BaseballControlPhaseV2,
} from "./BaseballControlsV2.tsx";
import { BaseballHudV2 } from "./BaseballHudV2.tsx";
import {
  BaseballFinalOverlayV2,
  BaseballOnlineWaitingOverlayV2,
} from "./BaseballOverlaysV2.tsx";
import {
  BASEBALL_RESULT_LABELS_V2,
  createBaseballDefenseThrowPresentationV2,
  createBaseballFielderPresentationsV2,
  createBaseballRunnerPresentationsV2,
} from "./BaseballPlayPresentationV2.ts";
import {
  BaseballStageV2,
  type BaseballBallPresentationV2,
  type BaseballPresentationPointV2,
  type BaseballTrailPointsV2,
} from "./BaseballStageV2.tsx";
import { BaseballVisualEventOverlayV2 } from "./BaseballVisualEventPresentationV2.tsx";
import "../../../../styles/baseball-v2.css";

const AIM_KEY_STEP = 0.035;
const BATTED_TRAIL_PROGRESS_GAP = 0.042;
const PITCH_PULSE_PERIOD_MS = 1_150;

const PITCH_NAMES = {
  fourSeam: "포심 직구",
  twoSeam: "투심",
  slider: "슬라이더",
  curve: "커브",
  changeup: "체인지업",
  fork: "포크",
  cutter: "커터",
} as const;

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

const syncBannerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  margin: "8px 2px",
  padding: "8px 12px",
  border: "1px solid rgba(29, 78, 216, 0.2)",
  borderRadius: "10px",
  color: "#173756",
  background: "rgba(239, 246, 255, 0.92)",
  fontSize: "12px",
  fontWeight: 750,
};

export interface BaseballOnlineGameV2Props {
  room: BaseballRoom;
  currentAuthId: string;
  onExit: () => void;
  className?: string;
}

interface OnlineVisualPlaybackPlan {
  playId: string;
  displayBeforeResult: BaseballGameState;
  plan: SoloVisualPlaybackPlan;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function pitchQualityForPulse(progress: number): PitchQuality {
  const centerError = Math.abs(clamp(progress, 0, 1) - 0.5);
  if (centerError <= 0.045) return "PERFECT";
  if (centerError <= 0.14) return "GOOD";
  if (centerError <= 0.28) return "NORMAL";
  return "MISS";
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
  pitchingPerspective: boolean,
  projection: PitchStageProjection,
): BaseballBallPresentationV2 {
  const frame = createPitchVisualFrame(trajectory, progress, {
    projection,
  });
  const project = (sample: PitchSpriteSample) => (
    pitchingPerspective ? pitchingPoint(sample, trajectory, projection) : toPoint(sample)
  );
  return {
    body: project(frame.body),
    trail: trailTuple(frame.trails.map(project)),
    pitchType: trajectory.pitchType,
    visible: true,
  };
}

function createBattedPresentation(
  game: BaseballGameState,
  progress: number,
  camera: BaseballCameraMode,
): BaseballBallPresentationV2 | null {
  const ball = game.activePlay?.battedBall;
  if (!ball) return null;
  const normalized = clamp(progress, 0, 1);
  const samplePoint = (sampleProgress: number, opacityScale = 1) => {
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

function noticeLabel(status: ReturnType<typeof useBaseballOnlineController>["noticeStatus"]) {
  switch (status) {
    case "SUBSCRIBED": return "실시간 연결됨";
    case "CONNECTING": return "실시간 연결 중";
    case "CHANNEL_ERROR": return "연결 복구 중";
    case "TIMED_OUT": return "연결 시간 초과 · 복구 중";
    case "CLOSED": return "연결 종료 · 재조회 중";
    case "DISABLED": return "서버 상태 확인 중";
  }
}

function presenceLabel(status: ReturnType<typeof useBaseballOnlineController>["presenceStatus"]) {
  switch (status) {
    case "SUBSCRIBED": return "Presence 연결됨";
    case "CONNECTING": return "Presence 연결 중";
    case "AUTH_ERROR": return "Presence 인증 실패";
    case "CHANNEL_ERROR": return "Presence 복구 중";
    case "TIMED_OUT": return "Presence 시간 초과";
    case "CLOSED": return "Presence 연결 종료";
    case "DISABLED": return "Presence 대기";
  }
}

function roleLabel(role: ReturnType<typeof useBaseballOnlineController>["role"]) {
  switch (role) {
    case "PITCHING": return "내 수비 · 투구 차례";
    case "BATTING": return "내 공격 · 타격 차례";
    case "FINAL": return "경기 종료";
    case "SPECTATING": return "관전 모드";
    case "WAITING": return "상대 입력 대기";
  }
}

export function BaseballOnlineGameV2({
  room: initialRoom,
  currentAuthId,
  onExit,
  className,
}: BaseballOnlineGameV2Props) {
  const controller = useBaseballOnlineController({
    initialRoom,
    currentAuthId,
  });
  const [pitchProgress, setPitchProgress] = useState(0);
  const [pitchPulseProgress, setPitchPulseProgress] = useState(0);
  const [pitchProjection, setPitchProjection] = useState<PitchStageProjection>({
    ...DEFAULT_PITCH_STAGE_PROJECTION,
  });
  const stageShellRef = useRef<HTMLDivElement>(null);
  const pitchProgressRef = useRef(0);
  const pitchPulseProgressRef = useRef(0);
  const preResolutionGameByPlayIdRef = useRef(new Map<string, BaseballGameState>());
  const handledResolvedPlayIdsRef = useRef(new Set<string>());
  const onlineVisualPlaybackPlanRef = useRef<OnlineVisualPlaybackPlan | null>(null);

  const {
    room,
    game,
    actorSeat,
    role,
    canPitch,
    canBat,
    aim,
    setAim,
    selectedPitchType,
    setSelectedPitchType,
    swingType,
    setSwingType,
    availablePitches,
    busy,
    recovering,
    error,
    noticeStatus,
    presenceStatus,
    connectedAuthIds,
    opponentConnected,
    allPlayersConnected,
    presenceRecoveryPending,
    refresh,
    submitPitch,
    submitSwing,
    submitTake,
  } = controller;

  const activePlay = game?.activePlay ?? null;
  const playback = useBaseballVisualPlayback();
  const resolvedPlay = activePlay?.phase === "RESOLVED" ? activePlay : null;

  useEffect(() => {
    if (!game || !activePlay || activePlay.phase === "RESOLVED") return;
    const snapshots = preResolutionGameByPlayIdRef.current;
    snapshots.set(activePlay.playId, cloneGameState(game));
    while (snapshots.size > 4) {
      const oldestPlayId = snapshots.keys().next().value;
      if (typeof oldestPlayId !== "string") break;
      snapshots.delete(oldestPlayId);
    }
  }, [activePlay, game]);

  const resolvedPlaybackPlan = useMemo<OnlineVisualPlaybackPlan | null>(() => {
    if (!game || !resolvedPlay) return null;
    const displayBeforeResult = preResolutionGameByPlayIdRef.current.get(resolvedPlay.playId)
      ?? cloneGameState(game);
    const official = game.lastPlay;
    const showThirdOutSnapshot = official !== null
      && official.outsRecorded > 0
      && displayBeforeResult.count.outs + official.outsRecorded >= 3;
    return {
      playId: resolvedPlay.playId,
      displayBeforeResult,
      plan: createSoloVisualPlaybackPlan({
        events: resolvedPlay.visualEvents,
        displayBeforeResult,
        authoritativeAfterResult: game,
        showThirdOutSnapshot,
      }),
    };
  }, [game, resolvedPlay]);
  const onlinePlaybackReady = !recovering
    && allPlayersConnected
    && !presenceRecoveryPending;
  const resolvedPlaybackPending = Boolean(
    onlinePlaybackReady
    && resolvedPlay
    && !handledResolvedPlayIdsRef.current.has(resolvedPlay.playId),
  );
  const playbackBlocking = playback.active || resolvedPlaybackPending;
  const activeOnlinePlaybackPlan = playback.active
    && onlineVisualPlaybackPlanRef.current?.playId === playback.playId
    ? onlineVisualPlaybackPlanRef.current
    : resolvedPlaybackPlan;
  const presentedVisualEvent = playback.currentEvent
    ?? (resolvedPlaybackPending ? resolvedPlaybackPlan?.plan.events[0] ?? null : null);
  const presentedVisualEventProgress = playback.currentEvent
    ? playback.currentEventProgress
    : 0;
  const authoritativePresentationGame = playback.active && playback.sourceGame
    ? playback.sourceGame
    : game;
  const presentationGame = playbackBlocking && presentedVisualEvent && activeOnlinePlaybackPlan
    ? resolveBaseballVisualPlaybackDisplayGame(
        activeOnlinePlaybackPlan.plan,
        activeOnlinePlaybackPlan.displayBeforeResult,
        presentedVisualEvent.id,
      )
    : game;
  const presentationPlay = authoritativePresentationGame?.activePlay ?? null;
  const activePitch = presentationPlay?.pitch ?? null;
  const canPitchNow = canPitch && !playbackBlocking;
  const canBatNow = canBat && !playbackBlocking;

  useEffect(() => {
    if (room?.status === "cancelled") {
      onlineVisualPlaybackPlanRef.current = null;
      playback.cancel();
      return;
    }
    if (
      playback.active
      && (!resolvedPlay || playback.playId !== resolvedPlay.playId)
    ) {
      onlineVisualPlaybackPlanRef.current = null;
      playback.cancel();
      return;
    }
    if (!onlinePlaybackReady || !game || !resolvedPlay || !resolvedPlaybackPlan) return;
    if (handledResolvedPlayIdsRef.current.has(resolvedPlay.playId)) return;
    onlineVisualPlaybackPlanRef.current = resolvedPlaybackPlan;
    playback.start({
      playId: resolvedPlay.playId,
      events: resolvedPlaybackPlan.plan.events,
      sourceGame: game,
    });
    handledResolvedPlayIdsRef.current.add(resolvedPlay.playId);
  }, [
    game,
    onlinePlaybackReady,
    playback.active,
    playback.cancel,
    playback.playId,
    playback.start,
    resolvedPlay,
    resolvedPlaybackPlan,
    room?.status,
  ]);

  useEffect(() => {
    pitchProgressRef.current = pitchProgress;
  }, [pitchProgress]);

  useEffect(() => {
    if (!activePitch || presentationPlay?.phase !== "AWAITING_BATTER") {
      setPitchProgress(activePitch ? 1 : 0);
      pitchProgressRef.current = activePitch ? 1 : 0;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPitchProgress(1);
      pitchProgressRef.current = 1;
      return;
    }

    let animationFrame = 0;
    let startedAt: number | null = null;
    const duration = clamp(activePitch.flightDurationMs, 320, 1_200);
    const animate = (timestamp: number) => {
      startedAt ??= timestamp;
      const next = clamp((timestamp - startedAt) / duration, 0, 1);
      pitchProgressRef.current = next;
      setPitchProgress(next);
      if (next < 1) animationFrame = window.requestAnimationFrame(animate);
    };
    setPitchProgress(0);
    pitchProgressRef.current = 0;
    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [activePitch, presentationPlay?.phase, presentationPlay?.playId]);

  useEffect(() => {
    if (!canPitchNow) {
      pitchPulseProgressRef.current = 0;
      setPitchPulseProgress(0);
      return;
    }
    let animationFrame = 0;
    let startedAt: number | null = null;
    const animate = (timestamp: number) => {
      startedAt ??= timestamp;
      const next = ((timestamp - startedAt) % PITCH_PULSE_PERIOD_MS) / PITCH_PULSE_PERIOD_MS;
      pitchPulseProgressRef.current = next;
      setPitchPulseProgress(next);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [canPitchNow]);

  const handlePrimaryAction = useCallback(() => {
    if (playbackBlocking) {
      if (playback.active && playback.currentEvent?.skippable) playback.skip();
      return;
    }
    if (canPitchNow) {
      void submitPitch(pitchQualityForPulse(pitchPulseProgressRef.current));
      return;
    }
    if (canBatNow) void submitSwing(pitchProgressRef.current);
  }, [
    canBatNow,
    canPitchNow,
    playback.active,
    playback.currentEvent,
    playback.skip,
    playbackBlocking,
    submitPitch,
    submitSwing,
  ]);

  const canAim = canPitchNow || canBatNow;
  const handleAimChange = useCallback((point: Parameters<typeof setAim>[0]) => {
    if (canAim) setAim(point);
  }, [canAim, setAim]);
  const handleSelectPitch = useCallback((pitch: typeof selectedPitchType) => {
    if (canPitchNow) setSelectedPitchType(pitch);
  }, [canPitchNow, setSelectedPitchType]);
  const handleSelectSwing = useCallback((swing: typeof swingType) => {
    if (canBatNow) setSwingType(swing);
  }, [canBatNow, setSwingType]);
  const handleTake = useCallback(() => {
    if (canBatNow) void submitTake();
  }, [canBatNow, submitTake]);

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
      ) return;

      if (event.code === "Space" || event.key === " ") {
        if (playbackBlocking) {
          event.preventDefault();
          handlePrimaryAction();
          return;
        }
        if (!canPitchNow && !canBatNow) return;
        event.preventDefault();
        handlePrimaryAction();
        return;
      }
      if (!canAim || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        return;
      }
      event.preventDefault();
      setAim((current) => ({
        x: current.x + (event.key === "ArrowLeft" ? -AIM_KEY_STEP : event.key === "ArrowRight" ? AIM_KEY_STEP : 0),
        y: current.y + (event.key === "ArrowUp" ? -AIM_KEY_STEP : event.key === "ArrowDown" ? AIM_KEY_STEP : 0),
      }));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canAim, canBatNow, canPitchNow, handlePrimaryAction, playbackBlocking, setAim]);

  const localIsBatting = presentationGame !== null && actorSeat === presentationGame.battingTeam;
  const localIsPitching = presentationGame !== null
    && actorSeat !== null
    && actorSeat !== presentationGame.battingTeam;
  const cameraMode: BaseballCameraMode = presentedVisualEvent?.camera
    ?? (presentationPlay?.battedBall && presentationPlay.phase === "RESOLVED"
      ? presentationPlay.visualEvents.find((event) => event.kind === "BALL_FLIGHT")?.camera ?? "INFIELD"
      : localIsBatting
        ? "BATTER"
        : "PITCHER");
  const perspective: "BATTING" | "PITCHING" | "FIELD" = presentedVisualEvent
    ? presentedVisualEvent.camera === "BATTER" || presentedVisualEvent.camera === "CONTACT"
      ? "BATTING"
      : presentedVisualEvent.camera === "PITCHER"
        ? "PITCHING"
        : "FIELD"
    : localIsBatting
      ? "BATTING"
      : "PITCHING";
  const backgroundSrc = resolveBaseballCameraBackground(
    cameraMode,
    perspective,
    BASEBALL_V2_CAMERA_BACKGROUND_SOURCES,
  );
  const showStrikeZone = Boolean(presentationGame)
    && !playbackBlocking
    && perspective !== "FIELD";

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

  const pitchBall = useMemo(() => (
    activePitch && presentationPlay?.phase === "AWAITING_BATTER"
      ? createPitchPresentation(
          activePitch.trajectory,
          pitchProgress,
          localIsPitching,
          pitchProjection,
        )
      : null
  ), [activePitch, localIsPitching, pitchProgress, pitchProjection, presentationPlay?.phase]);
  const battedBall = useMemo(() => (
    authoritativePresentationGame
    && presentationPlay?.battedBall
    && presentedVisualEvent?.kind === "BALL_FLIGHT"
      ? createBattedPresentation(
          authoritativePresentationGame,
          presentedVisualEventProgress,
          cameraMode,
        )
      : null
  ), [
    cameraMode,
    authoritativePresentationGame,
    presentationPlay?.battedBall,
    presentedVisualEvent?.kind,
    presentedVisualEventProgress,
  ]);
  const lastPlayEntry = authoritativePresentationGame?.playByPlay[
    authoritativePresentationGame.playByPlay.length - 1
  ];
  const visualBattingTeam = presentedVisualEvent
    ? lastPlayEntry?.battingTeam ?? authoritativePresentationGame?.battingTeam ?? 0
    : presentationGame?.battingTeam ?? 0;
  const visualFieldingTeam = visualBattingTeam === 0 ? 1 : 0;
  const runners = useMemo(
    () => authoritativePresentationGame && presentationGame ? createBaseballRunnerPresentationsV2({
      authoritativeGame: authoritativePresentationGame,
      presentationGame,
      event: presentedVisualEvent,
      eventProgress: presentedVisualEventProgress,
      cameraMode,
      runnerAssetSrc: BASEBALL_V2_RUNNER_SOURCES[visualBattingTeam],
    }) : [],
    [
      cameraMode,
      authoritativePresentationGame,
      presentationGame,
      presentedVisualEvent,
      presentedVisualEventProgress,
      visualBattingTeam,
    ],
  );
  const fielders = useMemo(
    () => authoritativePresentationGame ? createBaseballFielderPresentationsV2({
      game: authoritativePresentationGame,
      event: presentedVisualEvent,
      eventProgress: presentedVisualEventProgress,
      fielderAssetSrc: BASEBALL_V2_FIELDER_SOURCES[visualFieldingTeam],
    }) : [],
    [
      authoritativePresentationGame,
      presentedVisualEvent,
      presentedVisualEventProgress,
      visualFieldingTeam,
    ],
  );
  const defenseThrow = useMemo(
    () => authoritativePresentationGame ? createBaseballDefenseThrowPresentationV2({
      game: authoritativePresentationGame,
      event: presentedVisualEvent,
      eventProgress: presentedVisualEventProgress,
    }) : null,
    [
      authoritativePresentationGame,
      presentedVisualEvent,
      presentedVisualEventProgress,
    ],
  );

  let overlay: ReactNode = null;
  if (room && game && room.status === "cancelled") {
    overlay = (
      <BaseballFinalOverlayV2
        game={game}
        title="경기 취소"
        summary="참가자가 방을 나가 온라인 경기가 종료되었습니다."
        backgroundSrc={baseballArenaSwingFacing}
        cancelled
        onExit={onExit}
      />
    );
  } else if (!room || !game) {
    overlay = (
      <BaseballOnlineWaitingOverlayV2
        title="경기 상태를 복구하는 중"
        message="서버의 최신 이닝·카운트·주자 상태를 불러오고 있습니다."
        participants={initialRoom.players.map((player) => ({
          id: player.authId,
          name: player.name,
          seatLabel: player.seat === 0 ? "원정 · 1P" : "홈 · 2P",
          connected: false,
        }))}
        backgroundSrc={baseballArenaFacing}
        canCancel
        onCancel={onExit}
      />
    );
  } else if (role === "SPECTATING") {
    overlay = (
      <BaseballOnlineWaitingOverlayV2
        title="경기 참가자 확인 필요"
        message="현재 로그인 계정이 이 방의 1P 또는 2P와 일치하지 않습니다."
        participants={room.players.map((player) => ({
          id: player.authId,
          name: player.name,
          seatLabel: player.seat === 0 ? "원정 · 1P" : "홈 · 2P",
          connected: false,
        }))}
        backgroundSrc={baseballArenaFacing}
        canCancel
        onCancel={onExit}
      />
    );
  } else if (playbackBlocking) {
    overlay = playback.active
      && presentedVisualEvent
      && presentationGame
      && authoritativePresentationGame ? (
      <BaseballVisualEventOverlayV2
        event={presentedVisualEvent}
        official={authoritativePresentationGame.lastPlay}
        game={presentationGame}
        onSkip={playback.skip}
        homeRunImageSrc={baseballArenaSwingFacing}
      />
    ) : null;
  } else if (role === "FINAL") {
    overlay = (
      <BaseballFinalOverlayV2
        game={game}
        backgroundSrc={BASEBALL_V2_SCOREBOARD_BACKGROUND_SOURCE}
        onExit={onExit}
      />
    );
  } else if (!playbackBlocking && (!allPlayersConnected || presenceRecoveryPending)) {
    overlay = (
      <BaseballOnlineWaitingOverlayV2
        title={opponentConnected ? "경기 상태 동기화 중" : "상대 재접속 대기 중"}
        message={opponentConnected
          ? "두 참가자의 접속을 확인했습니다. 서버의 최신 경기 상태를 다시 받은 뒤 입력을 엽니다."
          : "상대가 실제로 Presence 채널에 접속할 때까지 투구와 타격 입력을 차단합니다."}
        participants={room.players.map((player) => ({
          id: player.authId,
          name: player.name,
          seatLabel: player.seat === 0 ? "원정 · 1P" : "홈 · 2P",
          connected: connectedAuthIds.has(player.authId),
        }))}
        backgroundSrc={baseballArenaFacing}
        canCancel
        onCancel={onExit}
      />
    );
  }

  const eventCanSkip = playback.active && Boolean(playback.currentEvent?.skippable);
  const mode: BaseballControlModeV2 = playbackBlocking
    ? "BETWEEN"
    : role === "PITCHING"
      ? "PITCHING"
      : role === "BATTING"
        ? "BATTING"
        : role === "FINAL"
          ? "BETWEEN"
          : "SPECTATING";
  const phase: BaseballControlPhaseV2 = playbackBlocking
    ? eventCanSkip
      ? "BETWEEN_PLAYS"
      : "EVENT_PLAYBACK"
    : role === "FINAL"
      ? "FINAL"
      : busy
        ? role === "PITCHING" ? "PITCH_WINDUP" : "EVENT_PLAYBACK"
        : role === "PITCHING"
          ? "READY"
          : role === "BATTING"
            ? "AIMING"
            : "ONLINE_WAITING";
  const primaryLabel = playbackBlocking
    ? eventCanSkip
      ? "장면 건너뛰기"
      : "판정 재생 중"
    : role === "PITCHING"
      ? "투구"
      : role === "BATTING"
        ? "스윙!"
        : role === "FINAL"
          ? "경기 종료"
          : "상대 입력 대기";
  const pitchTimingQuality = pitchQualityForPulse(pitchPulseProgress);
  const instruction = playbackBlocking
    ? presentedVisualEvent
      ? `${presentedVisualEvent.kind.replaceAll("_", " ")} · 서버 판정 장면 재생 중`
      : "서버 판정 장면을 준비하고 있습니다."
    : role === "PITCHING"
      ? `구종과 코스를 정하고 타이밍 ${pitchTimingQuality}에 Space로 투구합니다.`
      : role === "BATTING"
        ? "공 궤적을 보고 조준한 뒤 Space로 스윙합니다."
        : "상대 플레이가 확정되면 서버 상태를 다시 불러옵니다.";
  const lastResult = presentationGame?.lastPlay
    ? BASEBALL_RESULT_LABELS_V2[presentationGame.lastPlay.code]
    : null;
  const activePlayKey = presentationPlay?.playId
    ?? `revision-${presentationGame?.revision ?? 0}`;
  const pitchMeter = canPitchNow ? (
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
  const pitchReadout = activePitch && presentationPlay?.phase === "AWAITING_BATTER" ? (
    <div
      className={`bbv2-pitch-readout bbv2-pitch-readout--${activePitch.pitchType}`}
      aria-live="polite"
    >
      <small>NOW PITCHING</small>
      <strong>{PITCH_NAMES[activePitch.pitchType]}</strong>
      <em>{activePitch.velocityKmh.toFixed(1)} km/h</em>
    </div>
  ) : lastResult ? (
    <div className="bbv2-pitch-readout" aria-live="polite">
      <small>LAST PLAY</small>
      <strong>{lastResult}</strong>
      <em>서버 판정 확정</em>
    </div>
  ) : null;
  const stageEffects = pitchMeter || pitchReadout ? (
    <>
      {pitchMeter}
      {pitchReadout}
    </>
  ) : null;

  return (
    <main className={className} style={shellStyle} aria-label="야구 온라인 경기">
      <header style={topBarStyle}>
        <button type="button" style={exitButtonStyle} onClick={onExit}>← 방으로 나가기</button>
        <div style={{ textAlign: "right" }}>
          <strong style={{ display: "block", color: "#0f2742", fontSize: "15px" }}>
            광주 2반 BASEBALL · ONLINE
          </strong>
          <small style={{ color: "#41617f", fontWeight: 750 }}>
            {actorSeat === null ? "관전" : `${actorSeat + 1}P`} · 3이닝 · 동점 시 연장
          </small>
        </div>
      </header>

      <div style={syncBannerStyle} role="status" aria-live="polite">
        <span>{roleLabel(role)}</span>
        <span>{recovering || presenceRecoveryPending
          ? "최신 상태 재조회 중…"
          : `${noticeLabel(noticeStatus)} · ${presenceLabel(presenceStatus)}`}</span>
      </div>

      <div ref={stageShellRef}>
      <BaseballStageV2
        assets={{
          backgroundSrc,
          backgroundAlt: perspective === "BATTING"
            ? "타자 시점 야구장"
            : perspective === "PITCHING"
              ? "투수 시점 야구장"
              : "타구 추적 야구장",
          ballSrc: BASEBALL_V2_BALL_SOURCE,
          batterSprite: perspective === "FIELD" ? undefined : {
            src: BASEBALL_V2_BATTER_ACTION_SOURCES[visualBattingTeam],
            frameCount: 4,
            frameIndex: 0,
            motion: localIsBatting && (busy || presentationPlay?.phase === "RESOLVED")
              ? "SWING"
              : "IDLE",
            animationKey: activePlayKey,
          },
          pitcherSprite: perspective === "PITCHING" ? {
            src: baseballPitcherActionsRed,
            frameCount: 5,
            frameIndex: activePitch && pitchProgress >= 0.7 ? 4 : 0,
            motion: localIsPitching && activePitch && pitchProgress < 0.7
              ? "PITCH"
              : "IDLE",
            animationKey: activePlayKey,
          } : undefined,
        }}
        cameraMode={cameraMode}
        perspective={perspective}
        pitchBall={battedBall ? null : pitchBall}
        battedBall={pitchBall ? null : battedBall}
        defenseThrow={defenseThrow}
        fielders={fielders}
        runners={runners}
        showStrikeZone={showStrikeZone}
        strikeZoneTarget={canAim ? aim : null}
        aimEnabled={canAim}
        onAimChange={canAim ? handleAimChange : undefined}
        hud={presentationGame ? <BaseballHudV2 game={presentationGame} /> : null}
        overlay={overlay}
        effects={stageEffects}
        ariaLabel={game
          ? `${game.inning}회${game.half === "top" ? "초" : "말"} 온라인 야구 경기장`
          : "온라인 야구 경기 상태 복구 중"}
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
        disabled={role === "SPECTATING"
          || (role === "FINAL" && !eventCanSkip)
          || (playbackBlocking && !eventCanSkip)}
        primaryActionEnabled={eventCanSkip || canPitchNow || canBatNow}
        primaryActionBusy={busy}
        onSelectPitch={handleSelectPitch}
        onSelectSwing={handleSelectSwing}
        onPrimaryAction={handlePrimaryAction}
      />

      {canBatNow ? (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <button
            type="button"
            style={exitButtonStyle}
            disabled={busy}
            onClick={handleTake}
          >
            지켜보기 · TAKE
          </button>
        </div>
      ) : null}

      {error ? (
        <div style={{ ...syncBannerStyle, borderColor: "rgba(220, 38, 38, .28)", background: "#fff1f2", color: "#991b1b" }} role="alert">
          <span>서버 명령 처리 실패: {error.code}</span>
          <button type="button" style={exitButtonStyle} onClick={() => void refresh("ERROR_RETRY")}>최신 상태 다시 받기</button>
        </div>
      ) : null}

      <p style={{ margin: "9px 4px 0", color: "#4b647b", fontSize: "12px", fontWeight: 700 }}>
        Space는 내 차례에만 투구·스윙을 전송합니다. 모든 판정과 공수교대는 서버가 확정하며, 재접속 시 최신 이닝·카운트·주자 상태로 복구됩니다.
      </p>
    </main>
  );
}

export default BaseballOnlineGameV2;
