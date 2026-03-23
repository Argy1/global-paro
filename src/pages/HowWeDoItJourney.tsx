import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const journeySteps = [
  {
    num: "01",
    title: "Register & Profile Assessment",
    desc: "You submit your profile and our AI evaluates your qualifications, STR, and English readiness to build your personalized roadmap.",
    details: [
      "You submit your profile (3 min)",
      "AI evaluates your qualifications, STR, and English readiness",
      "Receive a personalized readiness roadmap",
    ],
    color: "hsl(var(--primary))",
  },
  {
    num: "02",
    title: "Guided Learning & Preparation",
    desc: "Access customised IELTS/NCLEX learning plans, country-specific credentialing guidance, and document preparation support.",
    details: [
      "Customised IELTS/NCLEX learning plans",
      "Country-specific credentialing guidance",
      "Document checklist and timeline planning",
    ],
    color: "hsl(var(--accent))",
  },
  {
    num: "03",
    title: "Ethical Job Matching",
    desc: "Once ready, get introduced to verified ethical employers aligned with your specialty and destination country.",
    details: [
      "Connect with verified ethical employers",
      "Transparent process — full employer visibility",
      "No pressure, no hidden fees, full consent",
    ],
    color: "hsl(var(--primary))",
  },
  {
    num: "04",
    title: "Placement & Ongoing Support",
    desc: "We guide you through visa applications, pre-departure prep, and support you in your new home country.",
    details: [
      "Visa & relocation assistance",
      "Settling-in support and onboarding",
      "Ongoing community and career development",
    ],
    color: "hsl(var(--accent))",
  },
];

export default function HowWeDoItJourney() {
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
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-white mb-4">
            Your Journey Step by Step
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto">
            A clear 4-phase roadmap from readiness assessment to successful international placement.
          </p>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {journeySteps.map((step, i) => (
              <div
                key={step.num}
                className="group relative bg-card rounded-2xl p-7 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Step number badge */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl font-black text-xl font-heading text-white mb-5"
                  style={{ backgroundColor: step.color }}
                >
                  {step.num}
                </div>
                {/* Connecting line for desktop */}
                {i < journeySteps.length - 1 && i % 2 === 0 && (
                  <div
                    className="absolute top-10 -right-4 w-8 h-0.5 hidden lg:block"
                    style={{ backgroundColor: "hsl(var(--border))" }}
                  />
                )}
                <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{step.desc}</p>
                <ul className="space-y-2.5">
                  {step.details.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-foreground">
                      <CheckCircle
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: step.color }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Flow indicator */}
          <div className="flex items-center justify-center gap-3 mt-12 flex-wrap">
            {journeySteps.map((step, i) => (
              <div key={step.num} className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {step.num}
                </div>
                {i < journeySteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, #015779 0%, #03989E 100%)" }}
      >
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-black font-heading text-white mb-3">Start Your Journey Today</h2>
          <p className="text-white/80 mb-8">
            Register now and get your personalised readiness roadmap in minutes.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full font-bold px-10"
            style={{ backgroundColor: "white", color: "#015779" }}
          >
            <Link to="/register">Register Now <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
