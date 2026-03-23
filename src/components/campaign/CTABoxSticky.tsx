import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsAppLink } from "@/hooks/useWhatsAppLink";

interface CTABoxStickyProps {
  title?: string;
  description?: string;
  applyLabel?: string;
  className?: string;
}

export function CTABoxSticky({
  title = "Ready to Start?",
  description = "Take the first step toward your international nursing career.",
  applyLabel = "Apply Now",
  className = "",
}: CTABoxStickyProps) {
  const { handleWhatsAppClick } = useWhatsAppLink();

  return (
    <div className={`bg-card rounded-xl p-6 shadow-card border border-border sticky top-24 ${className}`}>
      <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      
      <div className="space-y-3">
        <Button variant="cta" className="w-full" asChild>
          <Link to="/apply">
            {applyLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="whatsappOutline" className="w-full" onClick={handleWhatsAppClick}>
          <MessageCircle className="h-4 w-4" />
          Join Community
        </Button>
      </div>
    </div>
  );
}
