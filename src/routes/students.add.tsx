import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { UserPlus, RotateCcw, IdCard, User, Hash, BookOpen, Award } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { useStudentsStore } from "@/hooks/useStudentsStore";
import { toast } from "sonner";

const schema = z.object({
  id: z.string().trim().min(2, "Student ID is required").max(20),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  age: z.coerce.number({ invalid_type_error: "Age must be a number" }).int().min(5, "Min age 5").max(100, "Max age 100"),
  course: z.string().trim().min(2, "Course is required").max(60),
  marks: z.coerce.number({ invalid_type_error: "Marks must be a number" }).min(0, "Min 0").max(100, "Max 100"),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/students/add")({ component: AddStudentPage });

function AddStudentPage() {
  const { addStudent, students } = useStudentsStore();
  const navigate = useNavigate();
  const nextId = `STU${1000 + students.length + 1}`;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { id: nextId, name: "", age: 18, course: "", marks: 0 },
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 500));
    addStudent({ ...values, email: `${values.name.toLowerCase().replace(/\s+/g, ".")}@university.edu` });
    toast.success(`${values.name} added successfully!`);
    navigate({ to: "/students" });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <GlassCard>
        <div className="mb-6 flex items-center gap-3">
          <div className="gradient-primary text-primary-foreground shadow-glow flex h-12 w-12 items-center justify-center rounded-2xl">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Add a new student</h2>
            <p className="text-muted-foreground text-sm">Fill in the details to enroll a student.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field icon={IdCard} label="Student ID" error={errors.id?.message}>
            <input {...register("id")} className="field-input" placeholder="STU1016" />
          </Field>
          <Field icon={User} label="Full Name" error={errors.name?.message}>
            <input {...register("name")} className="field-input" placeholder="e.g. Maya Patel" />
          </Field>
          <Field icon={Hash} label="Age" error={errors.age?.message}>
            <input type="number" {...register("age")} className="field-input" />
          </Field>
          <Field icon={BookOpen} label="Course" error={errors.course?.message}>
            <input {...register("course")} className="field-input" placeholder="e.g. Computer Science" />
          </Field>
          <Field icon={Award} label="Marks (0-100)" error={errors.marks?.message} className="md:col-span-2">
            <input type="number" {...register("marks")} className="field-input" />
          </Field>

          <div className="mt-2 flex flex-wrap justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={() => reset({ id: nextId, name: "", age: 18, course: "", marks: 0 })}
              className="glass inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isSubmitting}
              className="gradient-primary text-primary-foreground shadow-glow inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03] disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Add Student"}
            </motion.button>
          </div>
        </form>
      </GlassCard>

      <style>{`
        .field-input {
          width: 100%;
          background: transparent;
          font-size: 0.875rem;
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({ icon: Icon, label, children, error, className }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode; error?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">{label}</label>
      <div className={`glass flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all focus-within:ring-2 ${error ? "ring-destructive/60 ring-2" : "focus-within:ring-primary/50"}`}>
        <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
        {children}
      </div>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  );
}