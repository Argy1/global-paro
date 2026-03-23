import { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Candidate = Tables<"candidates">;

const STORAGE_KEY = "gp_last_seen_stage";

interface StoredStage {
  stage: string;
  seenAt: string; // ISO string
}

function getStoredStage(candidateId: string): StoredStage | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${candidateId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredStage(candidateId: string, stage: string) {
  localStorage.setItem(
    `${STORAGE_KEY}_${candidateId}`,
    JSON.stringify({ stage, seenAt: new Date().toISOString() })
  );
}

interface Props {
  candidate: Candidate;
}

export default function StageChangeNotification({ candidate }: Props) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  const [prevStage, setPrevStage] = useState<string | null>(null);
  const [changedAt, setChangedAt] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredStage(candidate.id);
    const currentStage = candidate.journey_stage;

    if (!stored) {
      // First visit — save current stage silently, no banner
      saveStoredStage(candidate.id, currentStage);
      return;
    }

    if (stored.stage !== currentStage) {
      // Stage has changed since last visit!
      setPrevStage(stored.stage);
      setChangedAt(stored.seenAt);
      // Update stored stage immediately so banner only shows once per change
      saveStoredStage(candidate.id, currentStage);
    }
  }, [candidate.id, candidate.journey_stage]);

  if (!prevStage || dismissed) return null;

  const stageLabels = t.portal.stageLabels as Record<string, string>;
  const prevLabel = stageLabels[prevStage] ?? prevStage;
  const newLabel = stageLabels[candidate.journey_stage] ?? candidate.journey_stage;
  const whenStr = changedAt
    ? format(new Date(changedAt), "d MMM yyyy, HH:mm")
    : "";

  return (
    <div className="relative flex items-start gap-3 bg-primary/5 border border-primary/30 rounded-xl px-4 py-3 animate-fade-in">
      {/* Icon */}
      <div className="shrink-0 mt-0.5 flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
        <Bell className="h-4 w-4 text-primary" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {t.portal.stageChanged}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          <span className="font-medium text-foreground">{prevLabel}</span>
          {" → "}
          <span className="font-bold text-primary">{newLabel}</span>
        </p>
        {whenStr && (
          <p className="text-xs text-muted-foreground mt-1">
            {t.portal.lastSeenAt}: {whenStr}
          </p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
