import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Constants } from "@/integrations/supabase/types";

const JOURNEY_STAGES = Constants.public.Enums.journey_stage_type;

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-foreground font-medium">{value || "—"}</p>
    </div>
  );
}

interface Props {
  selected: any;
  onClose: () => void;
  onUpdate: (id: string, updates: Record<string, any>) => void;
}

export default function CandidateDetailPanel({ selected, onClose, onUpdate }: Props) {
  return (
    <div className="w-full lg:w-[400px] shrink-0 bg-card rounded-xl border border-border p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Candidate Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>

      <div className="space-y-4 text-sm">
        <Field label="Full Name" value={selected.full_name} />
        <Field label="Email" value={selected.email} />
        <Field label="WhatsApp" value={selected.whatsapp_number} />
        <Field label="Date of Birth" value={selected.date_of_birth} />
        <Field label="University" value={selected.university} />
        <Field label="Graduation Year" value={selected.graduation_year} />
        <Field label="Profession" value={selected.profession} />
        <Field label="Specialty" value={selected.specialty} />
        <Field label="English" value={selected.english_capability || selected.english_level} />
        <Field label="License Status" value={selected.license_status} />
        <Field label="Experience (yrs)" value={selected.experience_years} />
        <Field label="City/Country" value={selected.city_country} />
        <Field label="Target Countries" value={selected.target_countries?.join(", ")} />
        <Field label="Motivations" value={selected.motivations?.join(", ")} />
        <Field label="Challenges" value={selected.challenges?.join(", ")} />
        <Field label="Help Needed" value={selected.help_needed?.join(", ")} />
        <Field label="Email Verified" value={selected.email_verified ? "Yes" : "No"} />
        <Field label="WhatsApp Verified" value={selected.whatsapp_verified ? "Yes" : "No"} />

        <div className="pt-4 border-t border-border space-y-3">
          <div>
            <Label className="text-foreground font-bold text-xs">Journey Stage</Label>
            <Select value={selected.journey_stage} onValueChange={(v) => onUpdate(selected.id, { journey_stage: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {JOURNEY_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-foreground font-bold text-xs">Assigned Support Agent</Label>
            <Input
              className="mt-1"
              defaultValue={selected.assigned_support_agent || ""}
              placeholder="Agent name"
              onBlur={(e) => {
                if (e.target.value !== (selected.assigned_support_agent || "")) {
                  onUpdate(selected.id, { assigned_support_agent: e.target.value || null });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
