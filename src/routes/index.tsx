import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  CloudSun,
  Droplets,
  Sparkles,
  Sprout,
  Tags,
  MapPin,
  Building2,
} from "lucide-react";
import { AppShell, Badge, Card, Progress, SectionTitle, baht } from "@/components/AppShell";
import { BrandMark } from "@/components/BrandMark";
import { notifications, todayTasks, weather } from "@/lib/farm-data";
import { useDragonflyData } from "@/hooks/useDragonflyData";
import { usePlots } from "@/hooks/usePlots";
import { ExperienceProgression } from "@/components/ExperienceProgression";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "สวนอัจฉริยะ — แอปจัดการสวนด้วย AI" },
      {
        name: "description",
        content: "ภาพรวมสวน งานประจำวัน สภาพอากาศ และสรุปต้นทุน-รายได้ ในแอปเดียว",
      },
      { property: "og:title", content: "สวนอัจฉริยะ — แอปจัดการสวนด้วย AI" },
      {
        property: "og:description",
        content: "จัดการแปลง วิเคราะห์โรคพืชด้วย AI และวางแผนงานเกษตรได้ในที่เดียว",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const dragonfly = useDragonflyData();
  const { plots } = usePlots();
  const isBeginner = dragonfly.persona.profile.knowledgeLevel === "Beginner";
  const isOwner = dragonfly.persona.id === "owner";
  const isCommercial = dragonfly.persona.profile.operationScale === "Commercial Farm";
  const isExport = dragonfly.persona.profile.operationScale === "Enterprise / Export";
  const smartTasks = dragonfly.isDemoMode ? dragonfly.state.tasks : todayTasks;
  const smartWeather = dragonfly.isDemoMode ? dragonfly.state.weather : weather.now;
  const avgHealth =
    plots.length > 0 ? Math.round(plots.reduce((s, p) => s + p.health, 0) / plots.length) : 0;
  const area = plots.reduce((s, p) => s + p.area, 0);
  const selectedFarm = dragonfly.activeDashboardFarm;
  const isPrimaryFarm = selectedFarm.id === "FARM-PRIMARY";
  const farmHealth = isPrimaryFarm ? avgHealth : selectedFarm.status === "Needs attention" ? 78 : 91;
  const farmTasks = isPrimaryFarm ? smartTasks : selectedFarm.status === "Needs attention" ? smartTasks.filter((task) => task.status !== "Completed") : smartTasks.filter((task) => task.status === "Completed");

  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadTx = () => {
      const stored = localStorage.getItem("garden_guru_transactions");
      if (stored) {
        try {
          setTransactions(JSON.parse(stored));
        } catch (e) {}
      }
    };
    loadTx();
    window.addEventListener("transactions_updated", loadTx);
    return () => window.removeEventListener("transactions_updated", loadTx);
  }, []);

  const income = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const cost = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <AppShell
      title={dragonfly.isDemoMode ? `แดชบอร์ด · ${selectedFarm.name}` : "สวัสดี ชาวสวน"}
      subtitle={
        dragonfly.isDemoMode
          ? `${selectedFarm.location} · ${dragonfly.persona.role} · ${dragonfly.persona.subscription}`
          : "ศุกร์ที่ 7 สิงหาคม 2569"
      }
    >
      {dragonfly.isDemoMode ? (
        <Card className="border-primary/25 bg-primary-soft/45 p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Building2 className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <label htmlFor="dashboard-farm" className="text-xs font-semibold text-primary">ฟาร์มที่กำลังดู</label>
              <select
                id="dashboard-farm"
                value={selectedFarm.id}
                onChange={(event) => dragonfly.setActiveDashboardFarm(event.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-primary/20 bg-card px-3 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
              >
                {dragonfly.dashboardFarms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name} · {farm.location}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex min-w-0 items-center gap-1"><MapPin className="size-3 shrink-0" />{selectedFarm.type} · {selectedFarm.plotCount} แปลง</span>
            <Badge tone={selectedFarm.status === "Normal" ? "good" : selectedFarm.status === "Blocked" ? "bad" : "warn"}>{selectedFarm.status === "Normal" ? "ปกติ" : selectedFarm.status === "Blocked" ? "ติดขัด" : "ต้องดู"}</Badge>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{selectedFarm.dataLabel}</p>
        </Card>
      ) : null}

      {isBeginner ? (
        <Card className="border-primary/30 bg-primary-soft/60">
          <p className="text-sm font-semibold text-primary">เริ่มต้นวันนี้</p>
          <p className="mt-1 text-xs text-muted-foreground">
            EasyPlants จะค่อย ๆ พาเพิ่มแปลง สร้างงาน และบันทึกสุขภาพพืชโดยไม่โชว์เครื่องมือระดับองค์กรก่อนจำเป็น
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {["Create farm", "Create first plot", "Add crop", "Create first task"].map((step, index) => (
              <div key={step} className="rounded-xl bg-card px-3 py-2">
                <span className="font-bold text-primary">{index + 1}.</span> {step}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {isOwner ? (
        <Card className="border-primary/25 bg-primary-soft/45">
          <p className="text-sm font-semibold text-primary">มุมมองเจ้าของสวน</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">โฟกัสผลผลิต ต้นทุน และงานที่ช่วยให้ตัดสินใจเองได้ โดยยังไม่แสดงเครื่องมือสั่งงานทีมที่ซับซ้อน</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs"><Link to="/yield" className="rounded-lg bg-card px-3 py-2 font-semibold">ดูแผนผลผลิต</Link><Link to="/costs" className="rounded-lg bg-card px-3 py-2 font-semibold">ตรวจต้นทุน</Link></div>
        </Card>
      ) : null}

      <ExperienceProgression persona={dragonfly.persona} onAdvance={dragonfly.setPersona} />

      {isCommercial || isExport ? (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "งานในขอบเขต", value: farmTasks.length },
            { label: "กำลังทำ", value: farmTasks.filter((task) => task.status === "In Progress").length },
            { label: "คนงาน", value: isPrimaryFarm ? dragonfly.state.workforce.active : Math.max(1, Math.round(selectedFarm.workerCount * 0.75)) },
            { label: isExport ? "PHI Alerts" : "แปลงต้องเฝ้าระวัง", value: isExport ? (selectedFarm.status === "Needs attention" ? 2 : 0) : (selectedFarm.status === "Needs attention" ? 2 : plots.filter((p) => p.health < 75).length) },
          ].map((metric) => (
            <Card key={metric.label} className="text-center">
              <p className="text-[11px] text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold text-primary">{metric.value}</p>
            </Card>
          ))}
        </div>
      ) : null}

      <Card className="relative overflow-hidden border-0 bg-primary px-5 py-5 text-primary-foreground shadow-[0_18px_30px_-20px_oklch(0.25_0.08_145_/_0.85)]">
        <div className="pointer-events-none absolute -right-8 -top-12 size-44 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-primary-foreground/80">สุขภาพสวนโดยรวม</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight">{farmHealth}</span>
              <span className="mb-1 text-sm text-primary-foreground/85">/ 100 · ดี</span>
            </div>
          </div>
          <BrandMark size="md" className="border border-white/15 bg-white/15 shadow-none" />
        </div>
        <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white/90" style={{ width: `${farmHealth}%` }} />
        </div>
        <div className="relative mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/10 py-2.5">
            <p className="text-lg font-bold">{dragonfly.isDemoMode ? selectedFarm.plotCount : plots.length}</p>
            <p className="text-[11px] text-primary-foreground/80">แปลง</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 py-2.5">
            <p className="text-lg font-bold">{dragonfly.isDemoMode ? selectedFarm.areaRai : area}</p>
            <p className="text-[11px] text-primary-foreground/80">ไร่</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 py-2.5">
            <p className="text-lg font-bold">{dragonfly.isDemoMode ? selectedFarm.treeCount : plots.reduce((s, p) => s + p.trees, 0)}</p>
            <p className="text-[11px] text-primary-foreground/80">ต้น</p>
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-[15px] font-bold tracking-tight">ทางลัดสำหรับวันนี้</h2>
          <Link
            to="/more"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary"
          >
            ทั้งหมด <ChevronRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              to: "/market" as const,
              icon: Tags,
              label: "ราคาตลาด",
              tone: "bg-amber-50 text-amber-700",
            },
            {
              to: "/disaster" as const,
              icon: Droplets,
              label: "ท่วม/แล้ง",
              tone: "bg-sky-50 text-sky-700",
            },
            {
              to: "/monitor" as const,
              icon: Sprout,
              label: "เฝ้าระวัง",
              tone: "bg-emerald-50 text-emerald-700",
            },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="surface-card group flex min-h-24 flex-col items-center justify-center gap-2 p-3 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span className={`flex size-10 items-center justify-center rounded-2xl ${q.tone}`}>
                <q.icon className="size-5" />
              </span>
              <span className="text-xs font-medium text-foreground">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/weather">
          <Card className="h-full transition-transform duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-muted-foreground">สภาพอากาศ</p>
            <CloudSun className="size-5 text-warning" />
          </div>
            <p className="mt-2 text-2xl font-bold tracking-tight">{smartWeather.temp}°</p>
            <p className="text-xs text-muted-foreground">{smartWeather.condition}</p>
            <p className="mt-3 text-xs font-semibold text-primary">
              โอกาสฝน {smartWeather.rainChance}%
            </p>
          </Card>
        </Link>
        <Link to="/recommend">
          <Card className="h-full transition-transform duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium text-muted-foreground">คำแนะนำ AI</p>
              <Sparkles className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-sm font-semibold leading-snug">ยังไม่ต้องรดน้ำ 💧</p>
            <p className="mt-1 text-xs text-muted-foreground">ใส่ปุ๋ยแปลงมังคุด</p>
            <p className="mt-3 inline-flex items-center gap-0.5 text-xs font-semibold text-primary">
              ดู 4 ข้อ <ArrowUpRight className="size-3.5" />
            </p>
          </Card>
        </Link>
      </div>

      <SectionTitle
        action={
          <Link to="/calendar" className="text-xs font-medium text-primary">
            ปฏิทินงาน
          </Link>
        }
      >
        งานที่ต้องทำวันนี้
      </SectionTitle>
      <Card className="space-y-3">
        {farmTasks.slice(0, 4).map((t: any) => (
          <div key={t.id} className="flex items-center gap-3">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-sm ${
                t.done || t.status === "Completed" ? "bg-primary-soft text-primary" : "bg-muted"
              }`}
            >
              {t.type === "Irrigation" || t.type === "รดน้ำ" ? "💧" : t.type === "Fertilizer" || t.type === "ใส่ปุ๋ย" ? "🌿" : "🧴"}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-medium ${t.done || t.status === "Completed" ? "text-muted-foreground line-through" : ""}`}
              >
                {t.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {t.time ? `${t.time} · ` : ""}{t.plot}
              </p>
            </div>
            <Badge tone={t.done || t.status === "Completed" ? "good" : t.status === "Delayed" ? "bad" : "warn"}>
              {t.status ?? (t.done ? "เสร็จ" : "รอทำ")}
            </Badge>
          </div>
        ))}
      </Card>

      {dragonfly.isDemoMode && dragonfly.state.recommendations.length > 0 ? (
        <>
          <SectionTitle>Smart Recommendations</SectionTitle>
          <Card className="space-y-3">
            {dragonfly.state.recommendations.slice(0, 2).map((rec) => (
              <div key={rec.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{rec.title}</p>
                  <Badge tone="info">{rec.confidence}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{rec.reason}</p>
                <p className="mt-1 text-xs font-medium text-primary">{rec.action}</p>
              </div>
            ))}
          </Card>
        </>
      ) : null}

      <SectionTitle
        action={
          <Link to="/plots" className="text-xs font-medium text-primary">
            ดูทั้งหมด
          </Link>
        }
      >
        แปลงของฉัน
      </SectionTitle>
      <div className="space-y-3">
        {plots.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center gap-3">
              <BrandMark size="md" className="bg-primary-soft text-primary shadow-none" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.crop} · {p.trees} ต้น · {p.area} ไร่
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">{p.health}%</span>
            </div>
            <div className="mt-3">
              <Progress value={p.health} />
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle
        action={
          <Link to="/costs" className="text-xs font-medium text-primary">
            รายละเอียด
          </Link>
        }
      >
        สรุปการเงินเดือนนี้
      </SectionTitle>
      <Card>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">รายได้</p>
            <p className="text-sm font-bold text-primary">{baht(income)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">ต้นทุน</p>
            <p className="text-sm font-bold text-destructive">{baht(cost)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">กำไร</p>
            <p className="text-sm font-bold">{baht(income - cost)}</p>
          </div>
        </div>
      </Card>

      <SectionTitle
        action={
          <Link to="/notifications" className="text-xs font-medium text-primary">
            ทั้งหมด
          </Link>
        }
      >
        แจ้งเตือนล่าสุด
      </SectionTitle>
      <Card className="space-y-3">
        {notifications.slice(0, 3).map((n) => (
          <div key={n.id} className="flex items-start gap-3">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-sm">{n.title}</p>
              <p className="text-xs text-muted-foreground">
                {n.type} · {n.time}
              </p>
            </div>
          </div>
        ))}
      </Card>
    </AppShell>
  );
}
