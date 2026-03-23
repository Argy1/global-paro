import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTranslation } from "@/i18n/LanguageContext";
import logoIcon3d from "@/assets/logo-icon-3d.png";
import logoText from "@/assets/logo-text.png";
import { INSTAGRAM_URL, SUPPORT_EMAIL, WHATSAPP_NUMBER_DISPLAY, WHATSAPP_TEL } from "@/lib/contact";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { t } = useTranslation();
  const isValid = (url?: string) => url && url !== "UPDATE_ME" && url.startsWith("http");
  const helpEmail = SUPPORT_EMAIL;
  const helpMobile = WHATSAPP_NUMBER_DISPLAY;

  const exploreLinks = [
    { href: "/about", label: "About Global Paro" },
    { href: "/what-we-do", label: "What We Do" },
    { href: "/how-we-do-it", label: "How We Do It" },
    { href: "/why-choose-us", label: "Why Choose Us" },
    { href: "/programs", label: "Programs & Pricing" },
    { href: "/quickstart", label: "Quickstart Guide" },
  ];

  const moreLinks = [
    { href: "/lms", label: "LMS" },
    { href: "/about#team", label: "Our Team" },
    { href: "/news", label: "News & Insights" },
    { href: "/success-stories", label: "Success Stories" },
    { href: "/employer", label: "For Employers" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  return (
    <footer style={{ backgroundColor: 'hsl(var(--primary))' }} className="text-primary-foreground">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand Column */}
          <div>
          <Link to="/" className="flex items-center gap-2 mb-5">
              <img src={logoIcon3d} alt="Global PARO Icon" className="h-12 w-auto object-contain brightness-0 invert" />
              <img src={logoText} alt="Global PARO" className="h-7 w-auto object-contain brightness-0 invert" />
              <div className="text-xs text-primary-foreground/60 mt-1 sr-only">Global Career Gateway for Nurses</div>
            </Link>
            <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed max-w-xs">
              Empowering nurses to build global careers through ethical recruitment, AI-driven learning, and transparent pathways.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { url: INSTAGRAM_URL, icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
                { url: settings?.linkedin_url, icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
                { url: settings?.tiktok_url, icon: <TikTokIcon className="h-4 w-4" />, label: "TikTok" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={isValid(social.url) ? social.url! : `mailto:${helpEmail}`}
                  target={isValid(social.url) ? "_blank" : undefined}
                  rel={isValid(social.url) ? "noopener noreferrer" : undefined}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110"
                  style={{ backgroundColor: 'hsl(var(--accent) / 0.25)', color: 'hsl(var(--primary-foreground))' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(var(--accent))'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(var(--accent) / 0.25)'; }}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="font-heading font-bold text-base mb-5 text-primary-foreground uppercase tracking-wide">Explore</h4>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/75 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More + Contact Column */}
          <div>
            <h4 className="font-heading font-bold text-base mb-5 text-primary-foreground uppercase tracking-wide">More</h4>
            <ul className="space-y-2.5 mb-6">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/75 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="space-y-2">
              <a
                href={`mailto:${helpEmail}`}
                className="flex items-center gap-2 text-sm text-primary-foreground/75 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {helpEmail}
              </a>
              <a
                href={WHATSAPP_TEL}
                className="flex items-center gap-2 text-sm text-primary-foreground/75 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {helpMobile}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-primary-foreground/50">
            <p>© {new Date().getFullYear()} Global Paro. All rights reserved.</p>
            <p className="text-center">We do not guarantee outcomes. Guidance-first, consent-based support.</p>
            <Link to="/privacy" className="hover:text-primary-foreground/80 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
