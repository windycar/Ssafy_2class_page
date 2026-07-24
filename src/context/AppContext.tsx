import { createContext, useContext, type ReactNode } from "react";
import { STUDENTS } from "../data/students";
import type { Student } from "../types/student";

interface AppContextValue {
  students: Student[];
  totalStudents: number;
}

const AppContext = createContext<AppContextValue>({
  students: STUDENTS,
  totalStudents: STUDENTS.length,
});

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={{ students: STUDENTS, totalStudents: STUDENTS.length }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
