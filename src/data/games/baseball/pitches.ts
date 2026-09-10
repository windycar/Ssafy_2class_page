import type {
  BaseballPitchType,
  PitchDefinition,
  PitchVisualKind,
} from "../../../utils/games/baseball/types.ts";

export const BASEBALL_PITCH_DEFINITIONS = [
  {
    type: "fourSeam",
    visualKind: "fastball",
    name: "포심 패스트볼",
    shortName: "직구",
    description: "가장 빠르며 타자 앞까지 거의 일직선으로 도달합니다.",
    velocityKmh: [145, 153],
    flightDurationMs: [430, 500],
    controlModifier: 1,
    movementRating: 42,
    spinRateRpm: [2_200, 2_600],
    breakX: 0,
    breakY: -0.015,
    lateBreak: 0.2,
    uiColor: "#ef4444",
  },
  {
    type: "twoSeam",
    visualKind: "twoSeam",
    name: "투심 패스트볼",
    shortName: "투심",
    description: "직구처럼 출발한 뒤 타자 앞에서 투수의 팔 방향으로 작게 흐릅니다.",
    velocityKmh: [140, 149],
    flightDurationMs: [480, 550],
    controlModifier: 0.94,
    movementRating: 72,
    spinRateRpm: [1_900, 2_300],
    breakX: 0.07,
    breakY: 0.025,
    lateBreak: 0.62,
    uiColor: "#f97316",
  },
  {
    type: "slider",
    visualKind: "slider",
    name: "슬라이더",
    shortName: "슬라이더",
    description: "초반에는 직구처럼 보이지만 후반에 빠르고 크게 횡변화합니다.",
    velocityKmh: [132, 141],
    flightDurationMs: [560, 640],
    controlModifier: 0.88,
    movementRating: 88,
    spinRateRpm: [2_300, 2_800],
    breakX: 0.16,
    breakY: 0.045,
    lateBreak: 0.74,
    uiColor: "#a78bfa",
  },
  {
    type: "curve",
    visualKind: "curve",
    name: "커브",
    shortName: "커브",
    description: "높은 포물선으로 출발해 홈플레이트 앞에서 큰 낙폭을 만듭니다.",
    velocityKmh: [119, 128],
    flightDurationMs: [650, 750],
    controlModifier: 0.84,
    movementRating: 94,
    spinRateRpm: [2_500, 3_100],
    breakX: -0.045,
    breakY: 0.22,
    lateBreak: 0.5,
    uiColor: "#60a5fa",
  },
  {
    type: "changeup",
    visualKind: "changeup",
    name: "체인지업",
    shortName: "체인지업",
    description: "직구와 같은 폼으로 출발하지만 속도가 느려 타자의 타이밍을 빼앗습니다.",
    velocityKmh: [113, 122],
    flightDurationMs: [720, 820],
    controlModifier: 0.92,
    movementRating: 76,
    spinRateRpm: [1_500, 1_900],
    breakX: 0.035,
    breakY: 0.085,
    lateBreak: 0.48,
    uiColor: "#34d399",
  },
  {
    type: "fork",
    visualKind: "fork",
    name: "포크볼",
    shortName: "포크",
    description: "홈플레이트 바로 앞까지 버티다가 급격히 아래로 떨어집니다.",
    velocityKmh: [125, 136],
    flightDurationMs: [620, 720],
    controlModifier: 0.76,
    movementRating: 96,
    spinRateRpm: [900, 1_400],
    breakX: 0.008,
    breakY: 0.255,
    lateBreak: 0.86,
    uiColor: "#22d3ee",
  },
  {
    type: "cutter",
    visualKind: "cutter",
    name: "컷 패스트볼",
    shortName: "커터",
    description: "직구에 가까운 속도로 들어오다 마지막에 짧게 반대 방향으로 꺾입니다.",
    velocityKmh: [138, 146],
    flightDurationMs: [490, 570],
    controlModifier: 0.9,
    movementRating: 78,
    spinRateRpm: [2_200, 2_700],
    breakX: -0.075,
    breakY: 0.018,
    lateBreak: 0.78,
    uiColor: "#f59e0b",
  },
] as const satisfies readonly PitchDefinition[];

export const BASEBALL_PITCH_TYPES = BASEBALL_PITCH_DEFINITIONS.map(
  (pitch) => pitch.type,
) as BaseballPitchType[];

export const PITCH_DEFINITION_BY_TYPE: Readonly<Record<BaseballPitchType, PitchDefinition>> =
  Object.freeze(Object.assign(
    Object.create(null) as Record<BaseballPitchType, PitchDefinition>,
    Object.fromEntries(BASEBALL_PITCH_DEFINITIONS.map((pitch) => [pitch.type, pitch])),
  ));

export const PITCH_TYPE_BY_VISUAL_KIND: Readonly<Record<PitchVisualKind, BaseballPitchType>> =
  Object.freeze(Object.assign(Object.create(null) as Record<PitchVisualKind, BaseballPitchType>, {
    fastball: "fourSeam",
    twoSeam: "twoSeam",
    slider: "slider",
    curve: "curve",
    changeup: "changeup",
    fork: "fork",
    cutter: "cutter",
  }));

export const PITCH_VISUAL_KIND_BY_TYPE: Readonly<Record<BaseballPitchType, PitchVisualKind>> =
  Object.freeze(Object.assign(Object.create(null) as Record<BaseballPitchType, PitchVisualKind>, {
    fourSeam: "fastball",
    twoSeam: "twoSeam",
    slider: "slider",
    curve: "curve",
    changeup: "changeup",
    fork: "fork",
    cutter: "cutter",
  }));

export function getPitchDefinition(type: BaseballPitchType): PitchDefinition {
  return PITCH_DEFINITION_BY_TYPE[type];
}

export function isBaseballPitchType(value: unknown): value is BaseballPitchType {
  return typeof value === "string" && Object.hasOwn(PITCH_DEFINITION_BY_TYPE, value);
}

export function isPitchVisualKind(value: unknown): value is PitchVisualKind {
  return typeof value === "string" && Object.hasOwn(PITCH_TYPE_BY_VISUAL_KIND, value);
}
