import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import nurseClipboard from "@/assets/nurse-clipboard.png";
import { useTranslation } from "@/i18n/LanguageContext";

export default function BatchProgram() {
  const { t } = useTranslation();

  const details = [
    { icon: Users, label: t.programs.batchRoleLabel, value: "Healthcare Assistant (HCA)" },
    { icon: FileText, label: t.programs.batchContractLabel, value: "2 Years Contract" },
    { icon: MapPin, label: t.programs.batchEmployerLabel, value: "Gov't / Private Hospitals & Nursing Homes" },
  ];

  return (
    <Layout>
      {/* ── MOBILE HERO (stacked) — hidden on lg+ ── */}
      <div className="lg:hidden">
        {/* Nurse image strip */}
        <div className="relative w-full h-56 overflow-hidden" style={{ background: "#03989E" }}>
          <img
            src={nurseClipboard}
            alt="Healthcare professional"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.9 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 50%, #03989E 100%)" }}
          />
          {/* Red badge — top-right, small */}
          <div
            className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg"
          >
            50 Nurses Only
          </div>
        </div>

        {/* Info card below image */}
        <div style={{ background: "#03989E" }} className="px-4 pb-8 pt-0">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#015779" }}>
              {t.programs.batchHeroCountry}
            </p>
            <h1 className="text-2xl font-black mb-4" style={{ color: "#015779" }}>
              {t.programs.batchHeroTitle}
            </h1>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>🚀</span> {t.programs.batchHeroBatch}
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>•</span> {t.programs.batchHeroDeployment}
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>•</span> {t.programs.batchHeroRegistration}
              </li>
            </ul>
            <Button asChild className="w-full font-bold text-white" style={{ backgroundColor: "#03989E" }}>
              <Link to="/register">
                {t.programs.batchHeroApply} <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP HERO (split panel) — hidden below lg ── */}
      <section className="relative overflow-hidden hidden lg:block" style={{ minHeight: 420, background: "#03989E" }}>
        {/* Red diagonal ribbon */}
        <div className="absolute top-0 left-0 z-20 overflow-hidden" style={{ width: 220, height: 220 }}>
          <div
            className="absolute flex items-center justify-center font-black text-white uppercase text-center leading-tight"
            style={{
              background: "#e53e3e",
              width: 300,
              height: 56,
              top: 72,
              left: -58,
              transform: "rotate(-45deg)",
              fontSize: 13,
              letterSpacing: "0.05em",
            }}
          >
            50&nbsp;NURSES&nbsp;ONLY
          </div>
        </div>

        {/* Left: nurse image */}
        <div className="absolute left-0 top-0 bottom-0 w-full lg:w-1/2">
          <img
            src={nurseClipboard}
            alt="Healthcare professional"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.92 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, transparent 40%, #03989E 100%)" }}
          />
        </div>

        {/* Right: info card */}
        <div className="relative z-10 container flex justify-end py-12 lg:py-16">
          <div className="w-full lg:w-1/2 lg:pl-12 bg-white rounded-2xl p-8 shadow-2xl" style={{ maxWidth: 480 }}>
            <div className="relative">
              <div
                className="absolute -bottom-8 -right-8 w-12 h-12"
                style={{ background: "linear-gradient(135deg, transparent 50%, #03989E 50%)" }}
              />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: "#015779" }}>
              {t.programs.batchHeroCountry}
            </p>
            <h1 className="text-3xl lg:text-4xl font-black mb-4" style={{ color: "#015779" }}>
              {t.programs.batchHeroTitle}
            </h1>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="text-base">🚀</span> {t.programs.batchHeroBatch}
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="text-base">•</span> {t.programs.batchHeroDeployment}
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="text-base">•</span> {t.programs.batchHeroRegistration}
              </li>
            </ul>
            <Button asChild className="w-full font-bold text-white" style={{ backgroundColor: "#03989E" }}>
              <Link to="/register">
                {t.programs.batchHeroApply} <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Page title overlay — bottom left */}
        <div className="absolute bottom-6 left-0 z-10 container">
          <h2 className="text-4xl font-black text-white">{t.programs.batchPageTitle}</h2>
          <p className="text-white/80 text-sm mt-1">{t.programs.batchPageSubtitle}</p>
        </div>
      </section>

      {/* Mobile page title */}
      <section className="lg:hidden py-5 px-4 text-center" style={{ background: "#015779" }}>
        <h2 className="text-xl font-black text-white">{t.programs.batchPageTitle}</h2>
        <p className="text-white/70 text-xs mt-1">{t.programs.batchPageSubtitle}</p>
      </section>

      {/* Batch Details */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground mb-8 text-center">{t.programs.batchDetailsTitle}</h2>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-10">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-card rounded-xl p-5 border border-border shadow-card flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#03989E20" }}>
                  <Icon className="h-5 w-5" style={{ color: "#03989E" }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-0.5">{label}</p>
                  <p className="font-semibold text-foreground text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Deployment badge */}
          <div className="flex items-start gap-3 p-4 rounded-xl border mb-10" style={{ background: "#03989E15", borderColor: "#03989E40" }}>
            <Calendar className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#03989E" }} />
            <p className="text-sm font-semibold text-foreground">
              {t.programs.batchDeploymentBadge}
            </p>
          </div>

          {/* Career path note */}
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden p-6" style={{ background: "#03989E15", borderColor: "#03989E40" }}>
            <p className="text-sm font-medium" style={{ color: "#03989E" }}>
              {t.programs.batchCareerPath}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}>
        <div className="container text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">{t.programs.batchCtaTitle}</h2>
          <p className="text-white/80 mb-6 text-sm">{t.programs.batchCtaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="font-bold text-white" style={{ backgroundColor: "#e53e3e" }}>
              <Link to="/register">{t.programs.batchCtaRegister} <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold border-white text-white hover:bg-white/10">
              <Link to="/programs/requirements">{t.programs.batchCtaRequirements}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
