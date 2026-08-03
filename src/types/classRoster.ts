import type { Student } from "./student";

export interface TeamClassRoster {
  id: string;
  name: string;
  students: Student[];
}
