import { differenceInDays, parseISO } from "date-fns";
import { Calendar, FileText, MapPin, ArrowRight, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useCandidateDocuments } from "@/hooks/useCandidatePortal";
import type { Tables } from "@/integrations/supabase/types";

type Candidate = Tables<"candidates">;

const STAGE_ORDER = ["New", "Contacted", "Screening", "Preparing", "Ready", "Placed", "Closed"];

function getNextStep(stage: string, lang: "en" | "id"): string {
  const steps: Record<string, { en: string; id: string }> = {
    New: {
      en: "Upload your CV and STR/SIP documents to get started.",
      id: "Unggah CV dan dokumen STR/SIP kamu untuk memulai.",
    },
    Contacted: {
      en: "Our team will reach out via WhatsApp soon. Keep an eye on your messages!",
      id: "Tim kami akan segera menghubungi kamu via WhatsApp. Pantau pesanmu!",
    },
    Screening: {
      en: "Complete your document checklist and ensure your profile is fully filled.",
      id: "Lengkapi daftar dokumen dan pastikan profilmu sudah terisi lengkap.",
    },
    Preparing: {
      en: "Focus on your IELTS/NCLEX preparation and practice English daily.",
      id: "Fokus persiapan IELTS/NCLEX dan latih bahasa Inggris setiap hari.",
    },
    Ready: {
      en: "You're ready! Our team is matching you with suitable employers.",
      id: "Kamu sudah siap! Tim kami sedang mencocokkan kamu dengan employer yang sesuai.",
    },
    Placed: {
      en: "Congratulations! Stay in touch with your support agent for visa guidance.",
      id: "Selamat! Tetap berhubungan dengan agen support kamu untuk panduan visa.",
    },
    Closed: {
      en: "Your journey has been completed. Thank you for being part of Global Paro!",
      id: "Perjalananmu telah selesai. Terima kasih telah menjadi bagian dari Global Paro!",
    },
  };
  return steps[stage]?.[lang] ?? steps["New"][lang];
}

const STAGE_COLORS: Record<string, string> = {
  New: "text-blue-500 bg-blue-50 border-blue-200",
  Contacted: "text-indigo-500 bg-indigo-50 border-indigo-200",
  Screening: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Preparing: "text-orange-500 bg-orange-50 border-orange-200",
  Ready: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Placed: "text-primary bg-primary/5 border-primary/30",
  Closed: "text-muted-foreground bg-muted border-border",
};

interface Props {
  candidate: Candidate;
}

export default function DashboardSummaryCard({ candidate }: Props) {
  const { lang, t } = useTranslation();
  const { data: docs, isLoading: docsLoading } = useCandidateDocuments();

  const daysSince = differenceInDays(new Date(), parseISO(candidate.created_at));
  const docCount = docs?.length ?? 0;
  const stageIndex = STAGE_ORDER.indexOf(candidate.journey_stage);
  const progress = Math.round(((stageIndex + 1) / (STAGE_ORDER.length - 1)) * 100);
  const stageColor = STAGE_COLORS[candidate.journey_stage] ?? STAGE_COLORS["New"];
  const nextStep = getNextStep(candidate.journey_stage, lang as "en" | "id");

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-5">
      {/* Top row: stage badge + progress */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{t.portal.currentStage}</p>
          <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full border ${stageColor}`}>
            {candidate.journey_stage === "Placed" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            {t.portal.stageLabels[candidate.journey_stage as keyof typeof t.portal.stageLabels] ?? candidate.journey_stage}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 min-w-[120px] max-w-[200px]">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{t.portal.journeyProgress}</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-muted/40 rounded-lg">
          <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-xl font-extrabold text-foreground">{daysSince}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">{t.portal.daysSinceRegistration}</p>
        </div>
        <div className="text-center p-3 bg-muted/40 rounded-lg">
          <FileText className="h-5 w-5 text-primary mx-auto mb-1" />
          {docsLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            <p className="text-xl font-extrabold text-foreground">{docCount}</p>
          )}
          <p className="text-[10px] text-muted-foreground leading-tight">{t.portal.documentsUploaded}</p>
        </div>
        <div className="text-center p-3 bg-muted/40 rounded-lg">
          <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-xl font-extrabold text-foreground truncate">
            {candidate.target_countries?.[0] ?? "—"}
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight">{t.portal.topTarget}</p>
        </div>
      </div>

      {/* Next step recommendation */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg p-3">
        <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-primary mb-0.5">{t.portal.nextStep}</p>
          <p className="text-sm text-foreground leading-snug">{nextStep}</p>
        </div>
      </div>
    </div>
  );
}
