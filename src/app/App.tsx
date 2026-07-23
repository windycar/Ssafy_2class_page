import { useState, useRef } from "react";
import {
  Users, Shuffle, Copy, RefreshCw, RotateCcw,
  Pencil, Check, X, ChevronUp, ChevronDown, FileJson,
  UserX, Trophy, Download,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import studentData from "../imports/list.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Student {
  id: number;
  name: string;
  username: string;
  class: string;
}

interface StudentEntry extends Student {
  included: boolean;
}

interface TeamColor {
  bg: string;
  border: string;
  headerBg: string;
  badgeBg: string;
  badgeText: string;
  nameText: string;
  avatarBg: string;
}

interface Team {
  id: number;
  name: string;
  members: Student[];
  color: TeamColor;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAM_COLORS: TeamColor[] = [
  { bg: "bg-blue-50", border: "border-blue-200", headerBg: "bg-blue-100", badgeBg: "bg-blue-200", badgeText: "text-blue-800", nameText: "text-blue-700", avatarBg: "bg-blue-200" },
  { bg: "bg-emerald-50", border: "border-emerald-200", headerBg: "bg-emerald-100", badgeBg: "bg-emerald-200", badgeText: "text-emerald-800", nameText: "text-emerald-700", avatarBg: "bg-emerald-200" },
  { bg: "bg-amber-50", border: "border-amber-200", headerBg: "bg-amber-100", badgeBg: "bg-amber-200", badgeText: "text-amber-800", nameText: "text-amber-700", avatarBg: "bg-amber-200" },
  { bg: "bg-violet-50", border: "border-violet-200", headerBg: "bg-violet-100", badgeBg: "bg-violet-200", badgeText: "text-violet-800", nameText: "text-violet-700", avatarBg: "bg-violet-200" },
  { bg: "bg-rose-50", border: "border-rose-200", headerBg: "bg-rose-100", badgeBg: "bg-rose-200", badgeText: "text-rose-800", nameText: "text-rose-700", avatarBg: "bg-rose-200" },
  { bg: "bg-orange-50", border: "border-orange-200", headerBg: "bg-orange-100", badgeBg: "bg-orange-200", badgeText: "text-orange-800", nameText: "text-orange-700", avatarBg: "bg-orange-200" },
  { bg: "bg-teal-50", border: "border-teal-200", headerBg: "bg-teal-100", badgeBg: "bg-teal-200", badgeText: "text-teal-800", nameText: "text-teal-700", avatarBg: "bg-teal-200" },
  { bg: "bg-pink-50", border: "border-pink-200", headerBg: "bg-pink-100", badgeBg: "bg-pink-200", badgeText: "text-pink-800", nameText: "text-pink-700", avatarBg: "bg-pink-200" },
  { bg: "bg-cyan-50", border: "border-cyan-200", headerBg: "bg-cyan-100", badgeBg: "bg-cyan-200", badgeText: "text-cyan-800", nameText: "text-cyan-700", avatarBg: "bg-cyan-200" },
  { bg: "bg-indigo-50", border: "border-indigo-200", headerBg: "bg-indigo-100", badgeBg: "bg-indigo-200", badgeText: "text-indigo-800", nameText: "text-indigo-700", avatarBg: "bg-indigo-200" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildTeams(
  students: Student[],
  teamCount: number,
  sortAlpha: boolean,
  preserveColors?: TeamColor[]
): Team[] {
  const shuffled = fisherYatesShuffle(students);
  const base = Math.floor(shuffled.length / teamCount);
  const extra = shuffled.length % teamCount;
  const teams: Team[] = [];
  let idx = 0;
  for (let i = 0; i < teamCount; i++) {
    const size = base + (i < extra ? 1 : 0);
    let members = shuffled.slice(idx, idx + size);
    if (sortAlpha) members = [...members].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    teams.push({
      id: i + 1,
      name: `${i + 1}팀`,
      members,
      color: preserveColors?.[i] ?? TEAM_COLORS[i % TEAM_COLORS.length],
    });
    idx += size;
  }
  return teams;
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

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
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value);
          if (!isNaN(v) && v >= min && v <= max) onChange(v);
        }}
        className="w-16 text-center border border-border rounded-xl py-1.5 bg-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronUp className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}

// ─── TeamCard ─────────────────────────────────────────────────────────────────

function TeamCard({
  team,
  onReshuffle,
  onRename,
}: {
  team: Team;
  onReshuffle: () => void;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(team.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraft(team.name);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const confirmEdit = () => {
    if (draft.trim()) onRename(draft.trim());
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(team.name);
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`rounded-2xl border-2 ${team.color.border} ${team.color.bg} overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div className={`${team.color.headerBg} px-4 py-3 flex items-center justify-between gap-2`}>
        {editing ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              className={`text-sm font-bold ${team.color.nameText} bg-white/80 rounded-lg px-2 py-0.5 w-28 focus:outline-none focus:ring-2 focus:ring-white/60`}
            />
            <button onClick={confirmEdit} className={`p-1 rounded-md hover:bg-white/40 transition-colors ${team.color.nameText}`}>
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={cancelEdit} className={`p-1 rounded-md hover:bg-white/40 transition-colors ${team.color.nameText}`}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className={`font-bold text-sm ${team.color.nameText} truncate`}>{team.name}</span>
            <button
              onClick={startEdit}
              className={`opacity-50 hover:opacity-100 transition-opacity p-0.5 rounded ${team.color.nameText}`}
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        )}
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${team.color.badgeBg} ${team.color.badgeText}`}>
          {team.members.length}명
        </span>
      </div>

      {/* Members */}
      <div className="px-4 py-3 space-y-2.5 flex-1">
        {team.members.map((member) => (
          <div key={member.id} className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full ${team.color.avatarBg} flex items-center justify-center flex-shrink-0`}
            >
              <span className={`text-xs font-bold ${team.color.nameText}`}>{member.name[0]}</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-800 leading-tight">{member.name}</div>
              <div className="text-xs text-gray-400 truncate">{member.username}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={`px-4 py-2.5 border-t ${team.color.border}`}>
        <button
          onClick={onReshuffle}
          className={`text-xs flex items-center gap-1.5 font-semibold ${team.color.nameText} opacity-60 hover:opacity-100 transition-opacity`}
        >
          <RefreshCw className="w-3 h-3" />
          다시 뽑기
        </button>
      </div>
    </motion.div>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

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
    <label className="flex items-center gap-3 cursor-pointer group select-none" onClick={onChange}>
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          checked
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300 bg-white group-hover:border-blue-400"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState<"teamCount" | "membersPerTeam">("teamCount");
  const [teamCount, setTeamCount] = useState(7);
  const [membersPerTeam, setMembersPerTeam] = useState(3);
  const [options, setOptions] = useState({
    differentFromLast: false,
    sortAlpha: false,
  });
  const [students, setStudents] = useState<StudentEntry[]>(
    studentData.students.map((s) => ({ ...s, included: true }))
  );
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const lastResultKey = useRef<string>("");

  // Derived
  const includedStudents = students.filter((s) => s.included);
  const includedCount = includedStudents.length;

  const effectiveTeamCount =
    mode === "teamCount"
      ? Math.max(1, Math.min(teamCount, includedCount))
      : Math.max(1, Math.ceil(includedCount / Math.max(1, membersPerTeam)));

  const effectiveMembersBase =
    effectiveTeamCount > 0 ? Math.floor(includedCount / effectiveTeamCount) : 0;

  const remainder = effectiveTeamCount > 0 ? includedCount % effectiveTeamCount : 0;

  // Handlers
  const handleShuffle = async () => {
    if (includedCount === 0) {
      toast.error("참여할 교육생이 없습니다.");
      return;
    }
    if (effectiveTeamCount < 1) {
      toast.error("팀 수가 올바르지 않습니다.");
      return;
    }

    setIsShuffling(true);
    await new Promise((r) => setTimeout(r, 700));

    let result = buildTeams(
      includedStudents,
      effectiveTeamCount,
      options.sortAlpha,
      teams?.map((t) => t.color)
    );

    if (options.differentFromLast && lastResultKey.current) {
      const key = (r: Team[]) => r.map((t) => t.members.map((m) => m.id).join(",")).join("|");
      let attempts = 0;
      while (key(result) === lastResultKey.current && attempts < 12) {
        result = buildTeams(
          includedStudents,
          effectiveTeamCount,
          options.sortAlpha,
          teams?.map((t) => t.color)
        );
        attempts++;
      }
      lastResultKey.current = key(result);
    }

    setTeams(result);
    setIsShuffling(false);
    toast.success("팀 편성이 완료되었습니다!");
  };

  const handleReshuffleTeam = (teamId: number) => {
    if (!teams) return;
    // Collect all members, re-shuffle globally but preserve team sizes & colors
    const allMembers = teams.flatMap((t) => t.members);
    const shuffled = fisherYatesShuffle(allMembers);
    let idx = 0;
    const newTeams = teams.map((team) => {
      let members = shuffled.slice(idx, idx + team.members.length);
      if (options.sortAlpha) members = [...members].sort((a, b) => a.name.localeCompare(b.name, "ko"));
      idx += team.members.length;
      return { ...team, members };
    });
    setTeams(newTeams);
    toast.success(`팀을 다시 편성했습니다.`);
  };

  const handleRenameTeam = (teamId: number, name: string) => {
    if (!teams) return;
    setTeams(teams.map((t) => (t.id === teamId ? { ...t, name } : t)));
  };

  const handleCopyText = () => {
    if (!teams) return;
    const text = teams
      .map(
        (t) =>
          `[${t.name}] (${t.members.length}명)\n${t.members
            .map((m) => `  · ${m.name} (${m.username})`)
            .join("\n")}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(text).then(() => toast.success("텍스트로 복사되었습니다!"));
  };

  const handleCopyJSON = () => {
    if (!teams) return;
    const data = teams.map((t) => ({
      team: t.name,
      count: t.members.length,
      members: t.members.map((m) => ({ name: m.name, username: m.username })),
    }));
    navigator.clipboard
      .writeText(JSON.stringify(data, null, 2))
      .then(() => toast.success("JSON으로 복사되었습니다!"));
  };

  const handleSaveImage = () => {
    toast.info("화면을 캡처하거나 브라우저 인쇄(Ctrl+P) 기능을 이용해 주세요.");
  };

  const handleReset = () => {
    setTeams(null);
    setStudents(studentData.students.map((s) => ({ ...s, included: true })));
    setMode("teamCount");
    setTeamCount(7);
    setMembersPerTeam(3);
    setOptions({ differentFromLast: false, sortAlpha: false });
    lastResultKey.current = "";
    toast.success("초기화되었습니다.");
  };

  const toggleStudent = (id: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, included: !s.included } : s))
    );
  };

  const hasExcluded = students.some((s) => !s.included);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate">
              SSAFY 광주 2반 랜덤 팀 편성
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              21명의 교육생을 공정하게 랜덤으로 편성해 보세요.
            </p>
          </div>
          <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full border border-blue-200 flex-shrink-0">
            <Users className="w-3.5 h-3.5" />
            교육생 21명
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Settings + Student List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Settings Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">팀 편성 설정</h2>

            {/* Mode selector */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">편성 방식</p>
              <div className="flex rounded-xl border border-border overflow-hidden bg-gray-50 p-1 gap-1">
                {(["teamCount", "membersPerTeam"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                      mode === m
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white"
                    }`}
                  >
                    {m === "teamCount" ? "팀 수로 나누기" : "팀당 인원수로 나누기"}
                  </button>
                ))}
              </div>
            </div>

            {/* Numeric settings */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2.5">팀 수</p>
                {mode === "teamCount" ? (
                  <Stepper
                    value={teamCount}
                    onChange={setTeamCount}
                    min={1}
                    max={Math.max(1, includedCount)}
                  />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-300">{effectiveTeamCount}</span>
                    <span className="text-sm text-gray-400">팀</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2.5">팀당 인원수</p>
                {mode === "membersPerTeam" ? (
                  <Stepper
                    value={membersPerTeam}
                    onChange={setMembersPerTeam}
                    min={1}
                    max={Math.max(1, includedCount)}
                  />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-300">{effectiveMembersBase}</span>
                    <span className="text-sm text-gray-400">명</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info badge */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    <span className="font-bold">{includedCount}명</span>을{" "}
                    <span className="font-bold">{effectiveTeamCount}개 팀</span>으로 구성 &mdash;{" "}
                    팀당 {effectiveMembersBase}명
                    {remainder > 0 && ` ~ ${effectiveMembersBase + 1}명`}
                  </p>
                  {remainder > 0 && (
                    <p className="text-xs text-blue-500 mt-0.5">
                      앞쪽 {remainder}개 팀에 한 명씩 추가 배정됩니다.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Options */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">추가 옵션</p>
              <div className="space-y-2.5">
                <Checkbox
                  checked={options.differentFromLast}
                  onChange={() => setOptions((p) => ({ ...p, differentFromLast: !p.differentFromLast }))}
                  label="직전 결과와 다르게 섞기"
                />
                <Checkbox
                  checked={options.sortAlpha}
                  onChange={() => setOptions((p) => ({ ...p, sortAlpha: !p.sortAlpha }))}
                  label="팀 내 명단 가나다순 정렬"
                />
              </div>
            </div>

            {/* Shuffle button */}
            <button
              onClick={handleShuffle}
              disabled={isShuffling || includedCount === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 text-base"
            >
              <motion.span
                animate={isShuffling ? { rotate: 360 } : { rotate: 0 }}
                transition={isShuffling ? { repeat: Infinity, duration: 0.55, ease: "linear" } : {}}
                className="inline-flex"
              >
                <Shuffle className="w-5 h-5" />
              </motion.span>
              {isShuffling ? "편성 중..." : "랜덤 팀 만들기"}
            </button>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">참여 교육생</h2>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  includedCount === students.length
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-amber-50 text-amber-600 border-amber-200"
                }`}
              >
                {includedCount} / {students.length}명
              </span>
            </div>

            <div className="flex-1 space-y-0.5 overflow-y-auto max-h-[360px] lg:max-h-none pr-0.5">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group ${
                    student.included
                      ? "hover:bg-blue-50 hover:border-blue-100 border border-transparent"
                      : "opacity-50 bg-gray-50 border border-dashed border-gray-200 hover:opacity-70"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                      student.included
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {student.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm font-semibold truncate leading-tight ${
                        student.included ? "text-gray-800" : "text-gray-400 line-through"
                      }`}
                    >
                      {student.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{student.username}</div>
                  </div>
                  {!student.included && (
                    <UserX className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {hasExcluded && (
              <button
                onClick={() => setStudents((prev) => prev.map((s) => ({ ...s, included: true })))}
                className="mt-3 w-full text-xs text-blue-600 hover:text-blue-700 py-2 border border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-colors font-semibold flex-shrink-0"
              >
                모두 포함하기
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {!teams ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white rounded-2xl border border-border shadow-sm p-16 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-blue-200" />
              </div>
              <h3 className="text-base font-bold text-gray-400 mb-1">결과가 여기에 표시됩니다</h3>
              <p className="text-sm text-gray-300">랜덤 팀 만들기 버튼을 눌러 주세요.</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Result header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold text-gray-800">편성 결과</h2>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-200">
                    {teams.length}팀 · {includedCount}명
                  </span>
                </div>
              </div>

              {/* Team grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onReshuffle={() => handleReshuffleTeam(team.id)}
                    onRename={(name) => handleRenameTeam(team.id, name)}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2.5 items-center">
                <button
                  onClick={handleShuffle}
                  disabled={isShuffling}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
                >
                  <RefreshCw className="w-4 h-4" />
                  전체 다시 섞기
                </button>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  결과 복사
                </button>
                <button
                  onClick={handleCopyJSON}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  <FileJson className="w-4 h-4" />
                  JSON으로 복사
                </button>
                <button
                  onClick={handleSaveImage}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  이미지로 저장
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors ml-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  초기화
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
