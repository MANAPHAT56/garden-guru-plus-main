import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  CloudSun,
  FileText,
  HandCoins,
  HeartPulse,
  GraduationCap,
  Users,
  Waves,
  Wheat,
  Cpu,
  Factory,
  Building2,
  Route as RouteIcon,
  Settings,
  ClipboardCheck,
  FolderOpen,
  Boxes,
  Wrench,
} from "lucide-react";
import { AppShell, Card, SectionTitle } from "@/components/AppShell";
import { BrandMark } from "@/components/BrandMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDragonflyData } from "@/hooks/useDragonflyData";
import { ExperienceProgression } from "@/components/ExperienceProgression";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "เมนูทั้งหมด — สวนอัจฉริยะ" },
      {
        name: "description",
        content: "เข้าถึงทุกฟีเจอร์: อากาศ ปฏิทิน ต้นทุน ผลผลิต แจ้งเตือน ชุมชน และรายงาน",
      },
      { property: "og:title", content: "เมนูทั้งหมด — สวนอัจฉริยะ" },
      { property: "og:description", content: "รวมทุกเครื่องมือจัดการสวนไว้ในหน้าเดียว" },
    ],
  }),
  component: MorePage,
});

const coreMenu = [
  {
    to: "/onboarding",
    icon: Bot,
    label: "โปรไฟล์ฟาร์ม",
    desc: "Knowledge level + operation scale",
  },
  {
    to: "/academy",
    icon: GraduationCap,
    label: "EasyPlants Academy",
    desc: "Guided learning และ tutorial",
  },
  {
    to: "/crop-calendar",
    icon: CalendarDays,
    label: "ปฏิทินพืช AI",
    desc: "Timeline เพาะปลูก → เก็บเกี่ยว",
  },
  { to: "/recommend", icon: Bot, label: "คำแนะนำ AI", desc: "รดน้ำ ใส่ปุ๋ย ฉีดยา เก็บเกี่ยว" },
  { to: "/weather", icon: CloudSun, label: "สภาพอากาศ", desc: "ฝน ความชื้น ลม UV" },
  { to: "/market", icon: HandCoins, label: "ราคาตลาด", desc: "ราคาผลผลิตล่าสุดวันนี้" },
  { to: "/disaster", icon: Waves, label: "น้ำท่วม-ภัยแล้ง", desc: "เฝ้าระวังและหลักฐานชดเชย" },
  { to: "/monitor", icon: HeartPulse, label: "เฝ้าระวังรายสัปดาห์", desc: "ความสมบูรณ์ของพืช" },
  { to: "/calendar", icon: CalendarDays, label: "ปฏิทินงาน", desc: "ตารางงานและแจ้งเตือน" },
  { to: "/costs", icon: BarChart3, label: "ต้นทุน-รายได้", desc: "รายรับ รายจ่าย กำไร" },
  { to: "/yield", icon: Wheat, label: "คาดการณ์ผลผลิต", desc: "ผลผลิตและรายได้ล่วงหน้า" },
] as const;

const proMenu = [
  { to: "/farm-pro", icon: Factory, label: "งานและทีม", desc: "งาน คนในทีม และแผนผลิตในหน้าเดียว" },
  {
    to: "/operations",
    icon: Building2,
    label: "ศูนย์ปฏิบัติการ 360",
    desc: "ฟาร์ม โซน งาน สต็อก และ compliance",
  },
  {
    to: "/inventory",
    icon: Boxes,
    label: "คลังและการจัดซื้อ",
    desc: "สต็อก ใบขอซื้อ อนุมัติ PO และรับสินค้า",
  },
  {
    to: "/machinery",
    icon: Wrench,
    label: "เครื่องจักรและการบำรุง",
    desc: "ทะเบียน ตรวจเช็ก แจ้งซ่อม และประวัติบำรุง",
  },
  {
    to: "/traceability",
    icon: RouteIcon,
    label: "Traceability",
    desc: "ค้นหา Lot และประวัติการผลิต",
  },
  {
    to: "/documents",
    icon: FolderOpen,
    label: "ศูนย์เอกสาร",
    desc: "ไฟล์ PHI, QA, ใบรับรอง และรายงาน",
  },
  { to: "/reports", icon: FileText, label: "รายงาน", desc: "PDF Excel และกราฟ" },
] as const;

const techMenu = [
  { to: "/iot", icon: Cpu, label: "IoT", desc: "Devices Rules Alerts Simulator" },
  { to: "/notifications", icon: Bell, label: "การแจ้งเตือน", desc: "งาน โรค ฝน ดินแห้ง" },
  { to: "/community", icon: Users, label: "ชุมชนชาวสวน", desc: "ถามตอบ แชร์ความรู้" },
  { to: "/settings", icon: Settings, label: "Settings", desc: "Data mode และ reset demo" },
] as const;

function MorePage() {
  const { persona, state, setPersona } = useDragonflyData();
  const isBeginner = persona.profile.knowledgeLevel === "Beginner";
  const hasPro = persona.subscription === "Farm Pro";
  const isEmployee = persona.id === "employee";
  const visibleCoreMenu = isEmployee
    ? coreMenu.filter((item) =>
        ["/weather", "/calendar", "/disaster", "/monitor"].includes(item.to),
      )
    : isBeginner
      ? coreMenu
      : coreMenu.filter((item) => item.to !== "/academy");
  const visibleTechMenu = isEmployee
    ? techMenu.filter((item) => ["/notifications", "/community"].includes(item.to))
    : techMenu;
  return (
    <AppShell
      title="เมนูทั้งหมด"
      subtitle={`${persona.profile.knowledgeLevel} · ${persona.profile.operationScale}`}
    >
      <ExperienceProgression persona={persona} onAdvance={setPersona} />
      <SectionTitle>{persona.id === "employee" ? "งานภาคสนาม" : "งานส่วนตัว"}</SectionTitle>
      <Link to="/my-work">
        <Card className="border-primary/30 bg-primary-soft/45">
          <ClipboardCheck className="size-6 text-primary" />
          <p className="mt-2 text-sm font-semibold">งานของฉัน</p>
          <p className="text-xs text-muted-foreground">
            {persona.id === "employee"
              ? "เช็กอิน รับงาน ส่งงาน และรายงานอุปสรรค"
              : "Todo ส่วนตัวที่สร้างจากปฏิทิน"}
          </p>
        </Card>
      </Link>
      {persona.id === "owner" ? (
        <>
          <SectionTitle>ทีมของฉัน</SectionTitle>
          <Link to="/workers">
            <Card className="border-primary/25 bg-primary-soft/45">
              <Users className="size-6 text-primary" />
              <p className="mt-2 text-sm font-semibold">สมาชิกและผู้ช่วยสวน</p>
              <p className="text-xs text-muted-foreground">
                เพิ่มผู้ช่วย ดูงานที่รับผิดชอบ และเตรียมพร้อมก่อนใช้ Workforce
              </p>
            </Card>
          </Link>
        </>
      ) : null}
      <SectionTitle>{isBeginner ? "เริ่มจัดการสวน" : "Smart Farming"}</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {visibleCoreMenu.map((m) => (
          <Link key={m.to} to={m.to}>
            <Card className="h-full">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <m.icon className="size-5" strokeWidth={2} />
              </span>
              <p className="mt-2 text-sm font-semibold">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {!isEmployee ? (
        <>
          <SectionTitle>{hasPro ? "Farm Pro" : "ปลดล็อก Farm Pro"}</SectionTitle>
          {!hasPro ? (
            <Card className="border-primary/30 bg-primary-soft/50">
              <p className="text-sm font-semibold text-primary">เครื่องมือสำหรับสวนเชิงพาณิชย์</p>
              <p className="mt-1 text-xs text-muted-foreground">
                ใช้เมื่อเริ่มมีหลายแปลง หลายคน หรืออยากควบคุมล็อตผลิตอย่างเป็นระบบ
                ฟีเจอร์ถูกล็อกจนกว่าจะสมัคร Farm Pro
              </p>
            </Card>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            {(isBeginner ? proMenu.slice(0, 1) : proMenu).map((m) => (
              <Link key={m.to} to={hasPro ? m.to : "/onboarding"}>
                <Card className={`h-full ${hasPro ? "" : "opacity-70"}`}>
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <m.icon className="size-5" strokeWidth={2} />
                  </span>
                  <p className="mt-2 text-sm font-semibold">{m.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {hasPro ? m.desc : `ล็อกใน Farm Pro · ${m.desc}`}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </>
      ) : null}

      <SectionTitle>Technology & System</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {visibleTechMenu.map((m) => (
          <Link key={m.to} to={m.to}>
            <Card className="h-full">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <m.icon className="size-5" strokeWidth={2} />
              </span>
              <p className="mt-2 text-sm font-semibold">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <SectionTitle>บัญชีของฉัน</SectionTitle>
      <Card className="flex items-center gap-3">
        <BrandMark size="md" />
        <div>
          <p className="text-sm font-semibold">{state.farm.name}</p>
          <p className="text-xs text-muted-foreground">
            {state.farm.plotCount} แปลง · {state.farm.areaRai.toLocaleString("th-TH")} ไร่ ·{" "}
            {state.farm.workerCount} คน
          </p>
        </div>
      </Card>

      <SectionTitle>การแสดงผล</SectionTitle>
      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">โหมดมืด / โหมดสว่าง</p>
          <p className="text-xs text-muted-foreground">แตะปุ่มเพื่อสลับธีมของแอป</p>
        </div>
        <div className="rounded-full bg-primary p-0.5 text-primary-foreground">
          <ThemeToggle />
        </div>
      </Card>
    </AppShell>
  );
}
