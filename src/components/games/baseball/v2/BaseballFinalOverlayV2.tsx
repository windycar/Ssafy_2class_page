import type { CSSProperties } from "react";

import type { BaseballGameState } from "../../../../utils/games/baseballEngine.ts";
import {
  createBaseballFinalResult,
  shouldRenderCancelledBaseballFinal,
  type BaseballFinalLineScore,
  type BaseballFinalMvp,
} from "../../../../utils/games/baseball/finalResult.ts";
import { BaseballOverlayFrameV2 } from "./BaseballOverlayFrameV2.tsx";
import "../../../../styles/baseball-final-result-v2.css";

export interface BaseballFinalOverlayV2Props {
  game: BaseballGameState;
  title?: string;
  summary?: string;
  backgroundSrc?: string;
  playerPortraits?: Readonly<Partial<Record<string, string>>>;
  cancelled?: boolean;
  onRematch?: () => void;
  onExit: () => void;
}

function teamColorStyle(themeColor: string, accentColor: string): CSSProperties {
  return {
    "--bbv2-result-team": themeColor,
    "--bbv2-result-accent": accentColor,
  } as CSSProperties;
}

function FinalScoreV2({ game }: { game: BaseballGameState }) {
  return (
    <div className="bbv2-final-hero-score" aria-label="최종 점수">
      {game.teams.map((team, teamIndex) => (
        <div
          className={game.winner === teamIndex ? "is-winner" : undefined}
          style={teamColorStyle(team.themeColor, team.accentColor)}
          key={team.id}
        >
          <small>{team.shortName}</small>
          <strong>{team.runs}</strong>
          <em>{game.winner === teamIndex ? "WINNER" : "FINAL"}</em>
        </div>
      ))}
      <span aria-hidden="true">:</span>
    </div>
  );
}

function FinalLineScoreV2({ lineScore }: { lineScore: BaseballFinalLineScore }) {
  return (
    <div className="bbv2-final-linescore" tabIndex={0} role="region" aria-label="최종 라인스코어 표">
      <table>
        <caption>최종 라인스코어</caption>
        <thead>
          <tr>
            <th scope="col">팀</th>
            {lineScore.innings.map((inning) => (
              <th scope="col" key={`final-inning-${inning}`}>{inning}</th>
            ))}
            <th scope="col">R</th>
            <th scope="col">H</th>
            <th scope="col">E</th>
          </tr>
        </thead>
        <tbody>
          {lineScore.rows.map((row) => (
            <tr className={row.isWinner ? "is-winner" : undefined} key={row.teamId}>
              <th scope="row" style={teamColorStyle(row.themeColor, row.accentColor)}>
                <i aria-hidden="true" />
                {row.shortName}
              </th>
              {row.innings.map((runs, inningIndex) => (
                <td key={`${row.teamId}-final-${inningIndex + 1}`}>
                  {runs === null ? "–" : runs}
                </td>
              ))}
              <td className="is-total">{row.runs}</td>
              <td className="is-total">{row.hits}</td>
              <td className="is-total">{row.errors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MvpPortraitV2({ mvp, src }: { mvp: BaseballFinalMvp; src?: string }) {
  if (src) {
    return (
      <img
        className="bbv2-final-mvp__portrait"
        src={src}
        alt={`${mvp.name} MVP 선수`}
        draggable={false}
      />
    );
  }

  return (
    <div
      className="bbv2-final-mvp__portrait bbv2-final-mvp__portrait--character"
      style={teamColorStyle(mvp.themeColor, mvp.accentColor)}
      role="img"
      aria-label={`${mvp.name} MVP 캐릭터 초상`}
    >
      <span className="bbv2-final-mvp__cap" aria-hidden="true" />
      <span className="bbv2-final-mvp__face" aria-hidden="true" />
      <span className="bbv2-final-mvp__body" aria-hidden="true" />
      <strong aria-hidden="true">{mvp.number}</strong>
    </div>
  );
}

function FinalActionsV2({
  onRematch,
  onExit,
}: Pick<BaseballFinalOverlayV2Props, "onRematch" | "onExit">) {
  return (
    <div className="bbv2-overlay__actions">
      {onRematch ? (
        <button type="button" onClick={onRematch}>다시 경기</button>
      ) : null}
      <button type="button" onClick={onExit}>나가기</button>
    </div>
  );
}

function CancelledResultV2({
  game,
  title,
  summary,
  backgroundSrc,
  onRematch,
  onExit,
}: Required<Pick<BaseballFinalOverlayV2Props, "game" | "title" | "summary" | "onExit">>
  & Pick<BaseballFinalOverlayV2Props, "backgroundSrc" | "onRematch">) {
  return (
    <BaseballOverlayFrameV2
      kind="final"
      label={title}
      backgroundSrc={backgroundSrc}
      modal
      live="assertive"
    >
      <span className="bbv2-overlay__eyebrow">GAME CLOSED</span>
      <h2>{title}</h2>
      <p>{summary}</p>
      <div className="bbv2-final-score" aria-label="중단 시점 점수">
        {game.teams.map((team) => (
          <div key={team.id}>
            <small>{team.shortName}</small>
            <strong>{team.runs}</strong>
            <em />
          </div>
        ))}
      </div>
      <FinalActionsV2 onRematch={onRematch} onExit={onExit} />
    </BaseballOverlayFrameV2>
  );
}

export function BaseballFinalOverlayV2({
  game,
  title = "경기 종료",
  summary,
  backgroundSrc,
  playerPortraits,
  cancelled = false,
  onRematch,
  onExit,
}: BaseballFinalOverlayV2Props) {
  const winner = game.winner === null ? null : game.teams[game.winner];
  const finalSummary = summary ?? (winner ? `${winner.name} 승리` : "무승부");

  if (shouldRenderCancelledBaseballFinal(game.status, cancelled)) {
    return (
      <CancelledResultV2
        game={game}
        title={title}
        summary={finalSummary}
        backgroundSrc={backgroundSrc}
        onRematch={onRematch}
        onExit={onExit}
      />
    );
  }

  const result = createBaseballFinalResult(game);
  const portraitSrc = playerPortraits?.[result.mvp.playerId]
    ?? (result.mvp.portraitAssetId ? playerPortraits?.[result.mvp.portraitAssetId] : undefined);

  return (
    <BaseballOverlayFrameV2
      kind="final"
      label="최종 경기 결과"
      backgroundSrc={backgroundSrc}
      modal
      live="polite"
      className="bbv2-final-result"
    >
      <header className="bbv2-final-result__header">
        <span className="bbv2-overlay__eyebrow">FINAL</span>
        <h2>{title}</h2>
        <p>{finalSummary}</p>
        <FinalScoreV2 game={game} />
      </header>

      <FinalLineScoreV2 lineScore={result.lineScore} />

      <div className="bbv2-final-result__details">
        <section
          className="bbv2-final-mvp"
          style={teamColorStyle(result.mvp.themeColor, result.mvp.accentColor)}
          aria-label={`MVP ${result.mvp.name}`}
        >
          <span className="bbv2-final-section-label">MVP</span>
          <div className="bbv2-final-mvp__content">
            <MvpPortraitV2 mvp={result.mvp} src={portraitSrc} />
            <div className="bbv2-final-mvp__copy">
              <small>{result.mvp.teamShortName} · {result.mvp.position}</small>
              <h3>{result.mvp.name}</h3>
              <strong>{result.mvp.primaryStatLine}</strong>
              <p>{result.mvp.secondaryStatLine}</p>
            </div>
          </div>
        </section>

        <section className="bbv2-final-highlights" aria-label="경기 주요 장면">
          <span className="bbv2-final-section-label">GAME HIGHLIGHTS</span>
          <ol>
            {result.highlights.map((highlight, index) => (
              <li key={highlight.id}>
                <span aria-hidden="true">{index + 1}</span>
                <div>
                  <small>{highlight.inningLabel}</small>
                  <strong>{highlight.title}</strong>
                  <p>{highlight.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <FinalActionsV2 onRematch={onRematch} onExit={onExit} />
    </BaseballOverlayFrameV2>
  );
}
