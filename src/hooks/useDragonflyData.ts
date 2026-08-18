import { useEffect, useMemo, useState } from "react";
import {
  appDataMode,
  buildCropSuitabilityRecommendations,
  demoPersonas,
  evaluateIoTRules,
  getWorkOrderCompletionIssue,
  getCurrentDemoPersona,
  getDemoState,
  getInitialDemoState,
  getDashboardFarms,
  isDemoMode,
  resetDemoState,
  saveDemoState,
  switchDemoPersona,
  type DemoPersonaId,
  type DemoState,
  type FarmDocument,
  type IoTDevice,
  type IoTRule,
  type MemberInvite,
  type OrganizationRole,
  type OrganizationDocumentType,
  type SmartTask,
  type WorkerProfile,
  type WorkOrder,
  type DashboardFarm,
  type FarmSite,
} from "@/lib/dragonfly-data";
import type { Plot } from "@/lib/farm-data";

export function useDragonflyData() {
  // Keep the server and first client render identical; restore local demo changes after hydration.
  const [state, setState] = useState<DemoState>(() => getInitialDemoState());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setState(getDemoState());
    update();
    window.addEventListener("dragonfly_demo_state_updated", update);
    return () => window.removeEventListener("dragonfly_demo_state_updated", update);
  }, []);

  const persona = useMemo(() => getCurrentDemoPersona(state), [state]);
  const [activeDashboardFarmId, setActiveDashboardFarmId] = useState("FARM-PRIMARY");
  const dashboardFarms = useMemo(() => getDashboardFarms(state), [state]);
  const activeDashboardFarm = dashboardFarms.find((farm) => farm.id === activeDashboardFarmId) ?? dashboardFarms[0];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedFarmId = window.localStorage.getItem("easyplants_active_dashboard_farm");
    if (savedFarmId) setActiveDashboardFarmId(savedFarmId);
  }, []);

  const setActiveDashboardFarm = (farmId: string) => {
    setActiveDashboardFarmId(farmId);
    if (typeof window !== "undefined") window.localStorage.setItem("easyplants_active_dashboard_farm", farmId);
  };

  const persist = (next: DemoState) => {
    const evaluated = evaluateIoTRules(next);
    setState(evaluated);
    saveDemoState(evaluated);
  };

  const setPersona = (personaId: DemoPersonaId) => {
    switchDemoPersona(personaId);
    setState(getDemoState());
  };

  const resetDemo = () => {
    resetDemoState();
    setState(getDemoState());
  };

  const addPlot = (plot: Omit<Plot, "id" | "health" | "lastCare" | "history">, structure?: { newFarm?: Pick<DashboardFarm, "id" | "name" | "location">; newSite?: Pick<FarmSite, "id" | "farmId" | "code" | "name"> }) => {
    const fullPlot: Plot = {
      ...plot,
      id: `P-${Date.now()}`,
      health: 100,
      lastCare: "เพิ่งเพิ่มแปลงใหม่ใน Demo Mode",
      history: [
        {
          date: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }),
          action: "สร้างแปลง",
          note: "บันทึกลง Demo Local Store",
        },
      ],
    };

    const newFarm = structure?.newFarm ? {
      ...structure.newFarm,
      type: "สวนที่ผู้ใช้สร้าง",
      areaRai: plot.area,
      primaryCrop: plot.crop,
      varieties: [plot.crop],
      plotCount: 1,
      treeCount: plot.trees,
      workerCount: 0,
      status: "Normal" as const,
      dataLabel: "ข้อมูลสวนที่ผู้ใช้เพิ่มใน Demo Mode",
    } : undefined;
    const newSite = structure?.newSite ? { ...structure.newSite, type: "โซนที่ผู้ใช้สร้าง", areaRai: plot.area, manager: "ยังไม่ระบุ", plotPrefixes: [], status: "Normal" as const } : undefined;
    persist({
      ...state,
      additionalFarms: newFarm ? [...(state.additionalFarms ?? []), newFarm] : state.additionalFarms ?? [],
      sites: newSite ? [...state.sites, newSite] : state.sites,
      plots: [...state.plots, fullPlot],
      recommendations: [
        ...buildCropSuitabilityRecommendations(fullPlot),
        ...state.recommendations,
      ],
      farm: plot.farmId === "FARM-PRIMARY" || !plot.farmId ? {
        ...state.farm,
        plotCount: state.farm.plotCount + 1,
        areaRai: state.farm.areaRai + plot.area,
        treeCount: state.farm.treeCount + plot.trees,
      } : state.farm,
    });
  };

  const addTask = (task: Omit<SmartTask, "id" | "status"> & Partial<Pick<SmartTask, "status">>) => {
    persist({
      ...state,
      tasks: [
        {
          id: `TASK-${Date.now()}`,
          status: task.status ?? "Planned",
          scheduledFor: task.scheduledFor ?? new Date().toISOString().slice(0, 10),
          origin: task.origin ?? (task.team || task.assignedWorkerId ? "team" : "personal"),
          ...task,
        },
        ...state.tasks,
      ],
    });
  };

  const updateTaskStatus = (taskId: string, status: SmartTask["status"], reason?: string, completion?: Omit<NonNullable<SmartTask["completion"]>, "completedAt">) => {
    const completedTask = state.tasks.find((task) => task.id === taskId);
    const shouldAppendHistory = status === "Completed" && completedTask?.status !== "Completed";
    const completionForHistory = completion ?? completedTask?.completion;
    const completedDate = new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
    persist({
      ...state,
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, status, reason, completion: completion ? { ...task.completion, ...completion, completedAt: status === "Completed" ? new Date().toISOString() : task.completion?.completedAt } : status === "Completed" && task.completion ? { ...task.completion, completedAt: new Date().toISOString() } : task.completion } : task)),
      plots: shouldAppendHistory && completedTask ? state.plots.map((plot) =>
        plot.id === completedTask.plot || plot.name === completedTask.plot
          ? {
              ...plot,
              lastCare: `${completedTask.title} · ${completedDate}`,
              health: completionForHistory?.health ?? plot.health,
              history: [{ date: completedDate, action: completedTask.title, note: `${completionForHistory?.note || "ปิดงานแล้ว"} · งาน ${completedTask.id} · ${completedTask.origin === "team" || completedTask.team ? "งานทีม" : completedTask.origin === "system" ? "งานจากระบบ" : "งานส่วนตัว"}${completedTask.team ? ` · ทีม ${completedTask.team}` : ""}${completionForHistory?.completedBy ? ` · ผู้ปฏิบัติงาน ${completionForHistory.completedBy}` : ""}${completionForHistory?.approvedBy ? ` · ผู้อนุมัติ ${completionForHistory.approvedBy}` : ""}${completionForHistory?.evidenceCount ? ` · หลักฐาน ${completionForHistory.evidenceCount} รายการ` : ""}` }, ...plot.history],
            }
          : plot
      ) : state.plots,
    });
  };

  const recordWeeklyInspection = (checks: { plotId: string; score: number; issues: string[] }[]) => {
    const recordedAt = new Date();
    const date = recordedAt.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
    const marker = `weekly-monitor:${recordedAt.toISOString().slice(0, 10)}`;
    const eligible = checks.filter((check) => {
      const plot = state.plots.find((item) => item.id === check.plotId);
      return plot && !plot.history.some((item) => item.note.includes(marker));
    });
    if (!eligible.length) return { saved: 0, skipped: checks.length };
    const lookup = new Map(eligible.map((check) => [check.plotId, check]));
    persist({
      ...state,
      plots: state.plots.map((plot) => {
        const check = lookup.get(plot.id);
        return check ? {
          ...plot,
          history: [{ date, action: "บันทึกเฝ้าระวังรายสัปดาห์", note: `คะแนนสุขภาพ ${check.score}/100${check.issues.length ? ` · พบ: ${check.issues.join(", ")}` : " · ไม่พบประเด็นเร่งด่วน"} · ${marker}` }, ...plot.history],
        } : plot;
      }),
    });
    return { saved: eligible.length, skipped: checks.length - eligible.length };
  };

  const updateWorkOrderStatus = (workOrderId: string, status: WorkOrder["status"], reason?: string) => {
    const workOrder = state.workOrders.find((item) => item.id === workOrderId);
    const completionIssue = workOrder && status === "Completed" ? getWorkOrderCompletionIssue(state, workOrder) : undefined;
    if (completionIssue) return { ok: false, reason: completionIssue };
    persist({
      ...state,
      workOrders: state.workOrders.map((workOrder) =>
        workOrder.id === workOrderId ? { ...workOrder, status, reason } : workOrder
      ),
    });
    return { ok: true as const };
  };

  const updateDevice = (deviceId: string, patch: Partial<IoTDevice>) => {
    persist({
      ...state,
      iotDevices: state.iotDevices.map((device) =>
        device.id === deviceId ? { ...device, ...patch } : device
      ),
    });
  };

  const updateWorker = (workerId: string, patch: Partial<WorkerProfile>) => {
    persist({ ...state, workers: state.workers.map((worker) => worker.id === workerId ? { ...worker, ...patch } : worker) });
  };

  const addIoTRule = (rule: Omit<IoTRule, "id">) => {
    persist({ ...state, iotRules: [{ ...rule, id: `RULE-${Date.now()}` }, ...state.iotRules] });
  };

  const updateIoTRule = (ruleId: string, patch: Partial<IoTRule>) => {
    persist({ ...state, iotRules: state.iotRules.map((rule) => rule.id === ruleId ? { ...rule, ...patch } : rule) });
  };

  const deleteIoTRule = (ruleId: string) => {
    persist({ ...state, iotRules: state.iotRules.filter((rule) => rule.id !== ruleId) });
  };

  const addWorker = (worker: Pick<WorkerProfile, "name" | "role" | "crew">) => {
    const newWorker: WorkerProfile = {
      id: `W-${Date.now()}`,
      ...worker,
      status: "Available",
      currentTask: "ยังไม่ได้มอบหมายงาน",
    };
    const existingCrew = state.workforce.crews.find((crew) => crew.name === worker.crew);
    persist({
      ...state,
      workers: [...state.workers, newWorker],
      workforce: {
        ...state.workforce,
        total: state.workforce.total + 1,
        available: state.workforce.available + 1,
        crews: existingCrew
          ? state.workforce.crews.map((crew) => crew.name === worker.crew ? { ...crew, assigned: crew.assigned + 1 } : crew)
          : [...state.workforce.crews, { name: worker.crew, assigned: 1, status: "Available" }],
      },
      farm: { ...state.farm, workerCount: state.farm.workerCount + 1 },
    });
  };

  const inviteMembers = (emails: string[], role: MemberInvite["role"], crew: string) => {
    const uniqueEmails = [...new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean))];
    const validEmails = uniqueEmails.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    const existing = new Set(state.memberInvites.filter((invite) => invite.status === "Sent").map((invite) => invite.email));
    const newEmails = validEmails.filter((email) => !existing.has(email));
    if (!newEmails.length) return { sent: 0, invalid: uniqueEmails.length };
    persist({
      ...state,
      memberInvites: [
        ...state.memberInvites,
        ...newEmails.map((email) => ({ id: `INV-${Date.now()}-${email}`, email, role, crew, status: "Sent" as const, sentAt: new Date().toISOString() })),
      ],
    });
    return { sent: newEmails.length, invalid: uniqueEmails.length - newEmails.length };
  };

  const addOrganizationRole = (name: string, permissions: string[]) => {
    const normalizedName = name.trim();
    if (!normalizedName || !permissions.length) return { ok: false as const, reason: "กรอกชื่อ role และเลือกสิทธิ์อย่างน้อย 1 รายการ" };
    if (state.organizationRoles.some((role) => role.name.toLocaleLowerCase("th-TH") === normalizedName.toLocaleLowerCase("th-TH"))) return { ok: false as const, reason: "มี role ชื่อนี้ในองค์กรแล้ว" };
    const newRole: OrganizationRole = { id: `ROLE-${Date.now()}`, name: normalizedName, permissions };
    persist({ ...state, organizationRoles: [...state.organizationRoles, newRole] });
    return { ok: true as const, role: newRole };
  };

  const addDocumentType = (documentType: Omit<OrganizationDocumentType, "id" | "builtIn">) => {
    const name = documentType.name.trim();
    if (!name) return { ok: false as const, reason: "กรอกชื่อประเภทเอกสาร" };
    if (state.documentTypes.some((type) => type.name.toLocaleLowerCase("th-TH") === name.toLocaleLowerCase("th-TH"))) return { ok: false as const, reason: "มีประเภทเอกสารชื่อนี้แล้ว" };
    const created = { ...documentType, id: `DOC-TYPE-${Date.now()}`, name };
    persist({ ...state, documentTypes: [...state.documentTypes, created] });
    return { ok: true as const, documentType: created };
  };

  const addDocument = (document: Omit<FarmDocument, "id">) => {
    const created = { ...document, id: `DOC-${Date.now()}` };
    persist({ ...state, documents: [created, ...state.documents] });
    return created;
  };

  const updateDocumentStatus = (documentId: string, status: FarmDocument["status"], approvedBy?: string) => {
    persist({ ...state, documents: state.documents.map((document) => document.id === documentId ? { ...document, status, approvedBy: status === "Approved" ? approvedBy : document.approvedBy } : document) });
  };

  const completeTutorialStep = (stepIds: string | string[]) => {
    const completedIds = Array.isArray(stepIds) ? stepIds : [stepIds];
    persist({ ...state, tutorialProgress: [...new Set([...state.tutorialProgress, ...completedIds])] });
  };

  return {
    mode: appDataMode,
    isDemoMode,
    personas: demoPersonas,
    persona,
    state,
    dashboardFarms,
    activeDashboardFarm,
    setActiveDashboardFarm,
    setPersona,
    resetDemo,
    addPlot,
    addTask,
    updateTaskStatus,
    recordWeeklyInspection,
    updateWorkOrderStatus,
    updateDevice,
    updateWorker,
    addIoTRule,
    updateIoTRule,
    deleteIoTRule,
    addWorker,
    inviteMembers,
    addOrganizationRole,
    addDocumentType,
    addDocument,
    updateDocumentStatus,
    completeTutorialStep,
  };
}
