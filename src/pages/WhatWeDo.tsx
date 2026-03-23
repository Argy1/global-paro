import { Link } from "react-router-dom";
import {
  ArrowRight, MapPin, Languages, FileCheck, Briefcase, Globe, MessageCircle,
  ShieldCheck, Award, Users, CheckCircle, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "@/i18n/LanguageContext";

const candidateServices = [
  { icon: MapPin, title: "Personalized Learning Path", desc: "AI-powered roadmap tailored to your nursing background, English level, and target country." },
  { icon: Languages, title: "IELTS / NCLEX Prep", desc: "Comprehensive study resources, mock tests, and expert coaching to hit your target scores." },
  { icon: FileCheck, title: "STR / License Verification", desc: "We help verify your Indonesian nursing license and guide credential authentication." },
  { icon: Briefcase, title: "Job Matching", desc: "Matched to verified employers in Singapore, USA, Canada, and beyond based on your profile." },
  { icon: Globe, title: "Visa & Relocation Support", desc: "Step-by-step guidance on work permits, visa applications, and settling in abroad." },
  { icon: MessageCircle, title: "Human + AI Support", desc: "24/7 AI chatbot for quick questions plus real human agents for complex guidance." },
];

const employerServices = [
  { icon: ShieldCheck, title: "Verified Credentials", desc: "Every candidate's documents and licenses are authenticated before matching." },
  { icon: Languages, title: "English Proficiency", desc: "Candidates meet IELTS/OET requirements relevant to your country standards." },
  { icon: Users, title: "Ready-to-Relocate", desc: "Pre-screened nurses who are committed and prepared for international placement." },
  { icon: Award, title: "Ethical Compliance", desc: "We follow WHO Code of Practice — transparent, fair, and nurse-first recruitment." },
];

const dontDoList = [
  "We do NOT charge fees to nurses — zero recruitment fees, ever.",
  "We do NOT guarantee job placement outcomes — we guide, not promise.",
  "We do NOT pressure nurses — everything is consent-based and voluntary.",
  "We do NOT share your personal data without explicit consent.",
  "We do NOT work with employers who violate ethical recruitment standards.",
];

export default function WhatWeDo() {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-16 lg:py-24">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-primary-foreground mb-4">{t.whatWeDo.title}</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">{t.whatWeDo.subtitle}</p>
        </div>
      </section>

      {/* For Candidates */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: 'hsl(var(--accent))' }}>For Nurses</p>
            <h2 className="text-3xl lg:text-4xl font-black font-heading text-foreground mb-3">{t.whatWeDo.forCandidates}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.whatWeDo.forCandidatesDesc}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidateServices.map((s, i) => (
              <div key={s.title} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:border-accent/40 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: 'hsl(var(--accent) / 0.1)' }}>
                  <s.icon className="h-6 w-6" style={{ color: 'hsl(var(--accent))' }} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: 'hsl(var(--primary))' }}>For Healthcare Employers</p>
            <h2 className="text-3xl lg:text-4xl font-black font-heading text-foreground mb-3">{t.whatWeDo.forEmployers}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.whatWeDo.forEmployersDesc}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {employerServices.map((s) => (
              <div key={s.title} className="bg-card rounded-2xl p-6 shadow-card border border-border text-center hover:border-primary/40 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl mx-auto mb-4" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                  <s.icon className="h-6 w-6" style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/employer">Partner With Us <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black font-heading text-foreground mb-3">{t.whatWeDo.whatWeDontDo}</h2>
            <p className="text-muted-foreground">{t.whatWeDo.whatWeDontDoDesc}</p>
          </div>
          <div className="bg-card rounded-2xl p-8 border-2 border-border shadow-card">
            <ul className="space-y-4">
              {dontDoList.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'hsl(var(--accent) / 0.1)' }}>
                    <CheckCircle className="h-4 w-4" style={{ color: 'hsl(var(--accent))' }} />
                  </div>
                  <p className="text-foreground">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl font-black font-heading text-primary-foreground mb-4">{t.whatWeDo.readyGetStarted}</h2>
          <p className="text-primary-foreground/85 mb-8">{t.whatWeDo.readyGetStartedDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              asChild
              className="rounded-full font-bold"
              style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--primary))' }}
            >
              <Link to="/register">{t.common.registerNow} <ArrowRight className="h-5 w-5" /></Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild className="rounded-full font-bold">
              <Link to="/how-we-do-it">{t.nav.howWeDoIt}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
