import { useState } from "react";
import logoIcon3d from "@/assets/logo-icon-3d.png";
import teamHeroBar from "@/assets/team-hero-bar.png";
import { useTranslation } from "@/i18n/LanguageContext";
import { teamProfiles } from "./teamProfiles";

export function OurTeamSection() {
  const { lang } = useTranslation();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const selectedMember = teamProfiles.find((profile) => profile.id === selectedMemberId) ?? null;

  return (
    <section id="team" className="py-12 md:py-16 bg-[#f2f4f5]" style={{ scrollMarginTop: "80px" }}>
      <div className="relative mb-8 md:mb-10 h-[90px] md:h-[120px] overflow-hidden">
        <img src={teamHeroBar} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={logoIcon3d}
            alt="Global Paro"
            className="object-contain shrink-0 -mr-1"
            style={{ width: "clamp(3.5rem, 7vw, 7rem)", height: "clamp(3.5rem, 7vw, 7rem)" }}
          />
          <h2 className="font-black tracking-tight leading-none whitespace-nowrap" style={{ fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)" }}>
            <strong className="font-black" style={{ color: "#015779" }}>ur </strong>
            <strong className="font-black" style={{ color: "#03989E" }}>TEAM</strong>
          </h2>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {teamProfiles.map((member) => {
            const isActive = member.id === selectedMemberId;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedMemberId(member.id)}
                className="text-left rounded-md overflow-hidden border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03989E] focus-visible:ring-offset-2"
                style={{
                  borderColor: isActive ? "#015779" : "#d6e7eb",
                  background: isActive ? "linear-gradient(180deg, #f9fbfb 0%, #eef6f8 100%)" : "#f9fbfb",
                  boxShadow: isActive ? "0 0 0 2px rgba(1, 87, 121, 0.15)" : "none",
                }}
                aria-pressed={isActive}
              >
                <div className="relative flex items-center justify-center min-h-[130px] pt-4 px-3">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-[128px] h-[128px] rounded-full object-cover border-4"
                    style={{ borderColor: isActive ? "#015779" : "#5a9aaa" }}
                  />
                  <span
                    className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: isActive ? "#03989E" : "#b8ccd2" }}
                    aria-hidden="true"
                  />
                </div>

                <div className="px-3 pb-4 pt-2 min-h-[120px] bg-white border-t border-[#d6e7eb]">
                  <h3 className="font-bold leading-tight text-base text-[#015779]">{member.name}</h3>
                  <p className="text-sm leading-snug mt-1 text-[#015779]">
                    {lang === "id" ? member.title.id : member.title.en}
                  </p>
                  {(lang === "id" ? member.subtitle.id : member.subtitle.en) && (
                    <p className="text-sm leading-snug text-[#015779]">
                      {lang === "id" ? member.subtitle.id : member.subtitle.en}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedMember ? (
        <div className="container max-w-6xl mx-auto px-4 md:px-6 mt-6">
          <article className="rounded-md border border-[#d6e7eb] bg-gradient-to-r from-[#4b69a2] via-[#4e7ba8] to-[#57a8b1] p-5 md:p-6 text-white">
            <h4 className="text-lg md:text-xl font-bold">{selectedMember.name}</h4>
            <p className="text-white/90 text-sm md:text-base mt-1">
              {lang === "id" ? selectedMember.title.id : selectedMember.title.en}
              {(lang === "id" ? selectedMember.subtitle.id : selectedMember.subtitle.en)
                ? ` - ${lang === "id" ? selectedMember.subtitle.id : selectedMember.subtitle.en}`
                : ""}
            </p>
            <div className="mt-4 space-y-3 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {lang === "id" ? selectedMember.description.id : selectedMember.description.en}
            </div>
          </article>
        </div>
      ) : null}

      <div className="h-11 flex items-center justify-center mt-6 w-full" style={{ backgroundColor: "#015779" }}>
        <span className="text-white text-sm md:text-lg font-medium">www.GlobalParo.com</span>
      </div>
    </section>
  );
}
