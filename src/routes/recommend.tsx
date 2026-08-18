import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Badge, Card, SectionTitle } from "@/components/AppShell";
import { recommendations } from "@/lib/farm-data";
import { useDragonflyData } from "@/hooks/useDragonflyData";
import { TimeRangeFilter } from "@/components/TimeRangeFilter";

export const Route = createFileRoute("/recommend")({
  head: () => ({
    meta: [
      { title: "คำแนะนำอัจฉริยะ — สวนอัจฉริยะ" },
      { name: "description", content: "AI แนะนำว่าวันนี้ควรรดน้ำ ใส่ปุ๋ย ฉีดยา หรือเก็บเกี่ยวหรือยัง" },
      { property: "og:title", content: "คำแนะนำอัจฉริยะ — สวนอัจฉริยะ" },
      { property: "og:description", content: "คำแนะนำการดูแลสวนรายวันจากข้อมูลอากาศและสภาพแปลง" },
    ],
  }),
  component: RecommendPage,
});

function RecommendPage() {
  const dragonfly = useDragonflyData();
  const [plotFilter, setPlotFilter] = useState("ทั้งหมด");
  const [sourceFilter, setSourceFilter] = useState("ทั้งหมด");
  const [confidenceFilter, setConfidenceFilter] = useState("ทั้งหมด");
  const [timeFilter, setTimeFilter] = useState("7d");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const demoRecommendations = dragonfly.state.recommendations;
  const plots = useMemo(
    () => ["ทั้งหมด", ...Array.from(new Set(demoRecommendations.map((item) => item.plot)))],
    [demoRecommendations]
  );
  const sources = useMemo(
    () => ["ทั้งหมด", ...Array.from(new Set(demoRecommendations.map((item) => item.sourceType)))],
    [demoRecommendations]
  );
  const confidences = useMemo(
    () => ["ทั้งหมด", ...Array.from(new Set(demoRecommendations.map((item) => item.confidence)))],
    [demoRecommendations]
  );
  const filteredDemoRecommendations = demoRecommendations.filter((item) => {
    const plotOk = plotFilter === "ทั้งหมด" || item.plot === plotFilter;
    const sourceOk = sourceFilter === "ทั้งหมด" || item.sourceType === sourceFilter;
    const confidenceOk = confidenceFilter === "ทั้งหมด" || item.confidence === confidenceFilter;
    return plotOk && sourceOk && confidenceOk && isInRecommendationPeriod(item.generatedAt, timeFilter, customRange);
  });
  const sourceTone = (sourceType: string): "good" | "warn" | "info" | "muted" => {
    if (sourceType === "user-data" || sourceType === "system") return "good";
    if (sourceType === "ai-estimate") return "warn";
    if (sourceType === "demo") return "info";
    return "muted";
  };

  return (
    <AppShell
      title="คำแนะนำอัจฉริยะ"
      subtitle={
        dragonfly.isDemoMode
          ? "Demo Mode: รวมข้อมูลอากาศ IoT ภาพดาวเทียม และระยะพืชจำลอง"
          : "วิเคราะห์จากอากาศ ความชื้นดิน และอายุพืช"
      }
    >
      {dragonfly.isDemoMode ? (
        <>
          <SectionTitle>ตัวกรอง</SectionTitle>
          <Card className="space-y-3">
            <TimeRangeFilter value={timeFilter} onChange={setTimeFilter} options={[{ value: "today", label: "วันนี้" }, { value: "7d", label: "7 วัน" }, { value: "30d", label: "30 วัน" }, { value: "all", label: "ทั้งหมด" }]} label="วันที่สร้างคำแนะนำ" dateRange={customRange} onDateRangeChange={setCustomRange} />
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">แปลง</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {plots.map((plot) => (
                  <button
                    key={plot}
                    onClick={() => setPlotFilter(plot)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      plotFilter === plot ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                    }`}
                  >
                    {plot}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">แหล่งข้อมูล</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sources.map((source) => (
                  <button
                    key={source}
                    onClick={() => setSourceFilter(source)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      sourceFilter === source ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                    }`}
                  >
                    {source === "ai-estimate" ? "ประมาณการจาก AI" : source === "demo" ? "ข้อมูลจำลอง" : source === "system" ? "ข้อมูลจากระบบ" : source === "user-data" ? "ข้อมูลที่ผู้ใช้บันทึก" : "ข้อมูลภายนอก"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">ระดับความมั่นใจ</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {confidences.map((confidence) => (
                  <button key={confidence} onClick={() => setConfidenceFilter(confidence)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${confidenceFilter === confidence ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>{confidence}</button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">กำลังแสดง {filteredDemoRecommendations.length} จาก {demoRecommendations.length} คำแนะนำ</p>
          </Card>
        </>
      ) : null}

      <SectionTitle>สรุปสำหรับวันนี้</SectionTitle>
      {dragonfly.isDemoMode
        ? filteredDemoRecommendations.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-xl">
                  ✨
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{r.title}</p>
                    <Badge tone={sourceTone(r.sourceType)}>{r.sourceType === "ai-estimate" ? "AI ประมาณการ" : r.sourceType === "demo" ? "ข้อมูลจำลอง" : r.sourceType === "system" ? "ระบบ" : r.sourceType === "user-data" ? "ผู้ใช้บันทึก" : "ภายนอก"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.reason}</p>
                  <p className="mt-2 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                    แหล่งที่มา: {r.sourceLabel} · ความมั่นใจ {r.confidence}{r.generatedAt ? ` · สร้าง ${new Date(`${r.generatedAt}T00:00:00`).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}` : ""}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-primary">แนะนำ: {r.action}</p>
                </div>
              </div>
            </Card>
          ))
        : recommendations.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-xl">
                  {r.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{r.title}</p>
                    <Badge tone={r.tone as "good" | "warn" | "info"}>{r.answer}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.reason}</p>
                </div>
              </div>
            </Card>
          ))}

      <SectionTitle>ปัจจัยที่ระบบใช้ประกอบคำแนะนำ</SectionTitle>
      <Card className="grid grid-cols-2 gap-3">
        {(dragonfly.isDemoMode
          ? [
              {
                l: "ความชื้นดิน",
                v: dragonfly.state.iotDevices.find((d) => d.id === "SM-D01-001")?.latestReading ?? "N/A",
              },
              { l: "โอกาสฝน", v: `${dragonfly.state.weather.rainChance}%` },
              { l: "ระยะการผลิต", v: translateStage(dragonfly.state.productionPlans[0]?.stage ?? "ยังไม่ระบุ") },
              { l: "การเปลี่ยนแปลง NDVI", v: `${dragonfly.state.satellite.changePercent}%` },
              { l: "การแจ้งเตือน IoT ที่ยังเปิดอยู่", v: `${dragonfly.state.iotAlerts.length}` },
              { l: "แหล่งข้อมูล", v: "ข้อมูลจำลอง" },
            ]
          : [
              { l: "ความชื้นดิน", v: "68%" },
              { l: "โอกาสฝน 6 ชม.", v: "65%" },
              { l: "อุณหภูมิสูงสุด", v: "34°C" },
              { l: "ความเร็วลม", v: "12 กม./ชม." },
              { l: "รอบปุ๋ยล่าสุด", v: "21 วัน" },
              { l: "อายุผลทุเรียน", v: "108 วัน" },
            ]).map((f) => (
          <div key={f.l} className="rounded-xl bg-muted/60 p-3">
            <p className="text-[11px] text-muted-foreground">{f.l}</p>
            <p className="text-sm font-semibold">{f.v}</p>
          </div>
        ))}
      </Card>

      {dragonfly.isDemoMode && filteredDemoRecommendations.length === 0 ? (
        <Card className="py-8 text-center">
          <p className="text-sm text-muted-foreground">ไม่มีคำแนะนำที่ตรงกับตัวกรองนี้</p>
        </Card>
      ) : null}

      <Card className="border-primary/30 bg-primary-soft/50">
        <p className="text-sm font-semibold text-primary">คำแนะนำที่อธิบายเหตุผลได้</p>
        <p className="mt-1 text-xs text-muted-foreground">
          คำแนะนำจะแสดงเหตุผลเสมอ และใน Demo Mode จะระบุชัดว่าเป็นข้อมูลจำลอง ไม่ใช่ข้อเท็จจริงรับประกัน
        </p>
      </Card>
    </AppShell>
  );
}

function translateStage(stage: string) {
  const labels: Record<string, string> = { "Fruit Development": "พัฒนาผล", Flowering: "ออกดอก", "Fruit Set": "ติดผล", "Pre-Harvest": "ก่อนเก็บเกี่ยว", Learning: "กำลังเรียนรู้" };
  return labels[stage] ?? stage;
}

function isInRecommendationPeriod(date: string | undefined, period: string, customRange: { start: string; end: string }) {
  if (period === "all" || !date) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const created = new Date(`${date}T00:00:00`);
  if (period === "custom") {
    const start = customRange.start ? new Date(`${customRange.start}T00:00:00`) : undefined;
    const end = customRange.end ? new Date(`${customRange.end}T23:59:59`) : undefined;
    return (!start || created >= start) && (!end || created <= end);
  }
  if (period === "today") return created.getTime() === today.getTime();
  const days = period === "7d" ? 7 : 30;
  const start = new Date(today);
  start.setDate(today.getDate() - days);
  return created >= start && created <= today;
}
