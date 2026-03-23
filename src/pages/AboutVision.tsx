import { Layout } from "@/components/layout/Layout";
import { JoinMissionBanner } from "@/components/about/JoinMissionBanner";
import { Globe, Target, TrendingUp, Users, Star, Eye } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function AboutVision() {
  const { t } = useTranslation();
  const v = t.aboutVision;

  const pillars = [
    { icon: <Globe className="h-7 w-7" />, title: v.globalReach, desc: v.globalReachDesc },
    { icon: <Target className="h-7 w-7" />, title: v.equalOpportunity, desc: v.equalOpportunityDesc },
    { icon: <TrendingUp className="h-7 w-7" />, title: v.sustainableGrowth, desc: v.sustainableGrowthDesc },
  ];

  const stats = [
    { value: "10+", label: v.statsCountriesReached },
    { value: "500+", label: v.statsNursesSupported },
    { value: "50+", label: v.statsPartnerHospitals },
    { value: "95%", label: v.statsSatisfaction },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #03989E 0%, #015779 100%)" }}>
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left: VISION label */}
            <div className="md:w-1/3 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1
                className="font-black text-white leading-none mb-2"
                style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", letterSpacing: "-0.03em" }}
              >
                {v.heroTitle}
              </h1>
              <div className="w-16 h-1 bg-white/50 rounded-full mt-2" />
            </div>

            {/* Right: Vision statement */}
            <div className="md:w-2/3">
              <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-6">
                {v.heroStatement}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Quote Card */}
      <section className="py-16 px-6 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 border-l-4 relative overflow-hidden"
            style={{ borderColor: "#03989E", backgroundColor: "hsl(var(--muted))" }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
              style={{ background: "#03989E", transform: "translate(30%, -30%)" }}
            />
            <Globe
              className="h-10 w-10 mb-6 opacity-60"
              style={{ color: "#03989E" }}
            />
            <blockquote
              className="text-2xl md:text-3xl font-bold text-foreground leading-snug mb-6 max-w-3xl italic"
            >
              "{v.quoteText}"
            </blockquote>
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest">
              {v.quoteAttr}
            </p>
          </div>
        </div>
      </section>

      {/* Vision Pillars */}
      <section className="py-16 px-6" style={{ backgroundColor: "hsl(var(--card))" }}>
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-12 text-foreground">
            {v.pillarsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#03989E20", color: "#03989E" }}
                >
                  {p.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-14 px-6 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-black mb-1" style={{ color: "#03989E" }}>
                  {s.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement Cards */}
      <section className="py-16 px-6" style={{ backgroundColor: "hsl(var(--card))" }}>
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="rounded-2xl p-8 text-white"
              style={{ background: "linear-gradient(135deg, #03989E, #015779)" }}
            >
              <Star className="h-8 w-8 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-3">{v.forNursesTitle}</h3>
              <p className="text-white/85 leading-relaxed">{v.forNursesDesc}</p>
            </div>
            <div className="rounded-2xl p-8 border-2 border-foreground/10">
              <Users className="h-8 w-8 mb-4" style={{ color: "#03989E" }} />
              <h3 className="text-xl font-bold mb-3 text-foreground">{v.forHealthcareTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.forHealthcareDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <JoinMissionBanner />
    </Layout>
  );
}
