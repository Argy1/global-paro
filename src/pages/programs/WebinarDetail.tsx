import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2, Mail, Calendar, Clock, MapPin, Share2,
  CheckCircle2, ChevronLeft, User, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import webinarIcon from "@/assets/webinar-icon.png";
import gratisBadge from "@/assets/gratis-badge.png";
import shareIcon from "@/assets/share-icon.png";
import { SUPPORT_EMAIL } from "@/lib/contact";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Webinar {
  id: string;
  slug: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  topic: string | null;
  cost: string;
  schedule: string | null;
  contact_email: string | null;
  register_link: string | null;
  is_featured: boolean;
  learn_items: string[];
  cover_image_url: string | null;
  event_date: string | null;
  speaker_name: string | null;
  speaker_bio: string | null;
  speaker_photo_url: string | null;
  order_index: number;
}

// ─── Registration form schema ─────────────────────────────────────────────────
const regSchema = z.object({
  full_name: z.string().trim().min(2, "Minimal 2 karakter"),
  email: z.string().trim().email("Email tidak valid"),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Nomor terlalu pendek")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor tidak valid"),
});
type RegForm = z.infer<typeof regSchema>;

// ─── Share helper ─────────────────────────────────────────────────────────────
async function handleShare(title: string) {
  const url = window.location.href;
  if (navigator.share) {
    await navigator.share({ title, text: `Yuk ikut webinar gratis: ${title}`, url });
  } else {
    await navigator.clipboard.writeText(url);
    toast.success("Link disalin ke clipboard!");
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WebinarDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: webinar, isLoading } = useQuery({
    queryKey: ["webinar_detail", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webinars" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Webinar | null;
    },
  });

  const form = useForm<RegForm>({ resolver: zodResolver(regSchema) });
  const [submitted, setSubmitted] = useState(false);

  // ── Social / OG meta tags ──────────────────────────────────────────────────
  useEffect(() => {
    if (!webinar) return;
    const siteUrl = "https://globalparo.lovable.app";
    const pageUrl = `${siteUrl}/programs/webinar/${webinar.slug}`;
    const suffix = " | Global PARO";
    const title = webinar.title + (webinar.subtitle ? ` — ${webinar.subtitle}` : "") + suffix;
    const desc = webinar.description ||
      `Daftar webinar gratis: ${webinar.title}. ${webinar.topic ?? ""} — globalparo.lovable.app`;

    const setMeta = (attr: string, name: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };

    document.title = title;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", pageUrl);
    if (webinar.cover_image_url) {
      setMeta("property", "og:image", webinar.cover_image_url);
      setMeta("property", "og:image:width", "1200");
      setMeta("property", "og:image:height", "630");
      setMeta("name", "twitter:image", webinar.cover_image_url);
    }
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", desc);
  }, [webinar]);

  const register = useMutation({
    mutationFn: async (values: RegForm) => {
      const { error } = await supabase.from("webinar_registrations" as any).insert({
        webinar_id: webinar!.id,
        full_name: values.full_name,
        email: values.email,
        whatsapp: values.whatsapp,
      });
      if (error) throw error;
    },
    onSuccess: () => setSubmitted(true),
    onError: (e: any) => toast.error(e.message ?? "Gagal mendaftar. Coba lagi."),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!webinar) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
          <h1 className="text-2xl font-bold text-foreground">Webinar tidak ditemukan</h1>
          <p className="text-muted-foreground">Link ini mungkin sudah tidak aktif.</p>
          <Button variant="outline" onClick={() => navigate("/programs/webinar")}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke daftar webinar
          </Button>
        </div>
      </Layout>
    );
  }

  const isFree = !webinar.cost || webinar.cost.toUpperCase() === "FREE" || webinar.cost.toUpperCase() === "GRATIS";

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: "#03d4db" }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10" style={{ background: "#03d4db" }} />

        <div className="container relative max-w-4xl">
          {/* Back link */}
          <Link
            to="/programs/webinar"
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Semua Webinar
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left text */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {isFree && (
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    GRATIS
                  </span>
                )}
                {webinar.is_featured && (
                  <span className="bg-amber-400/90 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
                {webinar.title}
              </h1>
              {webinar.subtitle && (
                <p className="text-xl font-semibold text-white/80 mb-4">{webinar.subtitle}</p>
              )}
              {webinar.description && (
                <p className="text-white/75 text-sm leading-relaxed">{webinar.description}</p>
              )}

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3 mt-5">
                {webinar.event_date && (
                  <span className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 rounded-full px-3 py-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(webinar.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
                {webinar.schedule && (
                  <span className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 rounded-full px-3 py-1">
                    <Clock className="h-3.5 w-3.5" />
                    {webinar.schedule}
                  </span>
                )}
                {webinar.topic && (
                  <span className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 rounded-full px-3 py-1">
                    <Tag className="h-3.5 w-3.5" />
                    {webinar.topic}
                  </span>
                )}
              </div>
            </div>

            {/* Right: image/icon */}
            <div className="flex justify-center">
              <div className="relative">
                {isFree && (
                  <img src={gratisBadge} alt="GRATIS" className="absolute -top-8 -left-8 z-10 w-24 h-24 object-contain drop-shadow-lg" />
                )}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                  {webinar.cover_image_url ? (
                    <img src={webinar.cover_image_url} alt={webinar.title} className="h-36 w-auto mx-auto object-contain" />
                  ) : (
                    <img src={webinarIcon} alt="Webinar" className="h-36 w-auto mx-auto object-contain" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main body: two columns ────────────────────────────────────── */}
      <section className="py-14 bg-muted">
        <div className="container max-w-5xl grid lg:grid-cols-3 gap-8">

          {/* ── LEFT: What you'll learn + Speaker ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* What you'll learn */}
            {webinar.learn_items?.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-foreground mb-5">Apa yang Akan Kamu Pelajari</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {webinar.learn_items.map((item) => (
                    <div key={item} className="flex items-start gap-3 bg-muted/60 rounded-xl p-3.5">
                      <div
                        className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold"
                        style={{ background: "#03989E" }}
                      >
                        ✓
                      </div>
                      <p className="text-sm text-foreground font-medium leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speaker card */}
            {webinar.speaker_name && (
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-foreground mb-5">Pembicara</h2>
                <div className="flex items-start gap-4">
                  {webinar.speaker_photo_url ? (
                    <img
                      src={webinar.speaker_photo_url}
                      alt={webinar.speaker_name}
                      className="h-20 w-20 rounded-full object-cover border-2 shrink-0"
                      style={{ borderColor: "#03989E" }}
                    />
                  ) : (
                    <div
                      className="h-20 w-20 rounded-full flex items-center justify-center shrink-0 text-white text-2xl font-bold"
                      style={{ background: "linear-gradient(135deg, #015779, #03989E)" }}
                    >
                      {webinar.speaker_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-foreground">{webinar.speaker_name}</p>
                    {webinar.speaker_bio && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{webinar.speaker_bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Info card + Registration form ── */}
          <div className="space-y-6">

            {/* Quick info card */}
            <div className="bg-card rounded-2xl border-2 overflow-hidden shadow-md sticky top-24" style={{ borderColor: "#03989E" }}>
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-extrabold text-foreground text-lg">Detail Webinar</h3>
              </div>

              {/* Teal bar: contact */}
              <div className="px-6 py-3 text-white text-sm font-semibold flex items-center gap-2" style={{ background: "#03989E" }}>
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${SUPPORT_EMAIL}`} className="underline truncate">
                  {SUPPORT_EMAIL}
                </a>
              </div>

              <div className="px-6 py-5 space-y-3 text-sm">
                {webinar.topic && (
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wide font-semibold mb-0.5">Topik</span>
                    <span className="text-foreground">{webinar.topic}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wide font-semibold mb-0.5">Biaya</span>
                  <span className="font-bold text-base" style={{ color: "#03989E" }}>{webinar.cost}</span>
                </div>
                {webinar.schedule && (
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wide font-semibold mb-0.5">Jadwal</span>
                    <span className="text-foreground">{webinar.schedule}</span>
                  </div>
                )}
                {webinar.event_date && (
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wide font-semibold mb-0.5">Tanggal</span>
                    <span className="text-foreground">
                      {new Date(webinar.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>

              {/* Share button */}
              <div className="px-6 pb-5">
                <button
                  onClick={() => handleShare(webinar.title)}
                  className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Share2 className="h-4 w-4" /> Bagikan Webinar
                </button>
              </div>
            </div>

            {/* ── Registration form ── */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-extrabold text-foreground text-lg mb-1">Daftar Sekarang</h3>
              <p className="text-xs text-muted-foreground mb-5">Gratis! Isi data di bawah untuk konfirmasi tempat.</p>

              {submitted ? (
                <div className="text-center py-6 space-y-3 animate-fade-in">
                  <CheckCircle2 className="h-12 w-12 mx-auto" style={{ color: "#03989E" }} />
                  <p className="font-bold text-foreground">Pendaftaran Berhasil! 🎉</p>
                  <p className="text-sm text-muted-foreground">
                    Kami akan menghubungi kamu via WhatsApp dengan detail acara.
                  </p>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit((v) => register.mutate(v))} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg_name">Nama Lengkap *</Label>
                    <Input id="reg_name" placeholder="Nama lengkapmu" {...form.register("full_name")} />
                    {form.formState.errors.full_name && (
                      <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg_email">Email *</Label>
                    <Input id="reg_email" type="email" placeholder="email@contoh.com" {...form.register("email")} />
                    {form.formState.errors.email && (
                      <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg_wa">Nomor WhatsApp *</Label>
                    <Input id="reg_wa" type="tel" placeholder="628xxxxxxxxxx" {...form.register("whatsapp")} />
                    {form.formState.errors.whatsapp && (
                      <p className="text-xs text-destructive">{form.formState.errors.whatsapp.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={register.isPending}
                    className="w-full h-11 font-bold text-white gap-2"
                    style={{
                      background: "linear-gradient(180deg, #03d4db 0%, #03989E 40%, #027f84 100%)",
                      boxShadow: "0 4px 14px rgba(3,152,158,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
                      border: "1.5px solid #03b8be",
                    }}
                  >
                    {register.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {register.isPending ? "Mendaftarkan..." : "Konfirmasi Tempat Saya"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Data kamu aman. Tidak ada biaya yang dikenakan.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA bar ────────────────────────────────────────────── */}
      <section className="py-5" style={{ background: "#015779" }}>
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-bold text-lg">Amankan tempatmu sekarang — gratis!</p>
          <div className="flex items-center gap-3">
            <a
              href="#reg_name"
              onClick={(e) => { e.preventDefault(); document.getElementById("reg_name")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center justify-center px-8 h-12 rounded-xl font-bold text-white text-base transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(180deg, #03d4db 0%, #03989E 40%, #027f84 100%)",
                boxShadow: "0 4px 14px rgba(3,152,158,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                border: "1.5px solid #03b8be",
              }}
            >
              Daftar Gratis
            </a>
            <button onClick={() => handleShare(webinar.title)} className="h-12 w-12 flex items-center justify-center hover:opacity-80 transition-opacity">
              <img src={shareIcon} alt="Share" className="h-10 w-10 object-contain" />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// Need React for useState

