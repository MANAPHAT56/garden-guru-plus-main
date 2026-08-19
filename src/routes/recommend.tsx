import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Badge, Card, SectionTitle } from "@/components/AppShell";
import { recommendations } from "@/lib/farm-data";
import { useDragonflyData } from "@/hooks/useDragonflyData";
import { TimeRangeFilter } from "@/components/TimeRangeFilter";
import { SearchableSelect } from "@/components/SearchableSelect";

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
  const [farmFilter, setFarmFilter] = useState(dragonfly.activeDashboardFarm.id);
  const [siteFilter, setSiteFilter] = useState("ทั้งหมด");
  const [plotFilter, setPlotFilter] = useState("ทั้งหมด");
  const [cropFilter, setCropFilter] = useState("ทั้งหมด");
  const [stageFilter, setStageFilter] = useState("ทั้งหมด");
  const [categoryFilter, setCategoryFilter] = useState("ทั้งหมด");
  const [sourceFilter, setSourceFilter] = useState("ทั้งหมด");
  const [confidenceFilter, setConfidenceFilter] = useState("ทั้งหมด");
  const [timeFilter, setTimeFilter] = useState("7d");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const demoRecommendations = dragonfly.state.recommendations;
  const recommendationRows = useMemo(() => demoRecommendations.map((item) => {
    const plot = dragonfly.state.plots.find((candidate) => candidate.id === item.plot || candidate.name === item.plot);
    const productionPlan = dragonfly.state.productionPlans.find((plan) => plan.plot === item.plot || plan.plot === plot?.id);
    return {
      ...item,
      farmId: plot?.farmId ?? "FARM-PRIMARY",
      siteId: plot?.siteId,
      crop: plot?.crop ?? productionPlan?.crop ?? "ไม่ระบุพืช",
      stage: productionPlan?.stage ?? "ไม่ระบุระยะการผลิต",
      category: getRecommendationCategory(item.title, item.action),
    };
  }), [demoRecommendations, dragonfly.state.plots, dragonfly.state.productionPlans]);
  const scopedSites = useMemo(() => dragonfly.state.sites.filter((site) => farmFilter === "ทั้งหมด" || (site.farmId ?? "FARM-PRIMARY") === farmFilter), [dragonfly.state.sites, farmFilter]);
  const scopedPlots = useMemo(() => dragonfly.state.plots.filter((plot) =>
    (farmFilter === "ทั้งหมด" || (plot.farmId ?? "FARM-PRIMARY") === farmFilter) &&
    (siteFilter === "ทั้งหมด" || plot.siteId === siteFilter),
  ), [dragonfly.state.plots, farmFilter, siteFilter]);
  const crops = useMemo(() => ["ทั้งหมด", ...Array.from(new Set(scopedPlots.map((plot) => plot.crop)))], [scopedPlots]);
  const stages = useMemo(() => ["ทั้งหมด", ...Array.from(new Set(recommendationRows
    .filter((item) => (farmFilter === "ทั้งหมด" || item.farmId === farmFilter) && (siteFilter === "ทั้งหมด" || item.siteId === siteFilter) && (plotFilter === "ทั้งหมด" || item.plot === plotFilter))
    .map((item) => item.stage)))], [farmFilter, plotFilter, recommendationRows, siteFilter]);
  const categories = useMemo(() => ["ทั้งหมด", ...Array.from(new Set(recommendationRows.map((item) => item.category)))], [recommendationRows]);
  const sources = useMemo(
    () => ["ทั้งหมด", ...Array.from(new Set(recommendationRows.map((item) => item.sourceType)))],
    [recommendationRows]
  );
  const confidences = useMemo(
    () => ["ทั้งหมด", ...Array.from(new Set(recommendationRows.map((item) => item.confidence)))],
    [recommendationRows]
  );
  const filteredDemoRecommendations = recommendationRows.filter((item) => {
    const farmOk = farmFilter === "ทั้งหมด" || item.farmId === farmFilter;
    const siteOk = siteFilter === "ทั้งหมด" || item.siteId === siteFilter;
    const plotOk = plotFilter === "ทั้งหมด" || item.plot === plotFilter;
    const cropOk = cropFilter === "ทั้งหมด" || item.crop === cropFilter;
    const stageOk = stageFilter === "ทั้งหมด" || item.stage === stageFilter;
    const categoryOk = categoryFilter === "ทั้งหมด" || item.category === categoryFilter;
    const sourceOk = sourceFilter === "ทั้งหมด" || item.sourceType === sourceFilter;
    const confidenceOk = confidenceFilter === "ทั้งหมด" || item.confidence === confidenceFilter;
    return farmOk && siteOk && plotOk && cropOk && stageOk && categoryOk && sourceOk && confidenceOk && isInRecommendationPeriod(item.generatedAt, timeFilter, customRange);
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
          <Card className="space-y-4" data-tour="recommendation-filters">
            <div>
              <p className="text-sm font-semibold">ขอบเขตคำแนะนำ</p>
              <p className="mt-1 text-xs text-muted-foreground">เลือกพื้นที่ก่อน เพื่อให้คำแนะนำและปัจจัยที่แสดงอิงสวน โซน และแปลงเดียวกัน</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <SearchableSelect
                label="สวน/ฟาร์ม"
                options={dragonfly.dashboardFarms.map((farm) => ({ value: farm.id, label: `${farm.name} · ${farm.location}` }))}
                value={farmFilter}
                onChange={(value) => { setFarmFilter(value); setSiteFilter("ทั้งหมด"); setPlotFilter("ทั้งหมด"); setCropFilter("ทั้งหมด"); setStageFilter("ทั้งหมด"); }}
                allLabel="ทุกสวนที่เข้าถึงได้"
                searchPlaceholder="ค้นหาชื่อสวนหรือพื้นที่"
              />
              <SearchableSelect
                label="โซน"
                options={["ทั้งหมด", ...scopedSites.map((site) => ({ value: site.id, label: `${site.code} · ${site.name}` }))]}
                value={siteFilter}
                onChange={(value) => { setSiteFilter(value); setPlotFilter("ทั้งหมด"); setCropFilter("ทั้งหมด"); setStageFilter("ทั้งหมด"); }}
                allLabel="ทุกโซนในสวน"
                searchPlaceholder="ค้นหารหัสหรือชื่อโซน"
              />
              <SearchableSelect
                label="แปลง"
                options={["ทั้งหมด", ...scopedPlots.map((plot) => ({ value: plot.id, label: `${plot.id} · ${plot.name} · ${plot.crop}` }))]}
                value={plotFilter}
                onChange={(value) => { setPlotFilter(value); setStageFilter("ทั้งหมด"); }}
                allLabel="ทุกแปลงในขอบเขต"
                searchPlaceholder="ค้นหารหัส ชื่อแปลง หรือพืช"
              />
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-semibold">ตัวกรองเพิ่มเติม</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <SearchableSelect label="ชนิดพืช" options={crops} value={cropFilter} onChange={setCropFilter} allLabel="พืชทุกชนิด" searchPlaceholder="ค้นหาชื่อพืช" />
                <SearchableSelect label="ระยะการผลิต" options={stages.map((stage) => stage === "ทั้งหมด" ? stage : ({ value: stage, label: translateStage(stage) }))} value={stageFilter} onChange={setStageFilter} allLabel="ทุกระยะการผลิต" searchPlaceholder="ค้นหาระยะการผลิต" />
                <SearchableSelect label="ประเภทคำแนะนำ" options={categories} value={categoryFilter} onChange={setCategoryFilter} allLabel="ทุกประเภทคำแนะนำ" searchPlaceholder="ค้นหาประเภท เช่น น้ำ ปุ๋ย โรค" />
                <SearchableSelect label="แหล่งข้อมูล" options={sources.map((source) => source === "ทั้งหมด" ? source : ({ value: source, label: translateSource(source) }))} value={sourceFilter} onChange={setSourceFilter} allLabel="ทุกแหล่งข้อมูล" searchPlaceholder="ค้นหาแหล่งข้อมูล" />
                <SearchableSelect label="ระดับความมั่นใจ" options={confidences} value={confidenceFilter} onChange={setConfidenceFilter} allLabel="ทุกระดับความมั่นใจ" searchPlaceholder="ค้นหาระดับความมั่นใจ" />
              </div>
            </div>
            <TimeRangeFilter value={timeFilter} onChange={setTimeFilter} options={[{ value: "today", label: "วันนี้" }, { value: "7d", label: "7 วัน" }, { value: "30d", label: "30 วัน" }, { value: "all", label: "ทั้งหมด" }]} label="วันที่สร้างคำแนะนำ" dateRange={customRange} onDateRangeChange={setCustomRange} />
            <p className="text-xs text-muted-foreground">กำลังแสดง {filteredDemoRecommendations.length} จาก {recommendationRows.length} คำแนะนำในขอบเขตที่เลือก</p>
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
                  <p className="mt-1 text-[11px] font-semibold text-primary">{r.plot} · {r.crop} · {translateStage(r.stage)} · {r.category}</p>
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

function translateSource(source: string) {
  const labels: Record<string, string> = {
    "ai-estimate": "ประมาณการจาก AI",
    demo: "ข้อมูลจำลอง",
    system: "ข้อมูลจากระบบ",
    "user-data": "ข้อมูลที่ผู้ใช้บันทึก",
    external: "ข้อมูลภายนอก",
  };
  return labels[source] ?? source;
}

function getRecommendationCategory(title: string, action: string) {
  const content = `${title} ${action}`.toLocaleLowerCase("th-TH");
  if (content.includes("ndvi") || content.includes("ตรวจ") || content.includes("monitor")) return "ตรวจแปลงและเฝ้าระวัง";
  if (content.includes("น้ำ") || content.includes("ชื้น") || content.includes("ฝน") || content.includes("irrigation")) return "น้ำและความชื้น";
  if (content.includes("ปุ๋ย") || content.includes("ธาตุอาหาร") || content.includes("fertilizer")) return "ปุ๋ยและธาตุอาหาร";
  if (content.includes("โรค") || content.includes("แมลง") || content.includes("เชื้อ") || content.includes("pest")) return "โรคและศัตรูพืช";
  if (content.includes("เก็บเกี่ยว") || content.includes("harvest")) return "เก็บเกี่ยวและคุณภาพ";
  return "ดูแลทั่วไป";
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
