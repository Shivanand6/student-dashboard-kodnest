import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Award, Download, Trophy, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { useStudentsStore } from "@/hooks/useStudentsStore";
import { getInitials, marksDistribution, studentAttendancePct } from "@/utils/stats";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const PIE_COLORS = ["oklch(0.6 0.22 260)", "oklch(0.65 0.2 230)", "oklch(0.7 0.18 200)", "oklch(0.7 0.18 155)", "oklch(0.78 0.17 75)"];

function ReportsPage() {
  const { students } = useStudentsStore();
  const topMarks = [...students].sort((a, b) => b.marks - a.marks).slice(0, 5);
  const topAttendance = [...students]
    .map((s) => ({ ...s, pct: studentAttendancePct(s) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);
  const dist = marksDistribution(students);

  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-aurora text-primary-foreground shadow-glow flex h-12 w-12 items-center justify-center rounded-2xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Performance Reports</h2>
              <p className="text-muted-foreground text-sm">Insights across the cohort</p>
            </div>
          </div>
          <button
            onClick={() => toast.success("Report export queued")}
            className="gradient-primary text-primary-foreground shadow-glow inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]"
          >
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="text-warning h-5 w-5" />
            <h3 className="text-lg font-semibold">Top Scoring Students</h3>
          </div>
          <ul className="space-y-2">
            {topMarks.map((s, i) => (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass flex items-center gap-3 rounded-xl p-3"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${i === 0 ? "gradient-aurora text-primary-foreground" : "bg-muted"}`}>
                  {i + 1}
                </div>
                <div className="gradient-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold">
                  {getInitials(s.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-muted-foreground text-xs">{s.course}</p>
                </div>
                <span className="text-sm font-bold">{s.marks}</span>
              </motion.li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Award className="text-success h-5 w-5" />
            <h3 className="text-lg font-semibold">Attendance Leaderboard</h3>
          </div>
          <ul className="space-y-2">
            {topAttendance.map((s, i) => (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass flex items-center gap-3 rounded-xl p-3"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${i === 0 ? "gradient-aurora text-primary-foreground" : "bg-muted"}`}>
                  {i + 1}
                </div>
                <div className="gradient-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold">
                  {getInitials(s.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-muted-foreground text-xs">{s.course}</p>
                </div>
                <span className="text-success text-sm font-bold">{s.pct}%</span>
              </motion.li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold">Marks Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dist} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {dist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold">Course Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(students.reduce<Record<string, number>>((acc, s) => { acc[s.course] = (acc[s.course] ?? 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {students.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}