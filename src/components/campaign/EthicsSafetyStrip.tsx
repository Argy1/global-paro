import { Link } from "react-router-dom";
import { Shield, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const greenFlags = [
  "Employer pays all fees",
  "Clear contract terms",
  "Verified job offers",
];

const redFlags = [
  "Asks you to pay fees",
  "Vague job details",
  "Pressure to decide fast",
];

interface EthicsSafetyStripProps {
  variant?: "default" | "compact";
}

export function EthicsSafetyStrip({ variant = "default" }: EthicsSafetyStripProps) {
  if (variant === "compact") {
    return (
      <section className="py-8 bg-primary/5 border-y border-primary/10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <p className="font-medium text-foreground">
                We never charge nurses. Employers pay all fees.
              </p>
            </div>
            <Button variant="link" asChild className="text-primary">
              <Link to="/ethics">
                Learn About Our Ethics Policy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-card">
      <div className="container">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Ethical Recruitment
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            How We Keep It Ethical
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Know the difference between ethical recruitment and potential scams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Green Flags */}
          <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Green Flags ✓</h3>
            </div>
            <ul className="space-y-3">
              {greenFlags.map((flag) => (
                <li key={flag} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flags */}
          <div className="bg-destructive/10 rounded-xl p-6 border border-destructive/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-destructive flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Red Flags ✗</h3>
            </div>
            <ul className="space-y-3">
              {redFlags.map((flag) => (
                <li key={flag} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link to="/ethics">
              Read Our Full Ethics Policy
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
