import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import { AppShell, Badge, Card, Progress, SectionTitle } from "@/components/AppShell";
import { useDragonflyData } from "@/hooks/useDragonflyData";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "EasyPlants Academy — สวนอัจฉริยะ" },
      { name: "description", content: "บทเรียนและ tutorial แบบมีขั้นตอนสำหรับชาวสวนไทย" },
    ],
  }),
  component: AcademyPage,
});

const beginnerPath = [
  { id: "create-farm", title: "Create Farm", desc: "ตั้งค่าฟาร์มแรกและพื้นที่รวม" },
  { id: "create-plot", title: "Create Plot", desc: "สร้างพื้นที่ปลูกแรกจาก GPS หรือแผนที่" },
  { id: "add-crop", title: "Add Crop", desc: "ระบุพืช พันธุ์ อายุ และจำนวนต้น" },
  { id: "crop-calendar", title: "Understand Crop Calendar", desc: "ดูช่วงการเจริญเติบโตและงานที่ควรทำ" },
  { id: "first-task", title: "Create First Task", desc: "สร้างงานรดน้ำหรือสำรวจใบพืช" },
  { id: "irrigation", title: "Record Irrigation", desc: "บันทึกว่าวันนี้ให้น้ำเท่าไร" },
  { id: "fertilizer", title: "Record Fertilizer", desc: "บันทึกสูตรและปริมาณปุ๋ย" },
  { id: "plant-health", title: "Record Pest or Disease", desc: "ถ่ายรูปหรือบันทึกอาการผิดปกติ" },
];

function AcademyPage() {
  const { persona, state, resetDemo } = useDragonflyData();
  const done = new Set(state.tutorialProgress);
  const completed = beginnerPath.filter((step) => done.has(step.id)).length;
  const progress = Math.round((completed / beginnerPath.length) * 100);
  const isBeginner = persona.profile.knowledgeLevel === "Beginner";

  return (
    <AppShell title="EasyPlants Academy" subtitle={isBeginner ? "Guided learning สำหรับเริ่มจัดการสวน" : "Setup guide แบบย่อสำหรับผู้ใช้มีประสบการณ์"}>
      <Card className="bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <BookOpen className="size-8" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">{isBeginner ? "Getting Started Path" : "Professional Setup Checklist"}</p>
            <p className="text-xs text-primary-foreground/80">
              {completed}/{beginnerPath.length} steps complete
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-full bg-white/20">
          <div className="h-2 rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      <SectionTitle>Learning Path</SectionTitle>
      <div className="space-y-3">
        {beginnerPath.map((step, index) => {
          const isDone = done.has(step.id);
          return (
            <Card key={step.id}>
              <div className="flex items-start gap-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${isDone ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {isDone ? <CheckCircle2 className="size-5" /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{step.title}</p>
                    <Badge tone={isDone ? "good" : "muted"}>{isDone ? "Done" : "Next"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="space-y-3">
        <p className="text-sm font-semibold">Interactive cue example</p>
        <p className="text-xs text-muted-foreground">
          ใน production step นี้จะ highlight ปุ่ม + Add Plot และพาผู้ใช้สร้าง growing area แรกโดยใช้ component เดิมของหน้าแปลง
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/plots" className="rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground">
            Continue tutorial
          </Link>
          <button onClick={resetDemo} className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-sm font-semibold">
            <RotateCcw className="size-4" /> Restart
          </button>
        </div>
      </Card>

      <SectionTitle>Progress</SectionTitle>
      <Card>
        <Progress value={progress} />
        <p className="mt-2 text-center text-xs text-muted-foreground">{progress}% completed in current demo persona</p>
      </Card>
    </AppShell>
  );
}
