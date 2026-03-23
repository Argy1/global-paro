import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/LanguageContext";

// Assets
import teamLogoIcon from "@/assets/team-logo-icon.png";
import teamArrow from "@/assets/team-arrow.png";
import logoIcon3d from "@/assets/logo-icon-3d.png";
import dumaPhoto from "@/assets/team-duma-evi.png";
import annPhoto from "@/assets/team-brigita-diansari.png";
import timothyPhoto from "@/assets/team-dr-timothy-low.png";
import agusPhoto from "@/assets/team-rei-lim.png";
import liaPhoto from "@/assets/team-auliana-idi-retnani.png";
import qrDuma from "@/assets/qr-duma.png";
import qrAnn from "@/assets/qr-ann.png";
import qrTimothy from "@/assets/qr-timothy.png";
import qrAgus from "@/assets/qr-agus.png";
import qrLia from "@/assets/qr-lia.png";

interface Member {
  firstName: string;
  lastName: string;
  role_en: string;
  role_id: string;
  linkedIn?: string;
  photo?: string;
  hasPhoto: boolean;
  useComposite?: boolean;
  qr?: string;
}

const members: Member[] = [
  {
    firstName: "DUMA",
    lastName: "Evi",
    role_en: "Founder",
    role_id: "Pendiri",
    photo: dumaPhoto,
    hasPhoto: true,
    qr: qrDuma,
  },
  {
    firstName: "MEGAWATI",
    lastName: "Santoso",
    role_en: "Strategic Business",
    role_id: "Bisnis Strategis",
    linkedIn: "https://www.linkedin.com/in/megasantoso/",
    hasPhoto: false,
  },
  {
    firstName: "Dr. TIMOTHY",
    lastName: "Low",
    role_en: "Board Advisor – ex CEO Gleneagles Hospital & Farrer Park Hospital",
    role_id: "Penasihat Dewan – eks CEO Gleneagles Hospital & Farrer Park Hospital",
    photo: timothyPhoto,
    hasPhoto: true,
    qr: qrTimothy,
  },
  {
    firstName: "Prof. AGUS",
    lastName: "Setiawan",
    role_en: "Independence Board Advisor – ex Dean Faculty of Nurse University of Indonesia",
    role_id: "Penasihat Dewan Independen – eks Dekan Fakultas Keperawatan UI",
    photo: agusPhoto,
    hasPhoto: true,
    qr: qrAgus,
  },
  {
    firstName: "LIA",
    lastName: "Retnani",
    role_en: "Board Advisor – Pharma Marketing Expert",
    role_id: "Penasihat Dewan – Ahli Pemasaran Farmasi",
    photo: liaPhoto,
    hasPhoto: true,
    qr: qrLia,
  },
];

export default function Team() {
  const { lang, t } = useTranslation();

  return (
    <Layout>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#03989E" }}>
        {/* Decorative white folded-paper shapes kiri dan kanan */}
        <div className="absolute left-0 top-0 h-full flex items-center z-10 pointer-events-none">
          {/* Kiri: dua segitiga putih yang membentuk lipatan kertas */}
          <div className="relative w-28 md:w-40 lg:w-56 h-full flex flex-col">
            <div className="flex-1" style={{ background: "linear-gradient(135deg, white 50%, transparent 50%)" }} />
            <div className="flex-1" style={{ background: "linear-gradient(225deg, white 50%, transparent 50%)" }} />
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full flex items-center z-10 pointer-events-none">
          {/* Kanan: dua segitiga putih lipatan kertas */}
          <div className="relative w-28 md:w-40 lg:w-56 h-full flex flex-col">
            <div className="flex-1" style={{ background: "linear-gradient(315deg, white 50%, transparent 50%)" }} />
            <div className="flex-1" style={{ background: "linear-gradient(45deg, white 50%, transparent 50%)" }} />
          </div>
        </div>

        {/* Title — logo ikon menyatu dengan teks */}
        <div className="relative z-20 py-6 md:py-8 lg:py-10 flex items-center justify-center">
          <div className="flex items-center gap-0">
            {/* Logo P sebagai huruf pertama dari "Our" */}
            <img
              src={logoIcon3d}
              alt="P"
              style={{ height: "clamp(4rem, 10vw, 8rem)", width: "auto" }}
              className="object-contain shrink-0 -mr-1"
            />
            {/* "ur TEAM" menyambung langsung setelah logo */}
            <h1
              className="font-black font-heading text-white tracking-tight leading-none"
              style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
            >
              <span className="italic">ur </span>
              <span style={{ color: "#015779" }}>TEAM</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── 6-Member Grid ── */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200">
            {members.map((person, i) => (
              <MemberCard key={person.firstName} person={person} lang={lang} index={i} />
            ))}
          </div>

          {/* Bottom navy bar */}
          <div
            className="flex items-center justify-center py-3"
            style={{ backgroundColor: "#015779" }}
          >
            <span className="text-white text-sm font-medium tracking-wide">www.GlobalParo.com</span>
          </div>
        </div>
      </section>

      {/* ── Join Mission CTA ── */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)" }}
      >
        <div className="container text-center">
          <h2 className="text-3xl font-extrabold text-primary-foreground mb-4">{t.team.joinMission}</h2>
          <p className="text-primary-foreground/90 max-w-xl mx-auto mb-8">{t.team.joinMissionDesc}</p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/register">{t.common.registerNow} <ArrowRight className="h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

function MemberCard({ person, lang, index }: { person: Member; lang: string; index: number }) {
  const isBottomRow = index >= 3;
  const col = index % 3;
  const showRightBorder = col < 2;
  const showBottomBorder = !isBottomRow;

  return (
    <div
      className="bg-white flex flex-col"
      style={{
        borderRight: showRightBorder ? "1px solid #e5e7eb" : "none",
        borderBottom: showBottomBorder ? "1px solid #e5e7eb" : "none",
      }}
    >
      {/* Photo area */}
      <div className="relative flex items-center justify-center pt-8 pb-4 px-6 bg-white min-h-[200px]">
        {person.hasPhoto && person.photo ? (
          <div className="relative">
            {/* The photo already has the teal P-logo frame baked in */}
            <img
              src={person.photo}
              alt={`${person.firstName} ${person.lastName}`}
              className="w-48 h-40 object-contain"
            />
          </div>
        ) : (
          /* Placeholder: teal P-logo with no photo */
          <div className="relative flex items-center justify-center">
            <img src={teamLogoIcon} alt="Global Paro" className="w-32 h-32 object-contain opacity-60" />
          </div>
        )}

        {/* Arrow icon — bottom right of photo */}
        <img
          src={teamArrow}
          alt=""
          className="absolute bottom-6 right-8 w-6 h-6 object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Name / role info */}
      <div className="px-4 pb-5 flex items-start gap-3">
        {/* QR code */}
        {person.qr ? (
          <img
            src={person.qr}
            alt={`${person.firstName} LinkedIn QR`}
            className="shrink-0 w-12 h-12 object-contain rounded"
          />
        ) : (
          <div
            className="shrink-0 w-12 h-12 rounded border-2 flex items-center justify-center opacity-30"
            style={{ borderColor: "#015779" }}
          >
            <span className="text-xs font-bold" style={{ color: "#015779" }}>QR</span>
          </div>
        )}

        {/* Vertical navy bar */}
        <div className="self-stretch w-0.5 rounded-full shrink-0" style={{ backgroundColor: "#015779" }} />

        {/* Text */}
        <div className="min-w-0">
          <p className="font-black font-heading text-base leading-tight">
            <span style={{ color: "#03989E" }}>{person.firstName}</span>{" "}
            <span style={{ color: "#015779" }}>{person.lastName}</span>
          </p>
          <p className="text-xs text-gray-500 leading-snug mt-0.5">
            {lang === "id" ? person.role_id : person.role_en}
          </p>
          {person.linkedIn && (
            <a
              href={person.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline mt-1 block"
              style={{ color: "#03989E" }}
            >
              {person.linkedIn}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
