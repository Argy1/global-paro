import { useState, useRef } from "react";
import { Upload, FileText, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useUploadDocument, useDeleteDocument, useCandidateDocuments } from "@/hooks/useCandidatePortal";

const DOC_TYPES = [
  { value: "cv", label: "CV / Resume" },
  { value: "certificate", label: "Certificate" },
  { value: "license", label: "License / STR" },
  { value: "english_cert", label: "English Certificate" },
  { value: "id_card", label: "ID Card / Passport" },
  { value: "other", label: "Other" },
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface Props {
  candidateId: string;
}

export default function DocumentUpload({ candidateId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileType, setFileType] = useState("cv");
  const { data: documents, isLoading } = useCandidateDocuments();
  const upload = useUploadDocument();
  const deleteDoc = useDeleteDocument();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      toast({ title: "File too large", description: "Maximum 10MB per file.", variant: "destructive" });
      return;
    }

    try {
      await upload.mutateAsync({ file, candidateId, fileType });
      toast({ title: "Document uploaded successfully" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Documents</h3>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Document Type</p>
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" onChange={handleUpload} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={upload.isPending} className="gap-1">
            {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload File
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Accepted: PDF, DOC, DOCX, JPG, PNG. Max 10MB.</p>

      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
      ) : documents && documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc: any) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{doc.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {DOC_TYPES.find((t) => t.value === doc.file_type)?.label || doc.file_type} • {formatSize(doc.file_size_bytes || 0)} • {new Date(doc.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteDoc.mutate({ id: doc.id, filePath: doc.file_path })}
                disabled={deleteDoc.isPending}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">No documents uploaded yet.</p>
      )}
    </div>
  );
}
