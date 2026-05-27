import { motion } from "motion/react";
import { Bell, Moon, Search, Sun, GraduationCap, Menu, LayoutDashboard, Users, UserPlus, CalendarCheck, BarChart3, Inbox } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const mobileNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "View Students", icon: Users },
  { to: "/students/add", label: "Add Student", icon: UserPlus },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/requests", label: "Requests", icon: Inbox },
] as const;

export function TopBar() {
  const { dark, toggle } = useDarkMode();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const titleMap: Record<string, string> = {
    "/": "Dashboard",
    "/students": "Students",
    "/students/add": "Add Student",
    "/attendance": "Attendance",
    "/reports": "Reports",
    "/requests": "Request Queue",
  };
  const title = titleMap[pathname] ?? "EduSphere";

  return (
    <header className="glass sticky top-0 z-30 flex items-center gap-3 rounded-2xl px-4 py-3 md:px-6">
      <Sheet>
        <SheetTrigger className="glass flex h-10 w-10 items-center justify-center rounded-xl md:hidden">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="glass-strong w-72 border-none p-4">
          <div className="mb-6 flex items-center gap-3">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-2xl text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <p className="gradient-text text-lg font-bold">EduSphere</p>
          </div>
          <nav className="flex flex-col gap-1">
            {mobileNav.map((n) => {
              const Icon = n.icon;
              return (
                <Link key={n.to} to={n.to} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-accent/10">
                  <Icon className="h-5 w-5" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden md:block">
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold tracking-tight"
        >
          {title}
        </motion.h1>
        <p className="text-xs text-muted-foreground">Manage your students with style</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="glass hidden items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all focus-within:ring-2 focus-within:ring-primary/50 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Quick search..."
            className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button className="glass relative flex h-10 w-10 items-center justify-center rounded-xl transition-transform hover:scale-105">
          <Bell className="h-4 w-4" />
          <span className="bg-accent absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full" />
        </button>
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="glass flex h-10 w-10 items-center justify-center rounded-xl transition-transform hover:scale-105 hover:rotate-12"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}