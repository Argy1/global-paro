import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-nurses.jpg";
import { WHATSAPP_URL } from "@/lib/contact";

interface HeroCampaignProps {
  headline?: React.ReactNode;
  subheadline?: string;
  showImage?: boolean;
  compact?: boolean;
}

export function HeroCampaign({
  headline = (
    <>
      Global Career<br />
      <span className="text-mint">Gateway</span> for<br />
      Nurses
    </>
  ),
  subheadline = "Empowering every international nurse with the knowledge, tools, and support they need to succeed abroad — through ethical recruitment, AI-driven learning, and transparent pathways.",
  showImage = true,
  compact = false,
}: HeroCampaignProps) {
  return (
    <section className="relative gradient-hero overflow-hidden">
      {/* Subtle globe pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='white' stroke-width='0.5'/%3E%3Cellipse cx='50' cy='50' rx='40' ry='20' fill='none' stroke='white' stroke-width='0.5'/%3E%3Cellipse cx='50' cy='50' rx='40' ry='20' fill='none' stroke='white' stroke-width='0.5' transform='rotate(60 50 50)'/%3E%3Cellipse cx='50' cy='50' rx='40' ry='20' fill='none' stroke='white' stroke-width='0.5' transform='rotate(120 50 50)'/%3E%3C/svg%3E")`,
            backgroundSize: '150px 150px',
          }}
        />
      </div>
      
      <div className={`container relative ${compact ? 'py-12 lg:py-16' : 'py-16 lg:py-24'}`}>
        <div className={`grid ${showImage ? 'lg:grid-cols-2' : ''} gap-8 lg:gap-12 items-center`}>
          <div className={`text-center ${showImage ? 'lg:text-left' : ''} animate-fade-up`}>
            {/* Trust badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              100% Ethical Recruitment
            </span>
            
            <h1 className={`${compact ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-extrabold text-primary-foreground leading-tight mb-6`}>
              {headline}
            </h1>
            
            <p className={`text-lg ${compact ? '' : 'md:text-xl'} text-primary-foreground/90 mb-6 max-w-lg ${showImage ? 'mx-auto lg:mx-0' : 'mx-auto'}`}>
              {subheadline}
            </p>

            {/* Trust microcopy */}
            <p className="text-sm text-primary-foreground/70 mb-8">
              Ethical • Transparent • Supportive
            </p>

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row gap-4 ${showImage ? 'justify-center lg:justify-start' : 'justify-center'}`}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/apply">
                  Apply Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Join WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {showImage && (
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-float">
                <img
                  src={heroImage}
                  alt="Diverse team of international nurses"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
