import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";

interface SEOConfig {
  titleEn: string;
  titleId: string;
  descEn: string;
  descId: string;
}

const routeSEO: Record<string, SEOConfig> = {
  "/": {
    titleEn: "Global PARO | Nursing Careers Abroad for Indonesian Nurses",
    titleId: "Global PARO | Karier Keperawatan Internasional untuk Perawat Indonesia",
    descEn: "Helping Indonesian nurses build global healthcare careers through ethical recruitment, AI-powered learning, and transparent pathways.",
    descId: "Membantu perawat Indonesia meraih karier kesehatan global melalui rekrutmen etis, pembelajaran berbasis AI, dan jalur yang transparan.",
  },
  "/about": {
    titleEn: "About Us | Global PARO",
    titleId: "Tentang Kami | Global PARO",
    descEn: "Learn about Global PARO's vision, mission, core values, and the team behind our ethical nurse recruitment platform.",
    descId: "Kenali visi, misi, nilai inti, dan tim di balik platform rekrutmen perawat etis Global PARO.",
  },
  "/what-we-do": {
    titleEn: "What We Do | Global PARO",
    titleId: "Apa yang Kami Lakukan | Global PARO",
    descEn: "We provide personalised guidance, licensing preparation, ethical job matching, and ongoing support for Indonesian nurses going global.",
    descId: "Kami menyediakan panduan personal, persiapan lisensi, pencocokan kerja etis, dan dukungan berkelanjutan bagi perawat Indonesia yang ingin berkarier global.",
  },
  "/how-we-do-it": {
    titleEn: "How We Do It | Global PARO",
    titleId: "Cara Kami Bekerja | Global PARO",
    descEn: "Our 4-step methodology: AI-driven assessment, guided learning, ethical job matching, and human + AI support.",
    descId: "Metodologi 4 langkah kami: penilaian berbasis AI, pembelajaran terpandu, pencocokan kerja etis, dan dukungan manusia + AI.",
  },
  "/programs": {
    titleEn: "Programs & Pricing | Global PARO",
    titleId: "Program & Harga | Global PARO",
    descEn: "Join Batch #1 — Nurse in Singapore. Limited to 50 nurses. Deployment target: May 2026.",
    descId: "Ikuti Batch #1 — Perawat di Singapura. Hanya 50 tempat tersedia. Target penempatan: Mei 2026.",
  },
  "/programs/batch": {
    titleEn: "Batch #1 — Nurse in Singapore | Global PARO",
    titleId: "Batch #1 — Perawat di Singapura | Global PARO",
    descEn: "Apply now for our first batch — Healthcare Assistant role in Singapore with 2-year contract and clear career pathway.",
    descId: "Daftar sekarang untuk batch pertama kami — posisi Healthcare Assistant di Singapura dengan kontrak 2 tahun dan jalur karier yang jelas.",
  },
  "/programs/requirements": {
    titleEn: "Requirement Criteria | Global PARO",
    titleId: "Kriteria Persyaratan | Global PARO",
    descEn: "Check if you qualify as an RN, EN, or HA for our Singapore Batch #1 nursing program.",
    descId: "Periksa apakah kamu memenuhi syarat sebagai RN, EN, atau HA untuk program perawat Singapura Batch #1 kami.",
  },
  "/programs/webinar": {
    titleEn: "Free Webinar — Nursing Careers in Singapore | Global PARO",
    titleId: "Webinar Gratis — Karier Perawat di Singapura | Global PARO",
    descEn: "Join our free live webinar about working as a nurse in Singapore — requirements, salary, benefits, and Q&A.",
    descId: "Ikuti webinar langsung gratis kami tentang bekerja sebagai perawat di Singapura — persyaratan, gaji, tunjangan, dan sesi tanya jawab.",
  },
  "/quickstart": {
    titleEn: "Quickstart Guide | Global PARO",
    titleId: "Panduan Cepat | Global PARO",
    descEn: "10 essential chapters every aspiring global nurse should read — from global demand to ethical pathways.",
    descId: "10 bab penting yang wajib dibaca setiap calon perawat global — dari permintaan tenaga global hingga jalur yang etis.",
  },
  "/lms": {
    titleEn: "Learning Resources | Global PARO",
    titleId: "Sumber Belajar | Global PARO",
    descEn: "Free IELTS prep, NCLEX resources, and Certified Global Nurse pathway — all in one place.",
    descId: "Persiapan IELTS gratis, sumber daya NCLEX, dan jalur Certified Global Nurse — semuanya di satu tempat.",
  },
  "/lms/ielts": {
    titleEn: "IELTS Preparation | Global PARO",
    titleId: "Persiapan IELTS | Global PARO",
    descEn: "Free IELTS practice materials, mock tests, and resources from top providers for nurses going global.",
    descId: "Materi latihan IELTS gratis, tes simulasi, dan sumber belajar dari penyedia terbaik untuk perawat yang ingin berkarier global.",
  },
  "/lms/nclex": {
    titleEn: "NCLEX 2026 Resources | Global PARO",
    titleId: "Sumber Daya NCLEX 2026 | Global PARO",
    descEn: "Sample NCLEX materials, practice questions, and key facts for Indonesian nurses preparing for the US nursing exam.",
    descId: "Materi NCLEX contoh, soal latihan, dan fakta penting bagi perawat Indonesia yang mempersiapkan ujian keperawatan AS.",
  },
  "/lms/certified": {
    titleEn: "Certified Global Nurse (CGN) | Global PARO",
    titleId: "Certified Global Nurse (CGN) | Global PARO",
    descEn: "Learn about the CGN certification — a prerequisite for NCLEX registration for Indonesian nurses.",
    descId: "Pelajari sertifikasi CGN — syarat wajib pendaftaran NCLEX bagi perawat Indonesia.",
  },
  "/news": {
    titleEn: "News & Insights | Global PARO",
    titleId: "Berita & Wawasan | Global PARO",
    descEn: "Stay informed with the latest guidance, news, and updates on international nursing careers.",
    descId: "Tetap terinformasi dengan panduan terbaru, berita, dan pembaruan tentang karier keperawatan internasional.",
  },
  "/success-stories": {
    titleEn: "Success Stories | Global PARO",
    titleId: "Kisah Sukses | Global PARO",
    descEn: "Real transformation journeys from Indonesian nurses who pursued and achieved their international careers.",
    descId: "Kisah transformasi nyata dari perawat Indonesia yang berhasil mengejar dan meraih karier internasional mereka.",
  },
  "/help": {
    titleEn: "Help Center | Global PARO",
    titleId: "Pusat Bantuan | Global PARO",
    descEn: "Get answers to common questions or reach out via email, WhatsApp, or phone. We're here to help.",
    descId: "Temukan jawaban untuk pertanyaan umum atau hubungi kami via email, WhatsApp, atau telepon. Kami siap membantu.",
  },
  "/register": {
    titleEn: "Register | Global PARO",
    titleId: "Daftar | Global PARO",
    descEn: "Create your nurse profile in under 3 minutes and start your international career journey today.",
    descId: "Buat profil perawatmu dalam kurang dari 3 menit dan mulailah perjalanan karier internasionalmu hari ini.",
  },
  "/employer": {
    titleEn: "For Employers | Global PARO",
    titleId: "Untuk Pemberi Kerja | Global PARO",
    descEn: "Connect with pre-screened, qualified Indonesian nurses ready for international placement.",
    descId: "Terhubung dengan perawat Indonesia berkualifikasi dan terseleksi yang siap untuk penempatan internasional.",
  },
  "/privacy": {
    titleEn: "Privacy Notice | Global PARO",
    titleId: "Pemberitahuan Privasi | Global PARO",
    descEn: "Learn how Global PARO collects, uses, and protects your personal data.",
    descId: "Pelajari bagaimana Global PARO mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  },
  "/portal": {
    titleEn: "My Application | Global PARO",
    titleId: "Aplikasi Saya | Global PARO",
    descEn: "View your application status, journey stage, and uploaded documents.",
    descId: "Lihat status aplikasi, tahap perjalanan, dan dokumen yang telah diunggah.",
  },
};

const DEFAULT_SEO: SEOConfig = {
  titleEn: "Global PARO | Nursing Careers Abroad",
  titleId: "Global PARO | Karier Keperawatan Internasional",
  descEn: "Ethical, AI-powered platform for Indonesian nurses pursuing international healthcare careers.",
  descId: "Platform berbasis AI yang etis untuk perawat Indonesia yang mengejar karier kesehatan internasional.",
};

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function applyMeta(title: string, desc: string, lang: string) {
  document.documentElement.lang = lang === "id" ? "id" : "en";
  document.title = title;
  setMeta("description", desc);
  setMeta("og:title", title, true);
  setMeta("og:description", desc, true);
  setMeta("og:type", "website", true);
  setMeta("twitter:title", title);
  setMeta("twitter:description", desc);
}

export function useSEO() {
  const { lang } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    // Dynamic article routes — handled by useArticleSEO in the page
    if (pathname.match(/^\/news\/.+/) || pathname.match(/^\/success-stories\/.+/)) {
      return;
    }

    const config =
      routeSEO[pathname] ||
      Object.entries(routeSEO).find(([key]) => pathname.startsWith(key + "/"))?.[1] ||
      DEFAULT_SEO;

    const title = lang === "id" ? config.titleId : config.titleEn;
    const desc = lang === "id" ? config.descId : config.descEn;
    applyMeta(title, desc, lang);
  }, [lang, location.pathname]);
}

/**
 * useArticleSEO — call inside NewsDetail / SuccessStoryDetail once article data loads.
 */
export function useArticleSEO(opts: {
  title?: string | null;
  excerpt?: string | null;
  coverImage?: string | null;
  type: "news" | "success-story";
}) {
  const { lang } = useTranslation();
  const { title, excerpt, coverImage, type } = opts;

  useEffect(() => {
    if (!title) return;

    const suffix = " | Global PARO";
    const metaTitle = title.length > 55 ? title.slice(0, 52) + "..." + suffix : title + suffix;
    const metaDesc = excerpt
      ? excerpt.length > 155
        ? excerpt.slice(0, 152) + "..."
        : excerpt
      : type === "news"
      ? lang === "id"
        ? "Baca artikel terbaru tentang karier keperawatan internasional di Global PARO."
        : "Read the latest article on international nursing careers at Global PARO."
      : lang === "id"
      ? "Kisah inspiratif perawat Indonesia yang berhasil meraih karier internasional."
      : "An inspiring story of an Indonesian nurse achieving an international career.";

    applyMeta(metaTitle, metaDesc, lang);

    // og:image — inject/update when cover image is available
    if (coverImage) {
      setMeta("og:image", coverImage, true);
      setMeta("og:image:width", "1200", true);
      setMeta("og:image:height", "630", true);
      setMeta("twitter:image", coverImage);
      setMeta("twitter:card", "summary_large_image");
    }
  }, [title, excerpt, coverImage, lang, type]);
}
