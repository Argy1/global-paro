import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const redFlags = [
  "Asks you to pay fees upfront",
  "Promises guaranteed jobs or visas",
  "Pressures you to decide quickly",
  "Won't share employer details",
  "No clear contract or terms",
];

const greenFlags = [
  "No fees charged to candidates",
  "Transparent about process and timelines",
  "Gives you time and space to decide",
  "Shares verified employer information",
  "Clear consent and privacy practices",
];

const protections = [
  {
    title: "WHO Code of Practice",
    desc: "We strictly follow the WHO Code of Practice on the International Recruitment of Health Personnel.",
  },
  {
    title: "Zero Placement Fees",
    desc: "We never charge nurses any recruitment or placement fees. Our costs are covered by verified employers only.",
  },
  {
    title: "Full Data Privacy",
    desc: "Your personal and professional data is never shared without your explicit written consent.",
  },
];

export default function HowWeDoItDifference() {
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
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-white mb-4">Know the Difference</h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto">
            Protect yourself from unethical recruiters. Know what to look for.
          </p>
        </div>
      </section>

      {/* Red vs Green Flags */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black font-heading text-foreground">Red Flags vs Green Flags</h2>
            <p className="text-muted-foreground mt-2">Compare what unethical vs ethical recruitment looks like</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Red Flags */}
            <div
              className="bg-card rounded-2xl p-7 border-2"
              style={{ borderColor: "hsl(var(--destructive) / 0.3)", background: "hsl(var(--destructive) / 0.03)" }}
            >
              <h3
                className="font-bold text-lg mb-6 flex items-center gap-2"
                style={{ color: "hsl(var(--destructive))" }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "hsl(var(--destructive) / 0.1)" }}
                >
                  🚩
                </div>
                Red Flags — Run Away
              </h3>
              <ul className="space-y-4">
                {redFlags.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "hsl(var(--destructive))" }} />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Green Flags */}
            <div
              className="bg-card rounded-2xl p-7 border-2"
              style={{ borderColor: "hsl(var(--accent) / 0.4)", background: "hsl(var(--accent) / 0.03)" }}
            >
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2" style={{ color: "hsl(var(--accent))" }}>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}
                >
                  ✅
                </div>
                Green Flags — Global PARO
              </h3>
              <ul className="space-y-4">
                {greenFlags.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "hsl(var(--accent))" }} />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Protections */}
      <section className="py-16 lg:py-20">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: "hsl(var(--accent))" }}>
              Our Commitments
            </p>
            <h2 className="text-3xl font-black font-heading text-foreground">How We Protect You</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {protections.map((p) => (
              <div
                key={p.title}
                className="bg-card rounded-2xl p-6 border border-border hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl mb-4"
                  style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}
                >
                  <ShieldCheck className="h-5 w-5" style={{ color: "hsl(var(--accent))" }} />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: "linear-gradient(to right, #015779, #03989E)" }}>
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl font-black font-heading text-white mb-3">Work With a Recruiter You Can Trust</h2>
          <p className="text-white/80 mb-7 text-sm">
            Global PARO is fully committed to ethical, transparent, and nurse-first recruitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-full font-bold" style={{ backgroundColor: "white", color: "#015779" }}>
              <Link to="/register">Register Now <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full font-bold border-white text-white hover:bg-white/10">
              <Link to="/how-we-do-it/journey">See Your Journey</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
