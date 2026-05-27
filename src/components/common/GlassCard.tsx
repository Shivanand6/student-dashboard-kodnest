import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn("glass-strong rounded-2xl p-6", hover && "card-3d", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}