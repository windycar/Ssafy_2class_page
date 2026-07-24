import { useState, useRef } from "react";
import { Pencil, Check, X, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import type { Team } from "../../types/team";

interface TeamCardProps {
  team: Team;
  onReshuffle: () => void;
  onRename: (name: string) => void;
}

export function TeamCard({ team, onReshuffle, onRename }: TeamCardProps) {
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
              className={`text-sm font-bold ${team.color.nameText} bg-white/80 rounded-lg px-2 py-0.5 w-28 focus:outline-none`}
            />
            <button onClick={confirmEdit} className={`p-1 rounded hover:bg-white/40 transition-colors ${team.color.nameText}`}>
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={cancelEdit} className={`p-1 rounded hover:bg-white/40 transition-colors ${team.color.nameText}`}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className={`font-bold text-sm ${team.color.nameText} truncate`}>{team.name}</span>
            <button onClick={startEdit} className={`opacity-50 hover:opacity-100 transition-opacity ${team.color.nameText}`} aria-label="팀명 수정">
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        )}
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${team.color.badgeBg} ${team.color.badgeText}`}>
          {team.members.length}명
        </span>
      </div>

      <div className="px-4 py-3 space-y-2.5 flex-1">
        {team.members.map((member) => (
          <div key={member.id} className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full ${team.color.avatarBg} flex items-center justify-center flex-shrink-0`}>
              <span className={`text-xs font-bold ${team.color.nameText}`}>{member.name[0]}</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-800 leading-tight">{member.name}</div>
              <div className="text-xs text-gray-400 truncate">{member.username}</div>
            </div>
          </div>
        ))}
      </div>

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
