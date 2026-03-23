import { CheckCircle, FileText, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: CheckCircle,
    title: "Check Eligibility",
    description: "Review destination requirements and see if you qualify for your target country.",
  },
  {
    step: 2,
    icon: FileText,
    title: "Submit Profile",
    description: "Complete our simple application form. No fees, ever.",
  },
  {
    step: 3,
    icon: Compass,
    title: "Get Guided Next Steps",
    description: "Our team contacts you with personalized pathway recommendations.",
  },
];

interface ProcessStepsProps {
  showCTA?: boolean;
}

export function ProcessSteps({ showCTA = true }: ProcessStepsProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your international nursing journey starts with three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connection line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-border" />
          
          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              {/* Step number */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold relative z-10">
                  {item.step}
                </div>
              </div>
              
              <div className="h-12 w-12 rounded-lg bg-mint mx-auto flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-mint-foreground" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        {showCTA && (
          <div className="text-center mt-12">
            <Button variant="cta" size="lg" asChild>
              <Link to="/apply">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
