import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, PlayCircle, RotateCcw } from "lucide-react";
import { AppShell, Badge, Card, Progress, SectionTitle } from "@/components/AppShell";
import { useDragonflyData } from "@/hooks/useDragonflyData";
import { getGuidedTutorial, startGuidedTutorial } from "@/lib/guided-tutorial";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "EasyPlants Academy — สวนอัจฉริยะ" },
      { name: "description", content: "บทเรียนและ tutorial แบบมีขั้นตอนสำหรับชาวสวนไทย" },
    ],
  }),
  component: AcademyPage,
});

function AcademyPage() {
  const { persona, state } = useDragonflyData();
  const tutorial = getGuidedTutorial(persona.id);
  const done = new Set(state.tutorialProgress);
  const completed = tutorial.steps.filter((step) => done.has(step.id)).length;
  const progress = Math.round((completed / tutorial.steps.length) * 100);
  const isBeginner = persona.profile.knowledgeLevel === "Beginner";

  return (
    <AppShell title="EasyPlants Academy" subtitle={isBeginner ? "โหมดฝึกสอนสำหรับเริ่มจัดการสวน" : "คู่มือเริ่มต้นตามมุมมองปัจจุบัน"}>
      <Card className="bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <BookOpen className="size-8" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">{tutorial.title}</p>
            <p className="text-xs text-primary-foreground/80">
              ทำแล้ว {completed}/{tutorial.steps.length} ขั้นตอน
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-full bg-white/20">
          <div className="h-2 rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      <Card className="space-y-3 border-primary/30 bg-primary-soft/45">
        <div className="flex items-start gap-3">
          <PlayCircle className="mt-0.5 size-6 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">โหมดฝึกสอนแบบโต้ตอบ</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tutorial.summary} ระบบจะพาไปหน้าที่เกี่ยวข้อง ไฮไลต์จุดใช้งาน และบอกสิ่งที่ควรกดทีละขั้น</p>
          </div>
        </div>
        <button type="button" onClick={() => startGuidedTutorial(persona.id)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
          {progress === 100 ? <><RotateCcw className="size-4" /> เริ่มฝึกสอนอีกครั้ง</> : <><PlayCircle className="size-4" /> เริ่มโหมดฝึกสอน</>}
        </button>
        <p className="text-[11px] text-muted-foreground">ยกเลิกได้ทุกเวลา และกดปุ่ม Escape บนคอมพิวเตอร์เพื่อออกจากโหมดฝึกสอน</p>
      </Card>

      <SectionTitle>เส้นทางการเรียนรู้</SectionTitle>
      <div className="space-y-3">
        {tutorial.steps.map((step, index) => {
          const isDone = done.has(step.id);
          return (
            <Card key={step.id}>
              <div className="flex items-start gap-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${isDone ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {isDone ? <CheckCircle2 className="size-5" /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{step.title}</p>
                    <Badge tone={isDone ? "good" : "muted"}>{isDone ? "เรียนแล้ว" : "รอเรียน"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <SectionTitle>ความคืบหน้า</SectionTitle>
      <Card>
        <Progress value={progress} />
        <p className="mt-2 text-center text-xs text-muted-foreground">เรียนรู้แล้ว {progress}% ในมุมมอง {persona.role}</p>
      </Card>
    </AppShell>
  );
}
