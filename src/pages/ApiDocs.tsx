import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Play,
  Loader2,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const BASE_URL = "https://kucfckgxcrgihtxaziqm.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2Zja2d4Y3JnaWh0eGF6aXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjY5NjUsImV4cCI6MjA4NTc0Mjk2NX0.SrBR0qNNnlnroio482OifAT2Ai3Wj_ax3aW_6SrceCk";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

interface Endpoint {
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  auth: "None" | "Anon Key" | "Bearer JWT" | "Admin JWT";
  tags: string[];
  tryable: boolean; // only safe read-only or explicitly safe endpoints
  requestBody?: {
    contentType: string;
    example: object;
  };
  responses: {
    status: number;
    description: string;
    example?: object;
  }[];
}

interface TryResult {
  status: number;
  statusText: string;
  latencyMs: number;
  body: string;
  headers: Record<string, string>;
  ok: boolean;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "bg-green-500/15 text-green-700 border-green-200 dark:border-green-800 dark:text-green-400",
  POST: "bg-blue-500/15 text-blue-700 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  PATCH: "bg-orange-500/15 text-orange-700 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  DELETE: "bg-red-500/15 text-red-700 border-red-200 dark:border-red-800 dark:text-red-400",
  PUT: "bg-yellow-500/15 text-yellow-700 border-yellow-200 dark:border-yellow-800 dark:text-yellow-400",
};

const ENDPOINTS: Endpoint[] = [
  // ─── Edge Functions ──────────────────────────────────────────────────────────
  {
    method: "POST",
    path: "/functions/v1/chat",
    summary: "AI Chat Completion (streaming)",
    description:
      "Streams an AI-generated response from Google Gemini 3 Flash. Used by the chat widget. Supports English and Bahasa Indonesia.",
    auth: "None",
    tags: ["Edge Functions"],
    tryable: true,
    requestBody: {
      contentType: "application/json",
      example: {
        messages: [{ role: "user", content: "What is Global Paro?" }],
        lang: "en",
      },
    },
    responses: [
      {
        status: 200,
        description: "Server-Sent Events stream of AI tokens.",
        example: { stream: 'data: {"choices":[{"delta":{"content":"Global Paro is..."}}]}' },
      },
      { status: 429, description: "Rate limited." },
      { status: 402, description: "AI quota exceeded." },
      { status: 500, description: "Server error." },
    ],
  },
  // ─── Candidates ──────────────────────────────────────────────────────────────
  {
    method: "GET",
    path: "/rest/v1/candidates?select=id,full_name,journey_stage,pipeline_status,created_at&limit=5",
    summary: "List Candidates",
    description: "Returns candidate records. Admin-only via RLS. Supports PostgREST filtering, ordering, and pagination.",
    auth: "Admin JWT",
    tags: ["Candidates"],
    tryable: false,
    responses: [
      {
        status: 200,
        description: "Array of candidate objects.",
        example: [{ id: "uuid", full_name: "Siti Rahayu", journey_stage: "New" }],
      },
      { status: 401, description: "Missing or invalid auth." },
    ],
  },
  {
    method: "POST",
    path: "/rest/v1/candidates",
    summary: "Create Candidate (Register)",
    description: "Creates a new candidate. Called during nurse registration at /register.",
    auth: "Anon Key",
    tags: ["Candidates"],
    tryable: false,
    requestBody: {
      contentType: "application/json",
      example: {
        full_name: "Test Nurse",
        whatsapp_number: "+62811111111",
        profession: "Nurse",
        education_level: "Bachelor",
        english_level: "IELTS",
        target_countries: ["Singapore"],
        consent_privacy: true,
        consent_contact: true,
      },
    },
    responses: [
      { status: 201, description: "Candidate created." },
      { status: 409, description: "Duplicate WhatsApp number." },
    ],
  },
  {
    method: "PATCH",
    path: "/rest/v1/candidates?id=eq.{id}",
    summary: "Update Candidate",
    description: "Updates candidate fields. Used by admin dashboard and candidate portal.",
    auth: "Bearer JWT",
    tags: ["Candidates"],
    tryable: false,
    requestBody: {
      contentType: "application/json",
      example: { journey_stage: "Screening", pipeline_status: "screened" },
    },
    responses: [
      { status: 204, description: "Updated successfully." },
      { status: 403, description: "RLS denied." },
    ],
  },
  // ─── Employers ───────────────────────────────────────────────────────────────
  {
    method: "POST",
    path: "/rest/v1/employer_inquiries",
    summary: "Submit Employer Inquiry",
    description: "Creates a new employer inquiry from /employer page.",
    auth: "Anon Key",
    tags: ["Employers"],
    tryable: false,
    requestBody: {
      contentType: "application/json",
      example: {
        institution_name: "Gleneagles Hospital",
        contact_name: "Dr. John Smith",
        institutional_email: "hr@gleneagles.com",
        country: "Singapore",
        nurses_needed: 10,
        specialties_needed: ["ICU", "ER"],
        preferred_timeline: "3-6 months",
      },
    },
    responses: [{ status: 201, description: "Inquiry created." }],
  },
  {
    method: "GET",
    path: "/rest/v1/employer_inquiries",
    summary: "List Employer Inquiries",
    description: "Returns all employer inquiries. Admin-only via RLS.",
    auth: "Admin JWT",
    tags: ["Employers"],
    tryable: false,
    responses: [
      {
        status: 200,
        description: "Array of employer inquiry objects.",
        example: [{ id: "uuid", institution_name: "Gleneagles", employer_status: "New" }],
      },
    ],
  },
  // ─── Webinars ─────────────────────────────────────────────────────────────────
  {
    method: "GET",
    path: "/rest/v1/webinars?is_published=eq.true&order=order_index.asc",
    summary: "List Published Webinars",
    description: "Returns all published webinars. Used on /programs/webinar. Public endpoint.",
    auth: "Anon Key",
    tags: ["Webinars"],
    tryable: true,
    responses: [
      {
        status: 200,
        description: "Array of webinar objects.",
        example: [{ id: "uuid", title: "Working as a Nurse in Singapore", cost: "FREE" }],
      },
    ],
  },
  {
    method: "POST",
    path: "/rest/v1/webinar_registrations",
    summary: "Register for Webinar",
    description: "Submits a webinar registration linked to a webinar_id.",
    auth: "Anon Key",
    tags: ["Webinars"],
    tryable: false,
    requestBody: {
      contentType: "application/json",
      example: {
        webinar_id: "replace-with-real-uuid",
        full_name: "Dewi Susanti",
        email: "dewi@example.com",
        whatsapp: "+6289876543210",
      },
    },
    responses: [{ status: 201, description: "Registration created." }],
  },
  // ─── Content ─────────────────────────────────────────────────────────────────
  {
    method: "GET",
    path: "/rest/v1/content?is_published=eq.true&order=publish_date.desc&limit=5",
    summary: "List Published Articles",
    description: "Returns published news and success story articles. Used on /news.",
    auth: "Anon Key",
    tags: ["Content"],
    tryable: true,
    responses: [
      {
        status: 200,
        description: "Array of content objects.",
        example: [{ id: "uuid", title: "Indonesian Nurses in Singapore", category: "Career Abroad" }],
      },
    ],
  },
  {
    method: "GET",
    path: "/rest/v1/success_stories?is_published=eq.true&order=publish_date.desc&limit=5",
    summary: "List Success Stories",
    description: "Returns published nurse success stories. Used on /success-stories.",
    auth: "Anon Key",
    tags: ["Content"],
    tryable: true,
    responses: [
      {
        status: 200,
        description: "Array of success story objects.",
        example: [{ id: "uuid", nurse_name: "Sari", destination_country: "Singapore" }],
      },
    ],
  },
  // ─── Chat ─────────────────────────────────────────────────────────────────────
  {
    method: "POST",
    path: "/rest/v1/chat_escalation_tickets",
    summary: "Create Escalation Ticket",
    description: "Creates a human escalation ticket when user types 'talk to human'.",
    auth: "Anon Key",
    tags: ["Chat"],
    tryable: false,
    requestBody: {
      contentType: "application/json",
      example: {
        issue_summary: "Need help with STR verification",
        name: "Rina",
        email: "rina@example.com",
        whatsapp: "+6281111222333",
        priority: "Normal",
      },
    },
    responses: [{ status: 201, description: "Ticket created." }],
  },
  {
    method: "GET",
    path: "/rest/v1/faq_items?order=priority.asc&limit=10",
    summary: "List FAQ Items",
    description: "Returns FAQ entries ordered by priority. Used on /help.",
    auth: "Anon Key",
    tags: ["Chat"],
    tryable: true,
    responses: [
      {
        status: 200,
        description: "Array of FAQ objects.",
        example: [{ id: "uuid", question: "Is it free?", category: "General" }],
      },
    ],
  },
  // ─── Auth ─────────────────────────────────────────────────────────────────────
  {
    method: "POST",
    path: "/auth/v1/signup",
    summary: "Register User Account",
    description: "Creates a new authenticated user. Email confirmation is required.",
    auth: "Anon Key",
    tags: ["Auth"],
    tryable: false,
    requestBody: {
      contentType: "application/json",
      example: {
        email: "nurse@example.com",
        password: "SecurePassword123!",
        data: { display_name: "Siti Rahayu" },
      },
    },
    responses: [
      { status: 200, description: "User created. Confirmation email sent." },
      { status: 422, description: "Invalid email or weak password." },
    ],
  },
  {
    method: "POST",
    path: "/auth/v1/token?grant_type=password",
    summary: "Login (Email + Password)",
    description: "Authenticates user and returns JWT access + refresh tokens.",
    auth: "Anon Key",
    tags: ["Auth"],
    tryable: false,
    requestBody: {
      contentType: "application/json",
      example: { email: "nurse@example.com", password: "SecurePassword123!" },
    },
    responses: [
      {
        status: 200,
        description: "JWT tokens returned.",
        example: { access_token: "eyJhbGci...", token_type: "bearer", expires_in: 3600 },
      },
      { status: 400, description: "Invalid credentials." },
    ],
  },
];

const ALL_TAGS = ["Edge Functions", "Auth", "Candidates", "Employers", "Webinars", "Content", "Chat"] as const;

// ─── CopyButton ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy">
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ─── TryItOut panel ───────────────────────────────────────────────────────────
function TryItOut({ endpoint }: { endpoint: Endpoint }) {
  const [bodyText, setBodyText] = useState(
    endpoint.requestBody ? JSON.stringify(endpoint.requestBody.example, null, 2) : ""
  );
  const [customToken, setCustomToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TryResult | null>(null);
  const [bodyError, setBodyError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const needsToken = endpoint.auth === "Bearer JWT" || endpoint.auth === "Admin JWT";

  const buildHeaders = (): Record<string, string> => {
    const h: Record<string, string> = {
      apikey: ANON_KEY,
      "Content-Type": "application/json",
    };
    if (needsToken && customToken) {
      h["Authorization"] = `Bearer ${customToken}`;
    } else if (endpoint.auth === "Anon Key" || endpoint.auth === "None") {
      h["Authorization"] = `Bearer ${ANON_KEY}`;
    }
    // PostgREST — return representation on insert
    if (endpoint.method === "POST" && endpoint.path.startsWith("/rest/v1/")) {
      h["Prefer"] = "return=representation";
    }
    return h;
  };

  const handleRun = async () => {
    // Validate JSON body if present
    if (endpoint.requestBody && endpoint.method !== "GET") {
      try {
        JSON.parse(bodyText);
        setBodyError(null);
      } catch {
        setBodyError("Invalid JSON — please fix before running.");
        return;
      }
    }

    setLoading(true);
    setResult(null);
    abortRef.current = new AbortController();
    const start = performance.now();

    try {
      const url = `${BASE_URL}${endpoint.path}`;
      const headers = buildHeaders();

      // For streaming (chat), collect the SSE stream
      if (endpoint.path.includes("/functions/v1/chat")) {
        const res = await fetch(url, {
          method: endpoint.method,
          headers,
          body: bodyText || undefined,
          signal: abortRef.current.signal,
        });

        const latencyMs = Math.round(performance.now() - start);
        const resHeaders: Record<string, string> = {};
        res.headers.forEach((v, k) => { resHeaders[k] = v; });

        if (!res.ok) {
          const errorText = await res.text();
          setResult({ status: res.status, statusText: res.statusText, latencyMs, body: errorText, headers: resHeaders, ok: false });
          setLoading(false);
          return;
        }

        // Read SSE stream and collect first few chunks
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let collected = "";
        let chunkCount = 0;

        if (reader) {
          while (chunkCount < 30) {
            const { done, value } = await reader.read();
            if (done) break;
            collected += decoder.decode(value, { stream: true });
            chunkCount++;
          }
          reader.cancel();
        }

        // Parse SSE to extract text content
        const lines = collected.split("\n").filter((l) => l.startsWith("data: ") && l !== "data: [DONE]");
        let fullText = "";
        for (const line of lines) {
          try {
            const json = JSON.parse(line.replace("data: ", ""));
            fullText += json?.choices?.[0]?.delta?.content ?? "";
          } catch { /* skip */ }
        }

        setResult({
          status: res.status,
          statusText: res.statusText,
          latencyMs,
          body: JSON.stringify({ ai_response: fullText || "(streaming — no text extracted)", raw_chunks: chunkCount }, null, 2),
          headers: resHeaders,
          ok: true,
        });

      } else {
        // Standard REST call
        const res = await fetch(url, {
          method: endpoint.method,
          headers,
          body: endpoint.requestBody && endpoint.method !== "GET" ? bodyText : undefined,
          signal: abortRef.current.signal,
        });

        const latencyMs = Math.round(performance.now() - start);
        const resHeaders: Record<string, string> = {};
        res.headers.forEach((v, k) => { resHeaders[k] = v; });

        let body = "";
        try {
          const text = await res.text();
          body = text ? JSON.stringify(JSON.parse(text), null, 2) : "(empty response)";
        } catch {
          body = "(could not parse response)";
        }

        setResult({ status: res.status, statusText: res.statusText, latencyMs, body, headers: resHeaders, ok: res.ok });
      }
    } catch (e: unknown) {
      const latencyMs = Math.round(performance.now() - start);
      const msg = e instanceof Error ? e.message : "Unknown error";
      setResult({ status: 0, statusText: "Network Error", latencyMs, body: msg, headers: {}, ok: false });
    } finally {
      setLoading(false);
    }
  };

  const handleAbort = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const statusColor = result
    ? result.ok
      ? "text-primary border-primary/30 bg-primary/5"
      : result.status >= 400
      ? "text-destructive border-destructive/30 bg-destructive/5"
      : "text-muted-foreground border-border bg-muted"
    : "";

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/3 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">Try it out</span>
        {endpoint.auth !== "None" && endpoint.auth !== "Anon Key" && (
          <Badge variant="outline" className="text-[10px] ml-auto border-destructive/40 text-destructive">
            Requires auth token
          </Badge>
        )}
      </div>

      {/* JWT Token input for protected endpoints */}
      {needsToken && (
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Authorization Bearer Token <span className="text-destructive">*</span>
          </label>
          <input
            type="password"
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
            placeholder="Paste your JWT access_token here..."
            className="w-full text-xs font-mono rounded border bg-background px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      {/* Editable request body */}
      {endpoint.requestBody && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Request Body (editable)</label>
            <button
              onClick={() => setBodyText(JSON.stringify(endpoint.requestBody!.example, null, 2))}
              className="text-[10px] text-primary hover:underline"
            >
              Reset to example
            </button>
          </div>
          <Textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="font-mono text-xs min-h-[120px] resize-y bg-background"
            spellCheck={false}
          />
          {bodyError && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {bodyError}
            </p>
          )}
        </div>
      )}

      {/* Run button */}
      <div className="flex items-center gap-2">
        {loading ? (
          <Button size="sm" variant="outline" onClick={handleAbort} className="gap-1.5 text-xs">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Running… (click to cancel)
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleRun}
            disabled={needsToken && !customToken}
            className="gap-1.5 text-xs"
          >
            <Play className="h-3.5 w-3.5" />
            Send Request
          </Button>
        )}
        {result && (
          <span className={`text-xs font-mono px-2 py-0.5 rounded border font-semibold flex items-center gap-1 ${statusColor}`}>
            {result.ok ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
            {result.status} {result.statusText}
          </span>
        )}
        {result && (
          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
            <Clock className="h-3 w-3" />
            {result.latencyMs} ms
          </span>
        )}
      </div>

      {/* Response */}
      {result && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Response</p>
            <CopyButton text={result.body} />
          </div>
          <div className="relative bg-muted rounded overflow-hidden max-h-80 overflow-y-auto">
            <pre className="text-xs font-mono p-3 text-foreground whitespace-pre-wrap break-all">
              {result.body}
            </pre>
          </div>
          {/* Response headers (collapsed) */}
          <details className="mt-1">
            <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground select-none">
              Response Headers ({Object.keys(result.headers).length})
            </summary>
            <div className="mt-1 bg-muted rounded p-2 max-h-32 overflow-y-auto">
              {Object.entries(result.headers).map(([k, v]) => (
                <div key={k} className="text-[10px] font-mono">
                  <span className="text-primary">{k}</span>: {v}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

// ─── EndpointCard ─────────────────────────────────────────────────────────────
function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false);
  const [tryOpen, setTryOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full text-left">
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors">
          <span
            className={`inline-flex items-center justify-center rounded px-2.5 py-0.5 text-xs font-bold border font-mono min-w-[58px] ${METHOD_COLORS[endpoint.method]}`}
          >
            {endpoint.method}
          </span>
          <code className="text-sm text-foreground font-mono flex-1 truncate">{endpoint.path}</code>
          <span className="text-sm text-muted-foreground hidden md:block flex-shrink-0">{endpoint.summary}</span>
          {endpoint.tryable && (
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] border-primary/30 text-primary bg-primary/5 shrink-0">
              Try
            </Badge>
          )}
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-1 mb-3 rounded-lg border bg-card p-5 space-y-4">
          {/* Summary & Auth */}
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex-1">
              <p className="font-semibold text-foreground">{endpoint.summary}</p>
              <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
            </div>
            <Badge variant="outline" className="shrink-0">
              🔑 {endpoint.auth}
            </Badge>
          </div>

          {/* Full URL */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Full URL</p>
            <div className="flex items-center gap-2 bg-muted rounded px-3 py-2">
              <code className="text-xs font-mono text-foreground flex-1 break-all">
                {BASE_URL}{endpoint.path}
              </code>
              <CopyButton text={`${BASE_URL}${endpoint.path}`} />
            </div>
          </div>

          {/* Request Body (static) */}
          {endpoint.requestBody && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Request Body — <span className="font-normal normal-case">{endpoint.requestBody.contentType}</span>
              </p>
              <div className="relative bg-muted rounded overflow-hidden">
                <div className="absolute top-2 right-2">
                  <CopyButton text={JSON.stringify(endpoint.requestBody.example, null, 2)} />
                </div>
                <pre className="text-xs font-mono p-3 pr-8 overflow-x-auto text-foreground">
                  {JSON.stringify(endpoint.requestBody.example, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Expected Responses */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Expected Responses</p>
            <div className="space-y-2">
              {endpoint.responses.map((r) => (
                <div key={r.status}>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                        r.status >= 200 && r.status < 300
                          ? "bg-primary/10 text-primary"
                          : r.status >= 400
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="text-sm text-muted-foreground">{r.description}</span>
                  </div>
                  {r.example && (
                    <div className="relative bg-muted rounded overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <CopyButton text={JSON.stringify(r.example, null, 2)} />
                      </div>
                      <pre className="text-xs font-mono p-3 pr-8 overflow-x-auto text-foreground">
                        {JSON.stringify(r.example, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Try it out */}
          {endpoint.tryable ? (
            <div>
              {!tryOpen ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTryOpen(true)}
                  className="gap-2 text-xs border-primary/30 text-primary hover:bg-primary/5"
                >
                  <Play className="h-3.5 w-3.5" />
                  Try it out
                </Button>
              ) : (
                <TryItOut endpoint={endpoint} />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded px-3 py-2 border border-dashed">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Try it out disabled — this endpoint writes data or requires an Admin JWT.
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ApiDocs() {
  const [activeTag, setActiveTag] = useState<string>("All");

  const filtered =
    activeTag === "All"
      ? ENDPOINTS
      : ENDPOINTS.filter((e) => e.tags.includes(activeTag));

  const grouped: Record<string, Endpoint[]> = {};
  filtered.forEach((e) => {
    const tag = e.tags[0];
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push(e);
  });

  const tryableCount = ENDPOINTS.filter((e) => e.tryable).length;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
            <Badge className="bg-primary/15 text-primary border-primary/30">v1.0</Badge>
          </div>
          <p className="text-muted-foreground text-base max-w-2xl">
            Interactive reference for all Global Paro backend endpoints.{" "}
            <span className="text-primary font-medium">{tryableCount} endpoints</span> support live "Try it out" requests directly from this page.
          </p>

          {/* Base URL */}
          <div className="mt-4 flex items-center gap-2 bg-muted rounded-lg px-4 py-2.5 max-w-lg">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">Base URL</span>
            <code className="text-sm font-mono text-foreground flex-1 truncate">{BASE_URL}</code>
            <CopyButton text={BASE_URL} />
          </div>

          {/* Auth info */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Anon Key", desc: "Public requests: include apikey + Authorization: Bearer <anon-key> headers." },
              { label: "Bearer JWT", desc: "User session token returned by the Auth login endpoint." },
              { label: "Admin JWT", desc: "Admin user JWT — validated server-side by has_role() RLS function." },
            ].map((a) => (
              <div key={a.label} className="rounded-lg border p-3 bg-muted">
                <p className="text-xs font-bold text-foreground">{a.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
              </div>
            ))}
          </div>

          {/* Try it out legend */}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
            <Play className="h-3.5 w-3.5 text-primary shrink-0" />
            Endpoints marked{" "}
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5 mx-1">Try</Badge>
            support live requests — click an endpoint, then press <strong className="text-foreground mx-1">Try it out</strong> to send a real API call and see the response.
          </div>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...ALL_TAGS].map((tag) => (
            <Button
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTag(tag)}
              className="text-xs"
            >
              {tag}
              <span className="ml-1.5 opacity-60">
                {tag === "All"
                  ? ENDPOINTS.length
                  : ENDPOINTS.filter((e) => e.tags.includes(tag)).length}
              </span>
            </Button>
          ))}
        </div>

        {/* Endpoint groups */}
        <div className="space-y-8">
          {Object.entries(grouped).map(([tag, endpoints]) => (
            <div key={tag}>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                {tag}
                <span className="text-sm font-normal text-muted-foreground">
                  ({endpoints.length} endpoint{endpoints.length !== 1 ? "s" : ""}
                  {endpoints.filter((e) => e.tryable).length > 0 &&
                    ` · ${endpoints.filter((e) => e.tryable).length} tryable`}
                  )
                </span>
              </h2>
              <div className="space-y-2">
                {endpoints.map((ep, i) => (
                  <EndpointCard key={i} endpoint={ep} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <a
              href="https://supabase.com/docs/guides/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Supabase PostgREST <ExternalLink className="h-3 w-3" />
            </a>
            {" "}· All database endpoints follow the{" "}
            <a
              href="https://postgrest.org/en/stable/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              PostgREST spec <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
