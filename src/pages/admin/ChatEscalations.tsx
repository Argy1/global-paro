import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock, CheckCircle, AlertTriangle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  name: string | null;
  email: string | null;
  whatsapp: string | null;
  issue_summary: string;
  priority: "Low" | "Normal" | "High";
  status: "Open" | "Assigned" | "In Progress" | "Resolved";
  assigned_to: string | null;
  created_at: string;
  first_response_at: string | null;
  resolved_at: string | null;
  conversation_id: string | null;
}

function timeElapsed(created: string): string {
  const ms = Date.now() - new Date(created).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m`;
  return `${Math.floor(hrs / 24)}d ${hrs % 24}h`;
}

function slaMet(created: string, firstResponse: string | null): "green" | "red" | "pending" {
  if (firstResponse) {
    const diff = new Date(firstResponse).getTime() - new Date(created).getTime();
    return diff <= 15 * 60 * 1000 ? "green" : "red";
  }
  const elapsed = Date.now() - new Date(created).getTime();
  return elapsed <= 15 * 60 * 1000 ? "pending" : "red";
}

export default function AdminChatEscalations() {
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["admin_escalation_tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_escalation_tickets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Ticket[];
    },
    refetchInterval: 30000,
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from("chat_escalation_tickets")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_escalation_tickets"] });
      toast({ title: "Ticket updated" });
    },
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  const handleStatusChange = (id: string, status: string) => {
    const updates: Record<string, any> = { status };
    if (status === "In Progress" || status === "Assigned") {
      // Set first_response_at if not already set
      const ticket = tickets?.find((t) => t.id === id);
      if (ticket && !ticket.first_response_at) {
        updates.first_response_at = new Date().toISOString();
      }
    }
    if (status === "Resolved") {
      updates.resolved_at = new Date().toISOString();
    }
    updateTicket.mutate({ id, updates });
  };

  const handleAssign = (id: string, agent: string) => {
    const updates: Record<string, any> = { assigned_to: agent || null };
    const ticket = tickets?.find((t) => t.id === id);
    if (ticket && !ticket.first_response_at && agent) {
      updates.first_response_at = new Date().toISOString();
      updates.status = "Assigned";
    }
    updateTicket.mutate({ id, updates });
  };

  const openTickets = tickets?.filter((t) => t.status !== "Resolved") ?? [];
  const resolvedTickets = tickets?.filter((t) => t.status === "Resolved") ?? [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Chat Escalations</h1>
          <p className="text-sm text-muted-foreground">SLA target: first response within 15 minutes</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-accent"><span className="h-2 w-2 rounded-full bg-accent inline-block" /> Within SLA</span>
          <span className="flex items-center gap-1 text-destructive"><span className="h-2 w-2 rounded-full bg-destructive inline-block" /> SLA Breached</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-8">
          {/* Open tickets */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Open Tickets ({openTickets.length})</h2>
            {openTickets.length > 0 ? (
              <div className="space-y-4">
                {openTickets.map((t) => {
                  const sla = slaMet(t.created_at, t.first_response_at);
                  return (
                    <div key={t.id} className="bg-card rounded-xl p-5 border border-border">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {/* SLA indicator */}
                            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${sla === "green" ? "bg-accent" : sla === "red" ? "bg-destructive animate-pulse" : "bg-muted-foreground/40"}`} />
                            <span className="font-bold text-foreground text-sm truncate">{t.name || "Anonymous"}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.priority === "High" ? "bg-destructive/10 text-destructive" : t.priority === "Normal" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                              {t.priority}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            {t.email && <span>{t.email}</span>}
                            {t.whatsapp && <span>WA: {t.whatsapp}</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {timeElapsed(t.created_at)} ago
                          </div>
                          <p className="text-[10px] text-muted-foreground">{new Date(t.created_at).toLocaleString()}</p>
                        </div>
                      </div>

                      <p className="text-sm text-foreground mb-4 bg-muted rounded-lg p-3">{t.issue_summary}</p>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Status */}
                        <Select value={t.status} onValueChange={(v) => handleStatusChange(t.id, v)}>
                          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Assigned">Assigned</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Assign */}
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <Input
                            placeholder="Assign to agent"
                            defaultValue={t.assigned_to ?? ""}
                            onBlur={(e) => handleAssign(t.id, e.target.value)}
                            className="w-[150px] h-8 text-xs"
                            maxLength={100}
                          />
                        </div>

                        {/* SLA info */}
                        {t.first_response_at && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-accent" />
                            First response: {new Date(t.first_response_at).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border">No open tickets — great job! 🎉</p>
            )}
          </div>

          {/* Resolved tickets */}
          {resolvedTickets.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Resolved ({resolvedTickets.length})</h2>
              <div className="space-y-3">
                {resolvedTickets.slice(0, 20).map((t) => {
                  const sla = slaMet(t.created_at, t.first_response_at);
                  return (
                    <div key={t.id} className="bg-card rounded-xl p-4 border border-border opacity-75">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${sla === "green" ? "bg-accent" : "bg-destructive"}`} />
                          <span className="text-sm font-medium text-foreground">{t.name || "Anonymous"}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{t.issue_summary}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {t.assigned_to && <span>Agent: {t.assigned_to}</span>}
                          {t.resolved_at && <span>Resolved: {new Date(t.resolved_at).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
