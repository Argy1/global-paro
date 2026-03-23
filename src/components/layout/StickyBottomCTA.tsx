import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/contact";

export function StickyBottomCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsApp = () => {
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-lg transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="container py-3 flex items-center justify-center gap-3 sm:gap-4">
        <Button variant="cta" size="sm" className="flex-1 sm:flex-none" asChild>
          <Link to="/register">
            Register <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="whatsapp" size="sm" className="flex-1 sm:flex-none" onClick={handleWhatsApp}>
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
