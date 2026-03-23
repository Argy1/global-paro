import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, MessageCircle, BookOpen, ChevronDown, ChevronUp,
  Globe, Languages, FileCheck, Heart, Shield, Users, BriefcaseMedical,
  GraduationCap, AlertTriangle, Handshake,
} from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";
import { WHATSAPP_URL } from "@/lib/contact";

const chapterIcons = [Globe, Languages, BriefcaseMedical, GraduationCap, FileCheck, Heart, AlertTriangle, Shield, Handshake, Users];
const chapterIds = [
  "global-shortage", "english-speaking-demand", "skills-competency", "english-requirements",
  "licensing-overview", "cultural-readiness", "communication-challenges", "common-barriers",
  "ethical-pathway", "global-paro-support",
];

export default function Quickstart() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(chapterIds[0]);
  const [tocOpen, setTocOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const whatsappHref = WHATSAPP_URL;

  const chapters = t.quickstart.chapters.map((ch, i) => ({
    ...ch,
    id: chapterIds[i],
    icon: chapterIcons[i],
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  };

  return (
    <Layout>
      <title>Quickstart Guide — Must-Know Before Working Abroad as a Nurse | Global Paro</title>
      <meta name="description" content="A comprehensive 10-chapter guide for nurses preparing to work abroad." />

      {/* Hero */}
      <section className="gradient-hero py-14 lg:py-20">
        <div className="container text-center max-w-3xl">
          <p className="text-accent-foreground bg-accent/20 inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            {t.quickstart.badge}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4 leading-tight">
            {t.quickstart.title}
          </h1>
          <p className="text-base lg:text-lg text-primary-foreground/85 max-w-2xl mx-auto">
            {t.quickstart.subtitle}
          </p>
        </div>
      </section>

      {/* Main content area */}
      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">

            {/* Sticky TOC */}
            <aside className="lg:block">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="lg:hidden w-full flex items-center justify-between bg-card border border-border rounded-xl p-4 mb-4 font-semibold text-foreground"
              >
                <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> {t.quickstart.toc}</span>
                {tocOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              <nav className={`${tocOpen ? "block" : "hidden"} lg:block lg:sticky lg:top-24 bg-card border border-border rounded-xl p-4 mb-6 lg:mb-0 max-h-[70vh] overflow-y-auto`}>
                <p className="hidden lg:block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{t.quickstart.toc}</p>
                <ol className="space-y-1">
                  {chapters.map((ch, i) => (
                    <li key={ch.id}>
                      <button
                        onClick={() => scrollTo(ch.id)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-start gap-2 ${
                          activeId === ch.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="shrink-0 w-5 text-right font-mono text-xs mt-0.5">{i + 1}.</span>
                        <span className="leading-snug">{ch.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            {/* Chapters */}
            <div className="space-y-16 lg:space-y-20">
              {chapters.map((ch, i) => {
                const isLast = i === chapters.length - 1;
                const nextChapter = !isLast ? chapters[i + 1] : null;
                const Icon = ch.icon;

                return (
                  <article key={ch.id} id={ch.id} ref={(el) => { sectionRefs.current[ch.id] = el; }} className="scroll-mt-24">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">{t.common.chapter} {String(i + 1).padStart(2, "0")}</p>
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground leading-tight">{ch.title}</h2>
                      </div>
                    </div>

                    <p className="text-base text-muted-foreground leading-relaxed mb-6">{ch.intro}</p>

                    <div className="bg-card border border-border rounded-xl p-6 mb-6">
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">{t.quickstart.keyPoints}</h3>
                      <ul className="space-y-3">
                        {ch.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-foreground">
                            <span className="shrink-0 mt-1 h-2 w-2 rounded-full bg-accent" />
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-muted rounded-xl p-6 mb-6 border-l-4 border-primary">
                      <h3 className="text-sm font-bold text-foreground mb-2">{t.quickstart.whatNext}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{ch.nextStep}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {nextChapter ? (
                        <Button variant="default" size="sm" onClick={() => scrollTo(nextChapter.id)}>
                          {t.quickstart.continueJourney} <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : null}
                      <Button variant="cta" size="sm" asChild>
                        <Link to="/register">{t.quickstart.registerGuided} <ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4" /> {t.quickstart.chatWithUs}
                        </a>
                      </Button>
                    </div>

                    {!isLast && <hr className="mt-12 lg:mt-16 border-border" />}
                  </article>
                );
              })}

              {/* Final CTA */}
              <div className="gradient-hero rounded-2xl p-8 lg:p-12 text-center">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-foreground mb-3">{t.quickstart.ctaTitle}</h2>
                <p className="text-primary-foreground/85 max-w-lg mx-auto mb-6">{t.quickstart.ctaSubtitle}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/register">{t.common.registerNow} <ArrowRight className="h-5 w-5" /></Link>
                  </Button>
                  <Button variant="heroOutline" size="xl" asChild>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" /> {t.common.whatsappSupport}
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-primary-foreground/50 mt-4">{t.quickstart.ctaDisclaimer}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
