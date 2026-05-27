import { motion } from "motion/react";
import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative mb-6"
      >
        <div className="gradient-aurora animate-aurora absolute inset-0 -z-10 rounded-full opacity-50 blur-3xl" />
        <div className="glass-strong animate-float shadow-elevated flex h-24 w-24 items-center justify-center rounded-3xl">
          <Icon className="text-primary h-12 w-12" />
        </div>
      </motion.div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}