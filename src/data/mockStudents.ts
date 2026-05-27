export type AttendanceStatus = "present" | "absent";

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  course: string;
  marks: number;
  attendance: AttendanceRecord[];
  avatar?: string;
  email?: string;
}

export interface StudentRequest {
  id: string;
  name: string;
  course: string;
  requestedAt: string;
  reason: string;
}

const COURSES = ["Computer Science", "Mathematics", "Physics", "Design", "Business", "Engineering"];
const NAMES = [
  "Aarav Sharma", "Maya Patel", "Liam Chen", "Sofia Rossi", "Noah Williams",
  "Zara Khan", "Ethan Brown", "Mia Garcia", "Lucas Müller", "Aria Tanaka",
  "Kai Nakamura", "Emma Dubois", "Oliver Smith", "Isla MacLeod", "Yuki Sato",
];

function makeAttendance(seed: number): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    records.push({
      date: d.toISOString().slice(0, 10),
      status: (seed * (i + 1)) % 5 === 0 ? "absent" : "present",
    });
  }
  return records;
}

export const mockStudents: Student[] = NAMES.map((name, i) => ({
  id: `STU${String(1001 + i)}`,
  name,
  age: 18 + (i % 8),
  course: COURSES[i % COURSES.length],
  marks: 55 + ((i * 7) % 45),
  email: `${name.toLowerCase().replace(/\s+/g, ".")}@university.edu`,
  attendance: makeAttendance(i + 1),
}));

export const mockRequests: StudentRequest[] = [
  { id: "REQ001", name: "Daniel Reyes", course: "Computer Science", requestedAt: "2026-05-20", reason: "Course transfer" },
  { id: "REQ002", name: "Sara Lindqvist", course: "Design", requestedAt: "2026-05-22", reason: "New admission" },
  { id: "REQ003", name: "Tomás Álvarez", course: "Physics", requestedAt: "2026-05-24", reason: "Re-enrollment" },
  { id: "REQ004", name: "Priya Kapoor", course: "Mathematics", requestedAt: "2026-05-25", reason: "Scholarship review" },
];

export const recentActivity = [
  { id: 1, action: "Added new student", subject: "Maya Patel", time: "2m ago", type: "add" as const },
  { id: 2, action: "Marked attendance", subject: "CS Batch", time: "1h ago", type: "attendance" as const },
  { id: 3, action: "Updated marks", subject: "Liam Chen", time: "3h ago", type: "edit" as const },
  { id: 4, action: "Processed request", subject: "REQ001", time: "Yesterday", type: "request" as const },
  { id: 5, action: "Exported report", subject: "May 2026", time: "Yesterday", type: "report" as const },
];