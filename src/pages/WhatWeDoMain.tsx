import { Link } from "react-router-dom";
import { ArrowRight, Brain, Globe2, ShieldCheck, MapPin, Languages, FileCheck, Briefcase, Globe, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { WhatWeDoCTA } from "@/components/whatwedo/WhatWeDoCTA";
import { useTranslation } from "@/i18n/LanguageContext";
import nursesGroup from "@/assets/nurses-group.png";

const highlightIcons = [Brain, Globe2, ShieldCheck];
const candidateIcons = [MapPin, Languages, FileCheck, Briefcase, Globe, MessageCircle];

export default function WhatWeDoMain() {
  const { t } = useTranslation();

  const stats = [
    { value: "10+", label: t.whatWeDo.statsCountries },
    { value: "1000+", label: t.whatWeDo.statsNurses },
    { value: "50+", label: t.whatWeDo.statsEmployers },
    { value: "24/7", label: t.whatWeDo.statsSupport },
  ];

  return (
    <Layout>
      {/* ── SECTION 1: Hero ── */}
      <section id="what-we-do" className="min-h-[480px] flex flex-col md:flex-row">
        <div
          className="flex flex-col justify-center px-10 py-16 md:w-1/2"
          style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}
        >
          <p className="text-xs font-black tracking-[0.25em] uppercase text-white/60 mb-3">Global PARO</p>
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-white leading-tight mb-5">
            {t.whatWeDo.title}
          </h1>
          <p className="text-base text-white/85 max-w-sm leading-relaxed mb-8">
            {t.whatWeDo.heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white font-bold px-6 py-3 rounded-full text-sm transition-all hover:bg-white/90 shadow-lg"
              style={{ color: "#015779" }}
            >
              {t.whatWeDo.getStarted} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 relative min-h-[300px] overflow-hidden">
          <img src={nursesGroup} alt="Nurses team" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(1,87,121,0.3) 0%, rgba(0,0,0,0.1) 100%)" }} />
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ background: "#015779" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-6 px-4">
                <p className="text-2xl lg:text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-xs text-white/70 font-medium uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Highlights */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-2" style={{ color: "#03989E" }}>{t.whatWeDo.whyLabel}</p>
            <h2 className="text-3xl lg:text-4xl font-black font-heading text-foreground">{t.whatWeDo.platformTitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.whatWeDo.highlights.map((h, i) => {
              const Icon = highlightIcons[i];
              return (
                <div key={h.title} className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:border-accent/40 transition-all text-center group">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl mx-auto mb-5" style={{ background: "rgba(3,152,158,0.1)" }}>
                    <Icon className="h-7 w-7" style={{ color: "#03989E" }} />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{h.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: For Candidates ── */}
      <section id="candidates" className="py-16 lg:py-20">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black font-heading text-foreground mb-4">{t.whatWeDo.forCandidates}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              {t.whatWeDo.forCandidatesDesc}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.whatWeDo.candidateServices.map((s, i) => {
              const Icon = candidateIcons[i];
              return (
                <div key={s.title} className="bg-card rounded-2xl p-7 border border-border shadow-sm hover:border-accent/40 hover:shadow-md transition-all">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-5" style={{ background: "rgba(3,152,158,0.1)" }}>
                    <Icon className="h-6 w-6" style={{ color: "#03989E" }} />
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black font-heading text-foreground">{t.whatWeDo.explorMore}</h2>
          </div>
          <div className="grid md:grid-cols-1 gap-6 max-w-xl mx-auto">
            <Link
              to="/what-we-do/employers"
              className="group block rounded-2xl border-2 border-border hover:border-accent/50 bg-card p-8 transition-all hover:shadow-md"
            >
              <div className="w-10 h-1.5 rounded-full mb-5" style={{ background: "#015779" }} />
              <h3 className="text-xl font-black font-heading text-foreground mb-3 group-hover:text-accent transition-colors">{t.whatWeDo.forEmployersLabel}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{t.whatWeDo.forEmployersNavDesc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: "#015779" }}>
                {t.whatWeDo.learnMore} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <WhatWeDoCTA />
    </Layout>
  );
}
