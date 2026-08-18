import { Link } from "@tanstack/react-router";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { useDragonflyData } from "@/hooks/useDragonflyData";

export function DemoModeControls() {
  const { isDemoMode, persona, resetDemo } = useDragonflyData();

  if (!isDemoMode) return null;

  return (
    <div className="border-b border-primary/20 bg-primary-soft px-4 py-2 text-primary">
      <div className="mx-auto flex w-full max-w-md items-center gap-2 md:max-w-6xl">
        <span className="shrink-0 rounded-full bg-primary px-2 py-1 text-[10px] font-bold tracking-wide text-primary-foreground">
          DEMO MODE
        </span>
        <Link to="/settings" className="flex min-w-0 flex-1 items-center gap-1.5 rounded-xl border border-primary/20 bg-card px-2.5 py-1.5 text-xs font-medium text-foreground">
          <ShieldCheck className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{persona.role} · {persona.subscription}</span>
        </Link>
        <button
          onClick={() => {
            if (window.confirm("Reset all demo changes and restore the original demonstration dataset?")) {
              resetDemo();
            }
          }}
          className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-card text-primary"
          aria-label="Reset demo data"
          title="Reset demo data"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
    </div>
  );
}
