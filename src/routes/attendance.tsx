import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CalendarCheck, UserCheck, UserX } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useStudentsStore } from "@/hooks/useStudentsStore";
import { getInitials, attendanceTrend } from "@/utils/stats";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/attendance")({ component: AttendancePage });

function AttendancePage() {
  const { students, markAttendanceForAll, markAttendance } = useStudentsStore();
  const today = new Date().toISOString().slice(0, 10);
  const trend = attendanceTrend(students);

  const handleMarkAll = (status: "present" | "absent") => {
    markAttendanceForAll(status);
    toast.success(`Marked all students as ${status}`);
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-primary text-primary-foreground shadow-glow flex h-12 w-12 items-center justify-center rounded-2xl">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Today's attendance</h2>
              <p className="text-muted-foreground text-sm">Mark attendance for {today}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleMarkAll("present")} className="gradient-primary text-primary-foreground shadow-glow inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]">
              <UserCheck className="h-4 w-4" /> Mark All Present
            </button>
            <button onClick={() => handleMarkAll("absent")} className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]">
              <UserX className="h-4 w-4" /> Mark All Absent
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 !p-0 overflow-hidden">
          <div className="border-border/40 border-b px-6 py-4">
            <h3 className="text-lg font-semibold">Attendance History</h3>
            <p className="text-muted-foreground text-xs">Today's records — tap to toggle</p>
          </div>
          <div className="max-h-[460px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-card/50 sticky top-0 backdrop-blur">
                <tr className="text-muted-foreground text-left text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Course</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const rec = s.attendance.find((a) => a.date === today);
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-border/40 border-b last:border-0"
                    >
                      <td className="px-6 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="gradient-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
                            {getInitials(s.name)}
                          </div>
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-muted-foreground text-xs">{s.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted-foreground px-6 py-2.5 text-xs">{s.course}</td>
                      <td className="px-6 py-2.5">{rec ? <StatusBadge status={rec.status} /> : <span className="text-muted-foreground text-xs">Not marked</span>}</td>
                      <td className="px-6 py-2.5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => markAttendance(s.id, "present")}
                            className="bg-success/10 text-success hover:bg-success/20 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all hover:scale-105"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(s.id, "absent")}
                            className="bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all hover:scale-105"
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold">Analytics</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="present" fill="oklch(0.7 0.22 260)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="absent" fill="oklch(0.65 0.24 25)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}