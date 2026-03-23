import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { WhatWeDoCTA } from "@/components/whatwedo/WhatWeDoCTA";

const items = [
  "We do not guarantee job placements or visa approvals.",
  "We do not charge nurses any fees — ever.",
  "We do not pressure you into decisions.",
  "We do not share your data without your explicit consent.",
];

export default function WhatWeDontDo() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-14 bg-muted">
        <div className="container text-center max-w-2xl mx-auto">
          <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: "#03989E" }}>
            Transparency
          </p>
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-foreground mb-4">
            What We Don't Do
          </h1>
          <p className="text-muted-foreground text-lg">
            We believe in transparency. Here's what you should know:
          </p>
        </div>
      </section>

      {/* List card */}
      <section className="py-16 bg-muted">
        <div className="container max-w-3xl">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8 md:p-10">
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span
                    className="shrink-0 mt-0.5 font-black text-base"
                    style={{ color: "#03989E" }}
                  >
                    →
                  </span>
                  <p className="text-foreground text-base leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <WhatWeDoCTA />
    </Layout>
  );
}
