import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Constants } from "@/integrations/supabase/types";

const EMPLOYER_STATUSES = Constants.public.Enums.employer_status_type;

export interface EmployerFilterValues {
  search: string;
  status: string;
  country: string;
}

export const defaultEmployerFilters: EmployerFilterValues = {
  search: "",
  status: "all",
  country: "all",
};

interface Props {
  filters: EmployerFilterValues;
  onChange: (filters: EmployerFilterValues) => void;
  countries: string[];
}

export default function EmployerFilters({ filters, onChange, countries }: Props) {
  const set = (key: keyof EmployerFilterValues, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasFilters = filters.search || filters.status !== "all" || filters.country !== "all";

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search institution, email…" value={filters.search} onChange={(e) => set("search", e.target.value)} className="pl-9" />
      </div>
      <Select value={filters.status} onValueChange={(v) => set("status", v)}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {EMPLOYER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.country} onValueChange={(v) => set("country", v)}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Country" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange({ ...defaultEmployerFilters })} className="gap-1 text-muted-foreground">
          <X className="h-4 w-4" /> Clear
        </Button>
      )}
    </div>
  );
}
