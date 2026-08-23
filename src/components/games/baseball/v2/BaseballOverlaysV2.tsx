import type { ReactNode } from "react";

import type {
  BaseballGameState,
  BaseballPlayer,
  BaseballPlayResultCode,
  InningHalf,
} from "../../../../utils/games/baseballEngine";

export interface BaseballOverlayPlayerAssetV2 {
  playerId: string;
  src: string;
}

interface OverlayFrameV2Props {
  kind: "intro" | "event" | "half" | "final" | "waiting";
  label: string;
  children: ReactNode;
  backgroundSrc?: string;
  modal?: boolean;
  live?: "polite" | "assertive";
  className?: string;
}

export interface BaseballIntroOverlayV2Props {
  eyebrow?: string;
  title: string;
  description: string;
  batter: BaseballPlayer;
  pitcher: BaseballPlayer;
  batterPortraitSrc?: string;
  pitcherPortraitSrc?: string;
  backgroundSrc?: string;
  primaryLabel?: string;
  disabled?: boolean;
  onContinue: () => void;
}

export type BaseballEventToneV2 = "neutral" | "strike" | "out" | "hit" | "score" | "home-run";

export interface BaseballEventOverlayV2Props {
  resultCode?: BaseballPlayResultCode;
  kicker?: string;
  title: string;
  detail?: string;
  tone?: BaseballEventToneV2;
  imageSrc?: string;
  imageAlt?: string;
  primaryLabel?: string;
  primaryEnabled?: boolean;
  onPrimaryAction?: () => void;
}

export interface BaseballHalfInningOverlayV2Props {
  inning: number;
  half: InningHalf;
  battingTeamName: string;
  scoreLabel: string;
  backgroundSrc?: string;
  disabled?: boolean;
  onContinue: () => void;
}

export interface BaseballFinalOverlayV2Props {
  game: BaseballGameState;
  title?: string;
  summary?: string;
  backgroundSrc?: string;
  onRematch?: () => void;
  onExit: () => void;
}

export interface BaseballOnlineParticipantV2 {
  id: string;
  name: string;
  seatLabel: string;
  connected: boolean;
}

export interface BaseballOnlineWaitingOverlayV2Props {
  title?: string;
  message: string;
  participants?: readonly BaseballOnlineParticipantV2[];
  backgroundSrc?: string;
  canCancel?: boolean;
  onCancel?: () => void;
}

const EMPTY_PARTICIPANTS: readonly BaseballOnlineParticipantV2[] = [];

function joinClassNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

function OverlayFrameV2({
  kind,
  label,
  children,
  backgroundSrc,
  modal = false,
  live,
  className,
}: OverlayFrameV2Props) {
  return (
    <section
      className={joinClassNames("bbv2-overlay", `bbv2-overlay--${kind}`, className)}
      role={modal ? "dialog" : "status"}
      aria-modal={modal ? true : undefined}
      aria-label={label}
      aria-live={live}
    >
      {backgroundSrc ? (
        <img className="bbv2-overlay__background" src={backgroundSrc} alt="" draggable={false} />
      ) : null}
      <div className="bbv2-overlay__shade" aria-hidden="true" />
      <div className="bbv2-overlay__content">{children}</div>
    </section>
  );
}

function OverlayPortraitV2({
  player,
  src,
  role,
}: {
  player: BaseballPlayer;
  src?: string;
  role: string;
}) {
  return (
    <div className="bbv2-overlay-player">
      <div className="bbv2-overlay-player__portrait">
        {src ? (
          <img src={src} alt={`${player.name} 선수`} draggable={false} />
        ) : (
          <span aria-hidden="true">{player.number}</span>
        )}
      </div>
      <small>{role}</small>
      <strong>{player.name}</strong>
      <em>#{player.number} · {player.position}</em>
    </div>
  );
}

export function BaseballIntroOverlayV2({
  eyebrow = "MATCH UP",
  title,
  description,
  batter,
  pitcher,
  batterPortraitSrc,
  pitcherPortraitSrc,
  backgroundSrc,
  primaryLabel = "플레이 시작",
  disabled = false,
  onContinue,
}: BaseballIntroOverlayV2Props) {
  return (
    <OverlayFrameV2 kind="intro" label="타석 시작 안내" backgroundSrc={backgroundSrc} modal>
      <span className="bbv2-overlay__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="bbv2-overlay-matchup" aria-label={`${batter.name} 대 ${pitcher.name}`}>
        <OverlayPortraitV2 player={batter} src={batterPortraitSrc} role="BATTER" />
        <strong className="bbv2-overlay-matchup__versus" aria-hidden="true">VS</strong>
        <OverlayPortraitV2 player={pitcher} src={pitcherPortraitSrc} role="PITCHER" />
      </div>
      <button
        className="bbv2-overlay__primary"
        type="button"
        aria-keyshortcuts="Space"
        disabled={disabled}
        onClick={onContinue}
      >
        <span>SPACE</span>
        {primaryLabel}
      </button>
    </OverlayFrameV2>
  );
}

export function BaseballEventOverlayV2({
  resultCode,
  kicker = "PLAY RESULT",
  title,
  detail,
  tone = "neutral",
  imageSrc,
  imageAlt = "",
  primaryLabel,
  primaryEnabled = true,
  onPrimaryAction,
}: BaseballEventOverlayV2Props) {
  return (
    <OverlayFrameV2
      kind="event"
      label={`플레이 결과: ${title}`}
      className={`is-${tone}`}
      live="assertive"
    >
      {imageSrc ? (
        <img className="bbv2-event-image" src={imageSrc} alt={imageAlt} draggable={false} />
      ) : null}
      <span className="bbv2-overlay__eyebrow">{kicker}</span>
      <h2>{title}</h2>
      {detail ? <p>{detail}</p> : null}
      {resultCode ? <code className="bbv2-event-code">{resultCode}</code> : null}
      {primaryLabel && onPrimaryAction ? (
        <button
          className="bbv2-overlay__primary"
          type="button"
          aria-keyshortcuts="Space"
          disabled={!primaryEnabled}
          onClick={onPrimaryAction}
        >
          <span>SPACE</span>
          {primaryLabel}
        </button>
      ) : null}
    </OverlayFrameV2>
  );
}

export function BaseballHalfInningOverlayV2({
  inning,
  half,
  battingTeamName,
  scoreLabel,
  backgroundSrc,
  disabled = false,
  onContinue,
}: BaseballHalfInningOverlayV2Props) {
  const halfLabel = half === "top" ? "초" : "말";
  return (
    <OverlayFrameV2 kind="half" label="공수교대" backgroundSrc={backgroundSrc} modal>
      <span className="bbv2-overlay__eyebrow">CHANGE SIDES</span>
      <div className="bbv2-half-icon" aria-hidden="true">⇄</div>
      <h2>{inning}회{halfLabel}</h2>
      <p><strong>{battingTeamName}</strong> 공격으로 전환합니다.</p>
      <div className="bbv2-half-score">{scoreLabel}</div>
      <button
        className="bbv2-overlay__primary"
        type="button"
        aria-keyshortcuts="Space"
        disabled={disabled}
        onClick={onContinue}
      >
        <span>SPACE</span>
        다음 이닝
      </button>
    </OverlayFrameV2>
  );
}

export function BaseballFinalOverlayV2({
  game,
  title = "경기 종료",
  summary,
  backgroundSrc,
  onRematch,
  onExit,
}: BaseballFinalOverlayV2Props) {
  const winner = game.winner === null ? null : game.teams[game.winner];
  const finalSummary = summary
    ?? (winner ? `${winner.name} 승리` : "무승부");

  return (
    <OverlayFrameV2 kind="final" label="최종 경기 결과" backgroundSrc={backgroundSrc} modal>
      <span className="bbv2-overlay__eyebrow">FINAL</span>
      <h2>{title}</h2>
      <p>{finalSummary}</p>
      <div className="bbv2-final-score" aria-label="최종 점수">
        {game.teams.map((team, teamIndex) => (
          <div className={game.winner === teamIndex ? "is-winner" : undefined} key={team.id}>
            <small>{team.shortName}</small>
            <strong>{team.runs}</strong>
            <em>{game.winner === teamIndex ? "WIN" : ""}</em>
          </div>
        ))}
      </div>
      <div className="bbv2-overlay__actions">
        {onRematch ? (
          <button type="button" onClick={onRematch}>다시 경기</button>
        ) : null}
        <button type="button" onClick={onExit}>나가기</button>
      </div>
    </OverlayFrameV2>
  );
}

export function BaseballOnlineWaitingOverlayV2({
  title = "상대를 기다리는 중",
  message,
  participants = EMPTY_PARTICIPANTS,
  backgroundSrc,
  canCancel = false,
  onCancel,
}: BaseballOnlineWaitingOverlayV2Props) {
  return (
    <OverlayFrameV2 kind="waiting" label="온라인 경기 대기" backgroundSrc={backgroundSrc} modal live="polite">
      <span className="bbv2-overlay__eyebrow">ONLINE ROOM</span>
      <div className="bbv2-waiting-ball" aria-hidden="true"><i /></div>
      <h2>{title}</h2>
      <p>{message}</p>
      {participants.length > 0 ? (
        <ul className="bbv2-participants" aria-label="참가자 연결 상태">
          {participants.map((participant) => (
            <li key={participant.id}>
              <span className={participant.connected ? "is-connected" : undefined} aria-hidden="true" />
              <strong>{participant.name}</strong>
              <em>{participant.seatLabel}</em>
              <small>{participant.connected ? "접속" : "연결 대기"}</small>
            </li>
          ))}
        </ul>
      ) : null}
      {canCancel && onCancel ? (
        <button className="bbv2-overlay__secondary" type="button" onClick={onCancel}>대기 취소</button>
      ) : null}
    </OverlayFrameV2>
  );
}
