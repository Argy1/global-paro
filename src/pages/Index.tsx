import { Link } from "react-router-dom";
import {
  ArrowRight, MessageCircle, Play, Lock,
  Instagram, Linkedin, Mail, Phone,
  Globe, BookOpen, Users, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { TrustBadgesStrip } from "@/components/campaign/TrustBadgesStrip";
import { TutorialModal } from "@/components/home/TutorialModal";
import { useSetting } from "@/hooks/useSiteSettings";
import { useContent } from "@/hooks/useContent";
import { useSuccessStories } from "@/hooks/useSuccessStories";
import { useTranslation } from "@/i18n/LanguageContext";
import heroBanner from "@/assets/hero-banner-desktop.png";
import heroNurses from "@/assets/hero-nurses.jpg";
import logoIcon from "@/assets/logo-icon.png";
import { INSTAGRAM_URL, SUPPORT_EMAIL, WHATSAPP_NUMBER_DISPLAY, WHATSAPP_TEL, WHATSAPP_URL } from "@/lib/contact";

const quickstartTopics = [
  { title_en: "Is Working Abroad Right for You?", title_id: "Apakah Bekerja di Luar Negeri Tepat untuk Anda?", slug: "is-working-abroad-right" },
  { title_en: "Understanding Licensing", title_id: "Memahami Lisensi", slug: "understanding-licensing" },
  { title_en: "English Proficiency (IELTS / OET)", title_id: "Kemahiran Bahasa Inggris (IELTS / OET)", slug: "english-proficiency" },
  { title_en: "NCLEX Preparation", title_id: "Persiapan NCLEX", slug: "nclex-preparation" },
  { title_en: "CGFNS & VisaScreen", title_id: "CGFNS & VisaScreen", slug: "cgfns-visascreen" },
  { title_en: "Document Checklist", title_id: "Daftar Periksa Dokumen", slug: "document-checklist" },
  { title_en: "Financial Planning", title_id: "Perencanaan Keuangan", slug: "financial-planning" },
  { title_en: "Employer Red vs Green Flags", title_id: "Tanda Bahaya vs Tanda Aman Pemberi Kerja", slug: "employer-red-green-flags" },
  { title_en: "Life Abroad: What to Expect", title_id: "Kehidupan di Luar Negeri: Apa yang Diharapkan", slug: "life-abroad" },
  { title_en: "Your First 90 Days", title_id: "90 Hari Pertama Anda", slug: "first-90-days" },
];

function VideoOrPlaceholder({ url, className = "" }: { url: string | null; className?: string }) {
  if (!url) {
    return (
      <div className={`bg-muted rounded-xl flex flex-col items-center justify-center text-muted-foreground ${className}`}>
        <Play className="h-14 w-14 mb-2 opacity-30" />
        <p className="text-sm font-medium">Video coming soon</p>
      </div>
    );
  }
  if (url.includes("youtube") || url.includes("youtu.be") || url.includes("vimeo")) {
    let src = url;
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      src = `https://www.youtube.com/embed/${id}`;
    } else if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      src = `https://www.youtube.com/embed/${id}`;
    } else if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1]?.split("?")[0];
      src = `https://player.vimeo.com/video/${id}`;
    }
    return <iframe src={src} className={`rounded-xl ${className}`} allow="autoplay; encrypted-media" allowFullScreen title="Video" />;
  }
  return <video src={url} controls className={`rounded-xl object-cover ${className}`} />;
}

export default function Index() {
  const { value: tutorialVideo } = useSetting("site_tutorial_video_url");
  const { value: linkedinUrl } = useSetting("linkedin_url");
  const { lang, t } = useTranslation();

  const { data: newsItems } = useContent("News");
  const { data: stories } = useSuccessStories();

  const publishedNews = (newsItems ?? []).filter((n) => n.published).slice(0, 4);
  const publishedStories = (stories ?? []).filter((s) => s.is_published).slice(0, 3);

  const whatsappHref = WHATSAPP_URL;

  const paroItems = [
    { letter: "P", title: t.home.paroP, desc: t.home.paroPDesc, icon: Sparkles },
    { letter: "A", title: t.home.paroA, desc: t.home.paroADesc, icon: Globe },
    { letter: "R", title: t.home.paroR, desc: t.home.paroRDesc, icon: Users },
    { letter: "O", title: t.home.paroO, desc: t.home.paroODesc, icon: BookOpen },
  ];

  const stats = [
    { num: "1000+", label: t.home.statsNurses },
    { num: "3", label: t.home.statsCountries },
    { num: "AI+Human", label: t.home.statsSupportModel },
    { num: "0 Fee", label: t.home.statsFee },
  ];

  return (
    <Layout>
      <TutorialModal />

      {/* 1. HERO */}
      <section className="bg-[#ECEFF1] py-2 md:py-0">
        <div className="w-full px-2 md:px-0">

          {/* ── TABLET (md only): image + buttons below ── */}
          <div className="hidden md:block lg:hidden">
            <img
              src={heroBanner}
              alt="Global PARO - Global Career Gateway for Nurses"
              className="w-full h-auto"
              loading="eager"
            />
            <div className="flex items-center justify-center gap-3 py-4 px-4" style={{ background: "#03989E" }}>
              <Link
                to="/register"
                className="inline-flex h-11 flex-1 max-w-[200px] items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #50A8B1 0%, #4C9EAB 100%)" }}
              >
                {t.common.getStarted}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <Link
                to="/programs"
                className="inline-flex h-11 flex-1 max-w-[200px] items-center justify-center rounded-full border-2 border-white bg-transparent px-5 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                {t.common.learnMore}
              </Link>
            </div>
          </div>

          {/* ── DESKTOP (lg+): overlay buttons on image ── */}
          <div className="relative hidden lg:block">
            <img
              src={heroBanner}
              alt="Global PARO - Global Career Gateway for Nurses"
              className="w-full h-auto"
              loading="eager"
            />
            <div className="absolute bottom-[9%] left-[39%] -translate-x-1/2">
              <div className="flex items-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex h-14 min-w-[220px] items-center justify-center gap-2 rounded-full px-8 text-xl font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.26)]"
                  style={{ background: "linear-gradient(135deg, #50A8B1 0%, #4C9EAB 100%)" }}
                >
                  {t.common.getStarted}
                  <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
                </Link>
                <Link
                  to="/programs"
                  className="inline-flex h-14 min-w-[220px] items-center justify-center rounded-full border-[2px] border-white/95 bg-white/5 px-8 text-xl font-bold text-white shadow-[0_7px_18px_rgba(0,0,0,0.18)] backdrop-blur-[2px] transition-all duration-200 hover:bg-white/12 hover:translate-y-[-1px]"
                >
                  {t.common.learnMore}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#B7CED7] bg-[#0EA0A6] md:hidden">
            <img
              src={heroNurses}
              alt="Global PARO - Global Career Gateway for Nurses"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "70% center" }}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C5F7F]/90 via-[#0C5F7F]/60 to-[#0C5F7F]/25" />
            <div className="relative z-10 p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                  <img src={logoIcon} alt="Global PARO Logo" className="h-10 w-10 object-contain" />
                </div>
                <div>
                  <h1 className="font-heading text-4xl font-black leading-none text-white">Global PARO</h1>
                  <p className="text-sm font-semibold text-white/95">Global Career Gateway for Nurses</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md"
                  style={{ backgroundColor: "#529FAA" }}
                >
                  {t.common.getStarted}
                </Link>
                <Link
                  to="/programs"
                  className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md"
                  style={{ backgroundColor: "#529FAA" }}
                >
                  {t.common.learnMore}
                </Link>
              </div>
            </div>
            <div className="pt-[66%]" />
          </div>
        </div>
      </section>

      {/* ─── 2. Stats Bar ─── */}
      <section className="py-6 border-b border-border" style={{ backgroundColor: 'hsl(var(--card))' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-heading font-black text-2xl" style={{ color: 'hsl(var(--accent))' }}>{stat.num}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Webinar Section ─── */}
      <section className="py-12 lg:py-16 bg-white border-b border-border">
        <div className="container max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: 'hsl(var(--accent))' }}>{t.home.webinarLabel}</p>
              <h2 className="text-3xl lg:text-4xl font-black font-heading text-foreground mb-3">{t.home.webinarTitle}</h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t.home.webinarDesc}</p>
              <div className="space-y-3 mb-6">
                {[t.home.webinarPoint1, t.home.webinarPoint2, t.home.webinarPoint3].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-accent font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="rounded-full font-bold" style={{ backgroundColor: 'hsl(var(--accent))' }}>
                <Link to="/programs/webinar">{t.home.webinarLearnMore} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="bg-card rounded-2xl border-2 overflow-hidden shadow-xl" style={{ borderColor: "#03989E" }}>
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-xl font-black text-foreground">{t.home.webinarComingSoon}</h3>
                <p className="text-sm text-muted-foreground">{t.home.webinarJoinNext}</p>
              </div>
              <div className="px-6 py-5 text-white font-semibold text-sm" style={{ background: "#03989E" }}>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:hello@globalparo.com" className="underline font-bold">hello@globalparo.com</a>
                </div>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{t.home.webinarFormat}</span>
                  <span className="text-muted-foreground">{t.home.webinarFormatValue}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                  <span className="font-semibold text-foreground">{t.home.webinarCost}</span>
                  <span className="font-bold" style={{ color: "#03989E" }}>FREE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Why Choose Us - PARO ─── */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: 'hsl(var(--accent))' }}>{t.home.paroLabel}</p>
            <h2 className="text-3xl lg:text-4xl font-black font-heading text-foreground">{t.home.paroTitle} <span style={{ color: 'hsl(var(--accent))' }}>{t.home.paroTitleHighlight}</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paroItems.map((item) => (
              <div key={item.letter} className="bg-card rounded-2xl p-6 shadow-card border border-border group hover:border-accent/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full font-black text-xl font-heading text-primary-foreground shrink-0" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                    {item.letter}
                  </span>
                  <item.icon className="h-5 w-5" style={{ color: 'hsl(var(--accent))' }} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/why-choose-us">{t.home.paroExplore} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 5. Tutorial Video Block ─── */}
      <section className="py-12 lg:py-16">
        <div className="container max-w-3xl">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto">
                  <VideoOrPlaceholder url={tutorialVideo} className="w-full h-full min-h-[200px]" />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <h2 className="text-xl font-bold text-foreground mb-2">{t.home.tutorialTitle}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{t.home.tutorialDesc}</p>
                  {tutorialVideo ? (
                    <Button size="sm" className="self-start" asChild>
                      <a href={tutorialVideo} target="_blank" rel="noopener noreferrer"><Play className="h-4 w-4" /> {t.home.watchTutorial}</a>
                    </Button>
                  ) : (
                    <Button size="sm" className="self-start" disabled><Play className="h-4 w-4" /> {t.home.videoComingSoon}</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── 6. Trust Badges ─── */}
      <TrustBadgesStrip />

      {/* ─── 7. Quickstart Guide Teaser ─── */}
      <section className="py-12 lg:py-16 bg-muted">
        <div className="container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">{t.home.quickstartTitle}</h2>
              <p className="text-muted-foreground text-sm mt-1">{t.home.quickstartSubtitle}</p>
            </div>
            <Button variant="link" asChild className="hidden sm:inline-flex">
              <Link to="/quickstart">{t.common.viewAll} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
            {quickstartTopics.map((topic, i) => (
              <Link
                key={topic.slug}
                to="/quickstart"
                className="snap-start shrink-0 w-56 bg-card border border-border rounded-xl p-5 hover:border-accent/40 hover:shadow-md transition-all group"
              >
                <span className="text-xs font-bold mb-2 block" style={{ color: 'hsl(var(--accent))' }}>{t.common.chapter} {String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {lang === "id" ? topic.title_id : topic.title_en}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. Register CTA ─── */}
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}>
        <div className="container text-center max-w-2xl">
          <Lock className="h-8 w-8 text-primary-foreground/60 mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-black font-heading text-primary-foreground mb-4">{t.home.registerCtaTitle}</h2>
          <p className="text-primary-foreground/85 mb-6">{t.home.registerCtaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="xl" asChild className="rounded-full font-bold" style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--primary))' }}>
              <Link to="/register">{t.common.registerNow} <ArrowRight className="h-5 w-5" /></Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild className="rounded-full font-bold">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> {t.common.whatsappSupport}
              </a>
            </Button>
          </div>
          <p className="text-xs text-primary-foreground/50 mt-4">{t.home.registerCtaDisclaimer}</p>
        </div>
      </section>

      {/* ─── 9. News & Insights ─── */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">{t.home.newsTitle}</h2>
              <p className="text-muted-foreground text-sm mt-1">{t.home.newsSubtitle}</p>
            </div>
            <Button variant="link" asChild><Link to="/news">{t.common.viewAll} <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          {publishedNews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {publishedNews.map((item) => (
                <Link key={item.id} to={`/news/${item.slug}`} className="group">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    {item.cover_image_url && <img src={item.cover_image_url} alt={item.title} className="w-full h-40 object-cover rounded-t-lg" loading="lazy" />}
                    <CardContent className={item.cover_image_url ? "p-4" : "p-6"}>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">{item.title}</h3>
                      {item.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card><CardContent className="py-12 text-center text-muted-foreground">{t.home.newsEmpty}</CardContent></Card>
          )}
        </div>
      </section>

      {/* ─── 10. Success Stories ─── */}
      <section className="py-12 lg:py-16 bg-muted">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">{t.home.storiesTitle}</h2>
              <p className="text-muted-foreground text-sm mt-1">{t.home.storiesSubtitle}</p>
            </div>
            <Button variant="link" asChild><Link to="/success-stories">{t.common.viewAll} <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          {publishedStories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedStories.map((story) => (
                <Link key={story.id} to={`/success-stories/${story.slug}`} className="group">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    {story.hero_image && <img src={story.hero_image} alt={story.title} className="w-full h-44 object-cover rounded-t-lg" loading="lazy" />}
                    <CardContent className={story.hero_image ? "p-4" : "p-6"}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'hsl(var(--accent))' }}>{story.origin_country} → {story.destination_country}</p>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{story.nurse_name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{story.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card><CardContent className="py-12 text-center text-muted-foreground">{t.home.storiesEmpty}</CardContent></Card>
          )}
        </div>
      </section>

      {/* ─── 11. Social + Contact Strip ─── */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <h2 className="text-2xl font-extrabold text-foreground text-center mb-8">{t.home.connectTitle}</h2>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {[
              { icon: Instagram, label: "Instagram", url: INSTAGRAM_URL },
              { icon: Linkedin, label: "LinkedIn", url: linkedinUrl },
            ].map(({ icon: Icon, label, url }) => (
              <Card key={label} className="flex-1 min-w-[140px] max-w-[200px]">
                <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                  <Icon className="h-7 w-7" style={{ color: 'hsl(var(--primary))' }} />
                  <p className="font-semibold text-foreground">{label}</p>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: 'hsl(var(--accent))' }}>{t.home.followUs}</a>
                  ) : (
                    <span className="text-xs text-muted-foreground">{t.home.comingSoon}</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" /> {SUPPORT_EMAIL}
            </a>
            <a href={WHATSAPP_TEL} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" /> {WHATSAPP_NUMBER_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
