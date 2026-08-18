import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Eye, LockKeyhole, RotateCcw, ShieldCheck, UserRoundCog, Users } from "lucide-react";
import { useState } from "react";
import { AppShell, Badge, Card, SectionTitle } from "@/components/AppShell";
import { useDragonflyData } from "@/hooks/useDragonflyData";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EasyPlants" },
      { name: "description", content: "Experience settings and demo environment controls" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { mode, isDemoMode, persona, personas, state, resetDemo, setPersona, addOrganizationRole } = useDragonflyData();
  const [requestMessage, setRequestMessage] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>(["ดูงานทีม"]);
  const isAdmin = persona.id === "owner" || persona.id === "commercial" || persona.id === "export";
  const role = getRoleProfile(persona.id);
  const switchView = (personaId: typeof persona.id) => {
    if (personaId === persona.id) return;
    setPersona(personaId);
    void navigate({ to: personaId === "employee" ? "/my-work" : "/" });
  };

  return (
    <AppShell title="โปรไฟล์และการเข้าถึง" subtitle="บทบาท สิทธิ์ และขอบเขตข้อมูลของบัญชีนี้">
      <Card>
        <div className="flex items-center gap-3">
          <UserRoundCog className="size-6 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{persona.label}</p>
            <p className="text-xs text-muted-foreground">บทบาทปัจจุบัน: {role.title}</p>
          </div>
          <Badge tone={persona.subscription === "Farm Pro" ? "good" : "muted"}>{persona.subscription}</Badge>
        </div>
      </Card>

      <SectionTitle>บทบาทปัจจุบัน</SectionTitle>
      <Card className="space-y-2">
        <p className="text-sm font-semibold text-primary">{role.title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{role.description}</p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs"><Info label="แพ็กเกจ" value={persona.subscription} /><Info label="ขนาดการดำเนินงาน" value={persona.profile.operationScale} /><Info label="ฟาร์มที่เข้าถึง" value={persona.id === "employee" ? "เฉพาะที่ได้รับมอบหมาย" : `${state.farm.name} และฟาร์มที่ได้รับสิทธิ์`} /><Info label="สิทธิ์การเงิน" value={role.canSeeFinance ? "ดูได้" : "ไม่มีสิทธิ์"} /></div>
      </Card>

      <SectionTitle>สิ่งที่บัญชีนี้ทำได้</SectionTitle>
      <Card className="space-y-2">{role.permissions.map((permission) => <div key={permission} className="flex items-center gap-2 text-xs"><ShieldCheck className="size-4 shrink-0 text-primary" />{permission}</div>)}</Card>

      <SectionTitle>บทบาทและการเปลี่ยนสิทธิ์</SectionTitle>
      <Card className="space-y-3">
        <p className="text-xs leading-relaxed text-muted-foreground">บทบาทไม่ใช่ระดับที่เปลี่ยนเองจากเมนู การเพิ่ม ลด หรือเปลี่ยน role ต้องทำโดย Owner/Admin ขององค์กร เพื่อให้สิทธิ์และ Audit Log ถูกต้อง ผู้ใช้ยังสลับองค์กรที่ได้รับเชิญได้โดยไม่ต้องเปลี่ยนบัญชี</p>
        {isAdmin ? <Link to="/workers" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground"><Users className="size-4" />จัดการสมาชิกและสิทธิ์</Link> : <button onClick={() => setRequestMessage("ส่งคำขอสิทธิ์เพิ่มให้ Owner/Admin แล้ว (Demo Mode)")} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground"><LockKeyhole className="size-4" />ขอสิทธิ์เพิ่ม</button>}
        {requestMessage ? <p className="rounded-lg bg-primary-soft px-3 py-2 text-xs text-primary">{requestMessage}</p> : null}
      </Card>

      {isDemoMode ? <>
        <SectionTitle>สลับมุมมองตัวอย่าง</SectionTitle>
        <Card className="space-y-3 border-primary/30 bg-primary-soft/40">
          <div className="flex gap-2"><Eye className="size-4 shrink-0 text-primary" /><p className="text-xs leading-relaxed text-muted-foreground">ใช้ตรวจ UX และสิทธิ์ของแต่ละบทบาทในข้อมูลตัวอย่างเท่านั้น การกดปุ่มนี้ไม่ใช่การเปลี่ยน Role ของสมาชิกในองค์กรจริง</p></div>
          <div className="grid grid-cols-2 gap-2">{personas.map((view) => <button key={view.id} type="button" onClick={() => switchView(view.id)} aria-pressed={persona.id === view.id} className={`min-h-14 rounded-lg border px-3 py-2 text-left transition-colors ${persona.id === view.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/45 hover:bg-primary-soft/35"}`}><span className="block text-xs font-semibold">{getRoleProfile(view.id).title}</span><span className="mt-1 block text-[10px] opacity-75">{view.subscription}</span></button>)}</div>
          <p className="text-[11px] text-muted-foreground">มุมมองปัจจุบัน: {role.title} · ข้อมูลจะเปลี่ยนตามตัวอย่างของแต่ละบทบาท</p>
        </Card>
      </> : null}

      {isAdmin ? <>
        <SectionTitle>Role ขององค์กร</SectionTitle>
        <Card className="space-y-3">
          <p className="text-xs text-muted-foreground">Owner/Admin กำหนด role ให้เหมาะกับโครงสร้างองค์กรได้ เช่น เจ้าหน้าที่ QA, ผู้ดูแลคลัง, ผู้ประสานงานเก็บเกี่ยว โดยไม่ต้องใช้ role ของระบบเพียงอย่างเดียว</p>
          <input value={newRoleName} onChange={(event) => setNewRoleName(event.target.value)} placeholder="ชื่อ role เช่น เจ้าหน้าที่ QA" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary" />
          <div className="grid grid-cols-2 gap-2">{["ดูงานทีม", "สร้างและมอบหมายงาน", "ดูต้นทุนและรายได้", "อนุมัติปิดงาน", "ดู Traceability/QA", "จัดการสมาชิก"].map((permission) => <label key={permission} className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-xs"><input type="checkbox" checked={newRolePermissions.includes(permission)} onChange={(event) => setNewRolePermissions((current) => event.target.checked ? [...current, permission] : current.filter((item) => item !== permission))} />{permission}</label>)}</div>
          <button onClick={() => { if (persona.subscription !== "Farm Pro") { setRequestMessage("Custom role ใช้ได้ใน Farm Pro เพื่อควบคุมสิทธิ์ระดับองค์กร"); return; } const result = addOrganizationRole(newRoleName, newRolePermissions); setRequestMessage(result.ok ? `สร้าง role “${result.role.name}” แล้ว ใช้เลือกตอนเชิญสมาชิกได้` : result.reason); if (result.ok) { setNewRoleName(""); setNewRolePermissions(["ดูงานทีม"]); } }} className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground">สร้าง Role ขององค์กร</button>
          {state.organizationRoles.length ? <div className="space-y-2 border-t border-border pt-3">{state.organizationRoles.map((organizationRole) => <div key={organizationRole.id} className="rounded-lg bg-muted/60 px-3 py-2"><p className="text-xs font-semibold">{organizationRole.name}</p><p className="mt-1 text-[11px] text-muted-foreground">{organizationRole.permissions.join(" · ")}</p></div>)}</div> : null}
        </Card>
      </> : null}

      <SectionTitle>ระดับความซับซ้อนของหน้าจอ</SectionTitle>
      <Card className="space-y-2"><p className="text-xs text-muted-foreground">มือใหม่/มาตรฐาน/ขั้นสูง เป็นการจัดการความซับซ้อนของ UI ไม่ใช่ role และผู้ใช้ต้องเปลี่ยนกลับได้เสมอ</p><Link to="/onboarding" className="block rounded-lg border border-border py-2.5 text-center text-xs font-semibold">ปรับโปรไฟล์และรูปแบบการใช้งาน</Link></Card>

      <SectionTitle>องค์กรและแพ็กเกจ</SectionTitle>
      <Card className="flex items-start gap-3"><Building2 className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="text-sm font-semibold">{state.farm.name}</p><p className="mt-1 text-xs text-muted-foreground">{persona.subscription === "Farm Pro" ? "Farm Pro เปิดงานทีม, Workforce, หลายฟาร์ม และการควบคุมปฏิบัติการ" : "Free ใช้จัดการสวนส่วนตัวและผู้ช่วยสวนพื้นฐานได้"}</p>{persona.id === "export" ? <p className="mt-2 text-xs text-primary">สิทธิ์ Export/QA เพิ่ม Traceability, PHI, ล็อต และการตรวจรับ ไม่ใช่ role ผู้จัดการอีกชุดหนึ่ง</p> : null}</div></Card>

      {isDemoMode ? (
        <>
          <SectionTitle>Demo</SectionTitle>
          <Card className="space-y-3 border-primary/30 bg-primary-soft/50">
            <p className="text-sm font-semibold text-primary">ข้อมูลตัวอย่าง</p>
            <p className="text-xs text-muted-foreground">
              โหมดข้อมูล: {mode} การรีเซ็ตจะคืนค่าแปลง งาน ทีม IoT และ Traceability ของมุมมองตัวอย่างปัจจุบัน
            </p>
            <button
              onClick={() => {
                if (window.confirm("Reset all demo changes? This will restore the original demonstration dataset.")) {
                  resetDemo();
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              <RotateCcw className="size-4" /> รีเซ็ตข้อมูลตัวอย่าง
            </button>
          </Card>
        </>
      ) : null}
    </AppShell>
  );
}

function getRoleProfile(personaId: "beginner" | "owner" | "commercial" | "export" | "employee") {
  const profiles = {
    beginner: { title: "ผู้เริ่มต้นดูแลสวน", description: "จัดการแปลง งานส่วนตัว และคำแนะนำรายวัน โดยยังไม่เห็นเครื่องมือองค์กรที่ซับซ้อน", canSeeFinance: true, permissions: ["สร้างและปิดงานส่วนตัว", "ดูแปลงและประวัติการดูแลของตน", "บันทึกต้นทุนและรายรับพื้นฐาน"] },
    owner: { title: "เจ้าของสวน", description: "จัดการสวนของตน ผู้ช่วยสวน และข้อมูลการเงินของฟาร์มที่เป็นเจ้าของ", canSeeFinance: true, permissions: ["จัดการแปลงและงานส่วนตัว", "เชิญผู้ช่วยสวน", "ดูต้นทุน รายรับ และผลผลิตของสวน"] },
    commercial: { title: "Farm Manager", description: "บริหารงานทีมหลายโซนภายใต้ Farm Pro แต่ไม่ได้หมายความว่าเข้าถึงข้อมูลส่งออกทุกอย่าง", canSeeFinance: true, permissions: ["สร้างและมอบหมายงานทีม", "ติดตาม Workforce และ Work Orders", "ดูต้นทุนและรายงานของฟาร์มที่ได้รับมอบหมาย"] },
    export: { title: "Farm Manager พร้อมสิทธิ์ Export/QA", description: "เป็นผู้จัดการฟาร์มที่มีสิทธิ์เพิ่มเติมสำหรับล็อต เอกสารคุณภาพ Traceability และการตรวจรับ", canSeeFinance: true, permissions: ["ทุกสิทธิ์ของ Farm Manager", "ตรวจสอบ Traceability และ PHI", "จัดการล็อตและตรวจรับ QA/เอกสารส่งออก"] },
    employee: { title: "พนักงานภาคสนาม", description: "รับและส่งงานในฟาร์ม/โซนที่ได้รับมอบหมาย โดยไม่เห็นข้อมูลธุรกิจที่ไม่จำเป็น", canSeeFinance: false, permissions: ["ดู Todo ที่ได้รับมอบหมาย", "เช็กอิน ส่งผลงานและหลักฐาน", "ดู Care Log เฉพาะแปลงที่เกี่ยวกับงาน"] },
  } as const;
  return profiles[personaId];
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2 text-xs last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
