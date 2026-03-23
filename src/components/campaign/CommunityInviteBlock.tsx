import { MessageCircle, CheckCircle, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsAppLink } from "@/hooks/useWhatsAppLink";

const benefits = [
  "Real-time answers from nurses worldwide",
  "Job alerts and opportunity notifications",
  "Study group partners for exams",
  "Settlement tips and emotional support",
];

const rules = [
  "Be respectful and supportive",
  "No recruitment fees or scams",
  "No spam or self-promotion",
];

interface CommunityInviteBlockProps {
  variant?: "default" | "compact";
}

export function CommunityInviteBlock({ variant = "default" }: CommunityInviteBlockProps) {
  const { handleWhatsAppClick } = useWhatsAppLink();

  if (variant === "compact") {
    return (
      <section className="py-12 lg:py-16 bg-mint/30">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Join Our WhatsApp Community</h3>
                <p className="text-sm text-muted-foreground">Connect with nurses worldwide</p>
              </div>
            </div>
            <Button variant="whatsapp" onClick={handleWhatsAppClick}>
              <MessageCircle className="h-4 w-4" />
              Join WhatsApp
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Free Community
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
              Join Our Global Nursing Community
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Connect with nurses worldwide. Get real advice, find study partners, and never feel alone on your journey.
            </p>

            <div className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Button variant="whatsapp" size="lg" onClick={handleWhatsAppClick}>
              <MessageCircle className="h-5 w-5" />
              Join WhatsApp Community
            </Button>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Community Guidelines</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Our community is a safe space. We expect all members to follow these simple rules:
            </p>
            <ul className="space-y-3">
              {rules.map((rule) => (
                <li key={rule} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
