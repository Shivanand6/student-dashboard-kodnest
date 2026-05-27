import { motion } from "motion/react";

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="relative h-12 w-12"
      >
        <div className="border-primary/20 absolute inset-0 rounded-full border-2" />
        <div className="border-t-primary absolute inset-0 rounded-full border-2 border-transparent" />
      </motion.div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}