import type { CSSProperties } from "react";

import "../../../../styles/baseball-hud-situations-v2.css";
import { selectBaseballHudSituationV2 } from "../../../../utils/games/baseball/hudSituation.ts";
import {
  getCurrentBatter,
  getCurrentPitcher,
  getNextBatters,
  type BaseNumber,
  type BaseballGameState,
  type BaseballPlayer,
  type BaseRunner,
  type TeamIndex,
} from "../../../../utils/games/baseballEngine";
import type { PlayByPlayEntry } from "../../../../utils/games/baseball/types.ts";

export interface BaseballHudAssetsV2 {
  playerPortraits?: Readonly<Partial<Record<string, string>>>;
  teamMarks?: Readonly<Partial<Record<string, string>>>;
}

export interface BaseballHudV2Props {
  game: BaseballGameState;
  assets?: BaseballHudAssetsV2;
  className?: string;
}

const BASE_LABELS: Readonly<Record<BaseNumber, string>> = {
  1: "1루",
  2: "2루",
  3: "3루",
};

function joinClassNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

function teamColorStyle(themeColor: string): CSSProperties {
  return { "--bbv2-team-color": themeColor } as CSSProperties;
}

function PlayerPortraitV2({
  player,
  src,
}: {
  player: BaseballPlayer;
  src?: string;
}) {
  if (src) {
    return (
      <img
        className="bbv2-player-portrait"
        src={src}
        alt={`${player.name} 선수`}
        draggable={false}
      />
    );
  }

  return (
    <span className="bbv2-player-portrait bbv2-player-portrait--fallback" aria-hidden="true">
      {player.number}
    </span>
  );
}

function CountLampV2({
  label,
  value,
  maximum,
  tone,
}: {
  label: string;
  value: number;
  maximum: number;
  tone: "ball" | "strike" | "out";
}) {
  return (
    <div className="bbv2-count-row" aria-label={`${label} ${value}`}>
      <span>{label}</span>
      <div className="bbv2-count-lamps" aria-hidden="true">
        {Array.from({ length: maximum }, (_, index) => (
          <i
            className={joinClassNames(
              `bbv2-count-lamp bbv2-count-lamp--${tone}`,
              index < value ? "is-on" : undefined,
            )}
            key={`${tone}-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

function BaseRunnerCardV2({
  base,
  runner,
}: {
  base: BaseNumber;
  runner: BaseRunner | null;
}) {
  const label = BASE_LABELS[base];
  const accessibleLabel = runner
    ? `${label} 주자 ${runner.name}, 주력 ${runner.speed}`
    : `${label} 주자 없음`;

  return (
    <div
      className={joinClassNames(
        "bbv2-base-runner",
        `bbv2-base-runner--${base}`,
        runner ? "is-occupied" : undefined,
      )}
      aria-label={accessibleLabel}
    >
      <span className="bbv2-base-runner__bag" aria-hidden="true" />
      <span className="bbv2-base-runner__copy">
        <small>{label}</small>
        <strong>{runner?.name ?? "비어 있음"}</strong>
        <em>{runner ? `주력 ${runner.speed}` : "—"}</em>
      </span>
    </div>
  );
}

function PlayerSummaryV2({
  player,
  portrait,
  role,
  detail,
}: {
  player: BaseballPlayer;
  portrait?: string;
  role: string;
  detail: string;
}) {
  return (
    <div className="bbv2-player-summary">
      <PlayerPortraitV2 player={player} src={portrait} />
      <div>
        <small>{role}</small>
        <strong>
          <span>#{player.number}</span> {player.name}
        </strong>
        <em>{detail}</em>
      </div>
    </div>
  );
}

function LinescoreV2({
  game,
  innings,
  assets,
}: {
  game: BaseballGameState;
  innings: number[];
  assets?: BaseballHudAssetsV2;
}) {
  return (
    <div className="bbv2-linescore" aria-label="라인스코어">
      <table>
        <thead>
          <tr>
            <th scope="col">팀</th>
            {innings.map((inning) => (
              <th scope="col" key={`inning-${inning}`}>{inning}</th>
            ))}
            <th scope="col">R</th>
            <th scope="col">H</th>
            <th scope="col">E</th>
          </tr>
        </thead>
        <tbody>
          {game.teams.map((team, teamIndex) => {
            const index = teamIndex as TeamIndex;
            const isBatting = game.status === "playing" && game.battingTeam === index;
            const markSrc = assets?.teamMarks?.[team.id] ?? assets?.teamMarks?.[team.rosterId];

            return (
              <tr className={isBatting ? "is-batting" : undefined} key={team.id}>
                <th scope="row" style={teamColorStyle(team.themeColor)}>
                  {markSrc ? <img src={markSrc} alt="" draggable={false} /> : null}
                  <span>{team.shortName}</span>
                </th>
                {innings.map((inning) => {
                  const score = team.inningRuns[inning - 1];
                  const hasStarted = score !== undefined;
                  return <td key={`${team.id}-${inning}`}>{hasStarted ? score : "–"}</td>;
                })}
                <td className="bbv2-linescore__total">{team.runs}</td>
                <td className="bbv2-linescore__total">{team.hits}</td>
                <td className="bbv2-linescore__total">{team.errors}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function inningLabel(entry: PlayByPlayEntry) {
  return `${entry.inning}회${entry.half === "top" ? "초" : "말"}`;
}

function PlayByPlayRowV2({
  entry,
  teamName,
}: {
  entry: PlayByPlayEntry;
  teamName: string;
}) {
  return (
    <li>
      <span>
        {inningLabel(entry)} · {teamName}
      </span>
      <p>{entry.message}</p>
    </li>
  );
}

function BaseballPlayByPlayPanelV2({ game }: { game: BaseballGameState }) {
  const recent = game.playByPlay.slice(-3).reverse();
  const allEntries = [...game.playByPlay].reverse();

  return (
    <section className="bbv2-play-by-play" aria-label="경기 중계">
      <div className="bbv2-play-by-play__bar">
        <strong>PLAY BY PLAY</strong>
        <details>
          <summary aria-label={`전체 중계 ${allEntries.length}개 펼치기`}>
            전체 {allEntries.length}
          </summary>
          <div className="bbv2-play-by-play__full">
            <div className="bbv2-play-by-play__full-heading">
              <strong>PLAY BY PLAY</strong>
              <span>최신 기록부터 표시</span>
            </div>
            {allEntries.length > 0 ? (
              <ol>
                {allEntries.map((entry) => (
                  <PlayByPlayRowV2
                    entry={entry}
                    teamName={game.teams[entry.battingTeam].shortName}
                    key={entry.id}
                  />
                ))}
              </ol>
            ) : (
              <p className="bbv2-play-by-play__empty">첫 투구를 기다리는 중입니다.</p>
            )}
          </div>
        </details>
      </div>

      {recent.length > 0 ? (
        <ol className="bbv2-play-by-play__recent" aria-live="polite">
          {recent.map((entry) => (
            <PlayByPlayRowV2
              entry={entry}
              teamName={game.teams[entry.battingTeam].shortName}
              key={entry.id}
            />
          ))}
        </ol>
      ) : (
        <p className="bbv2-play-by-play__empty">첫 투구를 기다리는 중입니다.</p>
      )}
    </section>
  );
}

export function BaseballHudV2({ game, assets, className }: BaseballHudV2Props) {
  const batter = getCurrentBatter(game);
  const pitcher = getCurrentPitcher(game);
  const nextBatters = getNextBatters(game, 2);
  const battingTeam = game.teams[game.battingTeam];
  const fieldingTeam = game.teams[game.battingTeam === 0 ? 1 : 0];
  const inningCount = Math.max(
    3,
    game.inning,
    game.teams[0].inningRuns.length,
    game.teams[1].inningRuns.length,
  );
  const innings = Array.from({ length: inningCount }, (_, index) => index + 1);
  const halfLabel = game.half === "top" ? "초" : "말";
  const statusLabel = game.status === "finished"
    ? "경기 종료"
    : `${game.inning}회${halfLabel} · ${battingTeam.shortName} 공격`;
  const pitcherState = fieldingTeam.pitcher;
  const portraits = assets?.playerPortraits;
  const situation = selectBaseballHudSituationV2(game);

  return (
    <header
      className={joinClassNames(
        "bbv2-hud",
        `bbv2-hud--tension-${situation.tension}`,
        className,
      )}
      aria-label="야구 경기 현황"
    >
      <LinescoreV2 game={game} innings={innings} assets={assets} />

      <section className="bbv2-hud__situation" aria-label="현재 경기 상황">
        <div className="bbv2-inning-status" aria-live="polite">
          <small>INNING</small>
          <strong>{statusLabel}</strong>
          {situation.visibleBadges.length > 0 ? (
            <div className="bbv2-situation-badges" aria-label="주요 경기 상황">
              {situation.visibleBadges.map((badge) => (
                <span
                  className={`bbv2-situation-badge bbv2-situation-badge--${badge.tone}`}
                  key={badge.id}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="bbv2-count" aria-label={`볼 ${game.count.balls}, 스트라이크 ${game.count.strikes}, 아웃 ${game.count.outs}`}>
          <CountLampV2 label="B" value={game.count.balls} maximum={3} tone="ball" />
          <CountLampV2 label="S" value={game.count.strikes} maximum={2} tone="strike" />
          <CountLampV2
            label="O"
            value={game.count.outs}
            maximum={Math.max(2, game.count.outs)}
            tone="out"
          />
        </div>

        <div className="bbv2-bases" aria-label="루상황">
          <BaseRunnerCardV2 base={2} runner={game.bases.second} />
          <BaseRunnerCardV2 base={3} runner={game.bases.third} />
          <BaseRunnerCardV2 base={1} runner={game.bases.first} />
        </div>
      </section>

      <section className="bbv2-hud__matchup" aria-label="현재 투타 대결">
        <PlayerSummaryV2
          player={batter}
          portrait={portraits?.[batter.id]}
          role="현재 타자"
          detail={`CON ${batter.contact} · PWR ${batter.power} · SPD ${batter.speed}`}
        />
        <PlayerSummaryV2
          player={pitcher}
          portrait={portraits?.[pitcher.id]}
          role="현재 투수"
          detail={`투구 ${pitcherState.pitchCount} · 체력 ${Math.round(pitcherState.stamina)}`}
        />
        <div className="bbv2-next-batters" aria-label="다음 타자">
          <small>NEXT</small>
          <ol>
            {nextBatters.map((player, index) => (
              <li key={player.id}>
                <span>{index + 1}</span>
                <strong>{player.name}</strong>
                <em>#{player.number} · {player.position}</em>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BaseballPlayByPlayPanelV2 game={game} />
    </header>
  );
}
