import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: "present" | "absent" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        status === "present"
          ? "bg-success/15 text-success ring-success/30 ring-1"
          : "bg-destructive/15 text-destructive ring-destructive/30 ring-1",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "present" ? "bg-success" : "bg-destructive")} />
      {status === "present" ? "Present" : "Absent"}
    </span>
  );
}