import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Mail, Globe, Search, ChevronDown, UserCircle, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoIcon3d from "@/assets/logo-icon-3d.png";
import logoText from "@/assets/logo-text.png";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "@/components/layout/SearchBar";
import { SUPPORT_EMAIL, WHATSAPP_TEL } from "@/lib/contact";

interface DropdownItem {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  dropdown?: DropdownItem[];
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useTranslation();
  const { user, signOut, isAdmin } = useAuth();

  // Fetch user avatar from profiles
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate("/auth");
  };

  const helpEmail = SUPPORT_EMAIL;

  // Handle anchor links: navigate to page then scroll to section
  const handleAnchorLink = (href: string) => {
    const [path, hash] = href.split("#");
    const targetPath = path || location.pathname;

    const getHeaderOffset = () => {
      const stickyHeader = document.querySelector("header.sticky") as HTMLElement | null;
      return stickyHeader?.offsetHeight ?? 80;
    };

    const scrollToHash = (id: string) => {
      if (id === "global-paro") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return true;
      }

      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
        window.scrollTo({ top, behavior: "smooth" });
        return true;
      }
      return false;
    };

    if (hash) {
      if (location.pathname !== targetPath) {
        navigate(`${targetPath}#${hash}`);
      } else {
        navigate(`${targetPath}#${hash}`, { replace: true });
      }

      if (scrollToHash(hash)) {
        return;
      }

      let attempts = 0;
      const maxAttempts = 20;
      const timer = window.setInterval(() => {
        attempts += 1;
        if (scrollToHash(hash) || attempts >= maxAttempts) {
          window.clearInterval(timer);
        }
      }, 100);
    } else {
      navigate(href);
    }
  };
  const navItems: NavItem[] = [
    {
      label: "About Us",
      dropdown: [
        { href: "/about#global-paro", label: "Global Paro" },
        { href: "/about#vision", label: "Our Vision" },
        { href: "/about#mission", label: "Our Mission" },
        { href: "/about#values", label: "Our Values" },
        { href: "/about#team", label: "Our Team" },
        
      ],
    },
    {
      label: "What We Do",
      dropdown: [
        { href: "/what-we-do", label: "What We Do" },
        { href: "/what-we-do#candidates", label: "For Candidates" },
        { href: "/what-we-do/employers", label: "For Employers" },
        { href: "/lms", label: "LMS" },
        { href: "/lms/ielts", label: "IELTS Preparation" },
        { href: "/lms/certified", label: "Certified Global Nurse" },
        { href: "/lms/nclex", label: "NCLEX 2026 Resources" },
      ],
    },
    {
      label: "How We Do It",
      dropdown: [
        { href: "/how-we-do-it", label: "How We Do It" },
        { href: "/how-we-do-it#approach", label: "Our Approach" },
        { href: "/how-we-do-it#journey", label: "Your Journey Step by Step" },
      ],
    },
    { href: "/why-choose-us", label: "Why Choose Us" },
    {
      label: "Programs",
      dropdown: [
        { href: "/programs/batch", label: "Batch Program" },
        { href: "/programs/requirements", label: "Global Job Opportunities Now" },
        { href: "/programs/webinar", label: "Webinar" },
        { href: "/quickstart", label: "Nurse Blog" },
      ],
    },
    { href: "/register", label: "Register" },
  ];

  const toggleLang = () => setLang(lang === "en" ? "id" : "en" as Lang);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md" style={{ backgroundColor: 'hsl(var(--card))' }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: 'hsl(var(--primary))' }} className="py-1.5">
        <div className="container flex items-center justify-between gap-4">
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            aria-label="Switch language"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "English" : "Indonesia"}
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* Search */}
          <SearchBar />

            {/* Right icons */}
          <div className="flex items-center gap-3">
            <Link to="/help" className="flex items-center gap-1 text-xs text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Help
            </Link>
            <a href={WHATSAPP_TEL} className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <Phone className="h-3.5 w-3.5" />
            </a>
            <a href={`mailto:${helpEmail}`} className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <Mail className="h-3.5 w-3.5" />
            </a>

            {user ? (
              /* ── Logged-in user menu ── */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 h-6 px-2 rounded-full text-xs font-semibold text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                  aria-label="User menu"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="avatar"
                      className="h-5 w-5 rounded-full object-cover border border-primary-foreground/30"
                    />
                  ) : (
                    <UserCircle className="h-4 w-4" />
                  )}
                  <span className="hidden sm:block max-w-[100px] truncate">
                    {profile?.display_name || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg border border-border py-1.5 z-50 animate-fade-in"
                    style={{ backgroundColor: "hsl(var(--card))" }}
                  >
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-accent hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/portal"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-accent hover:bg-muted transition-colors"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      My Portal
                    </Link>
                    <Link
                      to="/account-settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-accent hover:bg-muted transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Account Settings
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                asChild
                size="sm"
                className="h-6 px-3 text-xs rounded-full font-semibold"
                style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
              >
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="container flex h-16 items-center justify-between gap-4" style={{ backgroundColor: 'hsl(var(--card))' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoIcon3d} alt="Global PARO Icon" className="h-12 w-auto object-contain" />
          <img src={logoText} alt="Global PARO" className="h-8 w-auto object-contain" />
        </Link>

        {/* Desktop Nav — CSS group/group-hover, no JS state needed */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              {item.href && !item.dropdown ? (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap",
                    location.pathname === item.href
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap",
                    item.dropdown?.some((d) => d.href.split("#")[0] === location.pathname)
                      ? "text-accent"
                      : "text-foreground hover:text-accent group-hover:text-accent"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
              )}

              {/* Dropdown — uses CSS group-hover, seamless bridge with pt-2 */}
              {item.dropdown && (
                <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                  <div
                    className="w-52 rounded-xl shadow-lg border border-border py-2"
                    style={{ backgroundColor: 'hsl(var(--card))' }}
                  >
                    {item.dropdown.map((sub) => (
                      <button
                        key={sub.href}
                        onClick={() => handleAnchorLink(sub.href)}
                        className="block w-full text-left px-4 py-2.5 text-sm font-medium text-foreground hover:text-accent hover:bg-muted transition-colors"
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="xl:hidden border-t border-border animate-fade-in" style={{ backgroundColor: 'hsl(var(--card))' }}>
          <nav className="container py-4 flex flex-col gap-1 max-h-[75vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.href && !item.dropdown ? (
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-sm font-semibold rounded-lg transition-colors",
                      location.pathname === item.href
                        ? "text-accent bg-muted"
                        : "text-foreground hover:text-accent hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-foreground hover:text-accent hover:bg-muted rounded-lg transition-colors"
                    >
                      {item.label}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", mobileExpanded === item.label && "rotate-180")} />
                    </button>
                    {mobileExpanded === item.label && item.dropdown && (
                      <div className="pl-4 pb-2">
                        {item.dropdown.map((sub) => (
                          <button
                            key={sub.href}
                            onClick={() => { handleAnchorLink(sub.href); setIsOpen(false); setMobileExpanded(null); }}
                            className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-border mt-2">
              <div className="flex items-center justify-between px-4 py-2">
                <button onClick={toggleLang} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  {lang === "en" ? "Switch to Indonesia" : "Switch to English"}
                </button>
              </div>
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground hover:text-accent hover:bg-muted rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/portal"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground hover:text-accent hover:bg-muted rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" /> My Portal
                  </Link>
                  <Link
                    to="/account-settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground hover:text-accent hover:bg-muted rounded-lg transition-colors"
                  >
                    <Settings className="h-4 w-4" /> Account Settings
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full mt-2 gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                    onClick={() => { handleSignOut(); setIsOpen(false); }}
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full mt-2" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>Login</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
