import { Link } from "@tanstack/react-router";
import { Bell, Home, LayoutGrid, Leaf, MessageCircle, ScanLine } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { BrandMark } from "@/components/BrandMark";
import { GuidedTutorial } from "@/components/GuidedTutorial";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WorkspaceContextSwitcher } from "@/components/WorkspaceContextSwitcher";

const navItems = [
  { to: "/", label: "หน้าหลัก", icon: Home, exact: true },
  { to: "/plots", label: "แปลง", icon: Leaf, exact: false },
  { to: "/diagnose", label: "ตรวจโรค", icon: ScanLine, exact: false },
  { to: "/assistant", label: "ผู้ช่วย AI", icon: MessageCircle, exact: false },
  { to: "/more", label: "เมนู", icon: LayoutGrid, exact: false },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="app-frame mx-auto flex min-h-screen w-full max-w-md flex-col bg-background md:max-w-6xl">
        <header data-tour="app-shell-header" className="sticky top-0 z-20 border-b border-border/60 bg-card/88 px-5 pt-[max(0.85rem,env(safe-area-inset-top))] pb-3 text-foreground backdrop-blur-2xl">
          {/* แถวบน: Logo + Actions */}
          <div className="flex items-center justify-between gap-2">
            <BrandMark size="sm" className="bg-primary-soft text-primary shadow-none" />
            <div className="flex shrink-0 items-center gap-1.5">
              <WorkspaceContextSwitcher />
              <ThemeToggle />
              <Link
                to="/notifications"
                className="relative flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="การแจ้งเตือน"
              >
                <Bell className="size-4.5" />
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-warning" />
              </Link>
            </div>
          </div>
          {/* แถวล่าง: Title + Subtitle */}
          <div className="mt-2.5">
            <h1 className="font-display text-xl font-bold leading-tight tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-1">
                {subtitle}
              </p>
            ) : null}
          </div>
        </header>

        <main className="flex-1 space-y-6 px-4 pt-5 pb-32 md:px-7 md:pt-7">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-border/70 bg-card/92 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl md:max-w-6xl">
          <ul className="flex items-stretch justify-between gap-1 p-1.5">
            {navItems.map((item) => (
              <li key={item.to} className="min-w-0 flex-1">
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  aria-label={item.label}
                  className="group relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted/60 active:scale-[0.98] data-[status=active]:text-primary"
                >
                  <item.icon
                    className="size-5 shrink-0"
                    strokeWidth={2}
                  />
                  <span className="w-full truncate text-center leading-none tracking-tight">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <GuidedTutorial />
      </div>
    </div>
  );
}

export function Card({ children, className = "", ...props }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`surface-card p-4 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex min-h-7 items-center justify-between gap-3 px-0.5">
      <h2 className="font-display text-[17px] font-semibold text-foreground">
        {children}
      </h2>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "good" | "warn" | "bad" | "info";
}) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    good: "bg-primary text-primary-foreground",
    warn: "bg-primary-soft text-primary",
    bad: "bg-destructive/15 text-destructive",
    info: "bg-primary-soft text-primary",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}

export const baht = (n: number) => `${n < 0 ? "-" : ""}฿${Math.abs(n).toLocaleString("th-TH")}`;
