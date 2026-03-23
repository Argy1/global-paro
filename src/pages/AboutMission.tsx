import { Layout } from "@/components/layout/Layout";
import { JoinMissionBanner } from "@/components/about/JoinMissionBanner";
import missionCards from "@/assets/mission-cards.png";
import { useTranslation } from "@/i18n/LanguageContext";

export default function AboutMission() {
  const { t } = useTranslation();

  return (
    <Layout>
      <section className="py-16 px-6 bg-background">
        <div className="container max-w-6xl mx-auto">
          {/* Title */}
          <div className="mb-10">
            <h1
              className="font-black leading-none"
              style={{
                fontSize: "clamp(3rem, 7vw, 5rem)",
                letterSpacing: "-0.03em",
                color: "#03989E",
              }}
            >
              {t.aboutMission.title}
            </h1>
            <div className="w-16 h-1 rounded-full mt-3" style={{ backgroundColor: "#03989E" }} />
          </div>

          {/* Mission cards image */}
          <div className="w-full min-h-[220px] sm:min-h-[300px] md:min-h-[380px]">
            <img
              src={missionCards}
              alt={t.aboutMission.missionAltText}
              className="w-full h-full object-contain"
              style={{ minHeight: "220px" }}
            />
          </div>
        </div>
      </section>

      <JoinMissionBanner />
    </Layout>
  );
}
