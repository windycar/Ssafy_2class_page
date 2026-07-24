import { useState, useRef } from "react";
import { Shuffle, ChevronUp, ChevronDown, Check, RefreshCw, Copy, FileJson, RotateCcw, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { STUDENTS } from "../data/students";
import { buildTeams, fisherYatesShuffle, teamsResultKey } from "../utils/teamShuffle";
import { copyToClipboard } from "../utils/copyToClipboard";
import { TeamCard } from "../components/team/TeamCard";
import { StudentChip } from "../components/team/StudentChip";
import { EmptyTeamResult } from "../components/team/EmptyTeamResult";
import type { StudentEntry } from "../types/student";
import type { Team } from "../types/team";

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
  const [mode, setMode] = useState<"teamCount" | "membersPerTeam">("teamCount");
  const [teamCount, setTeamCount] = useState(7);
  const [membersPerTeam, setMembersPerTeam] = useState(3);
  const [options, setOptions] = useState({ differentFromLast: false, sortAlpha: false, autoTeamName: true });
  const [students, setStudents] = useState<StudentEntry[]>(STUDENTS.map((s) => ({ ...s, included: true })));
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const lastKey = useRef("");

  const included = students.filter((s) => s.included);
  const includedCount = included.length;
  const effectiveTeamCount = mode === "teamCount" ? Math.max(1, Math.min(teamCount, includedCount)) : Math.max(1, Math.ceil(includedCount / Math.max(1, membersPerTeam)));
  const effectiveMembersBase = effectiveTeamCount > 0 ? Math.floor(includedCount / effectiveTeamCount) : 0;
  const remainder = effectiveTeamCount > 0 ? includedCount % effectiveTeamCount : 0;

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
    setStudents(STUDENTS.map((s) => ({ ...s, included: true })));
    setMode("teamCount");
    setTeamCount(7);
    setMembersPerTeam(3);
    setOptions({ differentFromLast: false, sortAlpha: false, autoTeamName: true });
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
          <p className="text-sm text-gray-500">21명의 교육생을 공정하게 랜덤으로 편성해 보세요.</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
          <Users className="w-3.5 h-3.5" />
          교육생 21명
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Settings Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6 space-y-5">
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
        </div>

        {/* Student List */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">참여 교육생</h2>
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
    </div>
  );
}
