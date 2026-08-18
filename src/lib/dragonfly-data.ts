import { plots as legacyPlots, type Plot } from "@/lib/farm-data";

export type DataMode = "demo" | "database";
export type DemoPersonaId = "beginner" | "owner" | "commercial" | "export" | "employee";
export type KnowledgeLevel = "Beginner" | "Intermediate" | "Experienced";
export type OperationScale = "Personal" | "Small Farm" | "Commercial Farm" | "Enterprise / Export";
export type SubscriptionPlan = "Free" | "Farm Pro";

export type ExperienceStage = {
  id: DemoPersonaId;
  title: string;
  summary: string;
  unlocks: string[];
  requiresPro?: boolean;
};

export const experienceStages: ExperienceStage[] = [
  { id: "beginner", title: "มือใหม่", summary: "เริ่มจากแปลง งาน และคำแนะนำรายวัน", unlocks: ["แปลง", "ปฏิทินงาน", "คำแนะนำ AI", "ต้นทุนพื้นฐาน"] },
  { id: "owner", title: "เจ้าของสวน", summary: "วางแผนผลผลิต รายได้ และดูสุขภาพสวนเป็นระบบ", unlocks: ["คาดการณ์ผลผลิต", "วิเคราะห์ต้นทุน", "การแจ้งเตือนตามแปลง"] },
  { id: "commercial", title: "ผู้จัดการสวน", summary: "บริหารทีม แผนผลิต และงานหลายโซน", unlocks: ["Work Orders", "Workforce", "ศูนย์ปฏิบัติการ 360"], requiresPro: true },
  { id: "export", title: "องค์กร/ส่งออก", summary: "ควบคุมหลายฟาร์ม ล็อตผลิต และการตรวจรับ", unlocks: ["Traceability", "Compliance", "พอร์ตหลายฟาร์ม"], requiresPro: true },
];

export type UserFarmProfile = {
  farmingType: string;
  experience: string;
  farmSize: string;
  workforce: string;
  technology: string[];
  knowledgeLevel: KnowledgeLevel;
  operationScale: OperationScale;
  tutorialsEnabled: boolean;
  recommendationsEnabled: boolean;
};

export type DemoPersona = {
  id: DemoPersonaId;
  label: string;
  role: string;
  subscription: SubscriptionPlan;
  profile: UserFarmProfile;
};

export type FarmSummary = {
  name: string;
  type: string;
  areaRai: number;
  primaryCrop: string;
  varieties: string[];
  plotCount: number;
  treeCount: number;
  workerCount: number;
};

export type DashboardFarm = FarmSummary & {
  id: string;
  location: string;
  status: "Normal" | "Needs attention" | "Blocked";
  dataLabel: string;
};

export function getDashboardFarms(state: { farm: FarmSummary; additionalFarms?: DashboardFarm[] }): DashboardFarm[] {
  const primary: DashboardFarm = {
    id: "FARM-PRIMARY",
    ...state.farm,
    location: "จันทบุรี",
    status: "Normal",
    dataLabel: "ข้อมูลฟาร์มที่กำลังใช้งานใน Demo Mode",
  };

  // Demo portfolio makes the multi-farm dashboard behavior testable without mixing its data with the primary farm.
  if (state.farm.areaRai < 20) return [primary, ...(state.additionalFarms ?? [])];

  return [
    primary,
    {
      id: "FARM-NORTH",
      name: "สวนทุเรียนเขาคิชฌกูฏ",
      type: "Commercial Fruit Orchard",
      areaRai: 185,
      primaryCrop: "Durian",
      varieties: ["Monthong", "Kanyao"],
      plotCount: 9,
      treeCount: 2_960,
      workerCount: 14,
      location: "จันทบุรี",
      status: "Needs attention",
      dataLabel: "ข้อมูลพอร์ตฟาร์มตัวอย่างใน Demo Mode",
    },
    {
      id: "FARM-EAST",
      name: "สวนผลไม้ระยอง",
      type: "Mixed Fruit Orchard",
      areaRai: 96,
      primaryCrop: "Mangosteen",
      varieties: ["Mangosteen", "Rambutan"],
      plotCount: 6,
      treeCount: 1_740,
      workerCount: 8,
      location: "ระยอง",
      status: "Normal",
      dataLabel: "ข้อมูลพอร์ตฟาร์มตัวอย่างใน Demo Mode",
    },
    ...(state.additionalFarms ?? []),
  ];
}

export type FarmSite = {
  id: string;
  farmId?: string;
  code: string;
  name: string;
  type: string;
  areaRai: number;
  manager: string;
  plotPrefixes: string[];
  status: "Normal" | "Needs attention" | "Blocked";
};

export type SmartTask = {
  id: string;
  title: string;
  plot: string;
  type: string;
  status: "Planned" | "Assigned" | "In Progress" | "Supervisor Review" | "Completed" | "Delayed" | "Skipped" | "Cancelled";
  reason?: string;
  scheduledFor?: string;
  assignedWorkerId?: string;
  team?: string;
  /** One shared task record powers both an owner's todo and a manager's team board. */
  origin?: "personal" | "team" | "system";
  createdBy?: string;
  ownerPersonaId?: DemoPersonaId;
  completion?: { note: string; health?: number; evidenceCount: number; completedAt?: string; completedBy?: string; approvedBy?: string; laborHours?: number; laborCost?: number; materialCost?: number; chemicalLot?: string; phiDays?: number };
};

export type DragonflyWeather = {
  source: "demo" | "api";
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  uv: number;
  rainChance: number;
  hourly: { t: string; temp: number; rain: number; condition: string }[];
  daily: { d: string; hi: number; lo: number; rain: number; icon: string }[];
};

export type Recommendation = {
  id: string;
  title: string;
  plot: string;
  reason: string;
  action: string;
  confidence: "Demo" | "Low" | "Medium" | "High";
  sourceType: "system" | "ai-estimate" | "demo" | "user-data" | "external";
  sourceLabel: string;
  generatedAt?: string;
};

export type ProductionPlan = {
  id: string;
  plot: string;
  crop: string;
  variety: string;
  stage: string;
  progress: number;
  expectedHarvest: string;
  expectedYield: string;
};

export type WorkOrder = {
  id: string;
  title: string;
  plot: string;
  team: string;
  type?: "Inspection" | "Irrigation" | "Fertilizer" | "Harvest" | "General";
  status: "Planned" | "Assigned" | "In Progress" | "Completed" | "Supervisor Review" | "Approved" | "Delayed";
  reason?: string;
  plannedFor?: string;
};

export type WorkerSummary = {
  total: number;
  active: number;
  available: number;
  absent: number;
  crews: { name: string; assigned: number; status: string }[];
};

export type WorkerProfile = {
  id: string;
  name: string;
  role: string;
  crew: string;
  status: "Active" | "Available" | "On Leave" | "Unavailable";
  farmId?: string;
  plot?: string;
  currentTask?: string;
};

export type MemberInvite = {
  id: string;
  email: string;
  role: string;
  crew: string;
  status: "Sent" | "Accepted" | "Expired";
  sentAt: string;
};

export type OrganizationRole = {
  id: string;
  name: string;
  permissions: string[];
  builtIn?: boolean;
};

export type IoTDevice = {
  id: string;
  name: string;
  type: string;
  plot: string;
  status: "Online" | "Offline";
  latestReading: string;
  numericValue?: number;
  unit?: string;
  lastCommunication: string;
  battery?: number;
  firmware?: string;
};

export type IoTRule = {
  id: string;
  name: string;
  deviceId: string;
  threshold: number;
  operator: "<" | ">";
  action: string;
  enabled?: boolean;
  severity?: "Info" | "Warning" | "Critical";
  recipients?: string;
};

export type IoTAlert = {
  id: string;
  title: string;
  plot: string;
  current: string;
  target: string;
  action: string;
  severity?: "Info" | "Warning" | "Critical";
  deviceId?: string;
  ruleId?: string;
};

export type TraceabilityChain = {
  lotId: string;
  farmId?: string;
  farmName?: string;
  siteId?: string;
  siteName?: string;
  packingLot: string;
  harvestLot: string;
  plot: string;
  crop: string;
  variety: string;
  activities: string[];
  chemicalRecords: string[];
  irrigationRecords: string[];
  workers: string[];
};

export type DocumentCategory = "การผลิต" | "สารเคมีและ PHI" | "QA และ Compliance" | "ใบรับรอง" | "การขายและส่งออก" | "ภัยพิบัติ" | "รายงานจากระบบ";

export type OrganizationDocumentType = {
  id: string;
  name: string;
  category: DocumentCategory;
  requiresApproval: boolean;
  tracksExpiry: boolean;
  requiredFor: string;
  builtIn?: boolean;
};

export type FarmDocument = {
  id: string;
  title: string;
  typeId: string;
  category: DocumentCategory;
  source: "upload" | "task" | "system" | "integration";
  farmId?: string;
  siteId?: string;
  plotId?: string;
  lotId?: string;
  documentNumber?: string;
  issuedAt: string;
  expiresAt?: string;
  fileName?: string;
  status: "Draft" | "Pending Review" | "Approved" | "Rejected" | "Expired";
  uploadedBy: string;
  approvedBy?: string;
  notes?: string;
};

export type DemoState = {
  personaId: DemoPersonaId;
  farm: FarmSummary;
  additionalFarms?: DashboardFarm[];
  sites: FarmSite[];
  plots: Plot[];
  tasks: SmartTask[];
  recommendations: Recommendation[];
  weather: DragonflyWeather;
  productionPlans: ProductionPlan[];
  workOrders: WorkOrder[];
  workforce: WorkerSummary;
  workers: WorkerProfile[];
  memberInvites: MemberInvite[];
  organizationRoles: OrganizationRole[];
  iotDevices: IoTDevice[];
  iotRules: IoTRule[];
  iotAlerts: IoTAlert[];
  traceability: TraceabilityChain[];
  documentTypes: OrganizationDocumentType[];
  documents: FarmDocument[];
  tutorialProgress: string[];
  phiScenario: {
    plot: string;
    chemicalDate: string;
    phiDays: number;
    earliestHarvest: string;
    plannedHarvest: string;
  };
  satellite: { plot: string; previousNdvi: number; currentNdvi: number; changePercent: number };
};

const STORAGE_KEY = "dragonfly_demo_state_v1";
const PERSONA_KEY = "dragonfly_demo_persona_v1";

export const appDataMode: DataMode =
  (import.meta.env.VITE_APP_DATA_MODE as DataMode | undefined) ??
  (import.meta.env.APP_DATA_MODE as DataMode | undefined) ??
  "demo";

export const isDemoMode = appDataMode === "demo";

export function getInitialDemoState() {
  return buildDemoState("commercial");
}

export const demoPersonas: DemoPersona[] = [
  {
    id: "employee",
    label: "Field Worker",
    role: "พนักงานภาคสนาม",
    subscription: "Free",
    profile: {
      farmingType: "Field operations",
      experience: "Assigned work only",
      farmSize: "Assigned zones",
      workforce: "Field crew member",
      technology: ["Mobile task list"],
      knowledgeLevel: "Intermediate",
      operationScale: "Commercial Farm",
      tutorialsEnabled: true,
      recommendationsEnabled: false,
    },
  },
  {
    id: "owner",
    label: "Farm Owner",
    role: "เจ้าของสวน",
    subscription: "Free",
    profile: {
      farmingType: "Mixed fruit orchard",
      experience: "1-2 years",
      farmSize: "5-20 rai",
      workforce: "Family and 1-3 helpers",
      technology: ["Mobile records", "Manual irrigation"],
      knowledgeLevel: "Intermediate",
      operationScale: "Small Farm",
      tutorialsEnabled: true,
      recommendationsEnabled: true,
    },
  },
  {
    id: "beginner",
    label: "Beginner Farmer",
    role: "ชาวสวนมือใหม่",
    subscription: "Free",
    profile: {
      farmingType: "Just starting / Learning",
      experience: "No experience",
      farmSize: "Less than 5 rai",
      workforce: "Working alone",
      technology: ["No IoT"],
      knowledgeLevel: "Beginner",
      operationScale: "Small Farm",
      tutorialsEnabled: true,
      recommendationsEnabled: true,
    },
  },
  {
    id: "commercial",
    label: "Commercial Farm Manager",
    role: "ผู้จัดการสวนเชิงพาณิชย์",
    subscription: "Farm Pro",
    profile: {
      farmingType: "Commercial farm",
      experience: "2-5 years",
      farmSize: "20-100 rai",
      workforce: "More than 20 workers",
      technology: ["Sensors", "Automatic irrigation", "Weather station"],
      knowledgeLevel: "Intermediate",
      operationScale: "Commercial Farm",
      tutorialsEnabled: false,
      recommendationsEnabled: true,
    },
  },
  {
    id: "export",
    label: "Export Farm Manager",
    role: "ผู้จัดการสวนส่งออก",
    subscription: "Farm Pro",
    profile: {
      farmingType: "Export farm",
      experience: "More than 5 years",
      farmSize: "More than 100 rai",
      workforce: "More than 20 workers",
      technology: ["Sensors", "Automatic irrigation", "Weather station", "Other agricultural IoT"],
      knowledgeLevel: "Experienced",
      operationScale: "Enterprise / Export",
      tutorialsEnabled: false,
      recommendationsEnabled: true,
    },
  },
];

const demoWeather: DragonflyWeather = {
  source: "demo",
  temp: 31,
  condition: "มีเมฆมาก ฝนช่วงเย็น",
  humidity: 74,
  wind: 11,
  uv: 6,
  rainChance: 68,
  hourly: [
    { t: "13:00", temp: 32, rain: 35, condition: "Cloudy" },
    { t: "15:00", temp: 31, rain: 58, condition: "Cloudy" },
    { t: "17:00", temp: 29, rain: 78, condition: "Rain" },
    { t: "20:00", temp: 27, rain: 42, condition: "Cloudy" },
  ],
  daily: [
    { d: "วันนี้", hi: 32, lo: 25, rain: 68, icon: "🌧️" },
    { d: "พรุ่งนี้", hi: 33, lo: 25, rain: 45, icon: "⛅" },
    { d: "พุธ", hi: 32, lo: 24, rain: 72, icon: "🌧️" },
    { d: "พฤหัสฯ", hi: 34, lo: 25, rain: 30, icon: "🌤️" },
    { d: "ศุกร์", hi: 33, lo: 25, rain: 40, icon: "⛅" },
  ],
};

function orchardPlots(prefix = "D", scale = 1): Plot[] {
  const base = [
    ["01", "Monthong", "Fruit Development", 42, 410, 87],
    ["02", "Monthong", "Flowering", 38, 365, 82],
    ["03", "Chanee", "Fruit Set", 31, 320, 76],
    ["04", "Monthong", "Pre-Harvest", 45, 480, 69],
    ["05", "Monthong", "Vegetative Growth", 28, 290, 91],
    ["06", "Chanee", "Post Harvest", 34, 335, 84],
  ] as const;

  return base.map(([code, variety, stage, area, trees, health]) => ({
    id: `${prefix}${code}`,
    name: `แปลง ${prefix}${code}`,
    crop: `ทุเรียน${variety}`,
    emoji: "🥭",
    ageMonths: 72,
    trees: Math.round(trees * scale),
    area: Math.round(area * scale),
    health,
    gps: `12.${6086 + Number(code)}° N, 102.${1035 + Number(code)}° E`,
    lastCare: stage,
    history: [
      { date: "10 ส.ค. 2569", action: "ตรวจแปลง", note: `สถานะการผลิต: ${stage}` },
      { date: "6 ส.ค. 2569", action: "บันทึกสุขภาพ", note: `คะแนนสุขภาพ ${health}/100` },
    ],
  }));
}

const defaultDocumentTypes: OrganizationDocumentType[] = [
  { id: "DOC-TYPE-TASK", name: "หลักฐานการปฏิบัติงาน", category: "การผลิต", requiresApproval: true, tracksExpiry: false, requiredFor: "Task ที่ต้องตรวจรับ", builtIn: true },
  { id: "DOC-TYPE-CHEM", name: "บันทึกการใช้สาร", category: "สารเคมีและ PHI", requiresApproval: true, tracksExpiry: false, requiredFor: "งานพ่นสารทุกครั้ง", builtIn: true },
  { id: "DOC-TYPE-PHI", name: "ใบสรุปสถานะ PHI", category: "สารเคมีและ PHI", requiresApproval: true, tracksExpiry: false, requiredFor: "ล็อตก่อนเก็บเกี่ยว", builtIn: true },
  { id: "DOC-TYPE-QA", name: "ใบตรวจรับ QA", category: "QA และ Compliance", requiresApproval: true, tracksExpiry: false, requiredFor: "Harvest/Packing Lot", builtIn: true },
  { id: "DOC-TYPE-GAP", name: "ใบรับรอง GAP", category: "ใบรับรอง", requiresApproval: true, tracksExpiry: true, requiredFor: "ฟาร์มที่อ้างอิงมาตรฐาน GAP", builtIn: true },
  { id: "DOC-TYPE-LAB", name: "ผลตรวจสารตกค้าง", category: "QA และ Compliance", requiresApproval: true, tracksExpiry: true, requiredFor: "ล็อตส่งออก", builtIn: true },
  { id: "DOC-TYPE-EXPORT", name: "เอกสารส่งออก", category: "การขายและส่งออก", requiresApproval: true, tracksExpiry: false, requiredFor: "ล็อตส่งออก", builtIn: true },
  { id: "DOC-TYPE-REPORT", name: "รายงานที่สร้างจากระบบ", category: "รายงานจากระบบ", requiresApproval: false, tracksExpiry: false, requiredFor: "รายงาน PDF/Excel", builtIn: true },
];

function demoDocuments(farmName: string): FarmDocument[] {
  return [
    { id: "DOC-001", title: `ใบรับรอง GAP · ${farmName}`, typeId: "DOC-TYPE-GAP", category: "ใบรับรอง", source: "upload", farmId: "FARM-PRIMARY", documentNumber: "GAP-TH-2569-0041", issuedAt: "2026-01-15", expiresAt: "2027-01-14", fileName: "gap-certificate-2569.pdf", status: "Approved", uploadedBy: "ผู้จัดการฟาร์ม", approvedBy: "Owner/Admin" },
    { id: "DOC-002", title: "สรุป PHI ล็อต EXPORT-2026-001", typeId: "DOC-TYPE-PHI", category: "สารเคมีและ PHI", source: "system", farmId: "FARM-PRIMARY", siteId: "SITE-D02", plotId: "D04", lotId: "EXPORT-2026-001", documentNumber: "PHI-D04-001", issuedAt: "2026-08-20", fileName: "phi-export-2026-001.pdf", status: "Pending Review", uploadedBy: "ระบบ EasyPlants", notes: "คำนวณจากบันทึกใช้สารล่าสุดและ PHI 14 วัน" },
    { id: "DOC-003", title: "ผลตรวจสารตกค้างก่อนส่งออก", typeId: "DOC-TYPE-LAB", category: "QA และ Compliance", source: "upload", farmId: "FARM-PRIMARY", siteId: "SITE-D02", plotId: "D04", lotId: "EXPORT-2026-001", documentNumber: "LAB-RES-260818", issuedAt: "2026-08-18", expiresAt: "2026-11-18", fileName: "lab-residue-export-001.pdf", status: "Approved", uploadedBy: "เจ้าหน้าที่ QA", approvedBy: "QA Manager" },
    { id: "DOC-004", title: "ใบตรวจรับคุณภาพ Packing Lot 014", typeId: "DOC-TYPE-QA", category: "QA และ Compliance", source: "task", farmId: "FARM-PRIMARY", siteId: "SITE-D04", plotId: "D04", lotId: "EXPORT-2026-001", issuedAt: "2026-08-20", fileName: "qa-pack-014.pdf", status: "Approved", uploadedBy: "รัชนี", approvedBy: "ผู้จัดการโรงคัด" },
    { id: "DOC-005", title: "Phytosanitary Certificate · North Lot 003", typeId: "DOC-TYPE-EXPORT", category: "การขายและส่งออก", source: "upload", farmId: "FARM-NORTH", siteId: "NORTH-A", plotId: "N02", lotId: "EXPORT-NORTH-2026-003", documentNumber: "PHYTO-TH-260821-88", issuedAt: "2026-08-21", fileName: "phyto-north-003.pdf", status: "Approved", uploadedBy: "ฝ่ายส่งออก", approvedBy: "Export Manager" },
    { id: "DOC-006", title: "หลักฐานตรวจระบบน้ำ D01", typeId: "DOC-TYPE-TASK", category: "การผลิต", source: "task", farmId: "FARM-PRIMARY", siteId: "SITE-D01", plotId: "D01", issuedAt: "2026-08-17", fileName: "task-T-001-evidence.jpg", status: "Approved", uploadedBy: "มาลี", approvedBy: "หัวหน้าสวน" },
  ];
}

function buildDemoState(personaId: DemoPersonaId): DemoState {
  if (personaId === "beginner") {
    return {
      personaId,
      farm: {
        name: "สวนเรียนรู้ EasyPlants",
        type: "Small Learning Farm",
        areaRai: 5,
        primaryCrop: "ผักสวนครัวและไม้ผล",
        varieties: ["มะนาว", "พริก", "โหระพา"],
        plotCount: 2,
        treeCount: 84,
        workerCount: 1,
      },
      sites: [
        { id: "SITE-B01", code: "B01", name: "สวนเรียนรู้", type: "แปลงทดลอง", areaRai: 5, manager: "เจ้าของสวน", plotPrefixes: ["B"], status: "Normal" },
      ],
      plots: legacyPlots.slice(0, 2).map((p, i) => ({ ...p, id: `B0${i + 1}`, area: i === 0 ? 3 : 2 })),
      tasks: [
        { id: "BT-001", title: "ตรวจใบและยอดอ่อน", plot: "แปลงผักหลังบ้าน", type: "Plant Health", status: "Planned", scheduledFor: "2026-08-17" },
        { id: "BT-002", title: "รดน้ำช่วงเช้า", plot: "แปลงมะนาว", type: "Irrigation", status: "Completed", scheduledFor: "2026-08-17" },
        { id: "BT-003", title: "จดบันทึกการเจริญเติบโต", plot: "ทุกแปลง", type: "Record", status: "Planned", scheduledFor: "2026-08-20" },
      ],
      recommendations: [
        {
          id: "BR-001",
          title: "ฝนจะตกช่วงเย็น",
          plot: "แปลงมะนาว",
          reason: "Demo weather แสดงโอกาสฝน 68% หลัง 17:00",
          action: "พิจารณาเลื่อนการรดน้ำรอบเย็น",
          confidence: "Demo",
          sourceType: "demo",
          sourceLabel: "ข้อมูลอากาศตัวอย่างจาก Demo Mode",
          generatedAt: "2026-08-17",
        },
      ],
      weather: demoWeather,
      productionPlans: [],
      workOrders: [],
      workforce: { total: 1, active: 1, available: 0, absent: 0, crews: [{ name: "เจ้าของสวน", assigned: 3, status: "Active" }] },
      workers: [
        {
          id: "OWNER-001",
          name: "เจ้าของสวน",
          role: "Farm Owner",
          crew: "เจ้าของสวน",
          status: "Active",
          plot: "แปลงมะนาว",
          currentTask: "ตรวจใบและยอดอ่อน",
        },
      ],
      memberInvites: [],
      organizationRoles: [],
      iotDevices: [],
      iotRules: [],
      iotAlerts: [],
      traceability: [],
      documentTypes: defaultDocumentTypes,
      documents: [],
      tutorialProgress: ["create-farm", "create-plot"],
      phiScenario: { plot: "-", chemicalDate: "-", phiDays: 0, earliestHarvest: "-", plannedHarvest: "-" },
      satellite: { plot: "แปลงมะนาว", previousNdvi: 0.64, currentNdvi: 0.62, changePercent: -3.1 },
    };
  }

  const isExport = personaId === "export";
  const scale = isExport ? 2.65 : 1;
  const plots = orchardPlots("D", scale);
  const scheduleDate = (offset: number) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  };

  return {
    personaId,
    farm: {
      name: isExport ? "EasyPlants Export Orchard" : "EasyPlants Demo Orchard",
      type: isExport ? "Export Fruit Orchard" : "Commercial Fruit Orchard",
      areaRai: isExport ? 850 : 320,
      primaryCrop: "Durian",
      varieties: ["Monthong", "Chanee"],
      plotCount: isExport ? 28 : 12,
      treeCount: isExport ? 12840 : 4850,
      workerCount: isExport ? 65 : 24,
    },
    sites: isExport
      ? [
          { id: "SITE-D01", code: "D01", name: "โซนเหนือ", type: "ทุเรียนส่งออก", areaRai: 220, manager: "อนันต์", plotPrefixes: ["D01", "D02"], status: "Normal" },
          { id: "SITE-D02", code: "D02", name: "โซนกลาง", type: "ทุเรียนส่งออก", areaRai: 210, manager: "มาลี", plotPrefixes: ["D03", "D04"], status: "Needs attention" },
          { id: "SITE-D03", code: "D03", name: "โซนตะวันออก", type: "ทุเรียนส่งออก", areaRai: 220, manager: "รัชนี", plotPrefixes: ["D05", "D06"], status: "Normal" },
          { id: "SITE-D04", code: "D04", name: "ศูนย์คัดบรรจุ", type: "Packing & QA", areaRai: 200, manager: "ผู้จัดการโรงคัด", plotPrefixes: [], status: "Normal" },
        ]
      : [
          { id: "SITE-D01", code: "D01", name: "โซนผลผลิต 1", type: "ทุเรียนหมอนทอง", areaRai: 110, manager: "มาลี", plotPrefixes: ["D01", "D02"], status: "Normal" },
          { id: "SITE-D02", code: "D02", name: "โซนผลผลิต 2", type: "ทุเรียนผสม", areaRai: 130, manager: "อนันต์", plotPrefixes: ["D03", "D04"], status: "Needs attention" },
          { id: "SITE-D03", code: "D03", name: "โซนสนับสนุน", type: "ระบบน้ำและบำรุง", areaRai: 80, manager: "กิตติ", plotPrefixes: ["D05", "D06"], status: "Normal" },
        ],
    plots,
    tasks: [
      { id: "T-001", title: "ตรวจระบบน้ำหยดและแรงดัน", plot: "D01", type: "Irrigation", status: "Completed", scheduledFor: scheduleDate(0), assignedWorkerId: "W-002", team: "Irrigation Crew" },
      { id: "T-002", title: "สำรวจเพลี้ยแป้งใต้ทรงพุ่ม", plot: "D03", type: "Inspection", status: "In Progress", scheduledFor: scheduleDate(0), assignedWorkerId: "W-001", team: "Crop Protection Crew" },
      { id: "T-003", title: "บันทึกความชื้นดินก่อนรอบให้น้ำ", plot: "D01", type: "Inspection", status: "Assigned", scheduledFor: scheduleDate(0), assignedWorkerId: "W-002", team: "Irrigation Crew" },
      { id: "T-004", title: "ใส่ปุ๋ยก่อนเก็บเกี่ยว", plot: "D04", type: "Fertilizer", status: "Delayed", reason: "Heavy Rain", scheduledFor: scheduleDate(1), assignedWorkerId: "W-004", team: "General Farm Crew" },
      { id: "T-005", title: "เตรียมทีมและอุปกรณ์เก็บเกี่ยว", plot: "D04", type: "Harvest", status: "Assigned", scheduledFor: scheduleDate(2), assignedWorkerId: "W-003", team: "Harvest Crew" },
      { id: "T-006", title: "ตรวจวาล์วและล้างไส้กรอง", plot: "D02", type: "Irrigation", status: "Planned", scheduledFor: scheduleDate(3), assignedWorkerId: "W-002", team: "Irrigation Crew" },
      { id: "T-007", title: "ตรวจคุณภาพผลก่อนตัด", plot: "D04", type: "Inspection", status: "Planned", scheduledFor: scheduleDate(5), assignedWorkerId: "W-005", team: "Harvest Crew" },
      { id: "T-008", title: "ตัดแต่งกิ่งแห้งหลังเก็บ", plot: "D03", type: "Pruning", status: "Planned", scheduledFor: scheduleDate(7), assignedWorkerId: "W-001", team: "Crop Protection Crew" },
    ],
    recommendations: [
      {
        id: "R-001",
        title: "ความชื้น D01 ต่ำ แต่ฝนใกล้เข้ามา",
        plot: "D01",
        reason: "ความชื้นดิน 27% และชุดข้อมูลอากาศจำลองคาดว่าฝนอาจมาในราว 3 ชั่วโมง ขณะพืชอยู่ระยะพัฒนาผล",
        action: "ตรวจความชื้นดินหน้างานก่อนเริ่มให้น้ำ",
        confidence: "Demo",
        sourceType: "ai-estimate",
        sourceLabel: "ประมาณการจาก AI โดยใช้ข้อมูลจำลอง Weather + IoT + Crop Stage",
        generatedAt: "2026-08-17",
      },
      {
        id: "R-002",
        title: "NDVI D01 ลดลงจากรอบก่อน",
        plot: "D01",
        reason: "ค่า NDVI ตัวอย่างรอบก่อน 0.76 รอบปัจจุบัน 0.69 เปลี่ยนแปลง -9.2%",
        action: "สร้างงานตรวจทรงพุ่มและระบบน้ำก่อนตัดสินใจแก้ไข",
        confidence: "Demo",
        sourceType: "demo",
        sourceLabel: "ข้อมูลดาวเทียม/NDVI จำลองสำหรับ Demo Mode",
        generatedAt: "2026-08-15",
      },
    ],
    weather: demoWeather,
    productionPlans: [
      { id: "PP-D01", plot: "D01", crop: "Durian", variety: "Monthong", stage: "Fruit Development", progress: 68, expectedHarvest: "May 2027", expectedYield: "28 tons" },
      { id: "PP-D02", plot: "D02", crop: "Durian", variety: "Monthong", stage: "Flowering", progress: 41, expectedHarvest: "June 2027", expectedYield: "24 tons" },
      { id: "PP-D03", plot: "D03", crop: "Durian", variety: "Chanee", stage: "Fruit Set", progress: 53, expectedHarvest: "May 2027", expectedYield: "18 tons" },
      { id: "PP-D04", plot: "D04", crop: "Durian", variety: "Monthong", stage: "Pre-Harvest", progress: 86, expectedHarvest: "20 Aug 2026", expectedYield: "31 tons" },
    ],
    workOrders: [
      { id: "WO-001", title: "Inspect irrigation system", plot: "D01", team: "Irrigation Crew", type: "Irrigation", status: "Completed", plannedFor: "2026-08-17" },
      { id: "WO-002", title: "Pest inspection", plot: "D03", team: "Crop Protection Crew", type: "Inspection", status: "In Progress", plannedFor: "2026-08-17" },
      { id: "WO-003", title: "Fertilizer application", plot: "D04", team: "General Farm Crew", type: "Fertilizer", status: "Delayed", reason: "Heavy Rain", plannedFor: "2026-08-19" },
      { id: "WO-004", title: "Harvest readiness checklist", plot: "D04", team: "Harvest Crew", type: "Harvest", status: "Assigned", plannedFor: "2026-08-20" },
    ],
    workforce: {
      total: isExport ? 65 : 24,
      active: isExport ? 48 : 18,
      available: isExport ? 11 : 4,
      absent: isExport ? 6 : 2,
      crews: [
        { name: "Irrigation Crew", assigned: 5, status: "On schedule" },
        { name: "Crop Protection Crew", assigned: 6, status: "In field" },
        { name: "Harvest Crew", assigned: isExport ? 18 : 8, status: "Preparing" },
        { name: "General Farm Crew", assigned: isExport ? 19 : 5, status: "Delayed by rain" },
      ],
    },
    workers: [
      { id: "W-001", name: "อนันต์", role: "Supervisor", crew: "Crop Protection Crew", status: "Active", farmId: "FARM-PRIMARY", plot: "D03", currentTask: "Pest inspection" },
      { id: "W-002", name: "มาลี", role: "Crew Lead", crew: "Irrigation Crew", status: "Active", farmId: "FARM-PRIMARY", plot: "D01", currentTask: "Inspect irrigation system" },
      { id: "W-003", name: "สมพร", role: "Worker", crew: "Harvest Crew", status: "Available", farmId: "FARM-PRIMARY", plot: "D04", currentTask: "Standby harvest prep" },
      { id: "W-004", name: "กิตติ", role: "Worker", crew: "General Farm Crew", status: "Active", farmId: "FARM-PRIMARY", plot: "D04", currentTask: "Fertilizer application" },
      { id: "W-005", name: "รัชนี", role: "QA Inspector", crew: "Harvest Crew", status: "Active", farmId: "FARM-PRIMARY", plot: "D04", currentTask: "Harvest readiness checklist" },
      { id: "W-006", name: "วิชัย", role: "Worker", crew: "General Farm Crew", status: "On Leave", farmId: "FARM-PRIMARY", currentTask: "ลาป่วย" },
    ],
    memberInvites: [
      { id: "INV-001", email: "niran@example.com", role: "พนักงาน", crew: "Harvest Crew", status: "Sent", sentAt: "2026-08-17T08:30:00" },
    ],
    organizationRoles: [],
    iotDevices: [
      { id: "SM-D01-001", name: "Soil Moisture D01", type: "Soil moisture", plot: "D01", status: "Online", latestReading: "34%", numericValue: 34, unit: "%", lastCommunication: "1 minute ago", battery: 82, firmware: "1.8.2" },
      { id: "WS-FARM-001", name: "Weather Station", type: "Weather station", plot: "Farm", status: "Online", latestReading: "31.4°C / 74%", numericValue: 31.4, unit: "°C", lastCommunication: "2 minutes ago", battery: 94, firmware: "2.1.0" },
      { id: "FLOW-D03-001", name: "Water Flow D03", type: "Flow meter", plot: "D03", status: "Online", latestReading: "18 L/min", numericValue: 18, unit: "L/min", lastCommunication: "4 minutes ago", battery: 76, firmware: "1.4.5" },
      { id: "VALVE-D04-02", name: "Valve D04-02", type: "Valve", plot: "D04", status: "Online", latestReading: "Closed", lastCommunication: "1 minute ago", firmware: "3.0.1" },
    ],
    iotRules: [{ id: "RULE-001", name: "ความชื้นดินต่ำ", deviceId: "SM-D01-001", threshold: 30, operator: "<", action: "สร้างงานตรวจระบบน้ำ", enabled: true, severity: "Warning", recipients: "หัวหน้าสวน, ทีมให้น้ำ" }],
    iotAlerts: [],
    traceability: [
      {
        lotId: "EXPORT-2026-001",
        farmId: "FARM-PRIMARY",
        farmName: isExport ? "EasyPlants Export Orchard" : "EasyPlants Demo Orchard",
        siteId: "SITE-D02",
        siteName: isExport ? "โซนกลาง" : "โซนผลผลิต 2",
        packingLot: "PACK-2026-014",
        harvestLot: "HARVEST-D04-001",
        plot: "D04",
        crop: "Monthong Durian",
        variety: "Monthong",
        activities: ["Pruning record 28 Jul 2026", "Pre-harvest inspection 14 Aug 2026"],
        chemicalRecords: ["Demo chemical application 10 Aug 2026, PHI 14 days"],
        irrigationRecords: ["Irrigation D04, 90 minutes, 12 Aug 2026"],
        workers: ["Supervisor: K. Anan", "Harvest Crew A"],
      },
      {
        lotId: "DOMESTIC-2026-021",
        farmId: "FARM-PRIMARY",
        farmName: isExport ? "EasyPlants Export Orchard" : "EasyPlants Demo Orchard",
        siteId: "SITE-D01",
        siteName: isExport ? "โซนเหนือ" : "โซนผลผลิต 1",
        packingLot: "PACK-2026-021",
        harvestLot: "HARVEST-D01-004",
        plot: "D01",
        crop: "ทุเรียนหมอนทอง",
        variety: "หมอนทอง",
        activities: ["ตรวจความแก่ผล 16 ส.ค. 2569", "ตัดผลและชั่งน้ำหนัก 18 ส.ค. 2569"],
        chemicalRecords: ["ไม่พบการใช้สารในช่วง PHI ก่อนเก็บเกี่ยว"],
        irrigationRecords: ["ให้น้ำ D01 60 นาที 15 ส.ค. 2569"],
        workers: ["หัวหน้าทีม: มาลี", "ทีมเก็บเกี่ยว 2"],
      },
      {
        lotId: "EXPORT-2026-008",
        farmId: "FARM-PRIMARY",
        farmName: isExport ? "EasyPlants Export Orchard" : "EasyPlants Demo Orchard",
        siteId: "SITE-D02",
        siteName: isExport ? "โซนกลาง" : "โซนผลผลิต 2",
        packingLot: "PACK-2026-026",
        harvestLot: "HARVEST-D03-003",
        plot: "D03",
        crop: "ทุเรียนชะนี",
        variety: "ชะนี",
        activities: ["ตรวจศัตรูพืช 12 ส.ค. 2569", "ตรวจคุณภาพก่อนเก็บ 19 ส.ค. 2569"],
        chemicalRecords: ["สารชีวภัณฑ์ Lot BIO-114 วันที่ 12 ส.ค. 2569"],
        irrigationRecords: ["ให้น้ำ D03 75 นาที 17 ส.ค. 2569"],
        workers: ["ผู้ตรวจ: อนันต์", "ทีมอารักขาพืช"],
      },
      {
        lotId: "EXPORT-NORTH-2026-003",
        farmId: "FARM-NORTH",
        farmName: "สวนทุเรียนเขาคิชฌกูฏ",
        siteId: "NORTH-A",
        siteName: "โซนเนินเหนือ",
        packingLot: "PACK-NORTH-2026-009",
        harvestLot: "HARVEST-N02-002",
        plot: "N02",
        crop: "ทุเรียนหมอนทอง",
        variety: "หมอนทอง",
        activities: ["ตรวจความสมบูรณ์ต้น 11 ส.ค. 2569", "คัดเกรดส่งออก 20 ส.ค. 2569"],
        chemicalRecords: ["บันทึกสาร Lot CHEM-N22 · ผ่าน PHI 21 วัน"],
        irrigationRecords: ["ระบบน้ำโซน N02 · 80 นาที"],
        workers: ["ผู้จัดการโซน: ธนา", "ทีมเก็บเกี่ยวเหนือ"],
      },
      {
        lotId: "EXPORT-NORTH-2026-004",
        farmId: "FARM-NORTH",
        farmName: "สวนทุเรียนเขาคิชฌกูฏ",
        siteId: "NORTH-B",
        siteName: "โซนเชิงเขา",
        packingLot: "PACK-NORTH-2026-011",
        harvestLot: "HARVEST-N07-001",
        plot: "N07",
        crop: "ทุเรียนก้านยาว",
        variety: "ก้านยาว",
        activities: ["ตรวจขนาดผล 14 ส.ค. 2569", "รับเข้าศูนย์คัดบรรจุ 21 ส.ค. 2569"],
        chemicalRecords: ["ไม่มีการใช้สารเคมีในรอบ 30 วัน"],
        irrigationRecords: ["น้ำหยด N07 · 55 นาที"],
        workers: ["ผู้ตรวจ QA: ปวีณา", "ทีมเก็บเกี่ยวเหนือ 2"],
      },
      {
        lotId: "RAYONG-2026-015",
        farmId: "FARM-EAST",
        farmName: "สวนผลไม้ระยอง",
        siteId: "EAST-A",
        siteName: "โซนริมคลอง",
        packingLot: "PACK-RAYONG-2026-015",
        harvestLot: "HARVEST-R03-006",
        plot: "R03",
        crop: "มังคุด",
        variety: "มังคุดพื้นเมือง",
        activities: ["สำรวจผิวผล 13 ส.ค. 2569", "เก็บเกี่ยวและคัดขนาด 19 ส.ค. 2569"],
        chemicalRecords: ["ปุ๋ยทางใบ Lot FOL-R18 วันที่ 2 ส.ค. 2569"],
        irrigationRecords: ["สปริงเกอร์ R03 · 45 นาที"],
        workers: ["หัวหน้าสวน: ศิริ", "ทีมผลไม้ระยอง"],
      },
    ],
    documentTypes: defaultDocumentTypes,
    documents: demoDocuments(isExport ? "EasyPlants Export Orchard" : "EasyPlants Demo Orchard"),
    tutorialProgress: ["profile-ready"],
    phiScenario: {
      plot: "D04",
      chemicalDate: "10 Aug 2026",
      phiDays: 14,
      earliestHarvest: "24 Aug 2026",
      plannedHarvest: "20 Aug 2026",
    },
    satellite: { plot: "D01", previousNdvi: 0.76, currentNdvi: 0.69, changePercent: -9.2 },
  };
}

export function getDemoState(): DemoState {
  if (typeof window === "undefined") return getInitialDemoState();

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return normalizeDemoState(JSON.parse(stored));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  const personaId = (window.localStorage.getItem(PERSONA_KEY) as DemoPersonaId | null) ?? "commercial";
  const state = buildDemoState(personaId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

function normalizeDemoState(stored: unknown): DemoState {
  const saved = stored && typeof stored === "object" ? (stored as Partial<DemoState>) : {};
  const personaId = demoPersonas.some((persona) => persona.id === saved.personaId)
    ? (saved.personaId as DemoPersonaId)
    : "commercial";
  const baseline = buildDemoState(personaId);
  const savedTasks = Array.isArray(saved.tasks) ? saved.tasks : undefined;
  const isLegacySchedule = savedTasks?.length === 4 && savedTasks.every((task) =>
    task && typeof task === "object" &&
    ["T-001", "T-002", "T-003", "T-004"].includes((task as SmartTask).id) &&
    (task as SmartTask).scheduledFor?.startsWith("2026-08-")
  );
  const savedRecommendations = Array.isArray(saved.recommendations) ? saved.recommendations : undefined;
  const normalizedRecommendations = savedRecommendations?.map((recommendation) => {
    const refreshed = baseline.recommendations.find((item) => item.id === recommendation.id);
    return refreshed && (recommendation.id === "R-001" || recommendation.id === "R-002") ? { ...recommendation, ...refreshed } : recommendation;
  });
  const normalizedWorkers = Array.isArray(saved.workers) ? saved.workers.map((worker) => {
    const legacyStatus = (worker as WorkerProfile & { status?: string }).status;
    const status = legacyStatus === "Assigned" ? "Active" : legacyStatus === "Absent" ? "On Leave" : legacyStatus;
    const { hoursToday: _hoursToday, ...workerWithoutHours } = worker as WorkerProfile & { hoursToday?: number };
    return { ...workerWithoutHours, status } as WorkerProfile;
  }) : baseline.workers;
  const savedTraceability = Array.isArray(saved.traceability) ? saved.traceability : [];
  const normalizedTraceability = [
    ...savedTraceability.map((record) => ({ ...baseline.traceability.find((item) => item.lotId === record.lotId), ...record })),
    ...baseline.traceability.filter((record) => !savedTraceability.some((savedRecord) => savedRecord.lotId === record.lotId)),
  ];

  // Demo data evolves with the app; retain user changes while filling fields introduced later.
  return {
    ...baseline,
    ...saved,
    farm: { ...baseline.farm, ...(saved.farm ?? {}) },
    additionalFarms: Array.isArray(saved.additionalFarms) ? saved.additionalFarms : baseline.additionalFarms ?? [],
    sites: Array.isArray(saved.sites) ? saved.sites : baseline.sites,
    plots: Array.isArray(saved.plots) ? saved.plots : baseline.plots,
    tasks: isLegacySchedule ? baseline.tasks : savedTasks ?? baseline.tasks,
    recommendations: normalizedRecommendations ?? baseline.recommendations,
    productionPlans: Array.isArray(saved.productionPlans) ? saved.productionPlans : baseline.productionPlans,
    workOrders: Array.isArray(saved.workOrders) ? saved.workOrders : baseline.workOrders,
    workers: normalizedWorkers,
    memberInvites: Array.isArray(saved.memberInvites) ? saved.memberInvites : baseline.memberInvites,
    organizationRoles: Array.isArray(saved.organizationRoles) ? saved.organizationRoles : baseline.organizationRoles,
    iotDevices: Array.isArray(saved.iotDevices) ? saved.iotDevices : baseline.iotDevices,
    iotRules: Array.isArray(saved.iotRules) ? saved.iotRules : baseline.iotRules,
    iotAlerts: Array.isArray(saved.iotAlerts) ? saved.iotAlerts : baseline.iotAlerts,
    traceability: normalizedTraceability,
    documentTypes: Array.isArray(saved.documentTypes) ? [...saved.documentTypes, ...baseline.documentTypes.filter((type) => !saved.documentTypes!.some((savedType) => savedType.id === type.id))] : baseline.documentTypes,
    documents: Array.isArray(saved.documents) ? [...saved.documents, ...baseline.documents.filter((document) => !saved.documents!.some((savedDocument) => savedDocument.id === document.id))] : baseline.documents,
    tutorialProgress: Array.isArray(saved.tutorialProgress) ? saved.tutorialProgress : baseline.tutorialProgress,
    workforce: { ...baseline.workforce, ...(saved.workforce ?? {}) },
    weather: { ...baseline.weather, ...(saved.weather ?? {}) },
    phiScenario: { ...baseline.phiScenario, ...(saved.phiScenario ?? {}) },
    satellite: { ...baseline.satellite, ...(saved.satellite ?? {}) },
  };
}

export function saveDemoState(state: DemoState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.localStorage.setItem(PERSONA_KEY, state.personaId);
  window.dispatchEvent(new Event("dragonfly_demo_state_updated"));
}

export function switchDemoPersona(personaId: DemoPersonaId) {
  const state = buildDemoState(personaId);
  saveDemoState(state);
}

export function resetDemoState() {
  if (typeof window === "undefined") return;
  const current = getDemoState().personaId;
  const state = buildDemoState(current);
  saveDemoState(state);
}

export function getCurrentDemoPersona(state = getDemoState()) {
  return demoPersonas.find((p) => p.id === state.personaId) ?? demoPersonas[1]!;
}

export function evaluateIoTRules(state: DemoState): DemoState {
  const alerts = state.iotRules.flatMap((rule) => {
    if (rule.enabled === false) return [];
    const device = state.iotDevices.find((d) => d.id === rule.deviceId);
    if (!device || device.numericValue == null) return [];
    const matched = rule.operator === "<" ? device.numericValue < rule.threshold : device.numericValue > rule.threshold;
    if (!matched) return [];
    return [
      {
        id: `ALERT-${rule.id}`,
        title: rule.name,
        plot: device.plot,
        current: `${device.numericValue}${device.unit ?? ""}`,
        target: `${rule.operator} ${rule.threshold}${device.unit ?? ""}`,
        action: rule.action,
        severity: rule.severity ?? "Warning",
        deviceId: device.id,
        ruleId: rule.id,
      },
    ];
  });

  return { ...state, iotAlerts: alerts };
}

export function getWorkOrderCompletionIssue(state: DemoState, workOrder: WorkOrder) {
  if (workOrder.type !== "Harvest") return undefined;
  const { plot, earliestHarvest, plannedHarvest, phiDays } = state.phiScenario;
  if (workOrder.plot !== plot || phiDays <= 0) return undefined;
  const earliest = Date.parse(earliestHarvest);
  const planned = Date.parse(plannedHarvest);
  if (!Number.isNaN(earliest) && !Number.isNaN(planned) && planned < earliest) {
    return `ยังปิดงานเก็บเกี่ยวไม่ได้: แปลง ${plot} ต้องเว้นระยะ PHI ${phiDays} วัน และเริ่มเก็บได้ ${earliestHarvest}`;
  }
  return undefined;
}

export function buildCropSuitabilityRecommendations(plot: Plot): Recommendation[] {
  const area = plot.area || 0;
  const crop = plot.crop.toLowerCase();
  const baseReason = `ระบบใช้ข้อมูลที่ผู้ใช้กรอก: พื้นที่ ${area} ไร่, จำนวน ${plot.trees} ต้น, พิกัด ${plot.gps}`;

  if (crop.includes("ทุเรียน") || area >= 20) {
    return [
      {
        id: `CROP-${plot.id}-durian`,
        title: "ทุเรียนหมอนทองเหมาะกับแปลงเชิงพาณิชย์",
        plot: plot.name,
        reason: `${baseReason}. แปลงขนาดนี้เหมาะกับการวาง production cycle และ work order รายแปลง`,
        action: "สร้าง Production Plan และกำหนดรอบให้น้ำ/ปุ๋ย",
        confidence: "Medium",
        sourceType: "ai-estimate",
        sourceLabel: "ประมาณการจาก AI จากขนาดแปลงและพืชที่ผู้ใช้เลือก",
      },
      {
        id: `CROP-${plot.id}-cover`,
        title: "ควรพิจารณาพืชคลุมดินระหว่างแถว",
        plot: plot.name,
        reason: "พืชคลุมดินช่วยลดการชะล้างหน้าดินและรักษาความชื้น แต่ต้องตรวจสภาพพื้นที่จริงก่อน",
        action: "บันทึกงานสำรวจดินและวัชพืชก่อนตัดสินใจ",
        confidence: "Low",
        sourceType: "ai-estimate",
        sourceLabel: "ข้อเสนอเชิงเกษตรทั่วไปจาก AI ยังไม่ใช่คำแนะนำยืนยัน",
      },
    ];
  }

  return [
    {
      id: `CROP-${plot.id}-lime`,
      title: "มะนาวหรือพืชผักหมุนเวียนเหมาะกับแปลงขนาดเล็ก",
      plot: plot.name,
      reason: `${baseReason}. แปลงขนาดเล็กเหมาะกับพืชที่เริ่มง่าย ใช้แรงงานน้อย และบันทึกผลได้เร็ว`,
      action: "เพิ่ม Crop Calendar และสร้างตารางรดน้ำ/ใส่ปุ๋ยพื้นฐาน",
      confidence: "Medium",
      sourceType: "ai-estimate",
      sourceLabel: "ประมาณการจาก AI จากขนาดแปลงและจำนวนแรงงาน",
    },
    {
      id: `CROP-${plot.id}-herb`,
      title: "สมุนไพร/ผักสวนครัวช่วยให้มือใหม่เรียนรู้เร็ว",
      plot: plot.name,
      reason: "รอบปลูกสั้น เห็นผลเร็ว เหมาะกับการฝึกใช้บันทึกงานและปฏิทินพืช",
      action: "เริ่มจากแปลงทดลอง 1 ส่วนก่อนขยายพื้นที่",
      confidence: "Low",
      sourceType: "ai-estimate",
      sourceLabel: "คำแนะนำเชิงเรียนรู้จาก AI ไม่ใช่ข้อมูลตลาดจริง",
    },
  ];
}
