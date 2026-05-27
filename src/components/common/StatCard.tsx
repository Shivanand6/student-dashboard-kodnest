import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: "primary" | "accent" | "success" | "warning";
  delay?: number;
}

const accentMap = {
  primary: "from-primary to-primary-glow",
  accent: "from-accent to-primary",
  success: "from-success to-accent",
  warning: "from-warning to-accent",
};

export function StatCard({ label, value, icon: Icon, trend, accent = "primary", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-strong card-3d relative overflow-hidden rounded-2xl p-6"
    >
      <div
        className={cn(
          "absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl opacity-40 bg-gradient-to-br",
          accentMap[accent],
        )}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <div className="text-success mt-2 flex items-center gap-1 text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 12, scale: 1.1 }}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-primary-foreground shadow-glow",
            accentMap[accent],
          )}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      </div>
    </motion.div>
  );
}