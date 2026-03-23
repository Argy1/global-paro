import { Users, Star, Eye } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "@/i18n/LanguageContext";
import { JoinMissionBanner } from "@/components/about/JoinMissionBanner";
import { OurTeamSection } from "@/components/about/OurTeamSection";
import logoIcon from "@/assets/logo-icon-3d.png";
import nursesHero from "@/assets/hero-nurses.jpg";
import missionCards from "@/assets/mission-cards.png";
import checkmarkIcon from "@/assets/values-checkmark.png";
import valuesTitle from "@/assets/values-title.png";
import valuesList from "@/assets/values-list.png";
import valuesBanner from "@/assets/values-banner.png";

export default function About() {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* SECTION 1: Global Paro Hero */}
      <section id="global-paro" className="relative overflow-hidden" style={{ scrollMarginTop: "80px" }}>
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(90deg, #015779 0%, #03989E 100%)" }} />

        <div className="relative z-10 py-10 md:py-14 lg:py-20">
          <div className="container px-4 md:px-6 lg:px-8">
            <div
              className="w-full rounded-2xl overflow-hidden shadow-2xl relative"
              style={{ background: "rgba(255,255,255,0.97)", minHeight: "320px" }}
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={nursesHero}
                  alt="Global PARO Nurses"
                  className="absolute right-0 top-0 h-full w-[55%] md:w-[50%] object-cover"
                  style={{ objectPosition: "78% center" }}
                  loading="eager"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to right, rgba(255,255,255,1) 35%, rgba(255,255,255,0.85) 52%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0) 100%)" }}
                />
              </div>

              <div className="relative z-10 flex flex-col justify-center gap-5 p-8 md:p-12 lg:p-14 w-full md:w-[52%]">
                <div className="flex items-center gap-3 md:gap-4">
                  <img
                    src={logoIcon}
                    alt="Global PARO Icon"
                    className="object-contain shrink-0"
                    style={{ width: "clamp(3.5rem, 7vw, 7rem)", height: "clamp(3.5rem, 7vw, 7rem)" }}
                  />
                  <h1
                    className="font-black font-heading leading-none tracking-tight whitespace-nowrap"
                    style={{ fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)" }}
                  >
                    <strong className="font-black" style={{ color: "#015779" }}>Global </strong>
                    <strong className="font-black" style={{ color: "#03989E" }}>PARO</strong>
                  </h1>
                </div>

                <p className="text-base md:text-lg leading-loose text-gray-700 text-justify" style={{ maxWidth: "480px" }}>
                  {t.about.heroDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Vision */}
      <section id="vision" style={{ scrollMarginTop: "80px" }}>
        <div className="py-20 px-6" style={{ background: "linear-gradient(135deg, #03989E 0%, #015779 100%)" }}>
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/3 flex flex-col items-start">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="font-black text-white leading-none mb-2" style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", letterSpacing: "-0.03em" }}>
                  {t.about.visionSectionTitle}
                </h2>
                <div className="w-16 h-1 bg-white/50 rounded-full mt-2" />
              </div>
              <div className="md:w-2/3">
                <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-6">
                  {t.about.visionStatement}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-14 px-6 bg-background">
          <div className="container max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {t.about.visionStats.map((s) => (
                <div key={s.label}>
                  <div className="text-4xl font-black mb-1" style={{ color: "#03989E" }}>{s.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-16 px-6" style={{ backgroundColor: "hsl(var(--card))" }}>
          <div className="container max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl p-8 text-white" style={{ background: "linear-gradient(135deg, #03989E, #015779)" }}>
                <Star className="h-8 w-8 mb-4 opacity-80" />
                <h4 className="text-xl font-bold mb-3">{t.about.visionForNurses}</h4>
                <p className="text-white/85 leading-relaxed">{t.about.visionForNursesCard}</p>
              </div>
              <div className="rounded-2xl p-8 border-2 border-foreground/10">
                <Users className="h-8 w-8 mb-4" style={{ color: "#03989E" }} />
                <h4 className="text-xl font-bold mb-3 text-foreground">{t.about.visionForHealthcare}</h4>
                <p className="text-muted-foreground leading-relaxed">{t.about.visionForHealthcareCard}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Mission */}
      <section id="mission" className="py-16 px-6 bg-background" style={{ scrollMarginTop: "80px" }}>
        <div className="container max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(3rem, 7vw, 5rem)", letterSpacing: "-0.03em", color: "#03989E" }}>
              {t.about.missionSectionTitle}
            </h2>
            <div className="w-16 h-1 rounded-full mt-3" style={{ backgroundColor: "#03989E" }} />
          </div>
          <div className="w-full min-h-[220px] sm:min-h-[300px] md:min-h-[380px]">
            <img src={missionCards} alt={t.about.missionImgAlt} className="w-full h-full object-contain" style={{ minHeight: "220px" }} />
          </div>
        </div>
      </section>

      {/* SECTION 4: Values */}
      <section id="values" className="py-16 px-6 bg-background" style={{ scrollMarginTop: "80px" }}>
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start">
              <img src={checkmarkIcon} alt={t.about.valuesImgAlt} className="w-48 h-48 object-contain mb-4" />
              <img src={valuesTitle} alt={t.about.valuesImgAlt} className="w-full max-w-sm object-contain mb-4" />
              <p className="text-foreground text-base">
                {t.about.valuesTagline}
                <span className="underline font-semibold">{t.about.valuesTaglineHighlight}</span>
                {t.about.valuesTaglineEnd}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img src={valuesList} alt={t.about.valuesListImgAlt} className="w-full max-w-md object-contain" />
            </div>
          </div>
        </div>
      </section>
      <div className="w-full">
        <img src={valuesBanner} alt={t.about.valuesBannerAlt} className="w-full object-cover" style={{ maxHeight: "80px" }} />
      </div>

      <OurTeamSection />
      <JoinMissionBanner />
    </Layout>
  );
}
