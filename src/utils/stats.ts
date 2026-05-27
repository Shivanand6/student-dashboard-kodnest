import type { Student } from "@/data/mockStudents";

export function averageMarks(students: Student[]): number {
  if (!students.length) return 0;
  return Math.round(students.reduce((acc, s) => acc + s.marks, 0) / students.length);
}

export function attendancePercentage(students: Student[]): number {
  let total = 0;
  let present = 0;
  students.forEach((s) => {
    total += s.attendance.length;
    present += s.attendance.filter((a) => a.status === "present").length;
  });
  return total === 0 ? 0 : Math.round((present / total) * 100);
}

export function studentAttendancePct(s: Student): number {
  if (!s.attendance.length) return 0;
  const p = s.attendance.filter((a) => a.status === "present").length;
  return Math.round((p / s.attendance.length) * 100);
}

export function marksDistribution(students: Student[]) {
  const buckets = [
    { range: "0-40", count: 0 },
    { range: "41-60", count: 0 },
    { range: "61-75", count: 0 },
    { range: "76-90", count: 0 },
    { range: "91-100", count: 0 },
  ];
  students.forEach((s) => {
    if (s.marks <= 40) buckets[0].count++;
    else if (s.marks <= 60) buckets[1].count++;
    else if (s.marks <= 75) buckets[2].count++;
    else if (s.marks <= 90) buckets[3].count++;
    else buckets[4].count++;
  });
  return buckets;
}

export function attendanceTrend(students: Student[]) {
  const map = new Map<string, { present: number; absent: number }>();
  students.forEach((s) => {
    s.attendance.forEach((a) => {
      const cur = map.get(a.date) ?? { present: 0, absent: 0 };
      cur[a.status]++;
      map.set(a.date, cur);
    });
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, v]) => ({ date: date.slice(5), ...v }));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}