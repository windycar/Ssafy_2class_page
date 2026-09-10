import type {
  BaseballPlayer,
  BaseballPlayResultCode,
  InningHalf,
} from "../../../../utils/games/baseballEngine";
import { BaseballOverlayFrameV2 } from "./BaseballOverlayFrameV2.tsx";

export { BaseballFinalOverlayV2 } from "./BaseballFinalOverlayV2.tsx";
export type { BaseballFinalOverlayV2Props } from "./BaseballFinalOverlayV2.tsx";

export interface BaseballOverlayPlayerAssetV2 {
  playerId: string;
  src: string;
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
    <BaseballOverlayFrameV2 kind="intro" label="타석 시작 안내" backgroundSrc={backgroundSrc} modal>
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
    </BaseballOverlayFrameV2>
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
    <BaseballOverlayFrameV2
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
    </BaseballOverlayFrameV2>
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
    <BaseballOverlayFrameV2 kind="half" label="공수교대" backgroundSrc={backgroundSrc} modal>
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
    </BaseballOverlayFrameV2>
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
    <BaseballOverlayFrameV2 kind="waiting" label="온라인 경기 대기" backgroundSrc={backgroundSrc} modal live="polite">
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
    </BaseballOverlayFrameV2>
  );
}
