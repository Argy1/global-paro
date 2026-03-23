import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Constants } from "@/integrations/supabase/types";
import { useState } from "react";
import { CheckSquare, X } from "lucide-react";

const JOURNEY_STAGES = Constants.public.Enums.journey_stage_type;
const PIPELINE_STATUSES = Constants.public.Enums.pipeline_status_type;

interface Props {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkUpdateStage: (stage: string) => void;
  onBulkUpdatePipeline: (status: string) => void;
}

export default function BulkActionsBar({ selectedCount, onClearSelection, onBulkUpdateStage, onBulkUpdatePipeline }: Props) {
  const [bulkStage, setBulkStage] = useState("");
  const [bulkPipeline, setBulkPipeline] = useState("");

  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <CheckSquare className="h-4 w-4 text-primary" />
        {selectedCount} selected
      </div>
      <Button variant="ghost" size="sm" onClick={onClearSelection} className="gap-1 text-muted-foreground">
        <X className="h-3 w-3" /> Clear
      </Button>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <Select value={bulkStage} onValueChange={setBulkStage}>
          <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Set Stage…" /></SelectTrigger>
          <SelectContent>
            {JOURNEY_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" variant="secondary" disabled={!bulkStage} onClick={() => { onBulkUpdateStage(bulkStage); setBulkStage(""); }}>
          Apply
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Select value={bulkPipeline} onValueChange={setBulkPipeline}>
          <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Set Pipeline…" /></SelectTrigger>
          <SelectContent>
            {PIPELINE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" variant="secondary" disabled={!bulkPipeline} onClick={() => { onBulkUpdatePipeline(bulkPipeline); setBulkPipeline(""); }}>
          Apply
        </Button>
      </div>
    </div>
  );
}
