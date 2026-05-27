import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Inbox, CheckCircle2, Clock } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useStudentsStore } from "@/hooks/useStudentsStore";
import { getInitials } from "@/utils/stats";
import { toast } from "sonner";

export const Route = createFileRoute("/requests")({ component: RequestsPage });

function RequestsPage() {
  const { requests, processRequest } = useStudentsStore();

  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-primary text-primary-foreground shadow-glow flex h-12 w-12 items-center justify-center rounded-2xl">
              <Inbox className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Request Queue</h2>
              <p className="text-muted-foreground text-sm">{requests.length} pending request{requests.length === 1 ? "" : "s"}</p>
            </div>
          </div>
          <div className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium">
            <span className="bg-warning h-2 w-2 animate-pulse rounded-full" />
            Live queue
          </div>
        </div>
      </GlassCard>

      {requests.length === 0 ? (
        <GlassCard>
          <EmptyState icon={CheckCircle2} title="Queue is clear" description="All requests have been processed. Sit back and relax." />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {requests.map((r, i) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 30 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 280, damping: 24 }}
                className="glass-strong card-3d relative overflow-hidden rounded-2xl p-5"
              >
                <div className="gradient-aurora absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-25 blur-2xl" />
                <div className="relative flex items-start gap-4">
                  <div className="gradient-primary text-primary-foreground shadow-glow flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold">
                    {getInitials(r.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{r.name}</h4>
                        <p className="text-muted-foreground text-xs">{r.id} · {r.course}</p>
                      </div>
                      <span className="bg-warning/15 text-warning ring-warning/30 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1">
                        <Clock className="h-2.5 w-2.5" /> Pending
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{r.reason}</p>
                    <p className="text-muted-foreground mt-1 text-xs">Requested on {r.requestedAt}</p>
                    <button
                      onClick={() => {
                        processRequest(r.id);
                        toast.success(`Processed ${r.name}'s request`);
                      }}
                      className="gradient-primary text-primary-foreground shadow-glow mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-transform hover:scale-[1.03]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Process Request
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}