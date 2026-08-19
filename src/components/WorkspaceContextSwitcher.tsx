import { useState } from "react";
import { Building2, Check, ChevronDown, RotateCcw, Sprout, X } from "lucide-react";
import { useDragonflyData, type WorkspaceContext } from "@/hooks/useDragonflyData";

const scopeLabels: Record<string, string> = {
  organization: "เข้าถึงข้อมูลทั้งองค์กรตามสิทธิ์",
  assigned_farms: "เข้าถึงเฉพาะฟาร์มที่ได้รับมอบหมาย",
  assigned_team: "เข้าถึงเฉพาะทีมที่ได้รับมอบหมาย",
  own_tasks: "เข้าถึงเฉพาะงานและแปลงของตนเอง",
};

const personaScaleLabel: Record<string, string> = {
  beginner: "สวนส่วนตัว · เริ่มต้น",
  owner: "สวนครอบครัว · ขนาดเล็ก",
  commercial: "สวนเชิงพาณิชย์ · Farm Pro",
  export: "สวนส่งออก · Enterprise",
  employee: "งานภาคสนาม · ตามที่ได้รับมอบหมาย",
};

export function WorkspaceContextSwitcher() {
  const { isDemoMode, persona, personas, state, workspaceContext, setWorkspaceContext, workspaceLabel, setPersona, resetDemo } = useDragonflyData();
  const [open, setOpen] = useState(false);
  const isOrganization = workspaceContext === "organization";
  const selectWorkspace = (context: WorkspaceContext) => { setWorkspaceContext(context); setOpen(false); };

  // แสดงข้อมูลที่เข้าถึงได้ใน scope ปัจจุบัน
  const roleMap: Record<string, string> = { employee: "ROLE-WORKER", commercial: "ROLE-MANAGER", export: "ROLE-OWNER" };
  const organizationRole = state.organizationRoles.find((role) => role.id === roleMap[persona.id]);
  const accessScope = isOrganization
    ? scopeLabels[organizationRole?.scope ?? "own_tasks"]
    : "ข้อมูลส่วนตัวแยกจากองค์กร";
  const accessItems = isOrganization
    ? (organizationRole?.permissions ?? ["ดูข้อมูลตามการมอบหมาย"])
    : ["จัดการแปลง Todo รายรับ และการดูแลในสวนของฉัน"];

  return (
    <div className="relative z-40 px-4 pt-3">
      <div className="mx-auto w-full max-w-md md:max-w-6xl">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="เลือกพื้นที่ทำงาน"
          className="flex min-h-14 w-full items-center gap-3 rounded-lg border border-border bg-card px-3 text-left shadow-sm transition-colors hover:border-primary/35 hover:bg-primary-soft/25"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            {isOrganization ? <Building2 className="size-4" /> : <Sprout className="size-4" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold text-muted-foreground">พื้นที่ทำงาน</span>
            <span className="block truncate text-sm font-semibold text-foreground">{workspaceLabel}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{accessScope}</span>
          </span>
          <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open ? (
          <section
            role="dialog"
            aria-label="เลือกพื้นที่ทำงาน"
            className="absolute inset-x-4 top-[calc(100%-0.25rem)] mx-auto max-w-md rounded-lg border border-border bg-card p-3 shadow-xl md:max-w-6xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">เลือกพื้นที่ทำงาน</p>
                <p className="mt-1 text-xs text-muted-foreground">หน้าจอและข้อมูลจะเปลี่ยนตามพื้นที่ที่เลือก</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-label="ปิด">
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <button
                type="button"
                onClick={() => selectWorkspace("personal")}
                className={`flex items-start gap-3 rounded-lg border p-3 text-left ${!isOrganization ? "border-primary bg-primary-soft/40" : "border-border hover:bg-muted"}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary"><Sprout className="size-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold">สวนของฉัน {!isOrganization ? <Check className="size-4 text-primary" /> : null}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">จัดการแปลง Todo รายรับ และประวัติการดูแลของคุณเอง</span>
                  <span className="mt-1 block text-[11px] font-semibold text-primary">ข้อมูลส่วนตัว แยกจากองค์กร</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => selectWorkspace("organization")}
                className={`flex items-start gap-3 rounded-lg border p-3 text-left ${isOrganization ? "border-primary bg-primary-soft/40" : "border-border hover:bg-muted"}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary"><Building2 className="size-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold">องค์กร EasyPlants Produce {isOrganization ? <Check className="size-4 text-primary" /> : null}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">ทำงานตามทีม ฟาร์ม และแปลงที่องค์กรกำหนดให้</span>
                  <span className="mt-1 block text-[11px] font-semibold text-primary">{persona.subscription} · {accessScope}</span>
                </span>
              </button>
            </div>

            {/* ข้อมูลที่เข้าถึงได้ */}
            <div className="mt-3 rounded-lg bg-muted/65 p-3">
              <div className="flex items-start gap-2">
                <div>
                  <p className="text-xs font-semibold">ข้อมูลที่เข้าถึงได้ในพื้นที่นี้</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{accessScope}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {accessItems.map((item) => (
                      <span key={item} className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-foreground">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isDemoMode ? (
              <div className="mt-3 border-t border-border pt-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold">ดูตัวอย่างมุมมองต่างๆ</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">สลับขนาดการดำเนินงานเพื่อทดลองการแสดงผลใน Demo Mode</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { if (window.confirm("Reset all demo changes and restore the original demonstration dataset?")) resetDemo(); }}
                    className="flex size-8 items-center justify-center rounded-full bg-muted text-primary"
                    aria-label="Reset demo data"
                    title="Reset demo data"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-5">
                  {personas.map((view) => (
                    <button
                      key={view.id}
                      type="button"
                      onClick={() => { setPersona(view.id); setOpen(false); }}
                      className={`min-h-11 rounded-lg border px-2 py-2 text-left text-[11px] font-semibold ${view.id === persona.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}
                    >
                      <span className="block truncate">{personaScaleLabel[view.id] ?? view.label}</span>
                      <span className="mt-0.5 block text-[10px] font-normal opacity-75">{view.subscription}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
