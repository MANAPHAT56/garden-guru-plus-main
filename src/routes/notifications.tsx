import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Badge, Card, SectionTitle } from "@/components/AppShell";
import { notifications } from "@/lib/farm-data";
import { SearchableSelect } from "@/components/SearchableSelect";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "การแจ้งเตือน — สวนอัจฉริยะ" },
      { name: "description", content: "แจ้งเตือนงานที่ต้องทำ โรคระบาด ฝน ลมแรง ดินแห้ง และรอบใส่ปุ๋ย" },
      { property: "og:title", content: "การแจ้งเตือน — สวนอัจฉริยะ" },
      { property: "og:description", content: "รับแจ้งเตือนเหตุการณ์สำคัญในสวนแบบเรียลไทม์" },
    ],
  }),
  component: NotificationsPage,
});

const icons: Record<string, string> = {
  โรคระบาด: "🦠",
  ฝน: "🌧️",
  ดินแห้ง: "🌵",
  ใส่ปุ๋ย: "🌿",
  ลมแรง: "💨",
};

function NotificationsPage() {
  const [typeFilter, setTypeFilter] = useState("ทั้งหมด");
  const [levelFilter, setLevelFilter] = useState("ทั้งหมด");
  const [settings, setSettings] = useState<Record<string, boolean>>({
    "งานที่ต้องทำ": true, "โรคระบาดในพื้นที่": true, "ฝนตก/ลมแรง": true, "ความชื้นดินต่ำ": true, "รอบใส่ปุ๋ย": true,
  });
  const types = useMemo(() => ["ทั้งหมด", ...Array.from(new Set(notifications.map((item) => item.type)))], []);
  const levels = ["ทั้งหมด", "สูง", "กลาง", "ต่ำ"];
  const filteredNotifications = notifications.filter((item) =>
    (typeFilter === "ทั้งหมด" || item.type === typeFilter) && (levelFilter === "ทั้งหมด" || item.level === levelFilter)
  );

  return (
    <AppShell title="การแจ้งเตือน" subtitle={`${filteredNotifications.length} จาก ${notifications.length} รายการ`}>
      <Card className="space-y-3">
        <SearchableSelect label="ประเภทการแจ้งเตือน" options={types} value={typeFilter} onChange={setTypeFilter} allLabel="ทุกประเภท" searchPlaceholder="ค้นหาประเภทการแจ้งเตือน" />
        <SearchableSelect label="ระดับความสำคัญ" options={levels} value={levelFilter} onChange={setLevelFilter} allLabel="ทุกระดับ" searchPlaceholder="ค้นหาระดับความสำคัญ" />
      </Card>
      <SectionTitle>รายการแจ้งเตือน</SectionTitle>
      {filteredNotifications.map((n) => (
        <Card key={n.id} className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg">
            {icons[n.type] ?? "🔔"}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{n.title}</p>
              <Badge tone={n.level === "สูง" ? "bad" : n.level === "กลาง" ? "warn" : "muted"}>
                {n.level}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {n.type} · {n.time}
            </p>
          </div>
        </Card>
      ))}
      {filteredNotifications.length === 0 ? <Card className="py-8 text-center text-sm text-muted-foreground">ไม่มีการแจ้งเตือนที่ตรงกับตัวกรอง</Card> : null}

      <SectionTitle>ตั้งค่าการแจ้งเตือน</SectionTitle>
      <Card className="space-y-3">
        {Object.keys(settings).map((s) => (
          <div key={s} className="flex items-center justify-between">
            <p className="text-sm">{s}</p>
            <button role="switch" aria-checked={settings[s]} onClick={() => setSettings((current) => ({ ...current, [s]: !current[s] }))} className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${settings[s] ? "bg-primary" : "bg-muted"}`} title={settings[s] ? `ปิดการแจ้งเตือน ${s}` : `เปิดการแจ้งเตือน ${s}`}>
              <span className={`size-4 rounded-full bg-card transition-transform ${settings[s] ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </Card>
    </AppShell>
  );
}
