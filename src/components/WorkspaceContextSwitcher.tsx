import { Building2, Sprout } from "lucide-react";
import { useDragonflyData, type WorkspaceContext } from "@/hooks/useDragonflyData";

export function WorkspaceContextSwitcher() {
  const {
    persona,
    workspaceContext,
    setWorkspaceContext,
    effectiveRole,
    effectiveSubscription,
    workspaceLabel,
  } = useDragonflyData();
  const isOrganization = workspaceContext === "organization";

  return (
    <div className="border-b border-border/70 bg-background px-4 py-2.5">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 md:max-w-6xl">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          {isOrganization ? <Building2 className="size-4" /> : <Sprout className="size-4" />}
        </span>
        <label className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold text-muted-foreground">
            พื้นที่ทำงานที่กำลังใช้
          </span>
          <select
            aria-label="เลือกพื้นที่ทำงาน"
            value={workspaceContext}
            onChange={(event) =>
              setWorkspaceContext(event.target.value as WorkspaceContext)
            }
            className="mt-0.5 block w-full appearance-none bg-transparent text-sm font-semibold text-foreground outline-none"
          >
            <option value="personal">สวนของฉัน · เจ้าของสวน</option>
            <option value="organization">
              องค์กร EasyPlants Produce · {persona.role}
            </option>
          </select>
        </label>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-xs font-semibold text-foreground">{workspaceLabel}</p>
          <p className="text-[10px] text-muted-foreground">
            {effectiveRole} · {effectiveSubscription}
          </p>
        </div>
      </div>
    </div>
  );
}
