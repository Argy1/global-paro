import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ContentType = "QuickstartChapter" | "News" | "SuccessStory";

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  tags: string[];
  cover_image_url: string | null;
  published: boolean;
  publish_date: string | null;
  country_focus: string | null;
  created_at: string;
  updated_at: string;
}

const emptyItem = (type: ContentType): Partial<ContentItem> => ({
  type,
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  tags: [],
  cover_image_url: "",
  published: false,
  publish_date: new Date().toISOString().slice(0, 10),
  country_focus: "",
});

export default function AdminContentManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Partial<ContentItem> | null>(null);

  const { data: allItems, isLoading } = useQuery({
    queryKey: ["admin_content_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("content_items" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ContentItem[];
    },
  });

  const upsertItem = useMutation({
    mutationFn: async (item: Partial<ContentItem>) => {
      const payload = {
        type: item.type,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || null,
        body: item.body || "",
        tags: item.tags || [],
        cover_image_url: item.cover_image_url || null,
        published: item.published ?? false,
        publish_date: item.publish_date || null,
        country_focus: item.country_focus || null,
      };
      if (item.id) {
        const { error } = await supabase.from("content_items" as any).update(payload).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("content_items" as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_content_items"] });
      queryClient.invalidateQueries({ queryKey: ["content_items"] });
      setEditing(null);
      toast({ title: "Content saved" });
    },
    onError: (e: any) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content_items" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_content_items"] });
      toast({ title: "Deleted" });
    },
  });

  const togglePublish = (item: ContentItem) => {
    upsertItem.mutate({ ...item, published: !item.published });
  };

  const news = allItems?.filter((i) => i.type === "News") || [];
  const chapters = allItems?.filter((i) => i.type === "QuickstartChapter") || [];
  const stories = allItems?.filter((i) => i.type === "SuccessStory") || [];

  if (editing) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-foreground">{editing.id ? "Edit" : "New"} Content</h1>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
        </div>
        <div className="max-w-2xl space-y-4">
          <div>
            <Label className="font-bold">Title</Label>
            <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div>
            <Label className="font-bold">Slug</Label>
            <Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="url-friendly-slug" />
          </div>
          <div>
            <Label className="font-bold">Excerpt</Label>
            <Textarea value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} />
          </div>
          <div>
            <Label className="font-bold">Body (Markdown/HTML)</Label>
            <Textarea value={editing.body || ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} rows={12} className="font-mono text-sm" />
          </div>
          {editing.type === "News" && (
            <>
              <div>
                <Label className="font-bold">Tags (comma-separated)</Label>
                <Input value={(editing.tags || []).join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
              </div>
              <div>
                <Label className="font-bold">Country Focus</Label>
                <Input value={editing.country_focus || ""} onChange={(e) => setEditing({ ...editing, country_focus: e.target.value })} />
              </div>
            </>
          )}
          {editing.type === "SuccessStory" && (
            <div>
              <Label className="font-bold">Cover Image URL</Label>
              <Input value={editing.cover_image_url || ""} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} />
            </div>
          )}
          <div>
            <Label className="font-bold">Publish Date</Label>
            <Input type="date" value={editing.publish_date || ""} onChange={(e) => setEditing({ ...editing, publish_date: e.target.value })} />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="cta"
              onClick={() => upsertItem.mutate(editing)}
              disabled={upsertItem.isPending || !editing.title || !editing.slug}
            >
              {upsertItem.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Save
            </Button>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.published ?? false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
              Published
            </label>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Content Manager</h1>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <Tabs defaultValue="news">
          <TabsList className="mb-6">
            <TabsTrigger value="news">News ({news.length})</TabsTrigger>
            <TabsTrigger value="chapters">Quickstart ({chapters.length})</TabsTrigger>
            <TabsTrigger value="stories">Success Stories ({stories.length})</TabsTrigger>
          </TabsList>

          {[
            { key: "news", items: news, type: "News" as ContentType },
            { key: "chapters", items: chapters, type: "QuickstartChapter" as ContentType },
            { key: "stories", items: stories, type: "SuccessStory" as ContentType },
          ].map((section) => (
            <TabsContent key={section.key} value={section.key}>
              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={() => setEditing(emptyItem(section.type))}>
                  <Plus className="h-4 w-4 mr-1" /> New {section.type === "QuickstartChapter" ? "Chapter" : section.type === "SuccessStory" ? "Story" : "Article"}
                </Button>
              </div>
              <div className="bg-card rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {["Title", "Tags", "Published", "Date", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium text-foreground">{item.title}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.tags?.join(", ") || "—"}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => togglePublish(item)} title={item.published ? "Unpublish" : "Publish"}>
                            {item.published ? <Eye className="h-4 w-4 text-accent" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                          </Button>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{item.publish_date ? new Date(item.publish_date).toLocaleDateString() : "—"}</td>
                        <td className="px-4 py-3 flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditing(item)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete this item?")) deleteItem.mutate(item.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {section.items.length === 0 && <p className="text-center py-8 text-muted-foreground">No items yet.</p>}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </AdminLayout>
  );
}
