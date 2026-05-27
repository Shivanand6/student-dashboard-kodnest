import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Users, GraduationCap, CalendarCheck, UserPlus, BarChart3, Inbox, Sparkles, Activity, FilePlus2 } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { GlassCard } from "@/components/common/GlassCard";
import { useStudentsStore } from "@/hooks/useStudentsStore";
import { averageMarks, attendancePercentage, attendanceTrend } from "@/utils/stats";
import { recentActivity } from "@/data/mockStudents";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/")({
  component: Index,
});

const activityIcons = {
  add: UserPlus,
  attendance: CalendarCheck,
  edit: Sparkles,
  request: Inbox,
  report: BarChart3,
} as const;

function Index() {
  const { students } = useStudentsStore();
  const avg = averageMarks(students);
  const att = attendancePercentage(students);
  const trend = attendanceTrend(students);

  return (
    <div className="space-y-6">
      {/* Hero strip */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-8"
      >
        <div className="gradient-aurora animate-aurora absolute inset-0 -z-10 opacity-30" />
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-muted-foreground text-sm">Welcome back 👋</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Your <span className="gradient-text">command center</span> is ready
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">Track students, attendance, and performance — all in real time.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/students/add" className="gradient-primary shadow-glow text-primary-foreground inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]">
              <UserPlus className="h-4 w-4" /> Add Student
            </Link>
            <Link to="/attendance" className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]">
              <CalendarCheck className="h-4 w-4" /> Mark Attendance
            </Link>
            <Link to="/reports" className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]">
              <FilePlus2 className="h-4 w-4" /> Export Report
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Students" value={students.length} icon={Users} trend="+12% this month" accent="primary" delay={0.05} />
        <StatCard label="Average Marks" value={`${avg}/100`} icon={GraduationCap} trend="+4.2 vs last term" accent="accent" delay={0.1} />
        <StatCard label="Attendance" value={`${att}%`} icon={CalendarCheck} trend="+1.8% this week" accent="success" delay={0.15} />
      </section>

      {/* Chart + Activity */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Attendance Trend</h3>
              <p className="text-muted-foreground text-xs">Last 14 days · all students</p>
            </div>
            <div className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
              <Activity className="h-3 w-3" /> Live
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="present" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.22 260)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.7 0.22 260)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="absent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="present" stroke="oklch(0.7 0.22 260)" strokeWidth={2.5} fill="url(#present)" />
                <Area type="monotone" dataKey="absent" stroke="oklch(0.65 0.24 25)" strokeWidth={2} fill="url(#absent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
          <ul className="space-y-3">
            {recentActivity.map((a, i) => {
              const Icon = activityIcons[a.type];
              return (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="glass flex items-center gap-3 rounded-xl p-3"
                >
                  <div className="gradient-primary text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.action}</p>
                    <p className="text-muted-foreground truncate text-xs">{a.subject}</p>
                  </div>
                  <span className="text-muted-foreground shrink-0 text-xs">{a.time}</span>
                </motion.li>
              );
            })}
          </ul>
        </GlassCard>
      </section>
    </div>
  );
}
