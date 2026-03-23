import { CheckCircle2, Circle, Clock } from "lucide-react";

const PIPELINE_STEPS = [
  { key: "New", label: "Registered", desc: "Application received" },
  { key: "Contacted", label: "Contacted", desc: "Initial outreach done" },
  { key: "Screening", label: "Screening", desc: "Documents & eligibility review" },
  { key: "Preparing", label: "Preparing", desc: "Interview & language prep" },
  { key: "Ready", label: "Ready", desc: "Ready for placement" },
  { key: "Placed", label: "Placed", desc: "Matched with employer" },
];

interface Props {
  currentStage: string;
}

export default function StatusTracker({ currentStage }: Props) {
  const currentIndex = PIPELINE_STEPS.findIndex((s) => s.key === currentStage);

  return (
    <div className="space-y-1">
      {PIPELINE_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isPending = i > currentIndex;

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              {isDone ? (
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
              ) : isCurrent ? (
                <Clock className="h-6 w-6 text-accent shrink-0 animate-pulse" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground/30 shrink-0" />
              )}
              {i < PIPELINE_STEPS.length - 1 && (
                <div className={`w-0.5 h-8 ${isDone ? "bg-primary" : "bg-muted-foreground/20"}`} />
              )}
            </div>
            <div className={`pb-6 ${isPending ? "opacity-40" : ""}`}>
              <p className={`text-sm font-semibold ${isCurrent ? "text-accent" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
