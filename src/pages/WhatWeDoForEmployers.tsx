import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Languages, Users, Award } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { WhatWeDoCTA } from "@/components/whatwedo/WhatWeDoCTA";

const services = [
  {
    icon: ShieldCheck,
    title: "Verified Credentials & STR",
    desc: "Pre-screened nurses with verified qualifications and active STR status.",
  },
  {
    icon: Languages,
    title: "English Proficiency Certified",
    desc: "Candidates with certified English proficiency ready for international work.",
  },
  {
    icon: Users,
    title: "Ready-to-Relocate Candidates",
    desc: "Qualified nurses who are prepared and eager to start their international careers.",
  },
  {
    icon: Award,
    title: "Ethical Recruitment Compliance",
    desc: "We partner only with employers who meet international ethical recruitment standards.",
  },
];

export default function WhatWeDoForEmployers() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-14 bg-muted">
        <div className="container text-center max-w-2xl mx-auto">
          <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: "#03989E" }}>
            What We Do
          </p>
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-foreground mb-4">
            For Employers
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We deliver pre-qualified, verified talent with the{" "}
            <span className="font-bold" style={{ color: "#03989E" }}>right skills</span>,
            documentation, and readiness to relocate.
          </p>
        </div>
      </section>

      {/* 4-card grid */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container max-w-4xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:border-accent/40 hover:shadow-md transition-all text-center"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl mx-auto mb-4"
                  style={{ background: "rgba(3,152,158,0.1)" }}
                >
                  <s.icon className="h-6 w-6" style={{ color: "#03989E" }} />
                </div>
                <h3 className="font-bold text-sm text-foreground mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/employer"
              className="inline-flex items-center gap-2 font-bold px-8 py-3 rounded-full text-base transition-all hover:opacity-90 shadow-md text-white"
              style={{ background: "linear-gradient(to right, #03989E, #015779)" }}
            >
              Partner With Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <WhatWeDoCTA />
    </Layout>
  );
}
