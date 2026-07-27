import type { BangRoom, BangWinner } from "../../types/bang";

const ROLE_LABEL: Record<string, string> = {
  sheriff: "보안관",
  deputy: "부관",
  outlaw: "무법자",
  renegade: "배신자",
};

const WINNER_LABEL: Record<BangWinner, string> = {
  sheriff_deputy: "보안관·부관",
  outlaw: "무법자",
  renegade: "배신자",
  draw: "무승부",
  cancelled: "게임 중단",
};

export function formatBangResult(room: BangRoom): string {
  const mvp = room.players.find((p) => p.studentId === room.mvpStudentId);
  const duration = room.startedAt && room.finishedAt
    ? Math.round((new Date(room.finishedAt).getTime() - new Date(room.startedAt).getTime()) / 60000)
    : null;

  const lines = [
    `[SSAFY 광주 2반 뱅! 결과]`,
    ``,
    `게임방: ${room.title}`,
    `참여 인원: ${room.players.length}명`,
    `승리 진영: ${room.winner ? WINNER_LABEL[room.winner] : "-"}`,
    ...(mvp ? [`MVP: ${mvp.name}`] : []),
    ...(duration !== null ? [`진행 시간: ${duration}분`] : []),
    ``,
    `참가자`,
    ...room.players.map(
      (p) => `- ${p.name}: ${p.role ? ROLE_LABEL[p.role] : "미배정"}`,
    ),
    ...(room.review ? [``, `한 줄 후기: ${room.review}`] : []),
  ];
  return lines.join("\n");
}

export { ROLE_LABEL, WINNER_LABEL };

