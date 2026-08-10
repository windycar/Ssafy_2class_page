import { useState, useRef } from "react";
import {
  Shuffle,
  ChevronUp,
  ChevronDown,
  Check,
  RefreshCw,
  Copy,
  FileJson,
  RotateCcw,
  Users,
  School,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

import { STUDENTS } from "../data/students";
import { ADDITIONAL_TEAM_CLASS_ROSTERS } from "../data/teamClassRosters";

import {
  buildTeams,
  fisherYatesShuffle,
  teamsResultKey,
} from "../utils/teamShuffle";

import { copyToClipboard } from "../utils/copyToClipboard";

import { TeamCard } from "../components/team/TeamCard";
import { StudentChip } from "../components/team/StudentChip";
import { EmptyTeamResult } from "../components/team/EmptyTeamResult";

import { teamClassRosterStorage } from "../services/storage/teamClassRosterStorage";

import {
  parseClassRoster,
  rosterToText,
} from "../utils/classRoster";

import type { TeamClassRoster } from "../types/classRoster";
import type { StudentEntry } from "../types/student";
import type { Team } from "../types/team";

const DEFAULT_CLASS_ID = "gwangju-class-2";

const DEFAULT_CLASS_ROSTER: TeamClassRoster = {
  id: DEFAULT_CLASS_ID,
  name: "광주 2반",
  students: STUDENTS,
};

/**
 * 랜덤 팀 모션에서 학생 카드들이 이동할 위치
 */
const SHUFFLE_POSITIONS = [
  { x: -125, y: -75, rotate: -13 },
  { x: -45, y: -105, rotate: 9 },
  { x: 65, y: -95, rotate: -8 },
  { x: 125, y: -30, rotate: 13 },
  { x: 105, y: 70, rotate: -10 },
  { x: 20, y: 105, rotate: 8 },
  { x: -80, y: 85, rotate: -11 },
  { x: -130, y: 15, rotate: 10 },
];

function withParticipation(
  students: TeamClassRoster["students"],
): StudentEntry[] {
  return students.map((student) => ({
    ...student,
    included: true,
  }));
}

function Stepper({
  value,
  onChange,
  min = 1,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </button>

      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value);

          if (
            !Number.isNaN(v) &&
            v >= min &&
            v <= max
          ) {
            onChange(v);
          }
        }}
        className="w-16 rounded-xl border border-border bg-white py-1.5 text-center text-xl font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronUp className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      className="group flex cursor-pointer select-none items-center gap-3"
      onClick={onChange}
    >
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
          checked
            ? "border-blue-600 bg-blue-600"
            : "border-gray-300 bg-white group-hover:border-blue-400"
        }`}
      >
        {checked && (
          <Check
            className="h-3 w-3 text-white"
            strokeWidth={3}
          />
        )}
      </div>

      <span className="text-sm text-gray-700">
        {label}
      </span>
    </label>
  );
}

export default function TeamRandomView() {
  const [customRosters, setCustomRosters] =
    useState<TeamClassRoster[]>(() =>
      teamClassRosterStorage.getRosters(),
    );

  const fileRosters = [
    DEFAULT_CLASS_ROSTER,
    ...ADDITIONAL_TEAM_CLASS_ROSTERS,
  ];

  const visibleCustomRosters = customRosters.filter(
    (customRoster) =>
      !fileRosters.some(
        (fileRoster) =>
          fileRoster.id === customRoster.id ||
          fileRoster.name === customRoster.name,
      ),
  );

  const classRosters = [
    ...fileRosters,
    ...visibleCustomRosters,
  ];

  const [selectedClassId, setSelectedClassId] = useState(
    () => {
      const savedClassId =
        teamClassRosterStorage.getSelectedClassId();

      return classRosters.some(
        (roster) => roster.id === savedClassId,
      )
        ? savedClassId!
        : DEFAULT_CLASS_ID;
    },
  );

  const selectedClassRoster =
    classRosters.find(
      (roster) => roster.id === selectedClassId,
    ) ?? DEFAULT_CLASS_ROSTER;

  const selectedClassIsCustom =
    visibleCustomRosters.some(
      (roster) => roster.id === selectedClassId,
    );

  const [mode, setMode] = useState<
    "teamCount" | "membersPerTeam"
  >("teamCount");

  const [teamCount, setTeamCount] = useState(() =>
    Math.min(
      5,
      Math.max(
        1,
        selectedClassRoster.students.length,
      ),
    ),
  );

  const [membersPerTeam, setMembersPerTeam] =
    useState(() =>
      Math.min(
        3,
        Math.max(
          1,
          selectedClassRoster.students.length,
        ),
      ),
    );

  const [options, setOptions] = useState({
    differentFromLast: false,
    sortAlpha: false,
    autoTeamName: true,
  });

  const [students, setStudents] = useState<
    StudentEntry[]
  >(() =>
    withParticipation(
      selectedClassRoster.students,
    ),
  );

  const [teams, setTeams] = useState<Team[] | null>(
    null,
  );

  const [isShuffling, setIsShuffling] =
    useState(false);

  /**
   * 랜덤 팀 애니메이션에서 보여줄 학생
   */
  const [
    shufflePreviewStudents,
    setShufflePreviewStudents,
  ] = useState<StudentEntry[]>([]);

  const [randomPickCount, setRandomPickCount] =
    useState(1);

  const [
    randomPickedStudents,
    setRandomPickedStudents,
  ] = useState<StudentEntry[]>([]);

  const [isPickingPeople, setIsPickingPeople] =
    useState(false);

  const [showRosterEditor, setShowRosterEditor] =
    useState(false);

  const [editingRosterId, setEditingRosterId] =
    useState<string | null>(null);

  const [draftClassName, setDraftClassName] =
    useState("");

  const [draftRoster, setDraftRoster] =
    useState("");

  const lastKey = useRef("");

  const included = students.filter(
    (student) => student.included,
  );

  const includedCount = included.length;

  const effectiveTeamCount =
    mode === "teamCount"
      ? Math.max(
          1,
          Math.min(teamCount, includedCount),
        )
      : Math.max(
          1,
          Math.ceil(
            includedCount /
              Math.max(1, membersPerTeam),
          ),
        );

  const effectiveMembersBase =
    effectiveTeamCount > 0
      ? Math.floor(
          includedCount / effectiveTeamCount,
        )
      : 0;

  const remainder =
    effectiveTeamCount > 0
      ? includedCount % effectiveTeamCount
      : 0;

  const draftStudentCount = parseClassRoster(
    draftRoster,
    draftClassName.trim() || "새 반",
    0,
  ).length;

  const activateRoster = (
    roster: TeamClassRoster,
  ) => {
    setSelectedClassId(roster.id);

    teamClassRosterStorage.setSelectedClassId(
      roster.id,
    );

    setStudents(
      withParticipation(roster.students),
    );

    setTeams(null);
    setRandomPickedStudents([]);
    setRandomPickCount(1);

    setTeamCount(
      Math.min(
        5,
        Math.max(1, roster.students.length),
      ),
    );

    setMembersPerTeam(
      Math.min(
        3,
        Math.max(1, roster.students.length),
      ),
    );

    lastKey.current = "";
  };

  const handleClassChange = (
    classId: string,
  ) => {
    const roster = classRosters.find(
      (item) => item.id === classId,
    );

    if (roster) {
      activateRoster(roster);
    }
  };

  const openNewRosterEditor = () => {
    setEditingRosterId(null);
    setDraftClassName("");
    setDraftRoster("");
    setShowRosterEditor(true);
  };

  const openRosterEditor = () => {
    if (!selectedClassIsCustom) {
      return;
    }

    setEditingRosterId(
      selectedClassRoster.id,
    );

    setDraftClassName(
      selectedClassRoster.name,
    );

    setDraftRoster(
      rosterToText(
        selectedClassRoster.students,
      ),
    );

    setShowRosterEditor(true);
  };

  const handleSaveRoster = () => {
    const className =
      draftClassName.trim();

    if (!className) {
      toast.error(
        "반 이름을 입력해 주세요.",
      );
      return;
    }

    const duplicate =
      classRosters.some(
        (roster) =>
          roster.id !== editingRosterId &&
          roster.name.toLocaleLowerCase("ko") ===
            className.toLocaleLowerCase("ko"),
      );

    if (duplicate) {
      toast.error(
        "이미 같은 이름의 반이 있습니다.",
      );
      return;
    }

    const parsedStudents =
      parseClassRoster(
        draftRoster,
        className,
      );

    if (
      parsedStudents.length === 0
    ) {
      toast.error(
        "교육생 이름을 한 명 이상 입력해 주세요.",
      );
      return;
    }

    const roster: TeamClassRoster = {
      id:
        editingRosterId ??
        `custom-class-${Date.now()}`,
      name: className,
      students: parsedStudents,
    };

    const nextRosters =
      editingRosterId
        ? customRosters.map(
            (item) =>
              item.id ===
              editingRosterId
                ? roster
                : item,
          )
        : [
            ...customRosters,
            roster,
          ];

    setCustomRosters(nextRosters);

    teamClassRosterStorage.setRosters(
      nextRosters,
    );

    activateRoster(roster);

    setShowRosterEditor(false);

    toast.success(
      editingRosterId
        ? `${className} 명단을 수정했습니다.`
        : `${className} 명단을 추가했습니다.`,
    );
  };

  const handleDeleteRoster = () => {
    if (!selectedClassIsCustom) {
      return;
    }

    if (
      !window.confirm(
        `${selectedClassRoster.name} 명단을 삭제하시겠습니까?`,
      )
    ) {
      return;
    }

    const nextRosters =
      customRosters.filter(
        (roster) =>
          roster.id !== selectedClassId,
      );

    setCustomRosters(nextRosters);

    teamClassRosterStorage.setRosters(
      nextRosters,
    );

    activateRoster(
      DEFAULT_CLASS_ROSTER,
    );

    toast.success(
      "반 명단을 삭제했습니다.",
    );
  };

  /**
   * =========================================================
   * 랜덤 팀 만들기
   *
   * 1. 학생 카드 셔플 모션
   * 2. 실제 팀 계산
   * 3. 결과 전체 동시에 표시
   * =========================================================
   */
  const handleShuffle = async () => {
    if (includedCount === 0) {
      toast.error(
        "참여할 교육생이 없습니다.",
      );
      return;
    }

    if (isShuffling) {
      return;
    }

    /**
     * 셔플 애니메이션용 학생 최대 8명
     */
    setShufflePreviewStudents(
      fisherYatesShuffle(
        included,
      ).slice(
        0,
        Math.min(
          8,
          included.length,
        ),
      ),
    );

    setIsShuffling(true);

    /**
     * 약 1.35초 동안 모션
     */
    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          1350,
        ),
    );

    let result =
      buildTeams(
        included,
        effectiveTeamCount,
        options.sortAlpha,
        options.autoTeamName,
        teams?.map(
          (team) =>
            team.color,
        ),
      );

    /**
     * 직전 결과와 다르게
     */
    if (
      options.differentFromLast &&
      lastKey.current
    ) {
      let attempts = 0;

      while (
        teamsResultKey(
          result,
        ) ===
          lastKey.current &&
        attempts < 12
      ) {
        result =
          buildTeams(
            included,
            effectiveTeamCount,
            options.sortAlpha,
            options.autoTeamName,
            teams?.map(
              (team) =>
                team.color,
            ),
          );

        attempts++;
      }
    }

    lastKey.current =
      teamsResultKey(result);

    /**
     * 중요:
     * 모든 팀 데이터를 한 번에 넣음.
     *
     * 팀 1, 2, 3 순서대로 보여주는 게 아님.
     */
    setTeams(result);

    /**
     * React가 결과를 렌더링할 시간을 조금 준 뒤
     * 셔플 화면 종료
     */
    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          180,
        ),
    );

    setIsShuffling(false);

    setShufflePreviewStudents([]);

    toast.success(
      "팀 편성이 완료되었습니다! 🎉",
    );
  };

  const handleRandomPeoplePick =
    async () => {
      if (includedCount === 0) {
        toast.error(
          "뽑을 수 있는 교육생이 없습니다.",
        );
        return;
      }

      setIsPickingPeople(true);

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            450,
          ),
      );

      const count =
        Math.min(
          randomPickCount,
          includedCount,
        );

      setRandomPickedStudents(
        fisherYatesShuffle(
          included,
        ).slice(
          0,
          count,
        ),
      );

      setIsPickingPeople(false);

      toast.success(
        `${count}명을 랜덤으로 뽑았습니다.`,
      );
    };

  const handleReshuffleTeam = () => {
    if (!teams) {
      return;
    }

    const allMembers =
      teams.flatMap(
        (team) =>
          team.members,
      );

    const shuffled =
      fisherYatesShuffle(
        allMembers,
      );

    let idx = 0;

    const newTeams =
      teams.map((team) => {
        let members =
          shuffled.slice(
            idx,
            idx +
              team.members.length,
          );

        if (
          options.sortAlpha
        ) {
          members = [
            ...members,
          ].sort((a, b) =>
            a.name.localeCompare(
              b.name,
              "ko",
            ),
          );
        }

        idx +=
          team.members.length;

        return {
          ...team,
          members,
        };
      });

    setTeams(newTeams);

    toast.success(
      "다시 편성되었습니다.",
    );
  };

  const handleRenameTeam = (
    teamId: number,
    name: string,
  ) => {
    if (!teams) {
      return;
    }

    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              name,
            }
          : team,
      ),
    );
  };

  const handleCopyText =
    async () => {
      if (!teams) {
        return;
      }

      const text = teams
        .map(
          (team) =>
            `[${team.name}] (${team.members.length}명)\n${team.members
              .map(
                (member) =>
                  `  · ${member.name} (${member.username})`,
              )
              .join("\n")}`,
        )
        .join("\n\n");

      const ok =
        await copyToClipboard(
          text,
        );

      ok
        ? toast.success(
            "텍스트로 복사되었습니다!",
          )
        : toast.error(
            "복사에 실패했습니다.",
          );
    };

  const handleCopyJSON =
    async () => {
      if (!teams) {
        return;
      }

      const data = teams.map(
        (team) => ({
          team: team.name,
          count:
            team.members.length,
          members:
            team.members.map(
              (member) => ({
                name:
                  member.name,
                username:
                  member.username,
              }),
            ),
        }),
      );

      const ok =
        await copyToClipboard(
          JSON.stringify(
            data,
            null,
            2,
          ),
        );

      ok
        ? toast.success(
            "JSON으로 복사되었습니다!",
          )
        : toast.error(
            "복사에 실패했습니다.",
          );
    };

  const handleReset = () => {
    setTeams(null);

    setStudents(
      withParticipation(
        selectedClassRoster.students,
      ),
    );

    setMode("teamCount");

    setTeamCount(
      Math.min(
        5,
        Math.max(
          1,
          selectedClassRoster
            .students.length,
        ),
      ),
    );

    setMembersPerTeam(
      Math.min(
        3,
        Math.max(
          1,
          selectedClassRoster
            .students.length,
        ),
      ),
    );

    setOptions({
      differentFromLast:
        false,
      sortAlpha: false,
      autoTeamName: true,
    });

    setRandomPickCount(1);

    setRandomPickedStudents(
      [],
    );

    setShufflePreviewStudents(
      [],
    );

    setIsShuffling(false);

    lastKey.current = "";

    toast.success(
      "초기화되었습니다.",
    );
  };

  const hasExcluded =
    students.some(
      (student) =>
        !student.included,
    );

  return (
    <div className="space-y-6">
      {/* =====================================================
          Page Header
      ====================================================== */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-200">
          <Shuffle className="h-5 w-5 text-white" />
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            랜덤 팀 편성
          </h1>

          <p className="text-sm text-gray-500">
            선택한 반의 교육생만
            공정하게 랜덤으로
            편성합니다.
          </p>
        </div>

        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          <Users className="h-3.5 w-3.5" />

          {selectedClassRoster.name}
          {" · "}
          {students.length}명
        </span>
      </div>

      {/* =====================================================
          반 선택
      ====================================================== */}
      <section className="rounded-2xl border border-[#1259AA]/15 bg-gradient-to-br from-white to-blue-50/60 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <School className="h-4 w-4 text-[#1259AA]" />

              <label
                htmlFor="team-class-select"
                className="text-sm font-extrabold text-gray-800"
              >
                편성할 반
              </label>
            </div>

            <select
              id="team-class-select"
              value={selectedClassId}
              onChange={(event) =>
                handleClassChange(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-[#1259AA]/20 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm outline-none transition focus:border-[#1259AA] focus:ring-2 focus:ring-[#1259AA]/15 lg:max-w-md"
            >
              {classRosters.map(
                (roster) => (
                  <option
                    key={
                      roster.id
                    }
                    value={
                      roster.id
                    }
                  >
                    {roster.name} (
                    {
                      roster
                        .students
                        .length
                    }
                    명)
                  </option>
                ),
              )}
            </select>

            <p className="mt-2 text-xs font-medium text-[#1259AA]">
              현재{" "}
              {
                selectedClassRoster.name
              }{" "}
              명단만 사용합니다.
              2반을 제외한 다른 반을
              선택하면 2반 학생은
              편성 후보에 포함되지
              않습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={
                openNewRosterEditor
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#1259AA] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0d4a8f]"
            >
              <Plus className="h-4 w-4" />
              다른 반 추가
            </button>

            {selectedClassIsCustom && (
              <>
                <button
                  type="button"
                  onClick={
                    openRosterEditor
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4" />
                  명단 수정
                </button>

                <button
                  type="button"
                  onClick={
                    handleDeleteRoster
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-50"
                  aria-label={`${selectedClassRoster.name} 삭제`}
                >
                  <Trash2 className="h-4 w-4" />
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          설정 + 교육생
      ====================================================== */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Settings Card */}
        <div className="flex flex-col space-y-5 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
            팀 편성 설정
          </h2>

          {/* Mode */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">
              편성 방식
            </p>

            <div className="flex gap-1 overflow-hidden rounded-xl border border-border bg-gray-50 p-1">
              {(
                [
                  "teamCount",
                  "membersPerTeam",
                ] as const
              ).map((currentMode) => (
                <button
                  type="button"
                  key={currentMode}
                  onClick={() =>
                    setMode(
                      currentMode,
                    )
                  }
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                    mode ===
                    currentMode
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:bg-white hover:text-gray-700"
                  }`}
                >
                  {currentMode ===
                  "teamCount"
                    ? "팀 수로 나누기"
                    : "팀당 인원수로 나누기"}
                </button>
              ))}
            </div>
          </div>

          {/* Numeric */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="mb-2.5 text-sm font-semibold text-gray-700">
                팀 수
              </p>

              {mode ===
              "teamCount" ? (
                <Stepper
                  value={
                    teamCount
                  }
                  onChange={
                    setTeamCount
                  }
                  min={1}
                  max={Math.max(
                    1,
                    includedCount,
                  )}
                />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-300">
                    {
                      effectiveTeamCount
                    }
                  </span>

                  <span className="text-sm text-gray-400">
                    팀
                  </span>
                </div>
              )}
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-gray-700">
                팀당 인원수
              </p>

              {mode ===
              "membersPerTeam" ? (
                <Stepper
                  value={
                    membersPerTeam
                  }
                  onChange={
                    setMembersPerTeam
                  }
                  min={1}
                  max={Math.max(
                    1,
                    includedCount,
                  )}
                />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-300">
                    {
                      effectiveMembersBase
                    }
                  </span>

                  <span className="text-sm text-gray-400">
                    명
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex items-start gap-2">
              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />

              <div>
                <p className="text-sm font-medium text-blue-700">
                  <span className="font-bold">
                    {includedCount}
                    명
                  </span>
                  을{" "}
                  <span className="font-bold">
                    {
                      effectiveTeamCount
                    }
                    개 팀
                  </span>
                  으로 구성 — 팀당{" "}
                  {
                    effectiveMembersBase
                  }
                  명
                  {remainder > 0 &&
                    ` ~ ${
                      effectiveMembersBase +
                      1
                    }명`}
                </p>

                {remainder >
                  0 && (
                  <p className="mt-0.5 text-xs text-blue-500">
                    앞쪽{" "}
                    {remainder}개
                    팀에 한 명씩 추가
                    배정됩니다.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">
              추가 옵션
            </p>

            <div className="space-y-2.5">
              <Checkbox
                checked={
                  options.differentFromLast
                }
                onChange={() =>
                  setOptions(
                    (
                      previous,
                    ) => ({
                      ...previous,
                      differentFromLast:
                        !previous.differentFromLast,
                    }),
                  )
                }
                label="직전 결과와 다르게 섞기"
              />

              <Checkbox
                checked={
                  options.sortAlpha
                }
                onChange={() =>
                  setOptions(
                    (
                      previous,
                    ) => ({
                      ...previous,
                      sortAlpha:
                        !previous.sortAlpha,
                    }),
                  )
                }
                label="팀 내 명단 가나다순 정렬"
              />

              <Checkbox
                checked={
                  options.autoTeamName
                }
                onChange={() =>
                  setOptions(
                    (
                      previous,
                    ) => ({
                      ...previous,
                      autoTeamName:
                        !previous.autoTeamName,
                    }),
                  )
                }
                label="팀 이름 자동 생성 (알파, 베타, 감마…)"
              />
            </div>
          </div>

          {/* =================================================
              Shuffle Button
          ================================================== */}
          <motion.button
            type="button"
            onClick={
              handleShuffle
            }
            disabled={
              isShuffling ||
              includedCount === 0
            }
            whileTap={
              !isShuffling
                ? {
                    scale: 0.97,
                  }
                : undefined
            }
            animate={
              isShuffling
                ? {
                    scale: [
                      1,
                      0.985,
                      1,
                    ],
                  }
                : {
                    scale: 1,
                  }
            }
            transition={
              isShuffling
                ? {
                    duration: 0.5,
                    repeat:
                      Infinity,
                  }
                : undefined
            }
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <motion.span
              animate={
                isShuffling
                  ? {
                      rotate:
                        360,
                    }
                  : {
                      rotate: 0,
                    }
              }
              transition={
                isShuffling
                  ? {
                      repeat:
                        Infinity,
                      duration:
                        0.45,
                      ease:
                        "linear",
                    }
                  : {}
              }
              className="inline-flex"
            >
              <Shuffle className="h-5 w-5" />
            </motion.span>

            {isShuffling
              ? "팀 섞는 중..."
              : "랜덤 팀 만들기"}
          </motion.button>

          {/* =================================================
              Random Pick
          ================================================== */}
          <div className="mt-1 flex flex-1 flex-col border-t border-[#dce8e3] pt-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-gray-800">
                  랜덤 사람 뽑기
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  참여 교육생 중
                  원하는 인원만
                  중복 없이 뽑습니다.
                </p>
              </div>

              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                최대{" "}
                {includedCount}명
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  랜덤 뽑기 인원
                </p>

                <div className="flex items-center gap-2">
                  <Stepper
                    value={Math.min(
                      randomPickCount,
                      Math.max(
                        1,
                        includedCount,
                      ),
                    )}
                    onChange={
                      setRandomPickCount
                    }
                    min={1}
                    max={Math.max(
                      1,
                      includedCount,
                    )}
                  />

                  <span className="text-sm font-semibold text-gray-500">
                    명
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  handleRandomPeoplePick
                }
                disabled={
                  isPickingPeople ||
                  includedCount ===
                    0
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-md shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <motion.span
                  animate={
                    isPickingPeople
                      ? {
                          rotate:
                            360,
                        }
                      : {
                          rotate:
                            0,
                        }
                  }
                  transition={
                    isPickingPeople
                      ? {
                          repeat:
                            Infinity,
                          duration:
                            0.55,
                          ease:
                            "linear",
                        }
                      : {}
                  }
                  className="inline-flex"
                >
                  <Shuffle className="h-4 w-4" />
                </motion.span>

                {isPickingPeople
                  ? "뽑는 중..."
                  : `랜덤 뽑기 - ${Math.min(
                      randomPickCount,
                      includedCount,
                    )}명`}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {randomPickedStudents.length >
              0 ? (
                <motion.div
                  key="picked-people"
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  className="mt-5 rounded-2xl border border-emerald-100 bg-[linear-gradient(135deg,#f2fbf7_0%,#f8fbfa_100%)] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-emerald-800">
                      랜덤 추첨 결과
                    </p>

                    <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      {
                        randomPickedStudents.length
                      }
                      명
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {randomPickedStudents.map(
                      (
                        student,
                        index,
                      ) => (
                        <div
                          key={
                            student.id
                          }
                          className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-white/90 px-3 py-2.5 shadow-sm"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-700">
                            {index +
                              1}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-gray-800">
                              {
                                student.name
                              }
                            </p>

                            <p className="truncate text-[11px] text-gray-500">
                              {
                                student.username
                              }
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-picked-people"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="mt-5 flex min-h-[145px] flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d8e8e0] bg-[#f8fbf9]/70 px-4 text-center"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Shuffle className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-bold text-gray-600">
                    랜덤 뽑기 결과가
                    여기 표시됩니다.
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    인원을 정한 뒤
                    버튼을 눌러주세요.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ===================================================
            Student List
        ==================================================== */}
        <div className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                참여 교육생
              </h2>

              <p className="mt-0.5 text-xs font-semibold text-[#1259AA]">
                {
                  selectedClassRoster.name
                }
              </p>
            </div>

            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                includedCount ===
                students.length
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-amber-200 bg-amber-50 text-amber-600"
              }`}
            >
              {includedCount} /{" "}
              {students.length}명
            </span>
          </div>

          <motion.div
            animate={
              isShuffling
                ? {
                    x: [
                      0,
                      -2,
                      3,
                      -2,
                      0,
                    ],
                  }
                : {
                    x: 0,
                  }
            }
            transition={
              isShuffling
                ? {
                    repeat:
                      Infinity,
                    duration:
                      0.28,
                  }
                : undefined
            }
            className="max-h-[360px] flex-1 space-y-0.5 overflow-y-auto pr-0.5 lg:max-h-none"
          >
            {students.map(
              (student) => (
                <StudentChip
                  key={
                    student.id
                  }
                  student={
                    student
                  }
                  onToggle={() =>
                    setStudents(
                      (
                        previous,
                      ) =>
                        previous.map(
                          (
                            item,
                          ) =>
                            item.id ===
                            student.id
                              ? {
                                  ...item,
                                  included:
                                    !item.included,
                                }
                              : item,
                        ),
                    )
                  }
                />
              ),
            )}
          </motion.div>

          {hasExcluded && (
            <button
              type="button"
              onClick={() =>
                setStudents(
                  (
                    previous,
                  ) =>
                    previous.map(
                      (
                        student,
                      ) => ({
                        ...student,
                        included:
                          true,
                      }),
                    ),
                )
              }
              className="mt-3 w-full flex-shrink-0 rounded-xl border border-dashed border-blue-200 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
            >
              모두 포함하기
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          TEAM SHUFFLE OVERLAY

          랜덤 팀 만들기 클릭
          → 학생 카드가 화면 중앙에서 섞임
          → 결과는 뒤에서 한 번에 생성
      ====================================================== */}
      <AnimatePresence>
        {isShuffling && (
          <motion.div
            key="team-shuffle-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 35,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 1.08,
                y: -20,
              }}
              transition={{
                type: "spring",
                stiffness: 230,
                damping: 18,
              }}
              className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/50 bg-white/95 px-5 py-7 shadow-2xl"
            >
              {/* 배경 블루 */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -left-24 -top-24 h-52 w-52 rounded-full bg-blue-200/40 blur-3xl"
              />

              {/* 배경 보라 */}
              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -bottom-28 -right-20 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl"
              />

              {/* 학생 카드 셔플 영역 */}
              <div className="relative mx-auto h-[250px] max-w-[350px]">
                {shufflePreviewStudents.map(
                  (
                    student,
                    index,
                  ) => {
                    const position =
                      SHUFFLE_POSITIONS[
                        index %
                          SHUFFLE_POSITIONS.length
                      ];

                    return (
                      <div
                        key={
                          student.id
                        }
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{
                            x: 0,
                            y: 0,
                            opacity: 0,
                            scale: 0.45,
                            rotate: 0,
                          }}
                          animate={{
                            x: [
                              0,
                              position.x,
                              position.x *
                                -0.45,
                              position.x *
                                0.7,
                              0,
                            ],

                            y: [
                              0,
                              position.y,
                              position.y *
                                0.4,
                              position.y *
                                -0.65,
                              0,
                            ],

                            rotate: [
                              0,
                              position.rotate,
                              -position.rotate,
                              position.rotate /
                                2,
                              0,
                            ],

                            opacity: [
                              0,
                              1,
                              1,
                              1,
                              0.85,
                            ],

                            scale: [
                              0.6,
                              1,
                              0.86,
                              1.06,
                              0.7,
                            ],
                          }}
                          transition={{
                            duration:
                              1.05,
                            repeat:
                              Infinity,
                            ease:
                              "easeInOut",
                            delay:
                              index *
                              0.035,
                          }}
                          className="z-10 min-w-[82px] rounded-xl border border-blue-100 bg-white px-3 py-2 text-center text-xs font-extrabold text-gray-700 shadow-lg"
                        >
                          {
                            student.name
                          }
                        </motion.div>
                      </div>
                    );
                  },
                )}

                {/* 중앙 셔플 아이콘 */}
                <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [
                        1,
                        1.13,
                        1,
                      ],
                      boxShadow: [
                        "0 15px 30px rgba(59,130,246,0.25)",
                        "0 20px 45px rgba(59,130,246,0.55)",
                        "0 15px 30px rgba(59,130,246,0.25)",
                      ],
                    }}
                    transition={{
                      duration:
                        0.65,
                      repeat:
                        Infinity,
                      ease:
                        "easeInOut",
                    }}
                    className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700"
                  >
                    <motion.div
                      animate={{
                        rotate:
                          360,
                      }}
                      transition={{
                        duration:
                          0.45,
                        repeat:
                          Infinity,
                        ease:
                          "linear",
                      }}
                    >
                      <Shuffle className="h-9 w-9 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* 텍스트 */}
              <div className="relative text-center">
                <motion.h2
                  animate={{
                    opacity: [
                      0.65,
                      1,
                      0.65,
                    ],
                    scale: [
                      1,
                      1.025,
                      1,
                    ],
                  }}
                  transition={{
                    duration:
                      0.8,
                    repeat:
                      Infinity,
                  }}
                  className="text-xl font-black text-gray-900"
                >
                  팀을 섞고 있습니다
                </motion.h2>

                <p className="mt-1 text-sm font-medium text-gray-400">
                  {
                    includedCount
                  }
                  명을{" "}
                  {
                    effectiveTeamCount
                  }
                  개 팀으로 공정하게
                  편성 중...
                </p>

                {/* 로딩 점 */}
                <div className="mt-4 flex justify-center gap-1.5">
                  {[0, 1, 2].map(
                    (dot) => (
                      <motion.span
                        key={dot}
                        animate={{
                          y: [
                            0,
                            -7,
                            0,
                          ],
                          opacity: [
                            0.35,
                            1,
                            0.35,
                          ],
                        }}
                        transition={{
                          duration:
                            0.65,
                          repeat:
                            Infinity,
                          delay:
                            dot *
                            0.14,
                        }}
                        className="h-2 w-2 rounded-full bg-blue-500"
                      />
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          Results
      ====================================================== */}
      <AnimatePresence mode="wait">
        {!teams ? (
          <motion.div
            key="empty"
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
          >
            <EmptyTeamResult />
          </motion.div>
        ) : (
          /**
           * 중요:
           *
           * 이 motion.div 하나만 애니메이션.
           * 개별 TeamCard에는 delay 없음.
           *
           * 따라서 모든 팀이 동시에 표시됨.
           */
          <motion.div
            key="results"
            initial={{
              opacity: 0,
              y: 28,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 230,
              damping: 19,
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-gray-800">
                  편성 결과
                </h2>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  {teams.length}팀
                  {" · "}
                  {includedCount}명
                </span>
              </div>
            </div>

            {/* ===============================================
                결과 전체 동시 표시

                index delay 없음
                TeamCard 개별 등장 없음
            ================================================ */}
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {teams.map(
                (team) => (
                  <TeamCard
                    key={
                      team.id
                    }
                    team={
                      team
                    }
                    onReshuffle={
                      handleReshuffleTeam
                    }
                    onRename={(
                      name,
                    ) =>
                      handleRenameTeam(
                        team.id,
                        name,
                      )
                    }
                  />
                ),
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={
                  handleShuffle
                }
                disabled={
                  isShuffling
                }
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isShuffling
                      ? "animate-spin"
                      : ""
                  }`}
                />
                전체 다시 섞기
              </button>

              <button
                type="button"
                onClick={
                  handleCopyText
                }
                className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Copy className="h-4 w-4" />
                결과 복사
              </button>

              <button
                type="button"
                onClick={
                  handleCopyJSON
                }
                className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FileJson className="h-4 w-4" />
                JSON으로 복사
              </button>

              <button
                type="button"
                onClick={
                  handleReset
                }
                className="ml-auto flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
              >
                <RotateCcw className="h-4 w-4" />
                초기화
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          Roster Editor
      ====================================================== */}
      {showRosterEditor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="roster-editor-title"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="roster-editor-title"
                  className="text-lg font-extrabold text-gray-900"
                >
                  {editingRosterId
                    ? "반 명단 수정"
                    : "다른 반 추가"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  저장한 명단은 이
                  기기의 랜덤 팀
                  편성에서만
                  사용됩니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowRosterEditor(
                    false,
                  )
                }
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="명단 편집 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
              <div>
                <label
                  htmlFor="class-name"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  반 이름
                </label>

                <input
                  id="class-name"
                  value={
                    draftClassName
                  }
                  onChange={(
                    event,
                  ) =>
                    setDraftClassName(
                      event.target
                        .value,
                    )
                  }
                  placeholder="예: 광주 1반"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition focus:border-[#1259AA] focus:ring-2 focus:ring-[#1259AA]/15"
                  autoFocus
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="class-roster"
                    className="text-sm font-bold text-gray-700"
                  >
                    교육생 명단
                  </label>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1259AA]">
                    {
                      draftStudentCount
                    }
                    명
                  </span>
                </div>

                <textarea
                  id="class-roster"
                  value={
                    draftRoster
                  }
                  onChange={(
                    event,
                  ) =>
                    setDraftRoster(
                      event.target
                        .value,
                    )
                  }
                  placeholder={
                    "한 줄에 한 명씩 입력하세요.\n김싸피\n이싸피, @ssafy02\n박싸피"
                  }
                  rows={10}
                  className="w-full resize-y rounded-xl border border-border px-3.5 py-3 font-mono text-sm leading-6 outline-none transition focus:border-[#1259AA] focus:ring-2 focus:ring-[#1259AA]/15"
                />

                <p className="mt-2 text-xs text-gray-500">
                  아이디는 선택
                  사항입니다. 입력하려면
                  “이름, @아이디”
                  형식을 사용하세요.
                </p>
              </div>
            </div>

            <div className="flex gap-2 border-t border-border bg-gray-50 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() =>
                  setShowRosterEditor(
                    false,
                  )
                }
                className="flex-1 rounded-xl border border-border bg-white py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
              >
                취소
              </button>

              <button
                type="button"
                onClick={
                  handleSaveRoster
                }
                className="flex-1 rounded-xl bg-[#1259AA] py-2.5 text-sm font-bold text-white transition hover:bg-[#0d4a8f]"
              >
                {editingRosterId
                  ? "수정 내용 저장"
                  : "반 명단 추가"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}