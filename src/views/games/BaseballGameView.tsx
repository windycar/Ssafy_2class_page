import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/baseball.css";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  Crosshair,
  Gamepad2,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

import baseballArena from "../../assets/games/baseball-arena-facing.png";
import baseballBatterSprite from "../../assets/games/baseball-batter-sprite.png";
import baseballBattingField from "../../assets/games/baseball-batting-field.png";
import baseballPitchingField from "../../assets/games/baseball-pitching-field.png";
import {
  BASEBALL_BALL_BODY_SRC,
  BaseballPitchBall,
} from "../../components/games/baseball/BaseballPitchBall";
import { useAuth } from "../../hooks/useAuth";
import { useBaseballMatchChannel } from "../../hooks/useBaseballMatchChannel";
import { baseballRoomStorage } from "../../services/storage/baseballRoomStorage";
import type { BaseballRoom, BaseballRoomPlayer } from "../../types/baseballRoom";
import {
  applyPlateOutcome,
  createGameState,
  createPitchFlightDuration,
  createPitchTrajectory,
  inningLabel,
  isPitchInStrikeZone,
  judgeCpuPitchResult,
  judgeSwingContact,
  REGULATION_INNINGS,
  type BaseballGameState,
  type ContactPoint,
  type GameTransition,
  type PlateOutcome,
  type PitchVisualKind,
  type TeamIndex,
} from "../../utils/games/baseballEngine";

type GameMode = "solo" | "versus";
type Screen = "menu" | "playing" | "finished";
type ActionMode = "batting" | "pitching";
type PitchPhase = "idle" | "aiming" | "windup" | "flight" | "resolved";

interface PitchType {
  id: PitchVisualKind;
  name: string;
  speed: [number, number];
  color: string;
}

interface ActivePitch {
  id: number;
  startedAt: number;
  windupDuration: number;
  flightDuration: number;
  target: ContactPoint;
  pitchType: PitchType;
  speed: number;
}

interface Feedback {
  label: string;
  detail: string;
  tone: "ball" | "strike" | "out" | "hit" | "homeRun";
}

interface HalfTransition {
  title: string;
  subtitle: string;
}

type OnlineGameEvent =
  | {
    kind: "outcome";
    outcome: PlateOutcome;
    state: BaseballGameState;
    transition: GameTransition;
    feedback: Feedback;
    eventEntry: string;
  }
  | {
    kind: "advance";
    state: BaseballGameState;
    nextScreen: "playing" | "finished";
    halfTransition: HalfTransition | null;
  }
  | {
    kind: "begin";
    state: BaseballGameState;
  };

const CENTER_POINT: ContactPoint = { x: 0.5, y: 0.5 };
const PITCH_TYPES: PitchType[] = [
  { id: "fastball", name: "직구", speed: [145, 153], color: "#ef4444" },
  { id: "curve", name: "커브", speed: [119, 128], color: "#60a5fa" },
  { id: "slider", name: "슬라이더", speed: [132, 141], color: "#a78bfa" },
  { id: "changeup", name: "체인지업", speed: [113, 122], color: "#34d399" },
];

const BATTED_OUTCOMES = new Set<PlateOutcome>([
  "foul",
  "out",
  "single",
  "double",
  "triple",
  "homeRun",
]);

const OUTCOME_COPY: Record<PlateOutcome, Omit<Feedback, "detail"> & { detail: string }> = {
  ball: { label: "볼", detail: "스트라이크존을 벗어났습니다.", tone: "ball" },
  calledStrike: { label: "스트라이크", detail: "존을 통과한 공을 지켜봤습니다.", tone: "strike" },
  swingingStrike: { label: "헛스윙", detail: "공과 배트가 만나지 않았습니다.", tone: "strike" },
  foul: { label: "파울", detail: "배트 끝에 걸렸습니다.", tone: "strike" },
  out: { label: "아웃", detail: "타구가 수비 정면으로 향했습니다.", tone: "out" },
  single: { label: "안타!", detail: "1루까지 안전하게 도착했습니다.", tone: "hit" },
  double: { label: "2루타!", detail: "외야를 가르는 장타입니다.", tone: "hit" },
  triple: { label: "3루타!", detail: "주자가 3루까지 내달립니다.", tone: "hit" },
  homeRun: { label: "홈런!", detail: "담장을 넘기는 완벽한 타구입니다.", tone: "homeRun" },
};

function clampPoint(value: number) {
  return Math.min(0.97, Math.max(0.03, value));
}

function controlFor(mode: GameMode, state: BaseballGameState): ActionMode {
  if (mode === "solo") return state.battingTeam === 1 ? "batting" : "pitching";
  return "batting";
}

function randomPitchType() {
  return PITCH_TYPES[Math.floor(Math.random() * PITCH_TYPES.length)];
}

function randomCpuPitchTarget(): ContactPoint {
  const inside = Math.random() < 0.68;
  if (inside) {
    return { x: 0.27 + Math.random() * 0.46, y: 0.2 + Math.random() * 0.6 };
  }

  const side = Math.floor(Math.random() * 4);
  if (side === 0) return { x: 0.06 + Math.random() * 0.12, y: 0.2 + Math.random() * 0.6 };
  if (side === 1) return { x: 0.82 + Math.random() * 0.12, y: 0.2 + Math.random() * 0.6 };
  if (side === 2) return { x: 0.24 + Math.random() * 0.52, y: 0.04 + Math.random() * 0.08 };
  return { x: 0.24 + Math.random() * 0.52, y: 0.89 + Math.random() * 0.07 };
}

function feedbackFor(outcome: PlateOutcome, transition: GameTransition, detail?: string): Feedback {
  const base = OUTCOME_COPY[outcome];
  if (transition.message === "볼넷") {
    return {
      label: transition.runsScored > 0 ? "밀어내기 볼넷" : "볼넷",
      detail: transition.runsScored > 0 ? `${transition.runsScored}점이 들어왔습니다.` : "타자가 1루로 출루합니다.",
      tone: "ball",
    };
  }

  const strikeout =
    transition.plateEnded &&
    (outcome === "calledStrike" || outcome === "swingingStrike");

  return {
    ...base,
    label: strikeout ? "삼진 아웃" : base.label,
    detail: detail ?? (transition.runsScored > 0 ? `${transition.runsScored}점이 들어왔습니다.` : base.detail),
  };
}

function BaseDiamond({ state }: { state: BaseballGameState }) {
  return (
    <div className="baseball-base-state" aria-label={`1루 ${state.bases.first ? "주자 있음" : "비어 있음"}, 2루 ${state.bases.second ? "주자 있음" : "비어 있음"}, 3루 ${state.bases.third ? "주자 있음" : "비어 있음"}`}>
      <span className={`baseball-base is-second ${state.bases.second ? "is-on" : ""}`} />
      <span className={`baseball-base is-third ${state.bases.third ? "is-on" : ""}`} />
      <span className={`baseball-base is-first ${state.bases.first ? "is-on" : ""}`} />
      <span className="baseball-home-base" />
    </div>
  );
}

function CountBoard({ state }: { state: BaseballGameState }) {
  const rows = [
    { label: "B", value: state.count.balls, total: 3, className: "is-ball" },
    { label: "S", value: state.count.strikes, total: 2, className: "is-strike" },
    { label: "O", value: state.count.outs, total: 2, className: "is-out" },
  ];

  return (
    <div className="baseball-count-board" aria-label={`${state.count.balls}볼 ${state.count.strikes}스트라이크 ${state.count.outs}아웃`}>
      {rows.map((row) => (
        <div key={row.label}>
          <strong>{row.label}</strong>
          <span>
            {Array.from({ length: row.total }, (_, index) => (
              <i key={index} className={`${row.className} ${index < row.value ? "is-on" : ""}`} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

function LineScore({ state }: { state: BaseballGameState }) {
  const inningCount = Math.max(REGULATION_INNINGS, state.inning);
  return (
    <div className="baseball-line-score-wrap">
      <table className="baseball-line-score">
        <thead>
          <tr>
            <th>TEAM</th>
            {Array.from({ length: inningCount }, (_, index) => <th key={index}>{index + 1}</th>)}
            <th>R</th>
            <th>H</th>
          </tr>
        </thead>
        <tbody>
          {state.teams.map((team, teamIndex) => (
            <tr key={team.name} className={state.battingTeam === teamIndex && state.status === "playing" ? "is-batting" : ""}>
              <th>{team.name}</th>
              {Array.from({ length: inningCount }, (_, index) => (
                <td key={index}>{team.inningRuns[index] ?? "-"}</td>
              ))}
              <td><strong>{team.runs}</strong></td>
              <td>{team.hits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BaseballGameView() {
  const { currentUser } = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [onlineRoom, setOnlineRoom] = useState<BaseballRoom | null>(() => (
    roomId ? baseballRoomStorage.getRoom(roomId) : null
  ));
  const [isOnlineRoomLoading, setIsOnlineRoomLoading] = useState(Boolean(roomId && !onlineRoom));
  const matchChannel = useBaseballMatchChannel(roomId, currentUser?.authId);
  const [screen, setScreen] = useState<Screen>(roomId ? "playing" : "menu");
  const [mode, setMode] = useState<GameMode>(roomId ? "versus" : "solo");
  const [game, setGame] = useState(() => onlineRoom?.gameState ?? createGameState("CPU", "나"));
  const [pitch, setPitch] = useState<ActivePitch | null>(null);
  const [pitchPhase, setPitchPhase] = useState<PitchPhase>("idle");
  const [aim, setAim] = useState<ContactPoint>(CENTER_POINT);
  const [selectedPitchId, setSelectedPitchId] = useState(PITCH_TYPES[0].id);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [lastOutcome, setLastOutcome] = useState<PlateOutcome | null>(null);
  const [lastTransition, setLastTransition] = useState<GameTransition | null>(null);
  const [halfTransition, setHalfTransition] = useState<HalfTransition | null>(null);
  const [isSwinging, setIsSwinging] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [onlineMatchId, setOnlineMatchId] = useState(onlineRoom?.matchId ?? "");
  const [onlineSeat, setOnlineSeat] = useState<TeamIndex | null>(() => {
    return onlineRoom?.players.find((player) => player.studentId === currentUser?.id)?.seat ?? null;
  });

  const pitchIdRef = useRef(0);
  const resolvedPitchRef = useRef<number | null>(null);
  const releaseTimerRef = useRef<number | null>(null);
  const resolveTimerRef = useRef<number | null>(null);
  const meterStartedAtRef = useRef(performance.now());
  const gameRef = useRef(game);
  const onlineRoomRef = useRef(onlineRoom);
  const initializedOnlineRoomRef = useRef("");

  const actionMode = controlFor(mode, game);
  const selectedPitch = PITCH_TYPES.find((item) => item.id === selectedPitchId) ?? PITCH_TYPES[0];
  const isOnlineMatch = mode === "versus" && Boolean(onlineMatchId);
  const isOnlineTurn = !isOnlineMatch || onlineSeat === game.battingTeam;
  const opponentConnected = !isOnlineMatch || (
    onlineRoom?.players.length === 2 && onlineRoom.status !== "cancelled"
  );
  const canControl = isOnlineTurn && opponentConnected;

  useEffect(() => {
    const ballImage = new Image();
    ballImage.src = BASEBALL_BALL_BODY_SRC;
    void ballImage.decode().catch(() => undefined);
  }, []);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    onlineRoomRef.current = onlineRoom;
  }, [onlineRoom]);

  useEffect(() => {
    if (!roomId) return;
    let active = true;
    const refreshRoom = async () => {
      const nextRoom = await baseballRoomStorage.refreshRoom(roomId);
      if (active) {
        setOnlineRoom(nextRoom);
        setIsOnlineRoomLoading(false);
      }
    };
    void refreshRoom();
    const timer = window.setInterval(() => void refreshRoom(), 1500);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !onlineRoom || !currentUser) return;
    if (initializedOnlineRoomRef.current === onlineRoom.id) return;

    const seat = onlineRoom.players.find((player) => player.studentId === currentUser.id)?.seat;
    if ((seat !== 0 && seat !== 1) || onlineRoom.status !== "playing" || !onlineRoom.gameState || !onlineRoom.matchId) {
      navigate(`/games/baseball/rooms/${onlineRoom.id}`, { replace: true });
      return;
    }

    initializedOnlineRoomRef.current = onlineRoom.id;
    gameRef.current = onlineRoom.gameState;
    setMode("versus");
    setGame(onlineRoom.gameState);
    setOnlineMatchId(onlineRoom.matchId);
    setOnlineSeat(seat as TeamIndex);
    setScreen(onlineRoom.gameState.status === "finished" ? "finished" : "playing");
    setHalfTransition(onlineRoom.gameState.status === "finished" ? null : {
      title: "PLAY BALL!",
      subtitle: `${inningLabel(onlineRoom.gameState)} · ${onlineRoom.gameState.teams[onlineRoom.gameState.battingTeam].name} 공격`,
    });
  }, [currentUser, navigate, onlineRoom, roomId]);

  const clearPitchTimers = useCallback(() => {
    if (releaseTimerRef.current !== null) window.clearTimeout(releaseTimerRef.current);
    if (resolveTimerRef.current !== null) window.clearTimeout(resolveTimerRef.current);
    releaseTimerRef.current = null;
    resolveTimerRef.current = null;
  }, []);

  useEffect(() => clearPitchTimers, [clearPitchTimers]);

  const persistOnlineGame = useCallback((state: BaseballGameState, finished = false) => {
    const activeRoom = onlineRoomRef.current;
    if (!activeRoom) return;
    const updated: BaseballRoom = {
      ...activeRoom,
      revision: activeRoom.revision + 1,
      gameState: state,
      status: finished ? "finished" : "playing",
      finishedAt: finished ? new Date().toISOString() : activeRoom.finishedAt,
    };
    onlineRoomRef.current = updated;
    setOnlineRoom(updated);
    baseballRoomStorage.updateRoom(updated);
  }, []);

  const settleOutcome = useCallback(
    (pitchId: number, outcome: PlateOutcome, detail?: string) => {
      if (resolvedPitchRef.current === pitchId) return;
      resolvedPitchRef.current = pitchId;
      clearPitchTimers();

      const before = gameRef.current;
      const transition = applyPlateOutcome(before, outcome);
      const nextFeedback = feedbackFor(outcome, transition, detail);
      const eventEntry = `${inningLabel(before)} · ${before.teams[before.battingTeam].name} 공격 · ${transition.message}`;
      gameRef.current = transition.state;
      setGame(transition.state);
      setPitchPhase("resolved");
      setLastTransition(transition);
      setFeedback(nextFeedback);
      setLastOutcome(outcome);
      setEventLog((current) => [eventEntry, ...current].slice(0, 6));

      if (onlineMatchId) {
        persistOnlineGame(transition.state, transition.gameEnded);
        const onlineEvent = {
          kind: "outcome",
          outcome,
          state: transition.state,
          transition,
          feedback: nextFeedback,
          eventEntry,
        } satisfies OnlineGameEvent;
        void matchChannel.sendGameEvent(
          onlineMatchId,
          onlineEvent as unknown as Record<string, unknown>,
        );
      }

      if (outcome === "homeRun") {
        void confetti({
          particleCount: 140,
          spread: 92,
          origin: { y: 0.62 },
          colors: ["#1259AA", "#ffffff", "#ef4444", "#fbbf24"],
        });
      }
    },
    [clearPitchTimers, matchChannel.sendGameEvent, onlineMatchId, persistOnlineGame],
  );

  const launchBattingPitch = useCallback(() => {
    clearPitchTimers();
    const pitchType = randomPitchType();
    const windupDuration = 850 + Math.round(Math.random() * 300);
    const flightDuration = createPitchFlightDuration(pitchType.id);
    const nextPitch: ActivePitch = {
      id: ++pitchIdRef.current,
      startedAt: performance.now(),
      windupDuration,
      flightDuration,
      target: randomCpuPitchTarget(),
      pitchType,
      speed: pitchType.speed[0] + Math.round(Math.random() * (pitchType.speed[1] - pitchType.speed[0])),
    };

    resolvedPitchRef.current = null;
    setPitch(nextPitch);
    setPitchPhase("windup");
    setAim(CENTER_POINT);
    setFeedback(null);
    setLastOutcome(null);
    setLastTransition(null);
    setIsSwinging(false);

    releaseTimerRef.current = window.setTimeout(() => {
      setPitchPhase("flight");
      releaseTimerRef.current = null;
    }, windupDuration);

    resolveTimerRef.current = window.setTimeout(() => {
      settleOutcome(
        nextPitch.id,
        isPitchInStrikeZone(nextPitch.target) ? "calledStrike" : "ball",
      );
    }, windupDuration + flightDuration + 120);
  }, [clearPitchTimers, settleOutcome]);

  const preparePitching = useCallback(() => {
    clearPitchTimers();
    resolvedPitchRef.current = null;
    meterStartedAtRef.current = performance.now();
    setPitch(null);
    setPitchPhase("aiming");
    setAim(CENTER_POINT);
    setFeedback(null);
    setLastOutcome(null);
    setLastTransition(null);
    setIsSwinging(false);
  }, [clearPitchTimers]);

  const prepareAction = useCallback(
    (state: BaseballGameState) => {
      if (mode === "versus" && (!opponentConnected || onlineSeat !== state.battingTeam)) {
        clearPitchTimers();
        setPitch(null);
        setPitchPhase("idle");
        setFeedback(null);
        setLastTransition(null);
        return;
      }
      if (controlFor(mode, state) === "batting") launchBattingPitch();
      else preparePitching();
    },
    [clearPitchTimers, launchBattingPitch, mode, onlineSeat, opponentConnected, preparePitching],
  );

  const startGame = (selectedMode: GameMode, onlinePlayers?: BaseballRoomPlayer[]) => {
    clearPitchTimers();
    const nextGame = selectedMode === "solo"
      ? createGameState("CPU", "나")
      : createGameState(
          onlinePlayers?.find((player) => player.seat === 0)?.name ?? "1P",
          onlinePlayers?.find((player) => player.seat === 1)?.name ?? "2P",
        );
    gameRef.current = nextGame;
    setMode(selectedMode);
    setGame(nextGame);
    setPitch(null);
    setPitchPhase("idle");
    setFeedback(null);
    setLastOutcome(null);
    setLastTransition(null);
    setEventLog([]);
    setScreen("playing");
    setHalfTransition({
      title: "PLAY BALL!",
      subtitle: selectedMode === "solo"
        ? "1회초 · 내가 먼저 수비합니다."
        : `1회초 · ${onlinePlayers?.find((player) => player.seat === 0)?.name ?? "1P"} 공격부터 시작합니다.`,
    });
  };

  useEffect(() => {
    const nextEvent = matchChannel.gameEvent;
    if (
      !nextEvent
      || !currentUser
      || !onlineMatchId
      || nextEvent.matchId !== onlineMatchId
      || nextEvent.senderAuthId === currentUser.authId
    ) return;

    const payload = nextEvent.payload as unknown as OnlineGameEvent;
    clearPitchTimers();

    if (payload.kind === "outcome") {
      gameRef.current = payload.state;
      setGame(payload.state);
      setPitch(null);
      setPitchPhase("resolved");
      setLastTransition(payload.transition);
      setFeedback(payload.feedback);
      setLastOutcome(payload.outcome);
      setEventLog((current) => [payload.eventEntry, ...current].slice(0, 6));
      if (payload.feedback.tone === "homeRun") {
        void confetti({
          particleCount: 100,
          spread: 82,
          origin: { y: 0.62 },
          colors: ["#1259AA", "#ffffff", "#ef4444", "#fbbf24"],
        });
      }
      return;
    }

    gameRef.current = payload.state;
    setGame(payload.state);
    setPitch(null);
    setPitchPhase("idle");
    setFeedback(null);
    setLastOutcome(null);
    setLastTransition(null);

    if (payload.kind === "advance") {
      setHalfTransition(payload.halfTransition);
      setScreen(payload.nextScreen);
      return;
    }

    setHalfTransition(null);
  }, [clearPitchTimers, currentUser, matchChannel.gameEvent, onlineMatchId]);

  const beginHalf = useCallback(() => {
    if (!canControl) return;
    setHalfTransition(null);
    if (onlineMatchId) {
      const onlineEvent = { kind: "begin", state: gameRef.current } satisfies OnlineGameEvent;
      void matchChannel.sendGameEvent(
        onlineMatchId,
        onlineEvent as unknown as Record<string, unknown>,
      );
    }
    prepareAction(gameRef.current);
  }, [canControl, matchChannel.sendGameEvent, onlineMatchId, prepareAction]);

  const handleSwing = useCallback(() => {
    if (!canControl || !pitch || pitchPhase !== "flight" || resolvedPitchRef.current === pitch.id) return;
    setIsSwinging(true);
    const releasedAt = pitch.startedAt + pitch.windupDuration;
    const progress = (performance.now() - releasedAt) / pitch.flightDuration;
    const contact = judgeSwingContact(progress, aim, pitch.target);
    settleOutcome(pitch.id, contact.outcome, contact.detail);
  }, [aim, canControl, pitch, pitchPhase, settleOutcome]);

  const handleDefensePitch = useCallback(() => {
    if (!canControl || pitchPhase !== "aiming") return;
    clearPitchTimers();
    const phase = ((performance.now() - meterStartedAtRef.current) % 1_200) / 1_200;
    const pulseError = Math.abs(phase - 0.5) / 0.5;
    const jitter = 0.012 + pulseError * 0.105;
    const angle = Math.random() * Math.PI * 2;
    const actualTarget = {
      x: clampPoint(aim.x + Math.cos(angle) * jitter),
      y: clampPoint(aim.y + Math.sin(angle) * jitter),
    };
    const windupDuration = 780;
    const flightDuration = createPitchFlightDuration(selectedPitch.id);
    const nextPitch: ActivePitch = {
      id: ++pitchIdRef.current,
      startedAt: performance.now(),
      windupDuration,
      flightDuration,
      target: actualTarget,
      pitchType: selectedPitch,
      speed: selectedPitch.speed[0] + Math.round(Math.random() * (selectedPitch.speed[1] - selectedPitch.speed[0])),
    };

    resolvedPitchRef.current = null;
    setPitch(nextPitch);
    setPitchPhase("windup");
    setFeedback(null);
    setLastTransition(null);

    releaseTimerRef.current = window.setTimeout(() => {
      setPitchPhase("flight");
      releaseTimerRef.current = null;
    }, windupDuration);

    resolveTimerRef.current = window.setTimeout(() => {
      const outcome = judgeCpuPitchResult(actualTarget, Math.random(), Math.random());
      settleOutcome(nextPitch.id, outcome);
    }, windupDuration + flightDuration + 120);
  }, [aim, canControl, clearPitchTimers, pitchPhase, selectedPitch, settleOutcome]);

  const advanceAfterPlay = useCallback(() => {
    if (!lastTransition || !canControl) return;
    const sendAdvance = (
      nextScreen: "playing" | "finished",
      nextHalfTransition: HalfTransition | null,
    ) => {
      if (!onlineMatchId) return;
      const onlineEvent = {
        kind: "advance",
        state: lastTransition.state,
        nextScreen,
        halfTransition: nextHalfTransition,
      } satisfies OnlineGameEvent;
      void matchChannel.sendGameEvent(
        onlineMatchId,
        onlineEvent as unknown as Record<string, unknown>,
      );
    };

    if (lastTransition.gameEnded) {
      setScreen("finished");
      setPitch(null);
      sendAdvance("finished", null);
      return;
    }

    if (lastTransition.halfEnded) {
      const nextState = lastTransition.state;
      const nextHalfTransition = {
        title: "공수 교대",
        subtitle: `${inningLabel(nextState)} · ${nextState.teams[nextState.battingTeam].name} 공격`,
      };
      setPitch(null);
      setFeedback(null);
      setLastTransition(null);
      setHalfTransition(nextHalfTransition);
      sendAdvance("playing", nextHalfTransition);
      return;
    }

    sendAdvance("playing", null);
    prepareAction(lastTransition.state);
  }, [canControl, lastTransition, matchChannel.sendGameEvent, onlineMatchId, prepareAction]);

  const moveAim = useCallback((x: number, y: number) => {
    setAim({ x: clampPoint(x), y: clampPoint(y) });
  }, []);

  const handlePlanePointer = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!canControl) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      moveAim(
        (event.clientX - bounds.left) / bounds.width,
        (event.clientY - bounds.top) / bounds.height,
      );
    },
    [canControl, moveAim],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (screen !== "playing") return;

      if (event.code === "Space") {
        if (event.repeat) return;
        event.preventDefault();

        if (halfTransition) {
          beginHalf();
          return;
        }

        if (feedback) {
          advanceAfterPlay();
          return;
        }

        if (actionMode === "batting") handleSwing();
        else handleDefensePitch();
        return;
      }

      if (halfTransition || feedback || !canControl) return;
      const step = 0.055;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
        event.preventDefault();
        setAim((current) => ({
          x: clampPoint(current.x + (event.code === "ArrowLeft" ? -step : event.code === "ArrowRight" ? step : 0)),
          y: clampPoint(current.y + (event.code === "ArrowUp" ? -step : event.code === "ArrowDown" ? step : 0)),
        }));
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [actionMode, advanceAfterPlay, beginHalf, canControl, feedback, halfTransition, handleDefensePitch, handleSwing, screen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  const pitchStyle = useMemo(() => {
    if (!pitch) return undefined;
    const batting = actionMode === "batting";
    const target = {
      x: (batting ? 41 : 43) + pitch.target.x * (batting ? 18 : 14),
      y: (batting ? 44 : 25) + pitch.target.y * (batting ? 32 : 24),
    };
    const start = batting ? { x: 44, y: 51 } : { x: 31, y: 68 };
    const trajectory = createPitchTrajectory(pitch.pitchType.id, start, target);
    return {
      "--windup-duration": `${pitch.windupDuration}ms`,
      "--flight-duration": `${pitch.flightDuration}ms`,
      "--pitch-target-left": `${trajectory.end.x}%`,
      "--pitch-target-top": `${trajectory.end.y}%`,
      "--pitch-mid-one-left": `${trajectory.first.x}%`,
      "--pitch-mid-one-top": `${trajectory.first.y}%`,
      "--pitch-mid-two-left": `${trajectory.second.x}%`,
      "--pitch-mid-two-top": `${trajectory.second.y}%`,
      "--pitch-color": pitch.pitchType.color,
    } as CSSProperties;
  }, [actionMode, pitch]);

  const planeStyle = {
    "--aim-x": `${aim.x * 100}%`,
    "--aim-y": `${aim.y * 100}%`,
    "--target-x": `${pitch ? pitch.target.x * 100 : aim.x * 100}%`,
    "--target-y": `${pitch ? pitch.target.y * 100 : aim.y * 100}%`,
  } as CSSProperties;

  const winnerText = game.winner === null
    ? "경기 종료"
    : `${game.teams[game.winner].name} 승리!`;

  if (roomId && isOnlineRoomLoading) {
    return <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" /></div>;
  }

  if (roomId && !onlineRoom) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <span className="text-4xl">⚾</span>
        <p className="text-sm font-bold text-gray-400">야구 게임방을 찾을 수 없습니다.</p>
        <Link to="/games/baseball/rooms" className="text-sm font-semibold text-blue-700 underline">야구 게임방 목록으로</Link>
      </div>
    );
  }

  if (screen === "menu") {
    return (
      <div className="baseball-page">
        <Link to="/games" className="baseball-back-link"><ArrowLeft aria-hidden="true" /> 게임방으로</Link>

        <section className="baseball-menu-hero">
          <img src={baseballArena} alt="투수와 타자가 승부하는 야구장" />
          <div className="baseball-menu-shade" />
          <div className="baseball-menu-copy">
            <span className="baseball-kicker"><Sparkles aria-hidden="true" /> GWANGJU 2 CLASS</span>
            <h1>광주 2반<br /><strong>BASEBALL</strong></h1>
            <p>타격과 투구를 직접 조작하는 3이닝 야구 경기</p>
          </div>
        </section>

        <section className="baseball-mode-section" aria-labelledby="mode-heading">
          <div>
            <p className="baseball-section-eyebrow">PLAY MODE</p>
            <h2 id="mode-heading">경기 방식을 선택하세요</h2>
          </div>

          <div className="baseball-mode-grid">
            <button type="button" className="baseball-mode-card is-solo" onClick={() => startGame("solo")}>
              <span className="baseball-mode-icon"><Bot aria-hidden="true" /></span>
              <span><small>CPU와 실제 공수 교대</small><strong>1인 경기</strong><em>공격은 타격 · 수비는 투구 조작</em></span>
              <ChevronRight aria-hidden="true" />
            </button>

            <button type="button" className="baseball-mode-card is-versus" onClick={() => navigate("/games/baseball/rooms")}>
              <span className="baseball-mode-icon"><Users aria-hidden="true" /></span>
              <span><small>게임방을 만들고 친구 초대</small><strong>온라인 2인 대결</strong><em>참여와 준비 완료 후 방장이 시작</em></span>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>

          <div className="baseball-how-to">
            <Zap aria-hidden="true" />
            <p><strong>실제 야구 규칙</strong> 4볼은 볼넷, 3스트라이크는 삼진, 3아웃마다 공수 교대합니다. 3회 종료 동점이면 연장전에 들어갑니다.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="baseball-page">
      <div className="baseball-game-heading">
        <button type="button" className="baseball-back-link" onClick={() => {
          clearPitchTimers();
          if (isOnlineMatch && onlineRoomRef.current && currentUser) {
            baseballRoomStorage.leaveRoom(onlineRoomRef.current, currentUser.id);
            navigate("/games/baseball/rooms");
            return;
          }
          setScreen("menu");
          setPitch(null);
          setHalfTransition(null);
          setOnlineMatchId("");
          setOnlineSeat(null);
        }}>
          <ArrowLeft aria-hidden="true" /> {isOnlineMatch ? "게임방 나가기" : "모드 선택"}
        </button>
        <div>
          <span>{mode === "solo" ? "1인 경기" : "온라인 2인 대결"} · {inningLabel(game)}</span>
          <h1>광주 2반 BASEBALL</h1>
        </div>
      </div>

      <section className="baseball-game-shell">
        <LineScore state={game} />

        <div className={`baseball-stage is-${actionMode}`}>
          <img
            className="baseball-game-scene"
            src={actionMode === "batting" ? baseballBattingField : baseballPitchingField}
            alt={actionMode === "batting" ? "홈플레이트 타격 화면" : "투수 뒤에서 보는 수비 화면"}
          />
          <div className="baseball-stage-shade" />

          {actionMode === "batting" && (
            <div
              className={`baseball-batter-character ${isSwinging ? "is-swinging" : ""}`}
              style={{ backgroundImage: `url(${baseballBatterSprite})` }}
              aria-hidden="true"
            />
          )}

          <div className="baseball-game-hud">
            <div className="baseball-inning-chip">
              <span>{game.inning > REGULATION_INNINGS ? "EXTRA" : "INNING"}</span>
              <strong>{inningLabel(game)}</strong>
              <em>{game.teams[game.battingTeam].name} 공격</em>
            </div>
            <CountBoard state={game} />
            <BaseDiamond state={game} />
          </div>

          {isOnlineMatch && (
            <div className={`baseball-online-chip ${opponentConnected ? "is-connected" : "is-disconnected"}`}>
              {opponentConnected ? <Wifi aria-hidden="true" /> : <WifiOff aria-hidden="true" />}
              <span>{opponentConnected ? `${onlineSeat !== null ? onlineSeat + 1 : "-"}P 접속 중` : "상대 연결 끊김"}</span>
            </div>
          )}

          {!halfTransition && game.status === "playing" && (
            <div
              className={`baseball-pitch-plane is-${actionMode}`}
              style={planeStyle}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                handlePlanePointer(event);
              }}
              onPointerMove={(event) => {
                if (event.pointerType === "mouse" || event.buttons > 0) handlePlanePointer(event);
              }}
              aria-label={actionMode === "batting" ? "타격 위치 커서" : "투구 위치 조준"}
            >
              <div className="baseball-real-strike-zone" aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
              </div>
              <span className={`baseball-location-cursor is-${actionMode}`} aria-hidden="true" />
              {pitch && pitchPhase === "flight" && actionMode === "batting" && (
                <span className="baseball-arrival-ring" aria-hidden="true" />
              )}
              <span className="baseball-zone-caption">STRIKE ZONE</span>
            </div>
          )}

          {pitch && (
            <>
              <BaseballPitchBall
                key={`ball-${pitch.id}`}
                variant="pitch"
                pitchKind={pitch.pitchType.id}
                actionMode={actionMode}
                phase={pitchPhase}
                style={pitchStyle}
              />
              <div className={`baseball-pitch-readout is-${pitchPhase}`}>
                <span>{pitch.pitchType.name}</span>
                <strong>{pitch.speed} km/h</strong>
              </div>
            </>
          )}

          {pitch && actionMode === "batting" && feedback && lastOutcome && BATTED_OUTCOMES.has(lastOutcome) && (
            <BaseballPitchBall
              variant="batted"
              pitchKind={pitch.pitchType.id}
              tone={feedback.tone}
              style={pitchStyle}
            />
          )}

          {isOnlineMatch && opponentConnected && !isOnlineTurn && !feedback && !halfTransition && (
            <div className="baseball-online-wait" role="status">
              <Users aria-hidden="true" />
              <strong>{game.teams[game.battingTeam].name} 공격 중</strong>
              <span>상대의 플레이 결과를 실시간으로 기다리고 있습니다.</span>
            </div>
          )}

          {isOnlineMatch && !opponentConnected && (
            <div className="baseball-online-wait is-disconnected" role="alert">
              <WifiOff aria-hidden="true" />
              <strong>상대 연결이 끊겼습니다.</strong>
              <span>상대가 다시 접속할 때까지 경기를 멈춥니다.</span>
            </div>
          )}

          {feedback && (
            <div className={`baseball-play-feedback is-${feedback.tone}`} role="status" aria-live="polite">
              <span>PLAY RESULT</span>
              <strong>{feedback.label}</strong>
              <p>{feedback.detail}</p>
            </div>
          )}

          {halfTransition && (
            <div className="baseball-half-transition">
              <div className="baseball-half-icon">
                {controlFor(mode, game) === "batting" ? <Gamepad2 aria-hidden="true" /> : <Shield aria-hidden="true" />}
              </div>
              <span>{game.inning > REGULATION_INNINGS ? "EXTRA INNING" : "3 INNING GAME"}</span>
              <h2>{halfTransition.title}</h2>
              <p>{halfTransition.subtitle}</p>
              <button type="button" onClick={beginHalf} disabled={!canControl}>
                {canControl ? "경기 계속" : "상대 시작 대기"} <ChevronRight aria-hidden="true" />
              </button>
            </div>
          )}

          {screen === "finished" && (
            <div className="baseball-finish-card">
              <Trophy aria-hidden="true" />
              <span>FINAL SCORE</span>
              <h2>{winnerText}</h2>
              <div className="baseball-final-scores">
                {game.teams.map((team) => (
                  <div key={team.name}><small>{team.name}</small><strong>{team.runs}</strong><em>{team.hits}안타</em></div>
                ))}
              </div>
              <div className="baseball-finish-actions">
                <button type="button" onClick={() => {
                  if (mode === "solo") startGame("solo");
                  else if (onlineRoomRef.current) navigate(`/games/baseball/rooms/${onlineRoomRef.current.id}`);
                }}><RotateCcw aria-hidden="true" /> {mode === "solo" ? "다시 경기" : "게임방으로"}</button>
                <button type="button" onClick={() => {
                  if (mode === "versus" && onlineRoomRef.current && currentUser) {
                    baseballRoomStorage.leaveRoom(onlineRoomRef.current, currentUser.id);
                    navigate("/games/baseball/rooms");
                    return;
                  }
                  setOnlineMatchId("");
                  setOnlineSeat(null);
                  setScreen("menu");
                }}>모드 선택</button>
              </div>
            </div>
          )}
        </div>

        {screen === "playing" && !halfTransition && (game.status === "playing" || feedback) && (
          <div className="baseball-controls">
            <div className="baseball-control-copy">
              {actionMode === "batting" ? <Crosshair aria-hidden="true" /> : <Shield aria-hidden="true" />}
              <div>
                <span>{actionMode === "batting" ? "ZONE HITTING" : "PULSE PITCHING"}</span>
                <strong>
                  {!canControl
                    ? opponentConnected ? "상대 공격이 끝날 때까지 기다리세요." : "상대가 다시 연결될 때까지 기다리세요."
                    : actionMode === "batting"
                    ? "중앙 홈플레이트 위에서 커서를 공에 맞추세요."
                    : "구종과 위치를 고르고 원이 작을 때 투구하세요."}
                </strong>
              </div>
            </div>

            {actionMode === "pitching" && !feedback && (
              <div className="baseball-pitch-selector">
                <div className="baseball-pitch-buttons">
                  {PITCH_TYPES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={selectedPitchId === item.id ? "is-selected" : ""}
                      style={{ "--selector-color": item.color } as CSSProperties}
                      onClick={() => setSelectedPitchId(item.id)}
                      disabled={pitchPhase !== "aiming"}
                    >
                      <span>{item.name}</span><small>{item.speed[0]}~{item.speed[1]}</small>
                    </button>
                  ))}
                </div>
                <div className="baseball-pulse-meter" aria-hidden="true"><i /></div>
              </div>
            )}

            {feedback ? (
              <button type="button" className="baseball-next-button" onClick={advanceAfterPlay} disabled={!canControl}>
                {lastTransition?.gameEnded ? "최종 결과" : lastTransition?.halfEnded ? "공수 교대" : "다음 공"}
                <ChevronRight aria-hidden="true" />
              </button>
            ) : actionMode === "batting" ? (
              <button type="button" className="baseball-swing-button" onClick={handleSwing} disabled={!canControl || pitchPhase !== "flight"}>
                <span>{pitchPhase === "flight" ? "SPACE" : "WAIT"}</span>
                <strong>{pitchPhase === "flight" ? "SWING!" : "투구 대기"}</strong>
              </button>
            ) : (
              <button type="button" className="baseball-pitch-button" onClick={handleDefensePitch} disabled={!canControl || pitchPhase !== "aiming"}>
                <span>SPACE</span><strong>{pitchPhase === "aiming" ? "투구!" : "투구 중"}</strong>
              </button>
            )}
          </div>
        )}

        <div className="baseball-bottom-panels">
          <div className="baseball-rule-summary">
            <strong>경기 규칙</strong>
            <span>3회제 · 4볼 볼넷 · 3스트라이크 삼진 · 3아웃 공수교대 · 동점 연장</span>
          </div>
          <div className="baseball-event-log">
            <strong>PLAY LOG</strong>
            {eventLog.length ? eventLog.slice(0, 3).map((item, index) => <span key={`${item}-${index}`}>{item}</span>) : <span>첫 투구를 준비하세요.</span>}
          </div>
        </div>
      </section>
    </div>
  );
}
