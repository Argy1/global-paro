import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, FileText, Award, Users, Calendar, Clock, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const singaporeDetails = {
  role: "Healthcare Assistant (HCA)",
  contract: "2 years contract",
  employer: "Government / Private Hospitals & Nursing Homes",
  benefits: [
    { key: "salary", value: "1.1K – 1.2K SGD (Net)" },
    { key: "housing", value: "500 SGD" },
    { key: "airfare", value: "1K SGD" },
    { key: "bonus", value: "2x salary" },
    { key: "insurance", value: "Depends on hospital" },
  ],
};

export default function Programs() {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [location.hash]);

  const plans = [
    { name: t.programs.starter.name, price: "9", currency: "SGD", period: "/one-time", highlight: false, features: t.programs.starter.features },
    { name: t.programs.professional.name, price: "19", currency: "SGD", period: "/one-time", highlight: true, features: t.programs.professional.features },
  ];

  const benefitLabels: Record<string, string> = {
    salary: t.programs.benefits.salary,
    housing: t.programs.benefits.housing,
    airfare: t.programs.benefits.airfare,
    bonus: t.programs.benefits.bonus,
    insurance: t.programs.benefits.insurance,
  };

  const requirementTiers = [
    { key: "RN", title: t.programs.requirementRN, items: t.programs.requirementRNItems, color: "border-primary bg-primary/5" },
    { key: "EN", title: t.programs.requirementEN, items: t.programs.requirementENItems, color: "border-accent bg-accent/5" },
    { key: "HA", title: t.programs.requirementHA, items: t.programs.requirementHAItems, color: "border-primary/40 bg-muted" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-16 lg:py-24">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4">{t.programs.title}</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">{t.programs.subtitle}</p>
        </div>
      </section>

      {/* 50 Nurses Only Banner */}
      <section className="bg-accent py-10">
        <div className="container">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-accent-foreground/80 text-sm font-semibold uppercase tracking-widest mb-1">Batch #1 — Singapore</p>
              <h2 className="text-4xl lg:text-5xl font-black text-accent-foreground">{t.programs.fiftyNursesOnly}</h2>
              <p className="text-accent-foreground/90 mt-2 max-w-md">{t.programs.fiftyNursesDesc}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-foreground/20 text-accent-foreground text-sm font-bold border border-accent-foreground/30">{t.programs.batchBadge}</span>
              <div className="flex items-center gap-2 text-accent-foreground/90 text-sm">
                <Clock className="h-4 w-4" />
                <span>{t.programs.batchInfo}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Batch Program */}
      <section id="batch" className="py-16 lg:py-20">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-foreground mb-8 text-center">{t.programs.batchTitle}</h2>
          <div className="max-w-3xl mx-auto bg-card rounded-2xl border-2 border-primary shadow-lg overflow-hidden">
            <div className="gradient-hero px-8 py-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-widest">🇸🇬 Singapore</p>
                  <h3 className="text-2xl font-black text-primary-foreground mt-1">{t.programs.batchName}</h3>
                </div>
                <Badge className="bg-accent text-accent-foreground text-sm px-4 py-1.5 font-bold">{t.programs.batchBadge}</Badge>
              </div>
            </div>
            <div className="p-8">
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Role</p>
                    <p className="font-medium text-foreground">{t.programs.batchRole}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Contract</p>
                    <p className="font-medium text-foreground">{t.programs.batchContract}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Employer</p>
                    <p className="font-medium text-foreground">{t.programs.batchEmployer}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 rounded-xl bg-accent/10 border border-accent/20">
                <Calendar className="h-5 w-5 text-accent shrink-0" />
                <p className="text-sm font-medium text-foreground">{t.programs.batchDeployment}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirement Criteria */}
      <section id="requirements" className="py-16 lg:py-20 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-foreground mb-3 text-center">{t.programs.requirementsCriteriaTitle}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">{t.programs.requirementsCriteriaDesc}</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {requirementTiers.map((tier) => (
              <div key={tier.key} className={`bg-card rounded-xl p-6 border-2 ${tier.color} shadow-card`}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{tier.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Webinar */}
      <section id="webinar" className="py-16 lg:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-extrabold text-foreground">{t.programs.webinarTitle}</h3>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">{t.programs.webinarBadge}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{t.programs.webinarDesc}</p>
                <Button variant="outline" disabled className="opacity-60 cursor-not-allowed">
                  {t.programs.webinarRegister} — {t.programs.webinarBadge}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Plan */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-foreground mb-12 text-center">{t.programs.choosePlan}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 border-2 relative ${plan.highlight ? "border-accent bg-accent/5 shadow-lg" : "border-border bg-card shadow-card"}`}>
                {plan.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-black tracking-wider">
                    ⭐ {t.common.recommended}
                  </span>
                )}
                <h3 className="text-2xl font-extrabold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-black text-accent">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.currency} {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlight ? "cta" : "outline"} className="w-full" asChild>
                  <Link to="/register">{t.common.getStarted} <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SG Nurse Details */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-foreground mb-4 text-center">{t.programs.nurseInSingapore}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">{singaporeDetails.role} — {singaporeDetails.contract}</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />{t.programs.requirementsTitle}
              </h3>
              <ul className="space-y-2">
                {t.programs.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />{t.programs.compensationTitle}
              </h3>
              <div className="space-y-3">
                {singaporeDetails.benefits.map((b) => (
                  <div key={b.key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{benefitLabels[b.key]}</span>
                    <span className="font-semibold text-foreground">{b.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-accent font-medium">📈 {t.programs.careerPath}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl font-extrabold text-primary-foreground mb-4">{t.programs.readyToStart}</h2>
          <p className="text-primary-foreground/90 mb-8">{t.programs.readyToStartDesc}</p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/register">{t.common.registerNow} <ArrowRight className="h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
