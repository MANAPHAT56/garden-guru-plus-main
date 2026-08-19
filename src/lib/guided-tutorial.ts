import type { DemoPersonaId } from "@/lib/dragonfly-data";

export type GuidedTutorialRoute = string;

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
  category?: string;
  requiresPro?: boolean;
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

const featureTutorials: GuidedTutorial[] = [
  { id: "feature-dashboard", category: "เริ่มต้นและข้อมูลสวน", title: "แดชบอร์ดสวน", summary: "อ่านสุขภาพสวน งานเร่งด่วน และสรุปข้อมูลของพื้นที่ที่กำลังเลือก", steps: [{ id: "feature-dashboard-step", route: "/", target: "app-shell-header", title: "เริ่มจากภาพรวมสวน", description: "แดชบอร์ดรวมข้อมูลของสวนหรือองค์กรตามพื้นที่ทำงานที่เลือกไว้ด้านบน", instruction: "ตรวจชื่อพื้นที่ทำงาน แล้วเลื่อนดูสุขภาพแปลงและงานที่ต้องทำวันนี้" }] },
  { id: "feature-workspace", category: "เริ่มต้นและข้อมูลสวน", title: "สลับสวนของฉันและองค์กร", summary: "สลับขอบเขตข้อมูลโดยไม่ต้องเปลี่ยนหน้า", steps: [{ id: "feature-workspace-step", route: "/", target: "app-shell-header", title: "เลือกพื้นที่ทำงาน", description: "สวนของฉันใช้ข้อมูลส่วนตัว ส่วนองค์กรใช้สิทธิ์และข้อมูลที่องค์กรกำหนด", instruction: "ใช้รายการพื้นที่ทำงานเหนือหัวข้อหน้า เพื่อเลือกบริบทที่ต้องการ" }] },
  { id: "feature-profile", category: "เริ่มต้นและข้อมูลสวน", title: "โปรไฟล์ฟาร์มและบทบาท", summary: "กำหนดระดับความรู้ ขนาดการดำเนินงาน และบทบาทตัวอย่างที่ระบบนำไปปรับหน้าจอ", steps: [{ id: "feature-profile-step", route: "/onboarding", target: "app-shell-header", title: "ตั้งค่าโปรไฟล์การใช้งาน", description: "โปรไฟล์ช่วยกำหนดคำอธิบาย ความซับซ้อนของหน้าจอ และเส้นทางเริ่มต้นที่เหมาะกับคุณ", instruction: "ตรวจบทบาทปัจจุบันและข้อมูลฟาร์ม ก่อนเลือกขั้นถัดไปของการใช้งาน" }] },
  { id: "feature-menu", category: "เริ่มต้นและข้อมูลสวน", title: "เมนูรวมตามสิทธิ์", summary: "ดูทุกฟีเจอร์ในหน้าเดียว พร้อมป้ายว่าเหมาะกับบทบาทใดและสถานะสิทธิ์", steps: [{ id: "feature-menu-step", route: "/more", target: "app-shell-header", title: "เลือกเครื่องมือให้เหมาะกับบทบาท", description: "เมนูไม่ซ้ำตาม Role แต่คำสั่งและข้อมูลจะเปลี่ยนตามพื้นที่ทำงานและสิทธิ์ของคุณ", instruction: "ตรวจป้ายเหมาะสำหรับและสถานะล็อก ก่อนเปิดฟีเจอร์ที่ต้องการ" }] },
  { id: "feature-academy", category: "เริ่มต้นและข้อมูลสวน", title: "EasyPlants Academy", summary: "ค้นหาและเริ่มบทเรียนแบบโต้ตอบสำหรับทุกฟีเจอร์ของระบบ", steps: [{ id: "feature-academy-step", route: "/academy", target: "app-shell-header", title: "เลือกบทเรียนที่ต้องการ", description: "บทเรียนแต่ละหัวข้อจะพาไปยังหน้าจริงพร้อมไฮไลต์จุดเริ่มต้นและคำแนะนำ", instruction: "ค้นหาชื่อฟีเจอร์ แล้วกดปุ่มฝึกฟีเจอร์นี้" }] },
  { id: "feature-plots", category: "เริ่มต้นและข้อมูลสวน", title: "จัดการแปลง", summary: "สร้างแปลงจาก GPS กำหนดสวน โซน ชนิดพืช และดูสุขภาพแปลง", steps: [{ id: "feature-plots-step", route: "/plots", target: "app-shell-header", title: "จัดการข้อมูลแปลง", description: "แปลงเป็นต้นทางของงาน การดูแล การคาดการณ์ และรายงาน", instruction: "เลือกสวนและโซนก่อน แล้วเพิ่มหรือเปิดรายละเอียดแปลงที่ต้องการ" }] },
  { id: "feature-diagnose", category: "เริ่มต้นและข้อมูลสวน", title: "ตรวจโรคพืช", summary: "บันทึกอาการ ตรวจความเสี่ยง และเก็บผลตรวจตามสวน โซน หรือแปลง", steps: [{ id: "feature-diagnose-step", route: "/diagnose", target: "app-shell-header", title: "เริ่มตรวจโรค", description: "ผลตรวจช่วยสร้างการเฝ้าระวังและงานติดตามในแปลงที่เกี่ยวข้อง", instruction: "เลือกขอบเขตแปลงและบันทึกอาการที่พบเพื่อให้ข้อมูลย้อนกลับได้" }] },
  { id: "feature-ai-assistant", category: "เริ่มต้นและข้อมูลสวน", title: "ผู้ช่วย AI", summary: "ขอคำแนะนำจากข้อมูลสวน พร้อมบอกชัดว่าเป็นข้อมูลระบบหรือประมาณการ AI", steps: [{ id: "feature-ai-assistant-step", route: "/assistant", target: "app-shell-header", title: "ถามผู้ช่วย AI", description: "คำตอบ AI ใช้ประกอบการตัดสินใจ ไม่แทนการตรวจแปลงหรือคำแนะนำผู้เชี่ยวชาญ", instruction: "เลือกหัวข้อและระบุสวนหรือแปลงที่ต้องการคำแนะนำ" }] },
  { id: "feature-crop-calendar", category: "วางแผนและดูแลงาน", title: "ปฏิทินพืช AI", summary: "สร้างรอบปลูกและดูช่วงดูแล เก็บเกี่ยว และงานที่ระบบแนะนำ", steps: [{ id: "feature-crop-calendar-step", route: "/crop-calendar", target: "app-shell-header", title: "วางรอบปลูก", description: "รอบปลูกเป็นกรอบเวลาที่เชื่อมแผนดูแล ผลผลิต และรายได้", instruction: "เลือกสวน โซน แปลง และพืช จากนั้นเพิ่มรอบปลูกที่ต้องการติดตาม" }] },
  { id: "feature-calendar", category: "วางแผนและดูแลงาน", title: "ปฏิทินงาน", summary: "สร้างงานส่วนตัวหรือมอบหมายงานทีม แล้วติดตามจนส่งตรวจและปิดงาน", steps: [{ id: "feature-calendar-step", route: "/calendar", target: "app-shell-header", title: "จัดตารางงาน", description: "งานจากปฏิทินคือข้อมูลกลางที่ใช้สร้างประวัติการดูแลหลังปิดงาน", instruction: "เลือกช่วงเวลาและขอบเขตแปลง แล้วสร้างงานหรือเปิดงานที่ยังไม่ส่งมอบ" }] },
  { id: "feature-my-work", category: "วางแผนและดูแลงาน", title: "งานของฉัน", summary: "พนักงานเช็กอิน รับงาน ส่งตรวจ และเจ้าของสวนติดตาม Todo ส่วนตัว", steps: [{ id: "feature-my-work-step", route: "/my-work", target: "app-shell-header", title: "ทำงานที่ได้รับมอบหมาย", description: "ในองค์กรจะแสดงเฉพาะงานของคุณ ส่วนสวนส่วนตัวจะแสดง Todo ที่คุณสร้าง", instruction: "เลือกงานวันนี้ เริ่มงาน และส่งงานให้หัวหน้าตรวจรับเมื่อทำเสร็จ" }] },
  { id: "feature-monitor", category: "วางแผนและดูแลงาน", title: "เฝ้าระวังรายสัปดาห์", summary: "ตรวจความสมบูรณ์ ความเสี่ยง และบันทึกผลตรวจตามพื้นที่", steps: [{ id: "feature-monitor-step", route: "/monitor", target: "app-shell-header", title: "ทำรอบตรวจสวน", description: "การตรวจเป็นประจำช่วยเห็นแนวโน้มก่อนกลายเป็นปัญหาใหญ่", instruction: "เลือกสวน โซน และแปลง แล้วบันทึกผลตรวจของสัปดาห์นี้" }] },
  { id: "feature-recommend", category: "วางแผนและดูแลงาน", title: "คำแนะนำ AI", summary: "ดูคำแนะนำรดน้ำ ใส่ปุ๋ย ป้องกันโรค และเก็บเกี่ยวตามข้อมูลที่เลือก", steps: [{ id: "feature-recommend-step", route: "/recommend", target: "app-shell-header", title: "อ่านคำแนะนำอย่างมีบริบท", description: "ระบบระบุที่มาและระดับความมั่นใจของข้อมูล เพื่อแยกข้อมูลจริงจากประมาณการ", instruction: "เลือกสวนหรือแปลง แล้วตรวจแหล่งข้อมูลใต้คำแนะนำก่อนนำไปใช้" }] },
  { id: "feature-weather", category: "วางแผนและดูแลงาน", title: "สภาพอากาศ", summary: "ดูพยากรณ์และความเสี่ยงจากจุดตรวจหรือแปลงที่เลือก", steps: [{ id: "feature-weather-step", route: "/weather", target: "app-shell-header", title: "อ่านอากาศตามพื้นที่", description: "ใน API Mode ระบบใช้พิกัดแปลง ส่วน Demo Mode ใช้ข้อมูลจำลอง", instruction: "เลือกสวน โซน หรือแปลง แล้วกำหนดช่วงพยากรณ์ที่ต้องการ" }] },
  { id: "feature-market", category: "การเงินและผลผลิต", title: "ราคาตลาด", summary: "เทียบราคาผลผลิตจากทุกจังหวัดและตลาดในระบบ พร้อมประเมินรายได้", steps: [{ id: "feature-market-step", route: "/market", target: "app-shell-header", title: "อ่านราคาตลาด", description: "ราคาเป็นข้อมูลประกอบการตัดสินใจ ควรดูแหล่งราคาและเวลาปรับปรุงล่าสุดเสมอ", instruction: "เลือกผลผลิต จังหวัด หรือตลาด แล้วตั้งขอบเขตผลผลิตเพื่อประเมินรายได้" }] },
  { id: "feature-costs", category: "การเงินและผลผลิต", title: "ต้นทุน รายรับ และรายจ่าย", summary: "บันทึกรายการจริงและดูผลกำไรตามสวน แปลง หรือรอบปลูก", steps: [{ id: "feature-costs-step", route: "/costs", target: "app-shell-header", title: "บันทึกการเงินสวน", description: "ต้นทุนจากงาน สต็อก และค่าแรงควรถูกรวมกับรายการที่กรอกเองเพื่อเห็นต้นทุนจริง", instruction: "เลือกขอบเขตและช่วงเวลา ก่อนเพิ่มรายรับหรือรายจ่ายรายการแรก" }] },
  { id: "feature-yield", category: "การเงินและผลผลิต", title: "คาดการณ์ผลผลิต", summary: "ดูผลผลิตและยอดขายคาดการณ์ตามปี ช่วงเวลา และช่องทางขาย", steps: [{ id: "feature-yield-step", route: "/yield", target: "app-shell-header", title: "วิเคราะห์ผลผลิตล่วงหน้า", description: "ตัวเลขคาดการณ์อิงข้อมูลระบบและสมมติฐาน จึงควรตรวจป้ายแหล่งที่มาทุกครั้ง", instruction: "เลือกสวน โซน แปลง ปีหรือช่วงเวลา แล้วตั้งสัดส่วนช่องทางขาย" }] },
  { id: "feature-disaster", category: "การเงินและผลผลิต", title: "น้ำท่วมและภัยแล้ง", summary: "เฝ้าระวังเหตุเสี่ยงตามพื้นที่และเก็บหลักฐานเพื่อการติดตาม", steps: [{ id: "feature-disaster-step", route: "/disaster", target: "app-shell-header", title: "ติดตามความเสี่ยงพื้นที่", description: "แยกความเสี่ยงตามสวน โซน และแปลง เพื่อสั่งงานป้องกันได้ตรงจุด", instruction: "เลือกขอบเขตพื้นที่และช่วงเวลา แล้วเปิดเหตุการณ์ที่ต้องติดตาม" }] },
  { id: "feature-team", category: "องค์กรและทีม", title: "งานและทีม", summary: "ผู้จัดการวางแผนงานทีม กำหนดผู้รับผิดชอบ และติดตามการอนุมัติ", requiresPro: true, steps: [{ id: "feature-team-step", route: "/farm-pro", target: "app-shell-header", title: "บริหารงานทีม", description: "งานทีมต่างจาก Todo ส่วนตัว เพราะมีผู้มอบหมาย ผู้รับผิดชอบ และผู้ตรวจรับ", instruction: "เลือกทีมและแปลงเป้าหมายก่อนสร้าง Work Order" }] },
  { id: "feature-workers", category: "องค์กรและทีม", title: "สมาชิกและทีม", summary: "เชิญสมาชิก กำหนดบทบาท ย้ายทีม และตั้งขอบเขตพื้นที่รับผิดชอบ", requiresPro: true, steps: [{ id: "feature-workers-step", route: "/workers", target: "app-shell-header", title: "จัดการคนในองค์กร", description: "พนักงานเห็นเฉพาะทีมตนเอง ส่วนผู้จัดการจะเปลี่ยนบทบาทและขอบเขตงานได้", instruction: "เริ่มจากเชิญสมาชิกด้วยอีเมล แล้วกำหนดบทบาทและทีม" }] },
  { id: "feature-operations", category: "องค์กรและทีม", title: "ศูนย์ปฏิบัติการ 360", summary: "ดูฟาร์ม โซน งาน สต็อก และ compliance ในมุมควบคุมเดียว", requiresPro: true, steps: [{ id: "feature-operations-step", route: "/operations", target: "app-shell-header", title: "ติดตามการปฏิบัติการ", description: "หน้านี้เหมาะกับผู้จัดการที่ต้องเห็นสถานะข้ามทีมและข้ามสวน", instruction: "เลือกฟาร์มและช่วงเวลา แล้วเปิดรายการที่มีความเสี่ยงหรือดีเลย์" }] },
  { id: "feature-inventory", category: "องค์กรและทีม", title: "คลังและการจัดซื้อ", summary: "ควบคุมสต็อก ใบขอซื้อ การอนุมัติ PO และการรับสินค้า", requiresPro: true, steps: [{ id: "feature-inventory-step", route: "/inventory", target: "app-shell-header", title: "วางแผนสต็อก", description: "รายการตัดสต็อกจากงานช่วยให้จุดสั่งซื้อสะท้อนการใช้จริง", instruction: "ตรวจสินค้าที่ต่ำกว่าจุดสั่งซื้อ แล้วสร้างหรือส่งต่อคำขอซื้อ" }] },
  { id: "feature-machinery", category: "องค์กรและทีม", title: "เครื่องจักรและการบำรุง", summary: "บันทึกทะเบียน ตรวจเช็ก แจ้งซ่อม และติดตามประวัติอุปกรณ์", requiresPro: true, steps: [{ id: "feature-machinery-step", route: "/machinery", target: "app-shell-header", title: "ดูแลเครื่องจักร", description: "บันทึกตรวจเช็กและซ่อมช่วยลดการหยุดชะงักระหว่างทำงาน", instruction: "เลือกเครื่องจักรที่ต้องตรวจ แล้วบันทึกผลหรือสร้างใบแจ้งซ่อม" }] },
  { id: "feature-traceability", category: "องค์กรและทีม", title: "ตรวจสอบย้อนกลับ", summary: "ค้นหา Lot และดูเส้นทางการผลิตจากแปลง งาน เอกสาร และการเก็บเกี่ยว", requiresPro: true, steps: [{ id: "feature-traceability-step", route: "/traceability", target: "app-shell-header", title: "ติดตามล็อตผลิต", description: "Traceability เชื่อมหลักฐานจริงเพื่อให้ตรวจย้อนหลังได้ ไม่ใช่การกรอกข้อมูลซ้ำ", instruction: "เลือกสวน โซน หรือแปลง แล้วค้นหาล็อตที่ต้องการตรวจสอบ" }] },
  { id: "feature-documents", category: "องค์กรและทีม", title: "ศูนย์เอกสาร", summary: "เก็บ PHI, QA, ใบรับรอง และเอกสารตามประเภทที่องค์กรกำหนด", requiresPro: true, steps: [{ id: "feature-documents-step", route: "/documents", target: "app-shell-header", title: "จัดเก็บเอกสารองค์กร", description: "เอกสารต่างจากรายงาน เพราะเป็นไฟล์และหลักฐานต้นทางที่ใช้ตรวจสอบ", instruction: "เลือกหมวดเอกสารและขอบเขตสวนหรือแปลงก่อนอัปโหลดไฟล์" }] },
  { id: "feature-reports", category: "องค์กรและทีม", title: "รายงาน", summary: "สร้างรายงาน PDF หรือ Excel จากข้อมูลที่เลือกตามสวน แปลง และช่วงเวลา", requiresPro: true, steps: [{ id: "feature-reports-step", route: "/reports", target: "app-shell-header", title: "สร้างรายงาน", description: "รายงานเป็นผลลัพธ์สรุปจากข้อมูลระบบ ไม่ใช่พื้นที่เก็บเอกสารต้นฉบับ", instruction: "เลือกชื่อและประเภทรายงาน ขอบเขตข้อมูล และช่วงเวลา ก่อนสร้างไฟล์" }] },
  { id: "feature-iot", category: "เทคโนโลยีและระบบ", title: "IoT และ Automation", summary: "ดูอุปกรณ์ สถานะข้อมูล กฎแจ้งเตือน และการทำงานอัตโนมัติ", requiresPro: true, steps: [{ id: "feature-iot-step", route: "/iot", target: "app-shell-header", title: "เชื่อมอุปกรณ์ IoT", description: "ข้อมูลอุปกรณ์สามารถไปช่วยอากาศ การให้น้ำ การแจ้งเตือน และการวิเคราะห์ความเสี่ยง", instruction: "เลือกฟาร์มและแปลง แล้วตรวจสถานะอุปกรณ์หรือเพิ่มกฎแจ้งเตือน" }] },
  { id: "feature-iot-guide", category: "เทคโนโลยีและระบบ", title: "คู่มืออุปกรณ์ IoT", summary: "เรียนรู้การติดตั้ง ใช้งาน และบำรุงรักษาอุปกรณ์สำหรับสวน", requiresPro: true, steps: [{ id: "feature-iot-guide-step", route: "/iot-guide", target: "app-shell-header", title: "ใช้อุปกรณ์ให้ถูกงาน", description: "เลือกอุปกรณ์ตามปัญหาที่ต้องการติดตาม เช่น ดิน น้ำ อากาศ หรือระบบให้น้ำ", instruction: "เปิดประเภทอุปกรณ์ที่มี แล้วอ่านขั้นตอนติดตั้งและจุดที่ข้อมูลจะถูกนำไปใช้" }] },
  { id: "feature-notifications", category: "เทคโนโลยีและระบบ", title: "การแจ้งเตือน", summary: "รวมงาน โรค ฝน ดินแห้ง และเหตุการณ์สำคัญที่ต้องติดตาม", steps: [{ id: "feature-notifications-step", route: "/notifications", target: "app-shell-header", title: "จัดการการแจ้งเตือน", description: "การแจ้งเตือนที่ดีต้องเลือกขอบเขตและความสำคัญ เพื่อไม่ให้ข้อมูลล้น", instruction: "ใช้ตัวกรองเพื่อดูเหตุที่เกี่ยวข้องกับสวนหรือหน้าที่ของคุณก่อน" }] },
  { id: "feature-community", category: "เทคโนโลยีและระบบ", title: "ชุมชนชาวสวน", summary: "ถามตอบและแลกเปลี่ยนความรู้ โดยควบคุมข้อมูลที่เปิดเผยตามบทบาท", steps: [{ id: "feature-community-step", route: "/community", target: "app-shell-header", title: "ใช้งานชุมชนอย่างปลอดภัย", description: "ข้อมูลการผลิตภายในองค์กรไม่ควรถูกเผยแพร่โดยไม่ได้รับอนุญาต", instruction: "ใช้ตัวกรองหัวข้อเพื่อค้นหาความรู้ และตรวจสิทธิ์ก่อนโพสต์ข้อมูลสวน" }] },
  { id: "feature-settings", category: "เทคโนโลยีและระบบ", title: "ตั้งค่าระบบ", summary: "ดู Data Mode รีเซ็ตข้อมูลสาธิต และกำหนดการใช้งานพื้นฐาน", steps: [{ id: "feature-settings-step", route: "/settings", target: "app-shell-header", title: "ตั้งค่าการใช้งาน", description: "โหมดสาธิตเหมาะสำหรับทดลอง flow แต่ไม่ใช่ข้อมูลใช้งานจริง", instruction: "ตรวจ Data Mode และค่าที่กระทบข้อมูลก่อนบันทึกการเปลี่ยนแปลง" }] },
];

export function getGuidedTutorial(personaId: DemoPersonaId) {
  if (personaId === "employee") return employeeTour;
  if (personaId === "commercial" || personaId === "export") return managerTour;
  return personalFarmTour;
}

export function getFeatureTutorials() {
  return featureTutorials;
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

export function startGuidedTutorial(tourId: string, personaId: DemoPersonaId) {
  const tour = findGuidedTutorial(tourId, personaId) ?? getGuidedTutorial(personaId);
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
  if (personaTour.id === tourId) return personaTour;
  return featureTutorials.find((tutorial) => tutorial.id === tourId) ?? null;
}
