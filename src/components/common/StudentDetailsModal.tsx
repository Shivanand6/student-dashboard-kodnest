import { motion } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Student } from "@/data/mockStudents";
import { getInitials, studentAttendancePct } from "@/utils/stats";
import { Calendar, Mail, User, GraduationCap, type LucideIcon } from "lucide-react";

interface Props {
  student: Student | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function StudentDetailsModal({ student, open, onOpenChange }: Props) {
  if (!student) return null;
  const att = studentAttendancePct(student);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-lg overflow-hidden border-none p-0">
        <div className="gradient-aurora animate-aurora h-28" />
        <div className="-mt-12 px-6 pb-6">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="gradient-primary ring-background shadow-glow text-primary-foreground mx-auto flex h-24 w-24 items-center justify-center rounded-3xl text-2xl font-bold ring-4"
          >
            {getInitials(student.name)}
          </motion.div>
          <DialogHeader className="mt-4 text-center sm:text-center">
            <DialogTitle className="text-center text-2xl">{student.name}</DialogTitle>
            <p className="text-center text-sm text-muted-foreground">{student.id} · {student.course}</p>
          </DialogHeader>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <InfoTile icon={User} label="Age" value={`${student.age} yrs`} />
            <InfoTile icon={GraduationCap} label="Course" value={student.course} />
            <InfoTile icon={Mail} label="Email" value={student.email ?? "—"} />
            <InfoTile icon={Calendar} label="Records" value={`${student.attendance.length} days`} />
          </div>

          <div className="mt-6 space-y-4">
            <ProgressRow label="Marks" value={student.marks} suffix="/100" />
            <ProgressRow label="Attendance" value={att} suffix="%" accent />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="glass flex items-center gap-3 rounded-xl p-3">
      <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, suffix, accent }: { label: string; value: number; suffix: string; accent?: boolean }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}{suffix}</span>
      </div>
      <div className="bg-muted h-2.5 overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={accent ? "gradient-aurora h-full" : "gradient-primary h-full"}
        />
      </div>
    </div>
  );
}