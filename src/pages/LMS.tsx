import { Link } from "react-router-dom";
import { Languages, Award, BookOpen, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "@/i18n/LanguageContext";

export default function LMS() {
  const { t } = useTranslation();

  const features = [
    { icon: Languages, title: t.lms.comprehensiveTraining, desc: t.lms.comprehensiveTrainingDesc },
    { icon: Award, title: t.lms.personalizedMatching, desc: t.lms.personalizedMatchingDesc },
    { icon: BookOpen, title: t.lms.fullSupport, desc: t.lms.fullSupportDesc },
  ];

  const sections = [
    {
      href: "/lms/ielts",
      icon: Languages,
      title: t.lms.ieltsPrep,
      desc: t.lms.ieltsDesc,
      color: "#03989E",
    },
    {
      href: "/lms/certified",
      icon: Award,
      title: t.lms.certifiedGlobalNurse,
      desc: t.lms.certifiedDesc,
      color: "#015779",
      badge: t.common.comingSoon,
    },
    {
      href: "/lms/nclex",
      icon: BookOpen,
      title: t.lms.nclexResources,
      desc: t.lms.nclexDesc,
      color: "#03989E",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-white border-b border-border py-12 lg:py-16">
        <div className="container text-center max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-5" style={{ color: "#015779" }}>
            {t.lms.title}
          </h1>
          <div className="inline-block rounded-lg px-10 py-3 text-white font-semibold text-lg" style={{ backgroundColor: "#03989E" }}>
            {t.lms.heroGateway}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-12 bg-muted">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
                <f.icon className="h-10 w-10 mx-auto mb-4" style={{ color: "#03989E" }} />
                <h3 className="font-bold text-foreground text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section links */}
      <section className="py-14 lg:py-20">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-10" style={{ color: "#015779" }}>
            {t.lms.exploreResources}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {sections.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: s.color + "15" }}>
                  <s.icon className="h-6 w-6" style={{ color: s.color }} />
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-foreground text-sm leading-snug">{s.title}</h3>
                  {s.badge && (
                    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFD600", color: "#015779" }}>
                      {s.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex-1">{s.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: s.color }}>
                  {t.lms.exploreLink} <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}>
        <div className="container text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">{t.lms.readyToLearn}</h2>
          <p className="text-white/80 mb-8 text-sm">{t.lms.readyToLearnDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-xl font-bold text-white border-2 border-white hover:bg-white hover:text-primary transition-all"
            >
              {t.common.registerNow} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/quickstart"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-xl font-bold border-2 border-white/40 text-white hover:bg-white/10 transition-all"
            >
              {t.lms.quickstartGuide}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
