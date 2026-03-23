import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/contact";

export function FloatingWhatsApp() {
  const handleClick = () => {
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-all hover:scale-105 active:scale-95"
      aria-label="WhatsApp Support"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}
