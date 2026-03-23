import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { WHATSAPP_URL } from "@/lib/contact";

export function useWhatsAppLink() {
  const navigate = useNavigate();

  const isValidLink = (link: string | undefined | null): boolean => {
    return !!link && link !== "UPDATE_ME" && link.startsWith("http");
  };

  const getFirstValidLink = (): string | null => WHATSAPP_URL;

  const handleWhatsAppClick = (e?: React.MouseEvent, specificLink?: string) => {
    e?.preventDefault();
    
    const linkToUse = specificLink || getFirstValidLink();
    
    if (linkToUse && isValidLink(linkToUse)) {
      window.open(linkToUse, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Link Coming Soon",
        description: "WhatsApp group link will be available soon. Contact: hello@globalparo.com",
        variant: "default",
      });
      // Navigate to community page for more options
      navigate("/community");
    }
  };

  const handleGroupClick = (link: string, e: React.MouseEvent) => {
    if (!isValidLink(link)) {
      e.preventDefault();
      toast({
        title: "Link Coming Soon",
        description: "This WhatsApp group link will be available soon. Contact: hello@globalparo.com",
        variant: "default",
      });
    }
  };

  return {
    isValidLink,
    getFirstValidLink,
    handleWhatsAppClick,
    handleGroupClick,
  };
}
