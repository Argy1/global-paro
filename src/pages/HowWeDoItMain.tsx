import { Link } from "react-router-dom";
import { ArrowRight, Bot, BookOpen, Handshake, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const approachCards = [
  {
    icon: Bot,
    title: "AI-Driven Assessment",
    desc: "We evaluate each nurse's profile, goals, STR status, English readiness and licensing requirements to create a personalised roadmap and build a trusted, job-ready database for global employers.",
  },
  {
    icon: BookOpen,
    title: "Guided Learning Pathway",
    desc: "Nurses receive customised learning plans for IELTS/TOEFL, NCLEX, and country-specific credentialing to ensure they meet all requirements efficiently.",
  },
  {
    icon: Handshake,
    title: "Ethical Recruitment & Job Matching",
    desc: "We partner only with employers who meet international ethical recruitment standards and offer transparent processes, ensuring fair treatment and opportunities.",
  },
  {
    icon: HeadphonesIcon,
    title: "Human + AI Support",
    desc: "Nurses can access instant AI assistance 24/7 and book real mentors for 1:1 sessions when they need deeper guidance and personalized support.",
  },
];

const subPages = [
  {
    href: "/how-we-do-it/approach",
    label: "Our Approach",
    desc: "How AI + human expertise create your personalized pathway",
    color: "hsl(var(--primary))",
  },
  {
    href: "/how-we-do-it/difference",
    label: "Know The Difference",
    desc: "Red flags vs Green flags — protect yourself from unethical recruiters",
    color: "hsl(var(--destructive))",
  },
  {
    href: "/how-we-do-it/journey",
    label: "Your Journey Step by Step",
    desc: "A clear 4-phase roadmap from readiness to international placement",
    color: "hsl(var(--accent))",
  },
];

export default function HowWeDoItMain() {
  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative py-20 lg:py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="container relative text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 bg-white/20 text-white">
            Our Methodology
          </span>
          <h1 className="text-4xl lg:text-6xl font-black font-heading text-white mb-5 leading-tight">
            How We Do It
          </h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10">
            We combine smart technology with human expertise to create your personalized pathway to success.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full font-bold px-8"
            style={{ backgroundColor: "white", color: "#015779" }}
          >
            <Link to="/register">Start Your Journey <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </section>

      {/* Our Approach Preview */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: "hsl(var(--accent))" }}>Our Approach</p>
            <h2 className="text-3xl lg:text-4xl font-black font-heading text-foreground">4 Pillars of Our Methodology</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Everything we do is built on these four principles</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {approachCards.map((card) => (
              <div
                key={card.title}
                className="group bg-card rounded-2xl p-6 border border-border hover:border-accent/40 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-colors"
                  style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}
                >
                  <card.icon className="h-6 w-6" style={{ color: "hsl(var(--accent))" }} />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/how-we-do-it/approach"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
              style={{ color: "hsl(var(--accent))" }}
            >
              See full Our Approach <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sub-page cards */}
      <section className="py-16 bg-muted">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black font-heading text-foreground">Explore Each Section</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {subPages.map((p) => (
              <Link
                key={p.href}
                to={p.href}
                className="group bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-1 w-12 rounded-full mb-4" style={{ backgroundColor: p.color }} />
                <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{p.label}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{p.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: p.color }}>
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "linear-gradient(to right, #015779, #03989E)" }}>
        <div className="container text-center">
          <h2 className="text-3xl font-black font-heading text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">Join thousands of nurses who trusted Global PARO to guide their international career.</p>
          <Button asChild size="lg" className="rounded-full font-bold" style={{ backgroundColor: "white", color: "#015779" }}>
            <Link to="/register">Register Now <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
