import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LayoutDashboard, UserPlus, Users, CalendarCheck, BarChart3, Inbox, GraduationCap, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "View Students", icon: Users },
  { to: "/students/add", label: "Add Student", icon: UserPlus },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/requests", label: "Requests", icon: Inbox },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 84 : 264 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="glass-strong sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 flex-col rounded-3xl p-4 md:flex"
    >
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="gradient-primary animate-pulse-glow flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-primary-foreground shadow-glow">
          <GraduationCap className="h-6 w-6" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden">
            <p className="gradient-text text-lg font-bold leading-tight">EduSphere</p>
            <p className="text-[11px] text-muted-foreground">Student Management</p>
          </motion.div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname === item.to || (item.to !== "/students" && pathname.startsWith(item.to + "/")) || (item.to === "/students" && pathname === "/students");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="gradient-primary absolute inset-0 -z-10 rounded-xl shadow-glow"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="glass mt-4 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:text-foreground"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        {!collapsed && "Collapse"}
      </button>
    </motion.aside>
  );
}