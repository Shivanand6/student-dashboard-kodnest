import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockStudents, mockRequests, type Student, type StudentRequest, type AttendanceStatus } from "@/data/mockStudents";

interface StudentsContextValue {
  students: Student[];
  requests: StudentRequest[];
  addStudent: (s: Omit<Student, "attendance">) => void;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  deleteStudent: (id: string) => Student | undefined;
  restoreStudent: (s: Student) => void;
  markAttendanceForAll: (status: AttendanceStatus) => void;
  markAttendance: (id: string, status: AttendanceStatus) => void;
  processRequest: (id: string) => void;
}

const StudentsContext = createContext<StudentsContextValue | null>(null);

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [requests, setRequests] = useState<StudentRequest[]>(mockRequests);

  const addStudent = useCallback((s: Omit<Student, "attendance">) => {
    setStudents((prev) => [{ ...s, attendance: [] }, ...prev]);
  }, []);

  const updateStudent = useCallback((id: string, patch: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const deleteStudent = useCallback((id: string) => {
    let removed: Student | undefined;
    setStudents((prev) => {
      removed = prev.find((s) => s.id === id);
      return prev.filter((s) => s.id !== id);
    });
    return removed;
  }, []);

  const restoreStudent = useCallback((s: Student) => {
    setStudents((prev) => (prev.some((x) => x.id === s.id) ? prev : [s, ...prev]));
  }, []);

  const markAttendance = useCallback((id: string, status: AttendanceStatus) => {
    const date = new Date().toISOString().slice(0, 10);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const filtered = s.attendance.filter((a) => a.date !== date);
        return { ...s, attendance: [...filtered, { date, status }] };
      }),
    );
  }, []);

  const markAttendanceForAll = useCallback((status: AttendanceStatus) => {
    const date = new Date().toISOString().slice(0, 10);
    setStudents((prev) =>
      prev.map((s) => {
        const filtered = s.attendance.filter((a) => a.date !== date);
        return { ...s, attendance: [...filtered, { date, status }] };
      }),
    );
  }, []);

  const processRequest = useCallback((id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <StudentsContext.Provider
      value={{ students, requests, addStudent, updateStudent, deleteStudent, restoreStudent, markAttendance, markAttendanceForAll, processRequest }}
    >
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudentsStore() {
  const ctx = useContext(StudentsContext);
  if (!ctx) throw new Error("useStudentsStore must be used within StudentsProvider");
  return ctx;
}