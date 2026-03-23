import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Mail, Loader2, Calendar, Clock, ArrowRight } from "lucide-react";
import webinarIcon from "@/assets/webinar-icon.png";
import gratisBadge from "@/assets/gratis-badge.png";
import shareIcon from "@/assets/share-icon.png";
import { useTranslation } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SUPPORT_EMAIL } from "@/lib/contact";

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
  speaker_photo_url: string | null;
}

export default function Webinar() {
  const { t } = useTranslation();

  const { data: webinars, isLoading } = useQuery({
    queryKey: ["webinars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webinars" as any)
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as unknown as Webinar[];
    },
  });

  const featured = webinars?.[0];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: t.programs.webinarShareTitle, text: t.programs.webinarShareText, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert(t.programs.webinarLinkCopied);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-14 lg:py-20" style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}>
        <div className="container text-center">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">{t.programs.webinarPageLabel}</p>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">{t.programs.webinarPageTitle}</h1>
          <p className="text-white/80 max-w-lg mx-auto text-sm">
            {featured?.description || t.programs.webinarPageDesc}
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : featured ? (
        <>
          {/* ── Featured webinar ── */}
          <section className="py-16 bg-muted">
            <div className="container max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left: graphic */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {(featured.cost?.toUpperCase() === "FREE" || featured.cost?.toUpperCase() === "GRATIS") && (
                      <img src={gratisBadge} alt="GRATIS" className="absolute -top-8 -left-8 z-10 w-24 h-24 object-contain drop-shadow-lg" />
                    )}
                    <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
                      {featured.cover_image_url ? (
                        <img src={featured.cover_image_url} alt={featured.title} className="h-40 w-auto mx-auto object-contain" />
                      ) : (
                        <img src={webinarIcon} alt="Webinar" className="h-40 w-auto mx-auto object-contain" />
                      )}
                    </div>
                  </div>

                  {/* Speaker mini-card */}
                  {featured.speaker_name && (
                    <div className="flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-3 w-full max-w-xs shadow-sm">
                      {featured.speaker_photo_url ? (
                        <img src={featured.speaker_photo_url} alt={featured.speaker_name} className="h-10 w-10 rounded-full object-cover border" style={{ borderColor: "#03989E" }} />
                      ) : (
                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "#03989E" }}>
                          {featured.speaker_name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Pembicara</p>
                        <p className="text-sm font-semibold text-foreground truncate">{featured.speaker_name}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-center text-sm text-muted-foreground max-w-xs">{t.programs.webinarGraphicDesc}</p>
                </div>

                {/* Right: info card */}
                <div className="bg-card rounded-2xl border-2 overflow-hidden shadow-xl" style={{ borderColor: "#03989E" }}>
                  <div className="px-8 py-6 border-b border-border">
                    <h2 className="text-2xl font-black text-foreground">{featured.title}</h2>
                    {featured.subtitle && <p className="font-semibold text-foreground">{featured.subtitle}</p>}
                  </div>
                  <div className="px-8 py-5 text-white font-semibold text-sm" style={{ background: "#03989E" }}>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t.programs.webinarContactLabel}{" "}
                      <a href={`mailto:${SUPPORT_EMAIL}`} className="underline font-bold">
                        {SUPPORT_EMAIL}
                      </a>
                    </div>
                  </div>
                  <div className="px-8 py-6 space-y-3">
                    {featured.topic && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground w-28 shrink-0">{t.programs.webinarTopicLabel}</span>
                        <span>{featured.topic}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground w-28 shrink-0">{t.programs.webinarCostLabel}</span>
                      <span className="font-bold" style={{ color: "#03989E" }}>{featured.cost}</span>
                    </div>
                    {featured.schedule && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground w-28 shrink-0">{t.programs.webinarScheduleLabel}</span>
                        <span>{featured.schedule}</span>
                      </div>
                    )}
                    {featured.event_date && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground w-28 shrink-0">Tanggal</span>
                        <span>{new Date(featured.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                      </div>
                    )}
                  </div>
                  {/* CTA to detail page */}
                  {featured.slug && (
                    <div className="px-8 pb-6">
                      <Link
                        to={`/programs/webinar/${featured.slug}`}
                        className="flex items-center justify-center gap-2 w-full h-11 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
                        style={{
                          background: "linear-gradient(180deg, #03d4db 0%, #03989E 40%, #027f84 100%)",
                          boxShadow: "0 4px 14px rgba(3,152,158,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
                          border: "1.5px solid #03b8be",
                        }}
                      >
                        Daftar & Lihat Detail <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* CTA bar */}
          <section className="py-5" style={{ background: "#015779" }}>
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white font-bold text-lg">{t.programs.webinarSecureSeat}</p>
              <div className="flex items-center gap-3">
                {featured.slug ? (
                  <Link
                    to={`/programs/webinar/${featured.slug}`}
                    className="inline-flex items-center justify-center px-8 h-12 rounded-xl font-bold text-white text-base transition-opacity hover:opacity-90"
                    style={{
                      background: "linear-gradient(180deg, #03d4db 0%, #03989E 40%, #027f84 100%)",
                      boxShadow: "0 4px 14px rgba(3,152,158,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                      border: "1.5px solid #03b8be",
                    }}
                  >
                    {t.programs.webinarRegisterNow}
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 h-12 rounded-xl font-bold text-white text-base transition-opacity hover:opacity-90"
                    style={{
                      background: "linear-gradient(180deg, #03d4db 0%, #03989E 40%, #027f84 100%)",
                      boxShadow: "0 4px 14px rgba(3,152,158,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                      border: "1.5px solid #03b8be",
                    }}
                  >
                    {t.programs.webinarRegisterNow}
                  </Link>
                )}
                <button onClick={handleShare} title="Share" className="h-12 w-12 flex items-center justify-center hover:opacity-80 transition-opacity">
                  <img src={shareIcon} alt="Share" className="h-10 w-10 object-contain" />
                </button>
              </div>
            </div>
          </section>

          {/* What you'll learn */}
          {featured.learn_items?.length > 0 && (
            <section className="py-16 bg-muted">
              <div className="container max-w-3xl mx-auto">
                <h2 className="text-2xl font-extrabold text-foreground text-center mb-8">{t.programs.webinarLearnTitle}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {featured.learn_items.map((item) => (
                    <div key={item} className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border shadow-sm">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold" style={{ background: "#03989E" }}>
                        ✓
                      </div>
                      <p className="text-sm text-foreground font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* More webinars */}
          {webinars && webinars.length > 1 && (
            <section className="py-16 bg-background">
              <div className="container max-w-4xl mx-auto">
                <h2 className="text-xl font-extrabold text-foreground mb-6">Webinar Lainnya</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {webinars.slice(1).map((w) => (
                    <div key={w.id} className="bg-card rounded-xl border border-border p-5 space-y-3 shadow-sm flex flex-col">
                      {w.speaker_name && (
                        <div className="flex items-center gap-2">
                          {w.speaker_photo_url ? (
                            <img src={w.speaker_photo_url} alt={w.speaker_name} className="h-8 w-8 rounded-full object-cover border" style={{ borderColor: "#03989E" }} />
                          ) : (
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "#03989E" }}>
                              {w.speaker_name.charAt(0)}
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground truncate">{w.speaker_name}</span>
                        </div>
                      )}
                      <h3 className="font-bold text-foreground">{w.title}</h3>
                      {w.subtitle && <p className="text-xs text-muted-foreground">{w.subtitle}</p>}
                      {w.topic && <p className="text-sm text-foreground/80 flex-1">{w.topic}</p>}
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold" style={{ color: "#03989E" }}>{w.cost}</p>
                        {w.event_date && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(w.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>
                      {w.slug ? (
                        <Link
                          to={`/programs/webinar/${w.slug}`}
                          className="inline-flex items-center justify-center w-full mt-2 h-9 rounded-lg gap-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ background: "linear-gradient(180deg, #03d4db 0%, #027f84 100%)" }}
                        >
                          Lihat Detail <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <Link
                          to="/register"
                          className="inline-flex items-center justify-center w-full mt-2 h-9 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ background: "linear-gradient(180deg, #03d4db 0%, #027f84 100%)" }}
                        >
                          {t.programs.webinarRegisterNow}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="py-24 bg-muted text-center">
          <p className="text-muted-foreground">Belum ada webinar yang dijadwalkan — pantau terus!</p>
        </section>
      )}
    </Layout>
  );
}
