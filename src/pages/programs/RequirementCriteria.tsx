import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/LanguageContext";

const tierColors = ["#015779", "#03989E", "#015779"];
const tierLights = ["#01577915", "#03989E15", "#01577910"];

export default function RequirementCriteria() {
  const { t } = useTranslation();
  const { reqRows, reqTiers } = t.programs;

  const tiers = reqTiers.map((tier, i) => ({
    ...tier,
    color: tierColors[i],
    light: tierLights[i],
  }));

  return (
    <Layout>
      {/* Hero */}
      <section className="py-14 lg:py-20" style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}>
        <div className="container text-center">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">{t.programs.reqPageLabel}</p>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">{t.programs.reqPageTitle}</h1>
          <p className="text-white/80 max-w-xl mx-auto text-sm">
            {t.programs.reqPageDesc}
          </p>
        </div>
      </section>

      {/* Tier Cards — Mobile */}
      <section className="py-12 bg-muted lg:hidden">
        <div className="container space-y-6">
          {tiers.map((tier) => (
            <div key={tier.key} className="bg-card rounded-2xl border-2 overflow-hidden shadow-card" style={{ borderColor: tier.color }}>
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: tier.color }}>
                <span className="text-2xl font-black text-white">{tier.title}</span>
                <span className="text-white/80 text-sm">{tier.full}</span>
              </div>
              <div className="p-5 space-y-4">
                {reqRows.map((req) => (
                  <div key={req.criterion}>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">{req.criterion}</p>
                    {(req[tier.key as "rn" | "en" | "ha"] as string[]).map((v) => (
                      <div key={v} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: tier.color }} />
                        {v}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Table — Desktop */}
      <section className="py-16 bg-muted hidden lg:block">
        <div className="container max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-white w-48" style={{ background: "#015779" }}>
                    {t.programs.reqRequirement}
                  </th>
                  {tiers.map((tier) => (
                    <th key={tier.key} className="px-6 py-4 text-center text-white w-1/4" style={{ background: tier.color }}>
                      <div className="text-lg font-black">{tier.title}</div>
                      <div className="text-xs text-white/75 font-normal">{tier.full}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reqRows.map((req, idx) => (
                  <tr key={req.criterion} className={idx % 2 === 0 ? "bg-card" : "bg-muted"}>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground border-r border-border">
                      {req.criterion}
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.key} className="px-6 py-4 text-sm text-center text-foreground border-r border-border last:border-0">
                        {(req[tier.key as "rn" | "en" | "ha"] as string[]).map((v) => (
                          <div key={v} className="leading-snug">{v}</div>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div className="mt-6 p-4 rounded-xl border text-sm text-muted-foreground" style={{ background: "#03989E10", borderColor: "#03989E30" }}>
            <span className="font-semibold text-foreground">{t.programs.reqRequirement}:</span> {t.programs.reqNote}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}>
        <div className="container text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">{t.programs.reqCtaTitle}</h2>
          <p className="text-white/80 mb-6 text-sm">{t.programs.reqCtaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="font-bold text-white" style={{ backgroundColor: "#e53e3e" }}>
              <Link to="/register">{t.programs.reqCtaApply} <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold border-white text-white hover:bg-white/10">
              <Link to="/programs/webinar">{t.programs.reqCtaWebinar}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
