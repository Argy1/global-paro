import { Link } from "react-router-dom";
import { ArrowRight, Bot, BookOpen, Handshake, HeadphonesIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "@/i18n/LanguageContext";

const approachIcons = [Bot, BookOpen, Handshake, HeadphonesIcon];

export default function HowWeDoIt() {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* ── SECTION 1: Hero ── */}
      <section
        id="how-we-do-it"
        className="relative py-20 lg:py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="container relative text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 bg-white/20 text-white">
            {t.howWeDoIt.ourMethodology}
          </span>
          <h1 className="text-4xl lg:text-6xl font-black font-heading text-white mb-5 leading-tight">{t.howWeDoIt.title}</h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10">{t.howWeDoIt.subtitle}</p>
          <Button asChild size="lg" className="rounded-full font-bold px-8" style={{ backgroundColor: "white", color: "#015779" }}>
            <Link to="/register">{t.howWeDoIt.startJourney} <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </section>

      {/* ── SECTION 2: Our Approach ── */}
      <section id="approach" className="py-16 lg:py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: "hsl(var(--accent))" }}>{t.howWeDoIt.ourApproach}</p>
            <h2 className="text-3xl lg:text-4xl font-black font-heading text-foreground">{t.howWeDoIt.pillarsTitle}</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t.howWeDoIt.pillarsSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {t.howWeDoIt.approachCards.map((card, i) => {
              const Icon = approachIcons[i];
              return (
                <div key={card.title} className="group bg-card rounded-2xl p-7 border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shrink-0"
                      style={{ backgroundColor: i % 2 === 0 ? "hsl(var(--primary) / 0.1)" : "hsl(var(--accent) / 0.1)" }}
                    >
                      <Icon className="h-7 w-7" style={{ color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))" }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))" }}>
                        {t.howWeDoIt.pillarLabel} {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{card.desc}</p>
                  <ul className="space-y-2">
                    {card.details.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))" }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Your Journey ── */}
      <section id="journey" className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: "hsl(var(--accent))" }}>{t.howWeDoIt.yourJourneyLabel}</p>
            <h2 className="text-3xl font-black font-heading text-foreground">{t.howWeDoIt.journeyStepByStep}</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {t.howWeDoIt.journeySteps.map((step, i) => {
              const num = String(i + 1).padStart(2, "0");
              const color = i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))";
              return (
                <div key={step.title} className="group relative bg-card rounded-2xl p-7 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl font-black text-xl font-heading text-white mb-5" style={{ backgroundColor: color }}>
                    {num}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{step.desc}</p>
                  <ul className="space-y-2.5">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Flow indicator */}
          <div className="flex items-center justify-center gap-3 mt-12 flex-wrap">
            {t.howWeDoIt.journeySteps.map((step, i) => {
              const num = String(i + 1).padStart(2, "0");
              const color = i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))";
              return (
                <div key={step.title} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white" style={{ backgroundColor: color }}>
                    {num}
                  </div>
                  {i < t.howWeDoIt.journeySteps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl font-black font-heading text-primary-foreground mb-4">{t.howWeDoIt.startJourney}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">{t.howWeDoIt.ctaSubtitle}</p>
          <Button size="xl" asChild className="rounded-full font-bold" style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--primary))' }}>
            <Link to="/register">{t.common.registerNow} <ArrowRight className="h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
