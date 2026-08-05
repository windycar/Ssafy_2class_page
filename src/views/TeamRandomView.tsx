import { useState, useRef } from "react";
import { Shuffle, ChevronUp, ChevronDown, Check, RefreshCw, Copy, FileJson, RotateCcw, Users, School, Plus, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { STUDENTS } from "../data/students";
import { ADDITIONAL_TEAM_CLASS_ROSTERS } from "../data/teamClassRosters";
import { buildTeams, fisherYatesShuffle, teamsResultKey } from "../utils/teamShuffle";
import { copyToClipboard } from "../utils/copyToClipboard";
import { TeamCard } from "../components/team/TeamCard";
import { StudentChip } from "../components/team/StudentChip";
import { EmptyTeamResult } from "../components/team/EmptyTeamResult";
import { teamClassRosterStorage } from "../services/storage/teamClassRosterStorage";
import { parseClassRoster, rosterToText } from "../utils/classRoster";
import type { TeamClassRoster } from "../types/classRoster";
import type { StudentEntry } from "../types/student";
import type { Team } from "../types/team";

const DEFAULT_CLASS_ID = "gwangju-class-2";
const DEFAULT_CLASS_ROSTER: TeamClassRoster = {
  id: DEFAULT_CLASS_ID,
  name: "광주 2반",
  students: STUDENTS,
};

function withParticipation(students: TeamClassRoster["students"]): StudentEntry[] {
  return students.map((student) => ({ ...student, included: true }));
}

function Stepper({ value, onChange, min = 1, max = 20 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= min && v <= max) onChange(v); }}
        className="w-16 text-center border border-border rounded-xl py-1.5 bg-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
      />
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
        <ChevronUp className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none" onClick={onChange}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white group-hover:border-blue-400"}`}>
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export default function TeamRandomView() {
  const [customRosters, setCustomRosters] = useState<TeamClassRoster[]>(() => teamClassRosterStorage.getRosters());
  const fileRosters = [DEFAULT_CLASS_ROSTER, ...ADDITIONAL_TEAM_CLASS_ROSTERS];
  const visibleCustomRosters = customRosters.filter(
    (customRoster) => !fileRosters.some(
      (fileRoster) => fileRoster.id === customRoster.id || fileRoster.name === customRoster.name,
    ),
  );
  const classRosters = [...fileRosters, ...visibleCustomRosters];
  const [selectedClassId, setSelectedClassId] = useState(() => {
    const savedClassId = teamClassRosterStorage.getSelectedClassId();
    return classRosters.some((roster) => roster.id === savedClassId) ? savedClassId! : DEFAULT_CLASS_ID;
  });
  const selectedClassRoster = classRosters.find((roster) => roster.id === selectedClassId) ?? DEFAULT_CLASS_ROSTER;
  const selectedClassIsCustom = visibleCustomRosters.some((roster) => roster.id === selectedClassId);
  const [mode, setMode] = useState<"teamCount" | "membersPerTeam">("teamCount");
  const [teamCount, setTeamCount] = useState(() => Math.min(5, Math.max(1, selectedClassRoster.students.length)));
  const [membersPerTeam, setMembersPerTeam] = useState(() => Math.min(3, Math.max(1, selectedClassRoster.students.length)));
  const [options, setOptions] = useState({ differentFromLast: false, sortAlpha: false, autoTeamName: true });
  const [students, setStudents] = useState<StudentEntry[]>(() => withParticipation(selectedClassRoster.students));
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [randomPickCount, setRandomPickCount] = useState(1);
  const [randomPickedStudents, setRandomPickedStudents] = useState<StudentEntry[]>([]);
  const [isPickingPeople, setIsPickingPeople] = useState(false);
  const [showRosterEditor, setShowRosterEditor] = useState(false);
  const [editingRosterId, setEditingRosterId] = useState<string | null>(null);
  const [draftClassName, setDraftClassName] = useState("");
  const [draftRoster, setDraftRoster] = useState("");
  const lastKey = useRef("");

  const included = students.filter((s) => s.included);
  const includedCount = included.length;
  const effectiveTeamCount = mode === "teamCount" ? Math.max(1, Math.min(teamCount, includedCount)) : Math.max(1, Math.ceil(includedCount / Math.max(1, membersPerTeam)));
  const effectiveMembersBase = effectiveTeamCount > 0 ? Math.floor(includedCount / effectiveTeamCount) : 0;
  const remainder = effectiveTeamCount > 0 ? includedCount % effectiveTeamCount : 0;
  const draftStudentCount = parseClassRoster(draftRoster, draftClassName.trim() || "새 반", 0).length;

  const activateRoster = (roster: TeamClassRoster) => {
    setSelectedClassId(roster.id);
    teamClassRosterStorage.setSelectedClassId(roster.id);
    setStudents(withParticipation(roster.students));
    setTeams(null);
    setRandomPickedStudents([]);
    setRandomPickCount(1);
    setTeamCount(Math.min(5, Math.max(1, roster.students.length)));
    setMembersPerTeam(Math.min(3, Math.max(1, roster.students.length)));
    lastKey.current = "";
  };

  const handleClassChange = (classId: string) => {
    const roster = classRosters.find((item) => item.id === classId);
    if (roster) activateRoster(roster);
  };

  const openNewRosterEditor = () => {
    setEditingRosterId(null);
    setDraftClassName("");
    setDraftRoster("");
    setShowRosterEditor(true);
  };

  const openRosterEditor = () => {
    if (!selectedClassIsCustom) return;
    setEditingRosterId(selectedClassRoster.id);
    setDraftClassName(selectedClassRoster.name);
    setDraftRoster(rosterToText(selectedClassRoster.students));
    setShowRosterEditor(true);
  };

  const handleSaveRoster = () => {
    const className = draftClassName.trim();
    if (!className) {
      toast.error("반 이름을 입력해 주세요.");
      return;
    }

    const duplicate = classRosters.some(
      (roster) => roster.id !== editingRosterId && roster.name.toLocaleLowerCase("ko") === className.toLocaleLowerCase("ko"),
    );
    if (duplicate) {
      toast.error("이미 같은 이름의 반이 있습니다.");
      return;
    }

    const parsedStudents = parseClassRoster(draftRoster, className);
    if (parsedStudents.length === 0) {
      toast.error("교육생 이름을 한 명 이상 입력해 주세요.");
      return;
    }

    const roster: TeamClassRoster = {
      id: editingRosterId ?? `custom-class-${Date.now()}`,
      name: className,
      students: parsedStudents,
    };
    const nextRosters = editingRosterId
      ? customRosters.map((item) => (item.id === editingRosterId ? roster : item))
      : [...customRosters, roster];

    setCustomRosters(nextRosters);
    teamClassRosterStorage.setRosters(nextRosters);
    activateRoster(roster);
    setShowRosterEditor(false);
    toast.success(editingRosterId ? `${className} 명단을 수정했습니다.` : `${className} 명단을 추가했습니다.`);
  };

  const handleDeleteRoster = () => {
    if (!selectedClassIsCustom) return;
    if (!window.confirm(`${selectedClassRoster.name} 명단을 삭제하시겠습니까?`)) return;

    const nextRosters = customRosters.filter((roster) => roster.id !== selectedClassId);
    setCustomRosters(nextRosters);
    teamClassRosterStorage.setRosters(nextRosters);
    activateRoster(DEFAULT_CLASS_ROSTER);
    toast.success("반 명단을 삭제했습니다.");
  };

  const handleShuffle = async () => {
    if (includedCount === 0) { toast.error("참여할 교육생이 없습니다."); return; }
    setIsShuffling(true);
    await new Promise((r) => setTimeout(r, 700));
    let result = buildTeams(included, effectiveTeamCount, options.sortAlpha, options.autoTeamName, teams?.map((t) => t.color));
    if (options.differentFromLast && lastKey.current) {
      let attempts = 0;
      while (teamsResultKey(result) === lastKey.current && attempts < 12) {
        result = buildTeams(included, effectiveTeamCount, options.sortAlpha, options.autoTeamName, teams?.map((t) => t.color));
        attempts++;
      }
    }
    lastKey.current = teamsResultKey(result);
    setTeams(result);
    setIsShuffling(false);
    toast.success("팀 편성이 완료되었습니다!");
  };

  const handleRandomPeoplePick = async () => {
    if (includedCount === 0) {
      toast.error("뽑을 수 있는 교육생이 없습니다.");
      return;
    }

    setIsPickingPeople(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    const count = Math.min(randomPickCount, includedCount);
    setRandomPickedStudents(fisherYatesShuffle(included).slice(0, count));
    setIsPickingPeople(false);
    toast.success(`${count}명을 랜덤으로 뽑았습니다.`);
  };

  const handleReshuffleTeam = () => {
    if (!teams) return;
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
    toast.success("다시 편성되었습니다.");
  };

  const handleRenameTeam = (teamId: number, name: string) => {
    if (!teams) return;
    setTeams(teams.map((t) => (t.id === teamId ? { ...t, name } : t)));
  };

  const handleCopyText = async () => {
    if (!teams) return;
    const text = teams.map((t) => `[${t.name}] (${t.members.length}명)\n${t.members.map((m) => `  · ${m.name} (${m.username})`).join("\n")}`).join("\n\n");
    const ok = await copyToClipboard(text);
    ok ? toast.success("텍스트로 복사되었습니다!") : toast.error("복사에 실패했습니다.");
  };

  const handleCopyJSON = async () => {
    if (!teams) return;
    const data = teams.map((t) => ({ team: t.name, count: t.members.length, members: t.members.map((m) => ({ name: m.name, username: m.username })) }));
    const ok = await copyToClipboard(JSON.stringify(data, null, 2));
    ok ? toast.success("JSON으로 복사되었습니다!") : toast.error("복사에 실패했습니다.");
  };

  const handleReset = () => {
    setTeams(null);
    setStudents(withParticipation(selectedClassRoster.students));
    setMode("teamCount");
    setTeamCount(Math.min(5, Math.max(1, selectedClassRoster.students.length)));
    setMembersPerTeam(Math.min(3, Math.max(1, selectedClassRoster.students.length)));
    setOptions({ differentFromLast: false, sortAlpha: false, autoTeamName: true });
    setRandomPickCount(1);
    setRandomPickedStudents([]);
    lastKey.current = "";
    toast.success("초기화되었습니다.");
  };

  const hasExcluded = students.some((s) => !s.included);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
          <Shuffle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">랜덤 팀 편성</h1>
          <p className="text-sm text-gray-500">선택한 반의 교육생만 공정하게 랜덤으로 편성합니다.</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
          <Users className="w-3.5 h-3.5" />
          {selectedClassRoster.name} · {students.length}명
        </span>
      </div>

      <section className="rounded-2xl border border-[#1259AA]/15 bg-gradient-to-br from-white to-blue-50/60 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <School className="h-4 w-4 text-[#1259AA]" />
              <label htmlFor="team-class-select" className="text-sm font-extrabold text-gray-800">편성할 반</label>
            </div>
            <select
              id="team-class-select"
              value={selectedClassId}
              onChange={(event) => handleClassChange(event.target.value)}
              className="w-full rounded-xl border border-[#1259AA]/20 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm outline-none transition focus:border-[#1259AA] focus:ring-2 focus:ring-[#1259AA]/15 lg:max-w-md"
            >
              {classRosters.map((roster) => (
                <option key={roster.id} value={roster.id}>{roster.name} ({roster.students.length}명)</option>
              ))}
            </select>
            <p className="mt-2 text-xs font-medium text-[#1259AA]">
              현재 {selectedClassRoster.name} 명단만 사용합니다. 2반을 제외한 다른 반을 선택하면 2반 20명은 편성 후보에 포함되지 않습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openNewRosterEditor}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1259AA] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0d4a8f]"
            >
              <Plus className="h-4 w-4" />다른 반 추가
            </button>
            {selectedClassIsCustom && (
              <>
                <button
                  type="button"
                  onClick={openRosterEditor}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4" />명단 수정
                </button>
                <button
                  type="button"
                  onClick={handleDeleteRoster}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-50"
                  aria-label={`${selectedClassRoster.name} 삭제`}
                >
                  <Trash2 className="h-4 w-4" />삭제
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Settings Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6 space-y-5 flex flex-col">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">팀 편성 설정</h2>

          {/* Mode */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">편성 방식</p>
            <div className="flex rounded-xl border border-border overflow-hidden bg-gray-50 p-1 gap-1">
              {(["teamCount", "membersPerTeam"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === m ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white"}`}>
                  {m === "teamCount" ? "팀 수로 나누기" : "팀당 인원수로 나누기"}
                </button>
              ))}
            </div>
          </div>

          {/* Numeric */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2.5">팀 수</p>
              {mode === "teamCount" ? <Stepper value={teamCount} onChange={setTeamCount} min={1} max={Math.max(1, includedCount)} /> : <div className="flex items-baseline gap-1"><span className="text-3xl font-extrabold text-gray-300">{effectiveTeamCount}</span><span className="text-sm text-gray-400">팀</span></div>}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2.5">팀당 인원수</p>
              {mode === "membersPerTeam" ? <Stepper value={membersPerTeam} onChange={setMembersPerTeam} min={1} max={Math.max(1, includedCount)} /> : <div className="flex items-baseline gap-1"><span className="text-3xl font-extrabold text-gray-300">{effectiveMembersBase}</span><span className="text-sm text-gray-400">명</span></div>}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  <span className="font-bold">{includedCount}명</span>을 <span className="font-bold">{effectiveTeamCount}개 팀</span>으로 구성 &mdash; 팀당 {effectiveMembersBase}명{remainder > 0 && ` ~ ${effectiveMembersBase + 1}명`}
                </p>
                {remainder > 0 && <p className="text-xs text-blue-500 mt-0.5">앞쪽 {remainder}개 팀에 한 명씩 추가 배정됩니다.</p>}
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">추가 옵션</p>
            <div className="space-y-2.5">
              <Checkbox checked={options.differentFromLast} onChange={() => setOptions((p) => ({ ...p, differentFromLast: !p.differentFromLast }))} label="직전 결과와 다르게 섞기" />
              <Checkbox checked={options.sortAlpha} onChange={() => setOptions((p) => ({ ...p, sortAlpha: !p.sortAlpha }))} label="팀 내 명단 가나다순 정렬" />
              <Checkbox checked={options.autoTeamName} onChange={() => setOptions((p) => ({ ...p, autoTeamName: !p.autoTeamName }))} label="팀 이름 자동 생성 (알파, 베타, 감마…)" />
            </div>
          </div>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            disabled={isShuffling || includedCount === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-200 text-base"
          >
            <motion.span animate={isShuffling ? { rotate: 360 } : { rotate: 0 }} transition={isShuffling ? { repeat: Infinity, duration: 0.55, ease: "linear" } : {}} className="inline-flex">
              <Shuffle className="w-5 h-5" />
            </motion.span>
            {isShuffling ? "편성 중..." : "랜덤 팀 만들기"}
          </button>

          <div className="mt-1 pt-5 border-t border-[#dce8e3] flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-gray-800">랜덤 사람 뽑기</h3>
                <p className="text-xs text-gray-500 mt-1">참여 교육생 중 원하는 인원만 중복 없이 뽑습니다.</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">최대 {includedCount}명</span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">랜덤 뽑기 인원</p>
                <div className="flex items-center gap-2">
                  <Stepper value={Math.min(randomPickCount, Math.max(1, includedCount))} onChange={setRandomPickCount} min={1} max={Math.max(1, includedCount)} />
                  <span className="text-sm font-semibold text-gray-500">명</span>
                </div>
              </div>
              <button
                onClick={handleRandomPeoplePick}
                disabled={isPickingPeople || includedCount === 0}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-100"
              >
                <motion.span animate={isPickingPeople ? { rotate: 360 } : { rotate: 0 }} transition={isPickingPeople ? { repeat: Infinity, duration: 0.55, ease: "linear" } : {}} className="inline-flex">
                  <Shuffle className="w-4 h-4" />
                </motion.span>
                {isPickingPeople ? "뽑는 중..." : `랜덤 뽑기 - ${Math.min(randomPickCount, includedCount)}명`}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {randomPickedStudents.length > 0 ? (
                <motion.div key="picked-people" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-5 rounded-2xl border border-emerald-100 bg-[linear-gradient(135deg,#f2fbf7_0%,#f8fbfa_100%)] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-emerald-800">랜덤 추첨 결과</p>
                    <span className="text-xs font-bold text-emerald-700 bg-white/80 rounded-full px-2.5 py-1">{randomPickedStudents.length}명</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {randomPickedStudents.map((student, index) => (
                      <div key={student.id} className="bg-white/90 border border-emerald-100 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-extrabold flex items-center justify-center">{index + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{student.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{student.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty-picked-people" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex-1 min-h-[145px] rounded-2xl border-2 border-dashed border-[#d8e8e0] bg-[#f8fbf9]/70 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2"><Shuffle className="w-5 h-5" /></div>
                  <p className="text-sm font-bold text-gray-600">랜덤 뽑기 결과가 여기 표시됩니다.</p>
                  <p className="text-xs text-gray-400 mt-1">인원을 정한 뒤 버튼을 눌러주세요.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">참여 교육생</h2>
              <p className="mt-0.5 text-xs font-semibold text-[#1259AA]">{selectedClassRoster.name}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${includedCount === students.length ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
              {includedCount} / {students.length}명
            </span>
          </div>
          <div className="flex-1 space-y-0.5 overflow-y-auto max-h-[360px] lg:max-h-none pr-0.5">
            {students.map((s) => <StudentChip key={s.id} student={s} onToggle={() => setStudents((prev) => prev.map((x) => x.id === s.id ? { ...x, included: !x.included } : x))} />)}
          </div>
          {hasExcluded && (
            <button onClick={() => setStudents((prev) => prev.map((s) => ({ ...s, included: true })))} className="mt-3 w-full text-xs text-blue-600 hover:text-blue-700 py-2 border border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-colors font-semibold flex-shrink-0">
              모두 포함하기
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {!teams ? (
          <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <EmptyTeamResult />
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-gray-800">편성 결과</h2>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-200">{teams.length}팀 · {includedCount}명</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
              {teams.map((team) => <TeamCard key={team.id} team={team} onReshuffle={handleReshuffleTeam} onRename={(name) => handleRenameTeam(team.id, name)} />)}
            </div>
            <div className="flex flex-wrap gap-2.5 items-center">
              <button onClick={handleShuffle} disabled={isShuffling} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60">
                <RefreshCw className="w-4 h-4" />전체 다시 섞기
              </button>
              <button onClick={handleCopyText} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                <Copy className="w-4 h-4" />결과 복사
              </button>
              <button onClick={handleCopyJSON} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                <FileJson className="w-4 h-4" />JSON으로 복사
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors ml-auto">
                <RotateCcw className="w-4 h-4" />초기화
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h2 id="roster-editor-title" className="text-lg font-extrabold text-gray-900">
                  {editingRosterId ? "반 명단 수정" : "다른 반 추가"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">저장한 명단은 이 기기의 랜덤 팀 편성에서만 사용됩니다.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRosterEditor(false)}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="명단 편집 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
              <div>
                <label htmlFor="class-name" className="mb-2 block text-sm font-bold text-gray-700">반 이름</label>
                <input
                  id="class-name"
                  value={draftClassName}
                  onChange={(event) => setDraftClassName(event.target.value)}
                  placeholder="예: 광주 1반"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition focus:border-[#1259AA] focus:ring-2 focus:ring-[#1259AA]/15"
                  autoFocus
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="class-roster" className="text-sm font-bold text-gray-700">교육생 명단</label>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1259AA]">{draftStudentCount}명</span>
                </div>
                <textarea
                  id="class-roster"
                  value={draftRoster}
                  onChange={(event) => setDraftRoster(event.target.value)}
                  placeholder={"한 줄에 한 명씩 입력하세요.\n김싸피\n이싸피, @ssafy02\n박싸피"}
                  rows={10}
                  className="w-full resize-y rounded-xl border border-border px-3.5 py-3 font-mono text-sm leading-6 outline-none transition focus:border-[#1259AA] focus:ring-2 focus:ring-[#1259AA]/15"
                />
                <p className="mt-2 text-xs text-gray-500">아이디는 선택 사항입니다. 입력하려면 “이름, @아이디” 형식을 사용하세요.</p>
              </div>
            </div>

            <div className="flex gap-2 border-t border-border bg-gray-50 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => setShowRosterEditor(false)}
                className="flex-1 rounded-xl border border-border bg-white py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveRoster}
                className="flex-1 rounded-xl bg-[#1259AA] py-2.5 text-sm font-bold text-white transition hover:bg-[#0d4a8f]"
              >
                {editingRosterId ? "수정 내용 저장" : "반 명단 추가"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
