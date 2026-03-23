import * as React from "react";
import { Instagram, Linkedin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { toast } from "@/hooks/use-toast";
import { INSTAGRAM_URL } from "@/lib/contact";

const TikTokIcon = React.forwardRef<SVGSVGElement, { className?: string }>(
  ({ className }, ref) => (
    <svg ref={ref} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
);
TikTokIcon.displayName = "TikTokIcon";

const socialPlatforms = [
  {
    name: "Instagram",
    icon: Instagram,
    description: "Daily tips and nurse stories",
    urlKey: "instagram_url" as const,
    color: "from-pink-500 to-purple-600",
  },
  {
    name: "TikTok",
    icon: TikTokIcon,
    description: "Quick guides and community clips",
    urlKey: "tiktok_url" as const,
    color: "from-gray-900 to-gray-700",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    description: "Professional updates and opportunities",
    urlKey: "linkedin_url" as const,
    color: "from-blue-600 to-blue-800",
  },
];

export function SocialStrip() {
  const { data: socialLinks, isLoading } = useSocialLinks();

  const isValidUrl = (url: string | undefined) => {
    return url && url !== "UPDATE_ME" && url.startsWith("http");
  };

  const handleClick = (url: string | undefined, name: string) => {
    if (isValidUrl(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Coming Soon",
        description: `Our ${name} link will be available soon. Contact: hello@globalparo.com`,
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-card border border-border animate-pulse">
                <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                <div className="h-6 w-24 bg-muted rounded mb-2" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            Follow Our Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay connected for tips, stories, and community updates.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {socialPlatforms.map((platform) => {
            const url = platform.name === "Instagram" ? INSTAGRAM_URL : socialLinks?.[platform.urlKey];
            const isValid = isValidUrl(url);

            return (
              <div
                key={platform.name}
                className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-lg transition-shadow text-center"
              >
                <div
                  className={`h-14 w-14 rounded-xl bg-gradient-to-br ${platform.color} mx-auto flex items-center justify-center mb-4`}
                >
                  <platform.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{platform.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>
                <Button
                  variant={isValid ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => handleClick(url, platform.name)}
                  className="w-full min-h-[44px]"
                >
                  {isValid ? (
                    <>
                      Follow Us
                      <ExternalLink className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <span className="text-muted-foreground">Link coming soon</span>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
