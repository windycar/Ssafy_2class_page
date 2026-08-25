import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  BASEBALL_GAME_INTRO_DURATION_MS,
  baseballGameIntroPhaseV2,
  baseballHalfInningPhaseV2,
  createBaseballGameIntroModelV2,
  createBaseballHalfInningModelV2,
  createBaseballPlayerIntroModelV2,
  type BaseballGameIntroPhaseV2,
} from "../../../../utils/games/baseball/presentationSequences.ts";
import type { BaseballGameState } from "../../../../utils/games/baseball/types.ts";
import "../../../../styles/baseball-presentation-sequences-v2.css";

type SequenceStyle = CSSProperties & {
  "--bbv2-sequence-progress"?: number;
  "--bbv2-sequence-duration"?: string;
};

const GAME_INTRO_PHASES: readonly BaseballGameIntroPhaseV2[] = [
  "MATCH_INTRO",
  "STADIUM",
  "MATCHUP",
  "STARTERS",
  "LINEUP",
  "PLAY_BALL",
  "FIRST_BATTER",
];

const GAME_INTRO_PHASE_START = [0, 0.14, 0.30, 0.44, 0.58, 0.76, 0.90] as const;

export interface BaseballGameIntroSequenceV2Props {
  game: BaseballGameState;
  backgroundSrc: string;
  modeLabel: string;
  onComplete: () => void;
  durationMs?: number;
}

export function BaseballGameIntroSequenceV2({
  game,
  backgroundSrc,
  modeLabel,
  onComplete,
  durationMs = BASEBALL_GAME_INTRO_DURATION_MS,
}: BaseballGameIntroSequenceV2Props) {
  const model = useMemo(() => createBaseballGameIntroModelV2(game), [game]);
  const [phase, setPhase] = useState<BaseballGameIntroPhaseV2>("MATCH_INTRO");
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    setPhase("MATCH_INTRO");
    const timers = GAME_INTRO_PHASES.slice(1).map((nextPhase, index) => window.setTimeout(
      () => setPhase(nextPhase),
      Math.round(durationMs * GAME_INTRO_PHASE_START[index + 1]),
    ));
    timers.push(window.setTimeout(() => completeRef.current(), durationMs));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [durationMs, game.seed]);

  const style: SequenceStyle = {
    "--bbv2-sequence-duration": `${durationMs}ms`,
  };
  const phaseCopy = phase === "MATCH_INTRO"
    ? { eyebrow: `${modeLabel} · MATCH INTRO`, title: "오늘의 경기", detail: "3이닝 승부 · 동점 시 연장" }
    : phase === "STADIUM"
      ? { eyebrow: "STADIUM WIDE", title: "광주 2반 야구장", detail: "선수들이 그라운드에 들어섭니다." }
      : phase === "MATCHUP"
        ? { eyebrow: "MATCHUP", title: model.matchup, detail: `${model.teams[0]} · ${model.teams[1]}` }
        : phase === "STARTERS"
          ? { eyebrow: "STARTING PITCHERS", title: `${model.starters[0].name} VS ${model.starters[1].name}`, detail: `#${model.starters[0].number} · #${model.starters[1].number}` }
          : phase === "LINEUP"
            ? { eyebrow: "LINEUP", title: model.lineupNames[0].slice(0, 3).join(" · "), detail: model.lineupNames[1].slice(0, 3).join(" · ") }
            : phase === "PLAY_BALL"
              ? { eyebrow: "GAME READY", title: "PLAY BALL!", detail: "첫 투구를 준비합니다." }
              : { eyebrow: "FIRST BATTER", title: `#${model.firstBatter.number} ${model.firstBatter.name}`, detail: `${model.firstBatter.position} · CON ${model.firstBatter.contact} · PWR ${model.firstBatter.power}` };

  return (
    <section
      className="bbv2-presentation-sequence bbv2-presentation-sequence--game-intro"
      data-phase={phase}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label="경기 시작 프레젠테이션"
    >
      <img src={backgroundSrc} alt="경기 시작 야구장 전경" draggable={false} />
      <div className="bbv2-presentation-sequence__shade" />
      <div className="bbv2-presentation-sequence__copy" key={phase}>
        <span>{phaseCopy.eyebrow}</span>
        <h2>{phaseCopy.title}</h2>
        <p>{phaseCopy.detail}</p>
      </div>
      <i className="bbv2-presentation-sequence__timeline" aria-hidden="true" />
      <button type="button" aria-keyshortcuts="Space" onClick={onComplete}>
        <kbd>SPACE</kbd> 시작 연출 건너뛰기
      </button>
    </section>
  );
}

export interface BaseballPlayerIntroSequenceV2Props {
  game: BaseballGameState;
  eventProgress: number;
  onSkip?: () => void;
}

export function BaseballPlayerIntroSequenceV2({
  game,
  eventProgress,
  onSkip,
}: BaseballPlayerIntroSequenceV2Props) {
  const model = createBaseballPlayerIntroModelV2(game);
  const style: SequenceStyle = {
    "--bbv2-sequence-progress": Math.min(1, Math.max(0, eventProgress)),
  };

  return (
    <aside
      className={`bbv2-presentation-sequence bbv2-presentation-sequence--player is-team-${model.teamIndex}`}
      data-player-id={model.player.id}
      style={style}
      role="status"
      aria-live="polite"
    >
      <div className="bbv2-player-intro__jersey" aria-hidden="true">
        <small>{model.teamShortName}</small>
        <strong>{model.player.number}</strong>
      </div>
      <div className="bbv2-player-intro__copy">
        <span>NEXT BATTER · {model.player.position}</span>
        <h2>{model.player.name}</h2>
        <dl>
          <div><dt>CONTACT</dt><dd>{model.player.contact}</dd></div>
          <div><dt>POWER</dt><dd>{model.player.power}</dd></div>
          <div><dt>SPEED</dt><dd>{model.player.speed}</dd></div>
        </dl>
        <p><b>TODAY</b>{model.today}</p>
      </div>
      {onSkip ? (
        <button type="button" aria-keyshortcuts="Space" onClick={onSkip}>
          <kbd>SPACE</kbd> 선수 소개 건너뛰기
        </button>
      ) : null}
    </aside>
  );
}

export interface BaseballHalfInningSequenceV2Props {
  game: BaseballGameState;
  eventProgress: number;
  backgroundSrc: string;
  onSkip?: () => void;
}

export function BaseballHalfInningSequenceV2({
  game,
  eventProgress,
  backgroundSrc,
  onSkip,
}: BaseballHalfInningSequenceV2Props) {
  const model = createBaseballHalfInningModelV2(game);
  const phase = baseballHalfInningPhaseV2(eventProgress);
  const style: SequenceStyle = {
    "--bbv2-sequence-progress": Math.min(1, Math.max(0, eventProgress)),
  };
  const halfLabel = `${model.completedInning}회${model.completedHalf === "top" ? "초" : "말"}`;

  return (
    <aside
      className="bbv2-presentation-sequence bbv2-presentation-sequence--half"
      data-phase={phase}
      style={style}
      role="status"
      aria-live="assertive"
    >
      <img src={backgroundSrc} alt="공수교대 야구장 전경" draggable={false} />
      <div className="bbv2-presentation-sequence__shade" />
      <div className="bbv2-half-sequence__copy" key={phase}>
        {phase === "THREE_OUT" ? <><span>{halfLabel}</span><h2>3 OUT</h2><p>세 번째 아웃이 확정됐습니다.</p></> : null}
        {phase === "INNING_COMPLETE" ? <><span>{halfLabel}</span><h2>INNING COMPLETE</h2><p>공수교대를 시작합니다.</p></> : null}
        {phase === "LINE_SCORE" ? (
          <>
            <span>LINE SCORE</span>
            <h2>{model.score[0]} <i>:</i> {model.score[1]}</h2>
            <div className="bbv2-half-sequence__linescore">
              {model.inningRuns.map((runs, teamIndex) => (
                <p key={teamIndex}>
                  <b>{game.teams[teamIndex].shortName}</b>
                  {runs.map((run, inningIndex) => <span key={inningIndex}>{run ?? "-"}</span>)}
                  <strong>{model.score[teamIndex]}</strong>
                </p>
              ))}
            </div>
          </>
        ) : null}
        {phase === "WIDE_SHOT" ? <><span>CHANGE SIDES</span><h2>그라운드 정비</h2><p>다음 공격을 준비합니다.</p></> : null}
        {phase === "NEXT_ATTACK" ? <><span>NEXT</span><h2>{model.nextBattingTeamShortName} ATTACK</h2><p>{model.nextBattingTeamName} 공격</p></> : null}
      </div>
      <i className="bbv2-presentation-sequence__event-progress" aria-hidden="true" />
      {onSkip ? (
        <button type="button" aria-keyshortcuts="Space" onClick={onSkip}>
          <kbd>SPACE</kbd> 공수교대 연출 건너뛰기
        </button>
      ) : null}
    </aside>
  );
}

export { baseballGameIntroPhaseV2 };

export default BaseballGameIntroSequenceV2;
