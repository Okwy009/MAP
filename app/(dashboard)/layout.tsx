import Link from "next/link";
import { LayoutDashboard, Calendar, CheckSquare, User, Settings, LogOut } from "lucide-react";

import { logout } from "@/app/actions/auth";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";

const navItems = [
  { icon: LayoutDashboard, label: "Today", href: "/today" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: CheckSquare, label: "Tracker", href: "/tracker" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-card p-4">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-400">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <span className="text-lg font-bold">MAP</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-border pt-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <OnboardingChecklist />
        {children}
      </main>
    </div>
  );
}
