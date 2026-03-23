import { Layout } from "@/components/layout/Layout";
import { BookOpen, ExternalLink, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";

const resourceUrls = [
  "https://www.ncsbn.org/nclex.htm",
  "https://www.nursesinternational.org/",
  "https://www.kaptest.com/nclex",
  "https://simplenursing.com/",
  "https://nurseslabs.com/",
];

export default function NCLEX() {
  const { t } = useTranslation();
  const { lms } = t;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-white border-b border-border py-10 lg:py-14">
        <div className="container max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
            <Link to="/lms" className="hover:text-foreground transition-colors font-medium" style={{ color: "#015779" }}>LMS</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-semibold">{lms.nclexResources}</span>
          </nav>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#03989E20" }}
            >
              <BookOpen className="h-5 w-5" style={{ color: "#03989E" }} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold" style={{ color: "#015779" }}>
                {lms.nclexPageTitle}
              </h1>
              <p className="text-sm" style={{ color: "#03989E" }}>
                {lms.nclexPageSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resource cards */}
      <section className="py-10 bg-muted">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#03989E20" }}
              >
                <BookOpen className="h-5 w-5" style={{ color: "#03989E" }} />
              </div>
              <div>
                <h2 className="font-extrabold text-lg" style={{ color: "#015779" }}>
                  {lms.nclexResourcesTitle}
                </h2>
                <p className="text-sm" style={{ color: "#03989E" }}>
                  {lms.nclexResourcesSubtitle}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lms.nclexLinks.map((r, i) => (
                <a
                  key={r.title}
                  href={resourceUrls[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-2 bg-white rounded-xl p-5 border border-border hover:border-teal-400 hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-bold text-sm text-foreground group-hover:text-teal-600 transition-colors">
                      {r.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{r.desc}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#03989E" }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 lg:py-14">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-extrabold mb-6" style={{ color: "#015779" }}>
            {lms.nclexFactsTitle}
          </h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {lms.nclexStats.map((s) => (
              <div
                key={s.label}
                className="bg-card rounded-xl p-5 border border-border text-center shadow-sm"
              >
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="font-extrabold text-lg" style={{ color: "#03989E" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-12"
        style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}
      >
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-3">
            {lms.nclexCtaTitle}
          </h2>
          <p className="text-white/80 mb-8 text-sm">
            {lms.nclexCtaDesc}
          </p>
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
              {lms.quickstartGuide}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
