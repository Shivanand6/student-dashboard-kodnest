import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Users as UsersIcon } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StudentDetailsModal } from "@/components/common/StudentDetailsModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useStudentsStore } from "@/hooks/useStudentsStore";
import { getInitials, studentAttendancePct } from "@/utils/stats";
import type { Student } from "@/data/mockStudents";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/students")({ component: StudentsLayout });

function StudentsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/students") return <Outlet />;
  return <StudentsListPage />;
}

function StudentsListPage() {
  const { students, deleteStudent, restoreStudent } = useStudentsStore();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Student | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirm, setConfirm] = useState<Student | null>(null);
  const pageSize = 6;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => setLoading(false), 500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const courses = useMemo(() => Array.from(new Set(students.map((s) => s.course))), [students]);
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = query.toLowerCase().trim();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const matchC = courseFilter === "all" || s.course === courseFilter;
      return matchQ && matchC;
    });
  }, [students, query, courseFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { if (page > pageCount) setPage(1); }, [page, pageCount]);

  const handleDelete = (s: Student) => {
    deleteStudent(s.id);
    setConfirm(null);
    toast(`Removed ${s.name}`, {
      description: "You can undo this action.",
      action: {
        label: "Undo",
        onClick: () => {
          restoreStudent(s);
          toast.success(`Restored ${s.name}`);
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      <GlassCard className="!p-4 md:!p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <motion.div
            initial={{ width: "100%" }}
            whileFocus={{ scale: 1.01 }}
            className="glass flex flex-1 items-center gap-2 rounded-xl px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-primary/50"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or ID..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </motion.div>
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="glass w-44 border-none">
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent className="glass-strong border-none">
                <SelectItem value="all">All courses</SelectItem>
                {courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="!p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading students..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No students found" description="Try a different search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-border/60 text-left text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Age</th>
                  <th className="px-5 py-3 font-medium">Marks</th>
                  <th className="px-5 py-3 font-medium">Attendance</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {view.map((s, i) => (
                    <motion.tr
                      key={s.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                      className="border-border/40 hover:bg-accent/5 group border-b transition-colors last:border-0"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="gradient-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold">
                            {getInitials(s.name)}
                          </div>
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-muted-foreground text-xs">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted-foreground px-5 py-3 font-mono text-xs">{s.id}</td>
                      <td className="px-5 py-3">{s.course}</td>
                      <td className="px-5 py-3">{s.age}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
                            <div className="gradient-primary h-full" style={{ width: `${s.marks}%` }} />
                          </div>
                          <span className="text-xs font-medium">{s.marks}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs font-medium">{studentAttendancePct(s)}%</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <IconButton title="View" onClick={() => { setSelected(s); setDetailsOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </IconButton>
                          <IconButton title="Edit" onClick={() => toast.info("Edit coming soon")}>
                            <Pencil className="h-4 w-4" />
                          </IconButton>
                          <IconButton title="Delete" destructive onClick={() => setConfirm(s)}>
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="border-border/40 flex items-center justify-between border-t px-5 py-3 text-xs">
            <span className="text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="glass flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-medium">Page {page} / {pageCount}</span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="glass flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>

      <StudentDetailsModal student={selected} open={detailsOpen} onOpenChange={setDetailsOpen} />
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Delete this student?"
        description={confirm ? `${confirm.name} will be removed. You can undo this within the toast.` : ""}
        confirmLabel="Delete"
        destructive
        onConfirm={() => confirm && handleDelete(confirm)}
      />
    </div>
  );
}

function IconButton({ children, onClick, title, destructive }: { children: React.ReactNode; onClick: () => void; title: string; destructive?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={
        "glass flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110 " +
        (destructive ? "hover:bg-destructive/15 hover:text-destructive" : "hover:text-primary")
      }
    >
      {children}
    </button>
  );
}