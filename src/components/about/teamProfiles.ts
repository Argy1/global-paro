import dumaPhoto from "@/assets/team-duma-evi.png";
import timothyPhoto from "@/assets/team-dr-timothy-low.png";
import reiPhoto from "@/assets/team-rei-lim.png";
import aulianaPhoto from "@/assets/team-auliana-idi-retnani.png";
import dodyPhoto from "@/assets/team-dody-senputra.png";
import brigitaPhoto from "@/assets/team-brigita-diansari.png";

export type LocalizedText = {
  id: string;
  en: string;
};

export type TeamProfile = {
  id: string;
  name: string;
  photo: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
};

export const teamProfiles: TeamProfile[] = [
  {
    id: "duma-evi",
    name: "DUMA EVI",
    photo: dumaPhoto,
    title: {
      en: "CEO & Founder",
      id: "CEO & Pendiri",
    },
    subtitle: {
      en: "",
      id: "",
    },
    description: {
      en: "Duma Evi is the Founder and CEO of Global Paro, a healthcare career platform building structured international pathways for nurses and healthcare professionals. Her mission is to help talented nurses from emerging markets access global career opportunities; ethically, strategically, and at scale.\n\nPreviously, she held leadership roles at Elsevier, Eli Lilly, MIMS, and the Embassy of the Netherlands in Indonesia, bringing over 19 years of experience in healthcare.",
      id: "Duma Evi adalah Founder dan CEO Global Paro, sebuah platform karier kesehatan yang membangun jalur internasional terstruktur bagi perawat dan tenaga kesehatan. Misinya adalah membantu perawat berbakat dari pasar berkembang mengakses peluang karier global secara etis, strategis, dan berdampak luas.\n\nSebelumnya, ia memegang peran kepemimpinan di Elsevier, Eli Lilly, MIMS, serta Kedutaan Besar Belanda di Indonesia, dengan pengalaman lebih dari 19 tahun di sektor kesehatan.",
    },
  },
  {
    id: "timothy-low",
    name: "Dr. TIMOTHY LOW",
    photo: timothyPhoto,
    title: {
      en: "Board Advisor",
      id: "Penasihat Dewan",
    },
    subtitle: {
      en: "Healthcare Provider Communities",
      id: "Komunitas Penyedia Layanan Kesehatan",
    },
    description: {
      en: "A healthcare entrepreneur and cross-border life sciences strategist operating across Asia, and as strategic investor.\n\nBased in Singapore, Singapore based physicians-leader and former CEO of Gleneagles Hospital and Farrer Park Hospital. Leader of Global Healthcare Investment at Pavillion Capital (Temasek affiliate).",
      id: "Seorang entrepreneur di bidang kesehatan dan strategis life sciences lintas negara yang beroperasi di Asia, sekaligus investor strategis.\n\nBerbasis di Singapura, beliau merupakan physician-leader dan mantan CEO Gleneagles Hospital serta Farrer Park Hospital. Saat ini memimpin investasi Global Healthcare di Pavillion Capital (afiliasi Temasek).",
    },
  },
  {
    id: "rei-lim",
    name: "REI LIM",
    photo: reiPhoto,
    title: {
      en: "Strategic Investor",
      id: "Investor Strategis",
    },
    subtitle: {
      en: "",
      id: "",
    },
    description: {
      en: "Rei Lim is a healthcare entrepreneur and cross-border commercial strategist operating across Asia's life sciences sector.\n\nHe is the Founder of Pharminex, a cross-border life sciences platform connecting leading Chinese biotech innovations with Southeast Asian and global partners. The platform facilitates structured introductions, commercial alignment, and regional execution.",
      id: "Rei Lim adalah entrepreneur kesehatan dan strategis komersial lintas negara yang beroperasi di sektor life sciences Asia.\n\nIa adalah Founder Pharminex, platform life sciences lintas negara yang menghubungkan inovasi biotech terdepan dari Tiongkok dengan mitra di Asia Tenggara dan global. Platform ini memfasilitasi pengenalan terstruktur, penyelarasan komersial, dan eksekusi regional.",
    },
  },
  {
    id: "auliana-idi-retnani",
    name: "AULIANA IDI RETNANI",
    photo: aulianaPhoto,
    title: {
      en: "Board Advisor",
      id: "Penasihat Dewan",
    },
    subtitle: {
      en: "Pharma Marketing Expert",
      id: "Ahli Pemasaran Farmasi",
    },
    description: {
      en: "Lia is a Marketing Lead at APL, a Zuellig Pharma Company in Indonesia, with extensive experience in marketing and product strategy within the pharmaceutical sector.\n\nShe has previously held roles at Boehringer Ingelheim and other organizations, contributing to digital marketing support, product management, and brand development. Her career reflects a strong focus on strategic marketing and innovation in healthcare.",
      id: "Lia adalah Marketing Lead di APL, perusahaan Zuellig Pharma di Indonesia, dengan pengalaman luas pada strategi pemasaran dan produk di sektor farmasi.\n\nSebelumnya, ia memegang berbagai peran di Boehringer Ingelheim dan organisasi lain, berkontribusi pada dukungan digital marketing, manajemen produk, serta pengembangan merek. Kariernya mencerminkan fokus kuat pada pemasaran strategis dan inovasi di bidang kesehatan.",
    },
  },
  {
    id: "dody-senputra",
    name: "DODY SENPUTRA",
    photo: dodyPhoto,
    title: {
      en: "Chief Technology Officer",
      id: "Chief Technology Officer",
    },
    subtitle: {
      en: "",
      id: "",
    },
    description: {
      en: "CTO of Skillio, an LMS platform that prepares students for internships in Singapore.\n\nCurrently with ByteDance /TikTok in Singapore.",
      id: "CTO Skillio, platform LMS yang mempersiapkan siswa untuk program magang di Singapura.\n\nSaat ini berkarya di ByteDance / TikTok Singapura.",
    },
  },
  {
    id: "brigita-dianasari",
    name: "BRIGITA DIANASARI",
    photo: brigitaPhoto,
    title: {
      en: "Content Creator Healthcare",
      id: "Content Creator Healthcare",
    },
    subtitle: {
      en: "& Marketing Nurse Community",
      id: "& Marketing Nurse Community",
    },
    description: {
      en: "Gita is a Bachelor of nursing with with 7 years experience in providing high-quality patient care in diverse healthcare environments, including operating theatre and clinic.\n\nShe develops and manages engaging content for social media and developing communication strategy in Nurse Community",
      id: "Gita adalah Sarjana Keperawatan dengan pengalaman 7 tahun dalam memberikan layanan pasien berkualitas tinggi di berbagai lingkungan kesehatan, termasuk kamar operasi dan klinik.\n\nIa mengembangkan dan mengelola konten media sosial yang menarik serta menyusun strategi komunikasi untuk komunitas perawat.",
    },
  },
];
