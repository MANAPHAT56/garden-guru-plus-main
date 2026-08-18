import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Settings2, UserRoundCheck, Users } from "lucide-react";
import { AppShell, Badge, Card, SectionTitle } from "@/components/AppShell";
import { useDragonflyData } from "@/hooks/useDragonflyData";
import { SearchableSelect } from "@/components/SearchableSelect";

export const Route = createFileRoute("/workers")({
  head: () => ({
    meta: [
      { title: "Workers — EasyPlants" },
      { name: "description", content: "จัดการคนงาน ทีม และงานภาคสนามตามแผน Free หรือ Farm Pro" },
    ],
  }),
  component: WorkersPage,
});

function WorkersPage() {
  const { persona, state, dashboardFarms, inviteMembers, updateWorker } = useDragonflyData();
  const [crewFilter, setCrewFilter] = useState("ทั้งหมด");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [plotFilter, setPlotFilter] = useState("ทั้งหมด");
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState("พนักงานภาคสนาม");
  const [workerCrew, setWorkerCrew] = useState("ผู้ช่วยสวน");
  const [inviteMessage, setInviteMessage] = useState("");
  const [editingWorkerId, setEditingWorkerId] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editCrew, setEditCrew] = useState("");
  const [editFarmId, setEditFarmId] = useState("");
  const [editSiteId, setEditSiteId] = useState("");
  const [editPlot, setEditPlot] = useState("");
  const [editStatus, setEditStatus] = useState("Available");
  const hasPro = persona.subscription === "Farm Pro";
  const inviteRoles = Array.from(new Set([...state.organizationRoles.map((role) => role.name), "ผู้ช่วยสวน"]));

  const crews = useMemo(() => ["ทั้งหมด", ...Array.from(new Set(state.workers.map((w) => w.crew)))], [state.workers]);
  const statuses = useMemo(() => ["ทั้งหมด", ...Array.from(new Set(state.workers.map((w) => w.status)))], [state.workers]);
  const plots = useMemo(
    () => ["ทั้งหมด", ...Array.from(new Set(state.workers.map((w) => w.plot).filter(Boolean) as string[]))],
    [state.workers]
  );
  const workerStatusOptions = statuses.map((status) => status === "ทั้งหมด" ? status : ({ value: status, label: workerStatusLabel(status) }));
  const personnelStatuses = [{ value: "Active", label: "กำลังปฏิบัติงาน" }, { value: "Available", label: "พร้อมทำงาน" }, { value: "On Leave", label: "ลางาน" }, { value: "Unavailable", label: "ไม่พร้อม" }];
  const editSites = state.sites.filter((site) => (site.farmId ?? "FARM-PRIMARY") === editFarmId);
  const editPlots = state.plots.filter((plot) => (plot.farmId ?? "FARM-PRIMARY") === editFarmId && (!editSiteId || plot.siteId === editSiteId));

  const workers = state.workers.filter((worker) => {
    const crewOk = crewFilter === "ทั้งหมด" || worker.crew === crewFilter;
    const statusOk = statusFilter === "ทั้งหมด" || worker.status === statusFilter;
    const plotOk = plotFilter === "ทั้งหมด" || worker.plot === plotFilter;
    return crewOk && statusOk && plotOk;
  });

  const tone = (status: string): "good" | "warn" | "bad" | "info" | "muted" => {
    if (status === "Active") return "good";
    if (status === "Available") return "warn";
    if (status === "On Leave") return "bad";
    return "muted";
  };

  if (persona.id === "employee") {
    return <AppShell title="ทีมงาน" subtitle="สิทธิ์พนักงานภาคสนาม"><Card className="border-primary/25 bg-primary-soft/45"><p className="text-sm font-semibold text-primary">บัญชีพนักงานเข้าถึงรายชื่อทีมทั้งหมดไม่ได้</p><p className="mt-1 text-xs text-muted-foreground">ใช้หน้างานของฉันเพื่อดูเฉพาะงานที่ได้รับมอบหมาย เช็กอิน ส่งงาน และส่งหลักฐาน</p><Link to="/my-work" className="mt-3 block rounded-lg bg-primary py-2.5 text-center text-xs font-semibold text-primary-foreground">ไปงานของฉัน</Link></Card></AppShell>;
  }

  return (
    <AppShell
      title={hasPro ? "ทีมงานและบุคลากร" : "สมาชิกสวน"}
      subtitle={hasPro ? "จัดการทีม คนงาน และงานประจำวัน" : "แผนฟรี: ผู้ช่วยสวนและการแบ่งงานพื้นฐาน"}
    >
      {!hasPro ? (
        <Card className="border-primary/30 bg-primary-soft/60">
          <p className="text-sm font-semibold text-primary">แผนฟรีและ Farm Pro</p>
          <p className="mt-1 text-xs text-muted-foreground">
            แผนฟรีมีสมาชิกหรือผู้ช่วยสวนสำหรับแบ่งงานง่าย ๆ ส่วน Farm Pro มีทีม หัวหน้าทีม การมอบหมาย และประวัติงานทีมเต็มรูปแบบ
          </p>
          <Link to="/farm-pro" className="mt-3 block rounded-xl border border-primary/30 py-2.5 text-center text-xs font-semibold text-primary">
            ดูเครื่องมือทีมใน Farm Pro
          </Link>
        </Card>
      ) : null}

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          ["ทั้งหมด", state.workforce.total],
          ["กำลังทำงาน", state.workforce.active],
          ["พร้อมทำงาน", state.workforce.available],
          ["ไม่พร้อม", state.workforce.absent],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm font-bold text-primary">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </Card>
        ))}
      </div>

      <SectionTitle action={<button data-tour="workers-members" onClick={() => setShowAddWorker((value) => !value)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">เชิญสมาชิก</button>}>สมาชิกและทีม</SectionTitle>
      {showAddWorker ? <Card className="space-y-3 border-primary/25"><p className="text-xs leading-relaxed text-muted-foreground">วางอีเมลได้หลายรายการ คั่นด้วย comma หรือขึ้นบรรทัดใหม่ ระบบจะส่งลิงก์สร้างบัญชีให้แต่ละคน หลังตอบรับจึงปรากฏเป็นคนงานและรับงานได้</p><label className="block text-xs font-semibold text-muted-foreground">อีเมลผู้รับคำเชิญ<textarea value={inviteEmails} onChange={(event) => setInviteEmails(event.target.value)} placeholder={"somchai@example.com\nsuda@example.com"} rows={3} className="mt-1.5 block w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" /></label><div><p className="text-xs font-semibold text-muted-foreground">เลือกบทบาท</p><div className="mt-1.5 grid grid-cols-2 gap-2">{inviteRoles.map((role) => <button key={role} onClick={() => setInviteRole(role)} className={`rounded-lg border px-2 py-2 text-left text-xs font-semibold ${inviteRole === role ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>{role}{state.organizationRoles.some((item) => item.name === role && !item.builtIn) ? <span className="mt-0.5 block text-[10px] font-normal opacity-75">บทบาทกำหนดเอง</span> : null}</button>)}</div></div>{state.organizationRoles.find((role) => role.name === inviteRole) ? <p className="rounded-lg bg-muted px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">ขอบเขตเริ่มต้น: {roleScopeLabel(state.organizationRoles.find((role) => role.name === inviteRole)!.scope)} · {state.organizationRoles.find((role) => role.name === inviteRole)!.permissions.join(" · ")}</p> : null}<SearchableSelect label="ทีม" options={["ผู้ช่วยสวน", ...crews.filter((crew) => crew !== "ทั้งหมด" && crew !== "ผู้ช่วยสวน")]} value={workerCrew} onChange={setWorkerCrew} allLabel="เลือกทีม" searchPlaceholder="ค้นหาชื่อทีม" /><button onClick={() => { const result = inviteMembers(inviteEmails.split(/[\n,;]+/), inviteRole, workerCrew); setInviteMessage(result.sent ? `ส่งคำเชิญ ${result.sent} คนแล้ว${result.invalid ? ` · อีเมลไม่ถูกต้องหรือซ้ำ ${result.invalid} รายการ` : ""}` : "ยังไม่มีอีเมลที่ส่งคำเชิญได้"); if (result.sent) { setInviteEmails(""); setShowAddWorker(false); } }} className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground">ส่งคำเชิญ</button><p className="text-[11px] text-muted-foreground">โหมดสาธิต: ระบบบันทึกคำเชิญ แต่ยังไม่ส่งอีเมลจริง</p></Card> : null}
      {inviteMessage ? <Card className="border-primary/25 bg-primary-soft/45 text-xs text-primary">{inviteMessage}</Card> : null}
      {state.memberInvites.filter((invite) => invite.status === "Sent").length ? <Card className="space-y-2"><p className="text-xs font-semibold">คำเชิญที่รอตอบรับ</p>{state.memberInvites.filter((invite) => invite.status === "Sent").map((invite) => <div key={invite.id} className="flex items-center justify-between gap-2 text-xs"><span className="truncate">{invite.email} · {invite.role} · {invite.crew}</span><Badge tone="warn">ส่งแล้ว</Badge></div>)}</Card> : null}

      <SectionTitle>ตัวกรอง</SectionTitle>
      <Card className="space-y-3">
        <SearchableSelect label="ทีม" options={crews} value={crewFilter} onChange={setCrewFilter} allLabel="ทุกทีม" searchPlaceholder="ค้นหาชื่อทีม" />
        <SearchableSelect label="สถานะบุคลากร" options={workerStatusOptions} value={statusFilter} onChange={setStatusFilter} allLabel="ทุกสถานะ" searchPlaceholder="ค้นหาสถานะ" />
        <SearchableSelect label="แปลง" options={plots} value={plotFilter} onChange={setPlotFilter} allLabel="ทุกแปลง" searchPlaceholder="ค้นหารหัสหรือชื่อแปลง" />
      </Card>

      <SectionTitle>{hasPro ? "รายชื่อบุคลากร" : "สมาชิก / ผู้ช่วย"}</SectionTitle>
      <div className="space-y-3">
        {workers.map((worker) => (
          <Card key={worker.id}>
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <UserRoundCheck className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{worker.name}</p>
                    <p className="text-xs text-muted-foreground">{worker.role} · {worker.crew}</p>
                  </div>
                  <Badge tone={tone(worker.status)}>{workerStatusLabel(worker.status)}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2 text-[11px] text-muted-foreground"><span>{worker.plot ? `พื้นที่หลัก ${worker.plot}` : "ยังไม่ระบุพื้นที่ประจำ"}</span><span>งานที่รับผิดชอบ {state.tasks.filter((task) => (task.assignedWorkerId === worker.id || (!task.assignedWorkerId && task.team === worker.crew)) && !["Completed", "Cancelled", "Skipped"].includes(task.status)).length} งาน</span></div>
                {hasPro ? <button type="button" onClick={() => { setEditingWorkerId(editingWorkerId === worker.id ? "" : worker.id); setEditRole(worker.role); setEditCrew(worker.crew); setEditFarmId(worker.farmId ?? "FARM-PRIMARY"); const plot = state.plots.find((item) => item.id === worker.plot || item.name === worker.plot); setEditSiteId(plot?.siteId ?? ""); setEditPlot(plot?.id ?? ""); setEditStatus(worker.status); }} className="mt-3 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-semibold text-foreground"><Settings2 className="size-3.5" />จัดการบทบาทและการย้าย</button> : null}
                {editingWorkerId === worker.id ? <div className="mt-3 space-y-3 rounded-lg border border-primary/25 bg-primary-soft/30 p-3"><p className="text-xs font-semibold text-primary">จัดการบุคลากร: {worker.name}</p><SearchableSelect label="บทบาทในองค์กร" options={inviteRoles} value={editRole} onChange={setEditRole} searchPlaceholder="ค้นหาบทบาท" /><SearchableSelect label="ทีม" options={crews.filter((crew) => crew !== "ทั้งหมด")} value={editCrew} onChange={setEditCrew} searchPlaceholder="ค้นหาทีม" /><SearchableSelect label="สถานะบุคลากร" options={personnelStatuses} value={editStatus} onChange={setEditStatus} searchPlaceholder="ค้นหาสถานะ" /><SearchableSelect label="ย้ายไปฟาร์ม" options={dashboardFarms.map((farm) => ({ value: farm.id, label: `${farm.name} · ${farm.location}` }))} value={editFarmId} onChange={(value) => { setEditFarmId(value); setEditSiteId(""); setEditPlot(""); }} searchPlaceholder="ค้นหาฟาร์ม" /><SearchableSelect label="โซนประจำ" options={[{ value: "", label: "ไม่กำหนดโซน" }, ...editSites.map((site) => ({ value: site.id, label: `${site.code} · ${site.name}` }))]} value={editSiteId || ""} onChange={(value) => { setEditSiteId(value); setEditPlot(""); }} allLabel="ไม่กำหนดโซน" searchPlaceholder="ค้นหาโซน" /><SearchableSelect label="แปลงประจำ" options={[{ value: "", label: "ไม่กำหนดแปลง" }, ...editPlots.map((plot) => ({ value: plot.id, label: `${plot.id} · ${plot.name} · ${plot.crop}` }))]} value={editPlot || ""} onChange={setEditPlot} allLabel="ไม่กำหนดแปลง" searchPlaceholder="ค้นหาแปลง" /><p className="text-[11px] leading-relaxed text-muted-foreground">การย้ายบุคลากรจะเปลี่ยนขอบเขตการจัดการของคนนี้เท่านั้น งานที่มอบหมายเดิมยังคงอยู่และควรย้ายผู้รับผิดชอบจากหน้า Work Order หากจำเป็น</p><button type="button" onClick={() => { const plot = state.plots.find((item) => item.id === editPlot); updateWorker(worker.id, { role: editRole, crew: editCrew, status: editStatus as "Active" | "Available" | "On Leave" | "Unavailable", farmId: editFarmId, plot: plot?.id, currentTask: worker.currentTask }); setEditingWorkerId(""); setInviteMessage(`บันทึกบทบาทและพื้นที่รับผิดชอบของ ${worker.name} แล้ว`); }} className="min-h-10 w-full rounded-lg bg-primary text-xs font-semibold text-primary-foreground">บันทึกการเปลี่ยนแปลง</button></div> : null}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {workers.length === 0 ? (
        <Card className="py-8 text-center">
          <Users className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">ไม่มีคนงานตรงกับตัวกรองนี้</p>
        </Card>
      ) : null}
    </AppShell>
  );
}

function workerStatusLabel(status: string) {
  return ({ Active: "กำลังปฏิบัติงาน", Available: "พร้อมทำงาน", "On Leave": "ลางาน", Unavailable: "ไม่พร้อม", Assigned: "กำลังปฏิบัติงาน", Absent: "ลางาน" } as Record<string, string>)[status] ?? status;
}

function roleScopeLabel(scope: "organization" | "assigned_farms" | "assigned_team" | "own_tasks") {
  return ({ organization: "ทั้งองค์กร", assigned_farms: "ฟาร์มที่ได้รับมอบหมาย", assigned_team: "ทีมของตนเอง", own_tasks: "งานของตนเอง" } as const)[scope];
}
