import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/i18n/LanguageContext";
import { useUpdateCandidateProfile } from "@/hooks/useCandidatePortal";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Candidate = Tables<"candidates">;

const SPECIALTIES = ["ICU", "ER", "Med-Surg", "OR", "Pediatrics", "Geriatric", "Mental Health", "Community Health", "Other"] as const;
const AVAILABILITIES = ["0-3 months", "3-6 months", "6-12 months"] as const;
const TARGET_COUNTRY_OPTIONS = ["Singapore", "USA", "Canada", "UK", "Australia", "Germany", "Japan", "UAE", "Saudi Arabia", "Other"];

const schema = z.object({
  full_name: z.string().trim().min(2, "Name too short").max(100),
  city_country: z.string().trim().max(100).optional(),
  whatsapp_number: z.string().trim().min(8, "Invalid number").max(20),
  specialty: z.string().optional(),
  availability: z.string().optional(),
  target_countries: z.array(z.string()).min(1, "Select at least one country"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  candidate: Candidate;
}

export default function EditProfileForm({ candidate }: Props) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const updateProfile = useUpdateCandidateProfile();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: candidate.full_name ?? "",
      city_country: candidate.city_country ?? "",
      whatsapp_number: candidate.whatsapp_number ?? "",
      specialty: candidate.specialty ?? "",
      availability: candidate.availability ?? "",
      target_countries: candidate.target_countries ?? [],
    },
  });

  const selectedCountries = watch("target_countries") ?? [];

  const toggleCountry = (country: string) => {
    const current = selectedCountries;
    const updated = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    setValue("target_countries", updated, { shouldValidate: true });
  };

  // ── Edit mode — cast to correct enum types
  const onSubmit = (data: FormValues) => {
    type SpecialtyType = "ICU" | "ER" | "Med-Surg" | "OR" | "Pediatrics" | "Geriatric" | "Mental Health" | "Community Health" | "Other";
    type AvailabilityType = "0-3 months" | "3-6 months" | "6-12 months";
    updateProfile.mutate(
      {
        id: candidate.id,
        updates: {
          full_name: data.full_name,
          city_country: data.city_country,
          whatsapp_number: data.whatsapp_number,
          specialty: data.specialty as SpecialtyType | undefined,
          availability: data.availability as AvailabilityType | undefined,
          target_countries: data.target_countries,
        },
      },
      {
        onSuccess: () => {
          toast({ title: t.portal.profileSaved });
          setIsEditing(false);
        },
        onError: () => toast({ title: t.portal.profileSaveError, variant: "destructive" }),
      }
    );
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // ── View mode ──
  if (!isEditing) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">{t.portal.profileInfo}</h2>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setIsEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
            {t.portal.editProfile}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ViewField label={t.portal.fullName} value={candidate.full_name} />
          <ViewField label={t.portal.email} value={candidate.email} />
          <ViewField label={t.portal.whatsapp} value={candidate.whatsapp_number} />
          <ViewField label={t.portal.location} value={candidate.city_country} />
          <ViewField label={t.portal.specialty} value={candidate.specialty} />
          <ViewField label={t.portal.availability} value={candidate.availability} />
          <ViewField label={t.portal.targetCountries} value={candidate.target_countries?.join(", ")} />
          <ViewField label={t.portal.university} value={candidate.university} />
          <ViewField label={t.portal.profession} value={candidate.profession} />
          <ViewField label={t.portal.englishLevel} value={candidate.english_capability || candidate.english_level} />
          <ViewField label={t.portal.licenseStatus} value={candidate.license_status} />
          <ViewField label={t.portal.experience} value={candidate.experience_years ? `${candidate.experience_years} ${t.portal.years}` : null} />
        </div>
      </div>
    );
  }

  // ── Edit mode ──
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">{t.portal.editProfile}</h2>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={handleCancel}>
          <X className="h-3.5 w-3.5" /> {t.portal.cancelEdit}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full name */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t.portal.fullName} *</Label>
            <Input {...register("full_name")} className={errors.full_name ? "border-destructive" : ""} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>

          {/* WhatsApp */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t.portal.whatsapp} *</Label>
            <Input {...register("whatsapp_number")} placeholder="+62..." className={errors.whatsapp_number ? "border-destructive" : ""} />
            {errors.whatsapp_number && <p className="text-xs text-destructive">{errors.whatsapp_number.message}</p>}
          </div>

          {/* City/Country */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t.portal.location}</Label>
            <Input {...register("city_country")} placeholder="e.g. Jakarta, Indonesia" />
          </div>

          {/* Specialty */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t.portal.specialty}</Label>
            <Select
              defaultValue={candidate.specialty ?? ""}
              onValueChange={(v) => setValue("specialty", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.portal.selectSpecialty} />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t.portal.availability}</Label>
            <Select
              defaultValue={candidate.availability ?? ""}
              onValueChange={(v) => setValue("availability", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.portal.selectAvailability} />
              </SelectTrigger>
              <SelectContent>
                {AVAILABILITIES.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Target countries */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">{t.portal.targetCountries} *</Label>
          <div className="flex flex-wrap gap-2">
            {TARGET_COUNTRY_OPTIONS.map((country) => (
              <button
                type="button"
                key={country}
                onClick={() => toggleCountry(country)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${
                  selectedCountries.includes(country)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
          {errors.target_countries && (
            <p className="text-xs text-destructive">{errors.target_countries.message}</p>
          )}
        </div>

        {/* Email (read-only note) */}
        <p className="text-xs text-muted-foreground">{t.portal.emailReadOnly}</p>

        {/* Submit */}
        <div className="flex gap-3 pt-1">
          <Button type="submit" variant="cta" size="sm" className="gap-2" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {t.portal.saveChanges}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
            {t.portal.cancelEdit}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ViewField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}
