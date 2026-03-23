import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Constants } from "@/integrations/supabase/types";

const JOURNEY_STAGES = Constants.public.Enums.journey_stage_type;
const SPECIALTIES = Constants.public.Enums.specialty_type;
const PROFESSIONS = Constants.public.Enums.profession_type;
const EDUCATION_LEVELS = Constants.public.Enums.education_level_type;
const ENGLISH_LEVELS = Constants.public.Enums.english_level_type;
const AVAILABILITY = Constants.public.Enums.availability_type;
const LICENSE_STATUSES = Constants.public.Enums.license_status_type;

export interface CandidateFilterValues {
  search: string;
  stage: string;
  verified: string;
  specialty: string;
  profession: string;
  education: string;
  english: string;
  availability: string;
  license: string;
  country: string;
}

const defaultFilters: CandidateFilterValues = {
  search: "",
  stage: "all",
  verified: "all",
  specialty: "all",
  profession: "all",
  education: "all",
  english: "all",
  availability: "all",
  license: "all",
  country: "all",
};

interface Props {
  filters: CandidateFilterValues;
  onChange: (filters: CandidateFilterValues) => void;
  countries: string[];
}

export { defaultFilters };

export default function CandidateFilters({ filters, onChange, countries }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = (key: keyof CandidateFilterValues, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasAdvancedFilters = filters.specialty !== "all" || filters.profession !== "all" || filters.education !== "all" || filters.english !== "all" || filters.availability !== "all" || filters.license !== "all" || filters.country !== "all";

  const clearAll = () => onChange({ ...defaultFilters });

  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, email, phone…" value={filters.search} onChange={(e) => set("search", e.target.value)} className="pl-9" />
        </div>
        <Select value={filters.stage} onValueChange={(v) => set("stage", v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {JOURNEY_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.verified} onValueChange={(v) => set("verified", v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Verified" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={showAdvanced ? "secondary" : "outline"} size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="gap-1">
          <Filter className="h-4 w-4" /> Advanced
          {hasAdvancedFilters && <span className="ml-1 h-2 w-2 rounded-full bg-primary inline-block" />}
        </Button>
        {(hasAdvancedFilters || filters.search || filters.stage !== "all" || filters.verified !== "all") && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1 text-muted-foreground">
            <X className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg border border-border">
          <Select value={filters.specialty} onValueChange={(v) => set("specialty", v)}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Specialty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.profession} onValueChange={(v) => set("profession", v)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Profession" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Professions</SelectItem>
              {PROFESSIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.education} onValueChange={(v) => set("education", v)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Education" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Education</SelectItem>
              {EDUCATION_LEVELS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.english} onValueChange={(v) => set("english", v)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="English" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {ENGLISH_LEVELS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.license} onValueChange={(v) => set("license", v)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="License" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All License</SelectItem>
              {LICENSE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.availability} onValueChange={(v) => set("availability", v)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Availability" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              {AVAILABILITY.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.country} onValueChange={(v) => set("country", v)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
