import type { DemoPersonaId } from "@/lib/dragonfly-data";

export type GuidedTutorialRoute = "/" | "/plots" | "/calendar" | "/workers" | "/my-work";

export type GuidedTutorialStep = {
  id: string;
  route: GuidedTutorialRoute;
  target: string;
  title: string;
  description: string;
  instruction: string;
};

export type GuidedTutorial = {
  id: string;
  title: string;
  summary: string;
  steps: GuidedTutorialStep[];
};

export type GuidedTutorialSession = {
  tourId: string;
  stepIndex: number;
  active: boolean;
};

const STORAGE_KEY = "easyplants_guided_tutorial";
export const GUIDED_TUTORIAL_EVENT = "easyplants_guided_tutorial_updated";

const personalFarmTour: GuidedTutorial = {
  id: "personal-farm-basics",
  title: "เริ่มจัดการสวนของคุณ",
  summary: "เรียนรู้ขอบเขตสวน สุขภาพแปลง การเพิ่มแปลง และการสร้างงานส่วนตัว",
  steps: [
    { id: "tour-farm-scope", route: "/", target: "dashboard-farm", title: "เลือกสวนที่กำลังดู", description: "ข้อมูลทั้งหมดในแดชบอร์ดจะอิงจากสวนที่เลือกตรงนี้", instruction: "ลองกดรายการสวนเพื่อดูตัวเลือก หรือกดถัดไป" },
    { id: "tour-farm-health", route: "/", target: "dashboard-health", title: "ตรวจสุขภาพสวน", description: "คะแนนนี้สรุปสุขภาพของแปลงในสวนที่เลือก เพื่อช่วยหาเรื่องที่ควรตรวจต่อ", instruction: "ดูคะแนนและแถบสุขภาพ แล้วกดถัดไป" },
    { id: "tour-add-plot", route: "/plots", target: "plots-add-gps", title: "เพิ่มแปลงเพาะปลูก", description: "สร้างแปลงจากตำแหน่ง GPS เลือกสวน โซน ชนิดพืช และบันทึกขอบเขต", instruction: "กดปุ่มนี้เมื่อต้องการสร้างแปลงจริง หรือกดถัดไป" },
    { id: "tour-create-task", route: "/calendar", target: "calendar-create-task", title: "สร้างงานดูแลสวน", description: "งานที่สร้างจากปฏิทินจะเป็นข้อมูลกลาง และเข้า Care Log เมื่อปิดงานแล้ว", instruction: "กดสร้างงานเพื่อเปิดแบบฟอร์ม หรือกดเสร็จสิ้น" },
  ],
};

const managerTour: GuidedTutorial = {
  id: "manager-operations",
  title: "เริ่มบริหารงานสวนและทีม",
  summary: "เรียนรู้ขอบเขตฟาร์ม ภาพรวมสุขภาพ การสร้างงานทีม และการจัดการบุคลากร",
  steps: [
    ...personalFarmTour.steps.slice(0, 2),
    { id: "tour-create-team-task", route: "/calendar", target: "calendar-create-task", title: "สร้างและมอบหมายงานทีม", description: "ผู้จัดการสร้าง Task กลาง เลือกแปลง ทีม หรือพนักงาน และติดตามจนหัวหน้าตรวจรับ", instruction: "กดสร้างงานเพื่อดูแบบฟอร์มงานทีม หรือกดถัดไป" },
    { id: "tour-manage-team", route: "/workers", target: "workers-members", title: "จัดการสมาชิกและทีม", description: "เชิญสมาชิก เปลี่ยนบทบาท ย้ายทีม และกำหนดฟาร์ม โซน หรือแปลงประจำได้จากส่วนนี้", instruction: "กดเชิญสมาชิกเพื่อดูแบบฟอร์ม หรือกดเสร็จสิ้น" },
  ],
};

const employeeTour: GuidedTutorial = {
  id: "employee-daily-work",
  title: "เริ่มทำงานประจำวัน",
  summary: "เรียนรู้การเช็กอิน ดูงานที่ได้รับมอบหมาย และส่งงานให้หัวหน้าตรวจรับ",
  steps: [
    { id: "tour-employee-checkin", route: "/my-work", target: "employee-checkin", title: "เช็กอินก่อนเริ่มงาน", description: "บันทึกเวลาและพื้นที่ปฏิบัติงานก่อนเริ่มทำงานที่ได้รับมอบหมาย", instruction: "กดเช็กอินที่เขตงาน หรือกดถัดไป" },
    { id: "tour-employee-filters", route: "/my-work", target: "employee-work-filters", title: "เลือกงานที่ต้องดู", description: "แยกงานวันนี้ งานค้าง และสถานะ เพื่อไม่ให้รายการงานจำนวนมากปะปนกัน", instruction: "ลองเลือกงานวันนี้หรือสถานะ แล้วกดถัดไป" },
    { id: "tour-employee-queue", route: "/my-work", target: "employee-task-queue", title: "ทำงานและส่งตรวจ", description: "กดเริ่มงาน เมื่อเสร็จให้ส่งตรวจ หัวหน้างานจะเป็นผู้อนุมัติปิดงาน", instruction: "เปิดงานที่รับผิดชอบ แล้วกดเสร็จสิ้นการฝึกสอน" },
  ],
};

export function getGuidedTutorial(personaId: DemoPersonaId) {
  if (personaId === "employee") return employeeTour;
  if (personaId === "commercial" || personaId === "export") return managerTour;
  return personalFarmTour;
}

export function getGuidedTutorialSession(): GuidedTutorialSession | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const session = JSON.parse(stored) as GuidedTutorialSession;
    return session.active ? session : null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveSession(session: GuidedTutorialSession | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(GUIDED_TUTORIAL_EVENT));
}

export function startGuidedTutorial(personaId: DemoPersonaId) {
  const tour = getGuidedTutorial(personaId);
  saveSession({ tourId: tour.id, stepIndex: 0, active: true });
}

export function updateGuidedTutorialStep(session: GuidedTutorialSession, stepIndex: number) {
  saveSession({ ...session, stepIndex });
}

export function stopGuidedTutorial() {
  saveSession(null);
}

export function findGuidedTutorial(tourId: string, personaId: DemoPersonaId) {
  const personaTour = getGuidedTutorial(personaId);
  return personaTour.id === tourId ? personaTour : null;
}
