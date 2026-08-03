import type { Student } from "../types/student";

export function parseClassRoster(
  value: string,
  className: string,
  idBase = Date.now() * 100,
): Student[] {
  const seen = new Set<string>();

  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "").trim())
    .filter(Boolean)
    .map((line, index) => {
      const [rawName, rawUsername] = line.split(/\s*(?:,|\t)\s*/, 2);
      const name = rawName.trim();
      const username = rawUsername?.trim()
        ? rawUsername.trim().startsWith("@")
          ? rawUsername.trim()
          : `@${rawUsername.trim()}`
        : `${className} · ${index + 1}번`;

      return {
        id: idBase + index,
        name,
        username,
        class: className.replace(/\s+/g, "_"),
      };
    })
    .filter((student) => {
      const key = `${student.name}\u0000${student.username}`;
      if (!student.name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function rosterToText(students: Student[]): string {
  return students
    .map((student) => {
      const isGeneratedLabel = student.username.startsWith(`${student.class.replace(/_/g, " ")} · `);
      return isGeneratedLabel ? student.name : `${student.name}, ${student.username}`;
    })
    .join("\n");
}
