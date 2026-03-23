import { Link } from "react-router-dom";
import { ArrowRight, Bot, BookOpen, Handshake, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const approachCards = [
  {
    icon: Bot,
    title: "AI-Driven Assessment",
    desc: "We evaluate each nurse's profile, goals, STR status, English readiness and licensing requirements to create a personalised roadmap and build a trusted, job-ready database for global employers.",
    details: [
      "Complete profile analysis in minutes",
      "Personalised readiness score",
      "Country-specific gap identification",
      "Ongoing progress tracking",
    ],
  },
  {
    icon: BookOpen,
    title: "Guided Learning Pathway",
    desc: "Nurses receive customised learning plans for IELTS/TOEFL, NCLEX, and country-specific credentialing to ensure they meet all requirements efficiently.",
    details: [
      "Customised IELTS/OET study plan",
      "NCLEX 2026 resources",
      "Country credentialing checklists",
      "LMS platform with progress tracking",
    ],
  },
  {
    icon: Handshake,
    title: "Ethical Recruitment & Job Matching",
    desc: "We partner only with employers who meet international ethical recruitment standards and offer transparent processes, ensuring fair treatment and opportunities.",
    details: [
      "Verified employer network only",
      "Zero fees charged to nurses",
      "Full transparency at every step",
      "WHO Code of Practice compliant",
    ],
  },
  {
    icon: HeadphonesIcon,
    title: "Human + AI Support",
    desc: "Nurses can access instant AI assistance 24/7 and book real mentors for 1:1 sessions when they need deeper guidance and personalized support.",
    details: [
      "AI chatbot available 24/7",
      "1:1 mentor session booking",
      "Dedicated support agent assigned",
      "Community WhatsApp groups",
    ],
  },
];

export default function HowWeDoItApproach() {
  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative py-16 lg:py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}
      >
        <div className="container text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-white/20 text-white">
            How We Do It
          </span>
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-white mb-4">Our Approach</h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto">
            Four core pillars that power every nurse's journey to international success.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 lg:py-20">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {approachCards.map((card, i) => (
              <div
                key={card.title}
                className="group bg-card rounded-2xl p-7 border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl shrink-0"
                    style={{ backgroundColor: i % 2 === 0 ? "hsl(var(--primary) / 0.1)" : "hsl(var(--accent) / 0.1)" }}
                  >
                    <card.icon
                      className="h-7 w-7"
                      style={{ color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))" }}
                    />
                  </div>
                  <div>
                    <div
                      className="text-xs font-bold tracking-widest uppercase mb-1"
                      style={{ color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))" }}
                    >
                      Pillar {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{card.desc}</p>
                <ul className="space-y-2">
                  {card.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-foreground">
                      <div
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))" }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next section nav */}
      <section className="py-12 bg-muted">
        <div className="container max-w-3xl text-center">
          <p className="text-muted-foreground mb-4 text-sm">Continue learning about our methodology</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/how-we-do-it/difference">Know The Difference <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
            <Button asChild className="rounded-full" style={{ backgroundColor: "hsl(var(--accent))", color: "white" }}>
              <Link to="/how-we-do-it/journey">Your Journey Step by Step <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
