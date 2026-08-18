import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AppShell, Badge, Card, SectionTitle } from "@/components/AppShell";
import { marketPrices, priceTrend, yieldForecast } from "@/lib/farm-data";
import { TimeRangeFilter } from "@/components/TimeRangeFilter";
import { SearchableSelect } from "@/components/SearchableSelect";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "ราคาผลผลิตวันนี้ — สวนอัจฉริยะ" },
      { name: "description", content: "ราคาทุเรียน มังคุด ลำไย ณ ปัจจุบันจากตลาดกลาง พร้อมแนวโน้มราคาและประเมินรายได้จากผลผลิตในสวน" },
      { property: "og:title", content: "ราคาผลผลิตวันนี้ — สวนอัจฉริยะ" },
      { property: "og:description", content: "ราคาตลาดล่าสุดช่วยตัดสินใจว่าจะขายวันไหนถึงคุ้มที่สุด" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketPage,
});

function MarketPage() {
  const [cropFilter, setCropFilter] = useState("ทุเรียนหมอนทอง");
  const [marketFilter, setMarketFilter] = useState("ทั้งหมด");
  const [provinceFilter, setProvinceFilter] = useState("ทั้งหมด");
  const [trendPeriod, setTrendPeriod] = useState("7d");
  const cropOptions = useMemo(() => [...new Set(marketPrices.map((item) => item.product))].map((product) => ({ value: product, label: product })), []);
  const markets = useMemo(() => ["ทั้งหมด", ...Array.from(new Set(marketPrices.filter((item) => item.product === cropFilter).map((item) => item.market)))], [cropFilter]);
  const provinces = useMemo(() => ["ทั้งหมด", ...Array.from(new Set(marketPrices.filter((item) => item.product === cropFilter).map((item) => item.province)))], [cropFilter]);
  const filteredPrices = marketPrices.filter((item) =>
    item.product === cropFilter && (marketFilter === "ทั้งหมด" || item.market === marketFilter) && (provinceFilter === "ทั้งหมด" || item.province === provinceFilter)
  );
  const overviewPrices = filteredPrices;
  const median = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    if (!sorted.length) return 0;
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
  };
  const medianPrice = overviewPrices.length ? Math.round(median(overviewPrices.map((item) => item.price))) : 0;
  const medianChange = overviewPrices.length ? median(overviewPrices.map((item) => item.change)).toFixed(1) : "0.0";
  const trendData = trendPeriod === "3d" ? priceTrend.slice(-3) : priceTrend;
  return (
    <AppShell title="ราคาตลาดวันนี้" subtitle="ข้อมูลตัวอย่าง · อัปเดตตามเวลาของแต่ละแหล่ง">
      <Card className="bg-primary border-0 text-primary-foreground">
        <p className="text-sm text-primary-foreground/85">{cropFilter} · ราคากลางจากขอบเขตที่เลือก</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-4xl font-bold">฿{medianPrice || "—"}</span>
          <span className="mb-1 text-sm text-primary-foreground/85">/ กก. · {Number(medianChange) >= 0 ? "▲" : "▼"} {Math.abs(Number(medianChange))}%</span>
        </div>
        <p className="mt-2 text-xs text-primary-foreground/80">
          Demo: ใช้ค่ากลางแบบ Median จากแหล่งในขอบเขตที่เลือก ไม่ใช่ราคาแนะนำให้ขายหรือข้อมูล API จริง
        </p>
      </Card>

      <Card className="space-y-3">
        <SearchableSelect label="ชนิดผลผลิต" options={cropOptions} value={cropFilter} onChange={(value) => { setCropFilter(value); setMarketFilter("ทั้งหมด"); setProvinceFilter("ทั้งหมด"); }} searchPlaceholder="ค้นหาผลผลิตหรือพันธุ์" />
        <SearchableSelect label="ตลาด" options={markets} value={marketFilter} onChange={setMarketFilter} allLabel="ทุกตลาด" searchPlaceholder="ค้นหาชื่อตลาด" />
        <SearchableSelect label="จังหวัด" options={provinces} value={provinceFilter} onChange={setProvinceFilter} allLabel="ทุกจังหวัด" searchPlaceholder="ค้นหาจังหวัด" />
        <p className="text-xs text-muted-foreground">กำลังแสดงราคาตลาด {filteredPrices.length} แห่ง · เลือกตลาดหรือจังหวัดเพื่อดูข้อมูลเฉพาะพื้นที่</p>
      </Card>

      <SectionTitle>แนวโน้มราคา 7 วัน</SectionTitle>
      <Card>
        <TimeRangeFilter value={trendPeriod} onChange={setTrendPeriod} options={[{ value: "3d", label: "3 วัน" }, { value: "7d", label: "7 วัน" }]} label="ช่วงแนวโน้มราคา" />
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="durian" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="mangosteen" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary" /> ทุเรียน
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: "var(--chart-3)" }} /> มังคุด
          </span>
        </div>
      </Card>

      <SectionTitle>แหล่งราคาในขอบเขตที่เลือก</SectionTitle>
      <Card className="space-y-3">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-border pb-2 text-[11px] font-semibold text-muted-foreground"><span>แหล่งราคา</span><span>ราคา</span><span>เปลี่ยนแปลง</span></div>
        {overviewPrices.length ? <div className="grid grid-cols-[1fr_auto_auto] gap-2 rounded-lg bg-primary-soft/45 p-2 text-xs"><span className="font-semibold">ราคากลางระบบ (Median)</span><span className="font-bold">฿{medianPrice}</span><span className="text-primary">{Number(medianChange) >= 0 ? "+" : ""}{medianChange}%</span></div> : null}
        {filteredPrices.map((m) => (
          <div key={m.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">
                {m.province} · อัปเดต {m.updated}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">฿{m.price}</p>
              <p
                className={`text-[11px] ${m.change > 0 ? "text-primary" : m.change < 0 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {m.change > 0 ? "▲" : m.change < 0 ? "▼" : "—"} {Math.abs(m.change)}%
              </p>
            </div>
          </div>
        ))}
      </Card>

      <SectionTitle>ประเมินรายได้จากผลผลิตของคุณ</SectionTitle>
      <Card className="space-y-3">
        {yieldForecast.map((y) => (
          <div key={y.plot} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{y.plot}</p>
              <p className="text-xs text-muted-foreground">
                {y.kg.toLocaleString("th-TH")} กก. × ฿{y.pricePerKg}
              </p>
            </div>
            <span className="text-sm font-semibold text-primary">
              ฿{(y.kg * y.pricePerKg).toLocaleString("th-TH")}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-medium">รวมโดยประมาณ</span>
          <Badge tone="good">
            ฿{yieldForecast.reduce((s, y) => s + y.kg * y.pricePerKg, 0).toLocaleString("th-TH")}
          </Badge>
        </div>
      </Card>
    </AppShell>
  );
}
