import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card } from "@/components/AppShell";
import { Bell, AlertTriangle, Leaf, CalendarDays } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "การแจ้งเตือน — สวนอัจฉริยะ" },
      { name: "description", content: "การแจ้งเตือนและการอัปเดตต่างๆ ของฟาร์ม" },
    ],
  }),
  component: NotificationsPage,
});

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "alert" | "info" | "success";
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "แจ้งเตือนความชื้นต่ำ",
    message: "แปลง D01 มีความชื้นในดินต่ำกว่า 40% ระบบแนะนำให้รดน้ำ",
    time: "10 นาทีที่แล้ว",
    type: "alert",
    read: false,
  },
  {
    id: "2",
    title: "ถึงรอบการใส่ปุ๋ย",
    message: "แปลง M02 ถึงรอบการบำรุงด้วยปุ๋ยเกร็ดทางใบ (รอบที่ 3)",
    time: "2 ชั่วโมงที่แล้ว",
    type: "info",
    read: false,
  },
  {
    id: "3",
    title: "งานรดน้ำเสร็จสิ้น",
    message: "สมชาย รดน้ำโซน NORTH-A เรียบร้อยแล้ว",
    time: "เมื่อวาน 16:30",
    type: "success",
    read: true,
  },
  {
    id: "4",
    title: "แจ้งเตือนสภาพอากาศ",
    message: "พยากรณ์อากาศแจ้งว่าจะมีฝนตกหนักในช่วงบ่ายนี้ โปรดระวังน้ำท่วมขัง",
    time: "เมื่อวาน 08:00",
    type: "alert",
    read: true,
  },
];

function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="size-5 text-warning" />;
      case "info":
        return <CalendarDays className="size-5 text-primary" />;
      case "success":
        return <Leaf className="size-5 text-good" />;
      default:
        return <Bell className="size-5 text-muted-foreground" />;
    }
  };

  return (
    <AppShell
      title="การแจ้งเตือน"
      subtitle="อัปเดตและข้อความแจ้งเตือนทั้งหมด"
    >
      <div className="flex items-center justify-between px-2 mb-4">
        <p className="text-sm font-semibold">
          ยังไม่ได้อ่าน ({notifications.filter((n) => !n.read).length})
        </p>
        <button
          onClick={markAllAsRead}
          className="text-xs font-medium text-primary hover:underline cursor-pointer"
        >
          ทำเครื่องหมายว่าอ่านแล้ว
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`flex items-start gap-4 transition-colors ${
              !n.read ? "border-primary/30 bg-primary-soft/40" : ""
            }`}
          >
            <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm ${!n.read ? "font-bold text-foreground" : "font-semibold text-foreground/90"}`}>
                  {n.title}
                </p>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {n.time}
                </p>
              </div>
              <p className={`mt-1 text-xs leading-relaxed ${!n.read ? "text-foreground/80" : "text-muted-foreground"}`}>
                {n.message}
              </p>
            </div>
            {!n.read && (
              <span className="mt-2.5 size-2 shrink-0 rounded-full bg-primary" />
            )}
          </Card>
        ))}

        {notifications.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Bell className="mx-auto mb-3 size-8 opacity-20" />
            <p className="text-sm font-medium">ไม่มีการแจ้งเตือน</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
