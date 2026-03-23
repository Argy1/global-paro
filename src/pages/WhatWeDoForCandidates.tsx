import { MapPin, Languages, FileCheck, Briefcase, Globe, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { WhatWeDoCTA } from "@/components/whatwedo/WhatWeDoCTA";

const services = [
  {
    icon: MapPin,
    title: "Personalized Learning Pathways",
    desc: "Customised learning plans tailored to your qualifications, goals, and target countries.",
  },
  {
    icon: Languages,
    title: "IELTS & NCLEX Preparation",
    desc: "Guided preparation resources for English proficiency and licensing examinations.",
  },
  {
    icon: FileCheck,
    title: "STR Verification Support",
    desc: "Assistance with STR/SIP verification and documentation processing.",
  },
  {
    icon: Briefcase,
    title: "Job Matching",
    desc: "Ethical job matching with verified employers — transparently and with full consent.",
  },
  {
    icon: Globe,
    title: "Visa & Relocation Assistance",
    desc: "Support with visa applications, relocation planning, and settling-in guidance.",
  },
  {
    icon: MessageCircle,
    title: "Human + AI Support",
    desc: "24/7 AI assistance plus real mentors for 1:1 sessions when you need deeper guidance.",
  },
];

export default function WhatWeDoForCandidates() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-14 bg-muted">
        <div className="container text-center max-w-2xl mx-auto">
          <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: "#03989E" }}>
            What We Do
          </p>
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-foreground mb-4">
            For Candidates
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We provide personalised guidance, licensing preparation, skill verification, and ethical job matching — all in one place.
          </p>
        </div>
      </section>

      {/* 3x2 Grid */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-card rounded-2xl p-7 border border-border shadow-sm hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl mb-5"
                  style={{ background: "rgba(3,152,158,0.1)" }}
                >
                  <s.icon className="h-6 w-6" style={{ color: "#03989E" }} />
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhatWeDoCTA />
    </Layout>
  );
}
