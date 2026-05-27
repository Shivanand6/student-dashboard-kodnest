
import { type Student } from "@/data/mockStudents";

const API_URL = "http://127.0.0.1:5000";

export async function getStudents(): Promise<Student[]> {
  const res = await fetch(`${API_URL}/students`);
  return await res.json();
}

export async function addStudent(student: Omit<Student, "attendance">): Promise<Student> {
  const res = await fetch(`${API_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });

  return await res.json();
}

export async function updateStudent(id: string, patch: Partial<Student>) {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });

  return await res.json();
}

export async function deleteStudent(id: string) {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: "DELETE",
  });

  return await res.json();
}

export async function markAttendance(
  studentId: string,
  status: "present" | "absent"
) {
  const res = await fetch(`${API_URL}/attendance/${studentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      date: new Date().toISOString().slice(0, 10),
    }),
  });

  return await res.json();
}
