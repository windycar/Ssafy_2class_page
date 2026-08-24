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
import baseballPitcherActionsRed from "../../../../assets/games/baseball-pitcher-actions-red.png";
import {
  BASEBALL_V2_BALL_SOURCE,
  BASEBALL_V2_BATTER_ACTION_SOURCES,
  BASEBALL_V2_CAMERA_BACKGROUND_SOURCES,
  BASEBALL_V2_FIELDER_SOURCES,
  BASEBALL_V2_RUNNER_SOURCES,
  BASEBALL_V2_SCOREBOARD_BACKGROUND_SOURCE,
} from "../../../../config/baseballV2Assets.ts";
import { useBaseballSoloController } from "../../../../hooks/useBaseballSoloController.ts";
import { resolveBaseballCameraBackground } from "../../../../utils/games/baseball/cameraBackground.ts";
import {
  getCurrentBatter,
  getCurrentPitcher,
} from "../../../../utils/games/baseball/gameState.ts";
import {
  createPitchVisualFrame,
  DEFAULT_PITCH_STAGE_PROJECTION,
  derivePitchStageProjection,
  projectBattedBallToCamera,
  type PitchSpriteSample,
  type PitchStageProjection,
} from "../../../../utils/games/baseball/presentation.ts";
import type {
  BaseballCameraMode,
  BattedBall,
  BaseballGameState,
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
  BaseballHalfInningOverlayV2,
  BaseballIntroOverlayV2,
} from "./BaseballOverlaysV2.tsx";
import {
  createBaseballDefenseThrowPresentationV2,
  createBaseballFielderPresentationsV2,
  createBaseballRunnerPresentationsV2,
  isBaseballHomeRunResultV2,
} from "./BaseballPlayPresentationV2.ts";
import {
  BaseballStageV2,
  type BaseballBallPresentationV2,
  type BaseballPresentationPointV2,
  type BaseballTrailPointsV2,
} from "./BaseballStageV2.tsx";
import { BaseballVisualEventOverlayV2 } from "./BaseballVisualEventPresentationV2.tsx";
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

function isFieldCamera(camera: BaseballCameraMode) {
  return !["BATTER", "PITCHER", "CONTACT", "DUGOUT", "REPLAY"].includes(camera);
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
  const backgroundSrc = resolveBaseballCameraBackground(
    cameraMode,
    perspective,
    BASEBALL_V2_CAMERA_BACKGROUND_SOURCES,
  );
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
      || !isBaseballHomeRunResultV2(officialResult.code)
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

  const visualBattingTeam = currentVisualEvent
    ? lastPlayEntry?.battingTeam ?? displayGame.battingTeam
    : displayGame.battingTeam;
  const visualFieldingTeam = visualBattingTeam === 0 ? 1 : 0;
  const runners = useMemo(() => createBaseballRunnerPresentationsV2({
    authoritativeGame: game,
    presentationGame: displayGame,
    event: currentVisualEvent,
    eventProgress: currentVisualEventProgress,
    cameraMode,
    runnerAssetSrc: BASEBALL_V2_RUNNER_SOURCES[visualBattingTeam],
  }), [
    cameraMode,
    currentVisualEvent,
    currentVisualEventProgress,
    displayGame,
    game,
    visualBattingTeam,
  ]);
  const fielders = useMemo(() => createBaseballFielderPresentationsV2({
    game,
    event: currentVisualEvent,
    eventProgress: currentVisualEventProgress,
    fielderAssetSrc: BASEBALL_V2_FIELDER_SOURCES[visualFieldingTeam],
  }), [currentVisualEvent, currentVisualEventProgress, game, visualFieldingTeam]);
  const defenseThrow = useMemo(() => createBaseballDefenseThrowPresentationV2({
    game,
    event: currentVisualEvent,
    eventProgress: currentVisualEventProgress,
  }), [currentVisualEvent, currentVisualEventProgress, game]);

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
    overlay = (
      <BaseballVisualEventOverlayV2
        event={currentVisualEvent}
        official={officialResult}
        game={displayGame}
        onSkip={skip}
        homeRunImageSrc={baseballArenaSwingFacing}
      />
    );
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
        backgroundSrc={BASEBALL_V2_SCOREBOARD_BACKGROUND_SOURCE}
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
            ballSrc: BASEBALL_V2_BALL_SOURCE,
            batterSprite: perspective === "FIELD" ? undefined : {
              src: BASEBALL_V2_BATTER_ACTION_SOURCES[visualBattingTeam],
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
          }}
          cameraMode={cameraMode}
          perspective={perspective}
          pitchBall={battedBall ? null : pitchBall}
          battedBall={pitchBall ? null : battedBall}
          defenseThrow={defenseThrow}
          fielders={fielders}
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
