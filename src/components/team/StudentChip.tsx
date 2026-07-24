import { UserX } from "lucide-react";
import type { StudentEntry } from "../../types/student";

interface StudentChipProps {
  student: StudentEntry;
  onToggle: () => void;
}

export function StudentChip({ student, onToggle }: StudentChipProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group ${
        student.included
          ? "hover:bg-blue-50 hover:border-blue-100 border border-transparent"
          : "opacity-50 bg-gray-50 border border-dashed border-gray-200 hover:opacity-70"
      }`}
      aria-label={`${student.name} ${student.included ? "제외" : "포함"}`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
          student.included ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-400"
        }`}
      >
        {student.name[0]}
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-semibold truncate leading-tight ${student.included ? "text-gray-800" : "text-gray-400 line-through"}`}>
          {student.name}
        </div>
        <div className="text-xs text-gray-400 truncate">{student.username}</div>
      </div>
      {!student.included && <UserX className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
    </button>
  );
}
