import { Link } from "react-router-dom";
import { Mail, Phone, MessageCircle, ArrowRight, ChevronDown, ChevronUp, Loader2, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "@/i18n/LanguageContext";
import { useFaqItems, FaqItem } from "@/hooks/useFaqItems";
import { cn } from "@/lib/utils";
import { SUPPORT_EMAIL, WHATSAPP_NUMBER_DISPLAY, WHATSAPP_TEL, WHATSAPP_URL } from "@/lib/contact";

const CATEGORY_LABELS: Record<FaqItem["category"], { en: string; id: string; emoji: string }> = {
  General:      { en: "General",       id: "Umum",           emoji: "💡" },
  Registration: { en: "Registration",  id: "Pendaftaran",    emoji: "📝" },
  English:      { en: "English Tests", id: "Tes Bahasa",     emoji: "🎓" },
  Licensing:    { en: "Licensing",     id: "Lisensi",        emoji: "📋" },
  Pathways:     { en: "Programs",      id: "Program",        emoji: "✈️" },
  Privacy:      { en: "Privacy",       id: "Privasi",        emoji: "🔒" },
  Employer:     { en: "For Employers", id: "Untuk Employer", emoji: "🏥" },
};

const CATEGORY_ORDER: FaqItem["category"][] = [
  "General", "Registration", "Pathways", "English", "Licensing", "Privacy", "Employer",
];

function FaqAccordionItem({ faq, highlight }: { faq: FaqItem; highlight?: string }) {
  const [open, setOpen] = useState(false);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/20 text-primary rounded-sm px-0.5">{part}</mark>
      ) : part
    );
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-card hover:bg-muted/50 transition-colors gap-3"
      >
        <span className="font-semibold text-foreground text-sm leading-snug">
          {highlightText(faq.question, highlight || "")}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 bg-card border-t border-border">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {highlightText(faq.answer, highlight || "")}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const { t, lang } = useTranslation();
  const { data: faqItems, isLoading, isError } = useFaqItems();
  const [searchQuery, setSearchQuery] = useState("");

  const email = SUPPORT_EMAIL;
  const mobile = WHATSAPP_NUMBER_DISPLAY;

  const [activeCategory, setActiveCategory] = useState<FaqItem["category"] | "All">("All");

  // Group FAQ items by category
  const grouped = useMemo(() => {
    if (!faqItems) return {};
    return CATEGORY_ORDER.reduce<Record<string, FaqItem[]>>((acc, cat) => {
      const items = faqItems.filter((f) => f.category === cat);
      if (items.length) acc[cat] = items;
      return acc;
    }, {});
  }, [faqItems]);

  const categories = Object.keys(grouped) as FaqItem["category"][];

  // Filter by search query AND active category
  const displayedGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const source = activeCategory === "All" ? grouped : { [activeCategory]: grouped[activeCategory] ?? [] };

    if (!q) return source;

    const filtered: Record<string, FaqItem[]> = {};
    for (const [cat, items] of Object.entries(source)) {
      const matched = items.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
      if (matched.length) filtered[cat] = matched;
    }
    return filtered;
  }, [grouped, activeCategory, searchQuery]);

  const totalResultCount = Object.values(displayedGroups).flat().length;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <Layout>
      <section className="gradient-hero py-16 lg:py-24">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4">{t.help.title}</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">{t.help.subtitle}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl mx-auto">
          {/* Contact cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="bg-card rounded-xl p-6 shadow-card border border-border text-center">
              <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-foreground mb-2">{t.help.email}</h3>
              <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card border border-border text-center">
              <MessageCircle className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-foreground mb-2">{t.help.whatsapp}</h3>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{t.help.chatOnWhatsApp}</a>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card border border-border text-center">
              <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-foreground mb-2">{t.help.phone}</h3>
              <a href={WHATSAPP_TEL} className="text-primary hover:underline">{mobile}</a>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-extrabold text-foreground mb-6">{t.help.faqTitle}</h2>

            {isLoading && (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">{t.help.loadingFaqs}</span>
              </div>
            )}

            {isError && (
              <p className="text-sm text-destructive text-center py-8">
                {t.help.faqError}
              </p>
            )}

            {!isLoading && !isError && faqItems && faqItems.length > 0 && (
              <>
                {/* Search bar */}
                <div className="relative mb-5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder={t.help.searchFaq}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Category filter pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <button
                    onClick={() => setActiveCategory("All")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                      activeCategory === "All"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    {t.help.filterAll}
                  </button>
                  {categories.map((cat) => {
                    const meta = CATEGORY_LABELS[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                          activeCategory === cat
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        )}
                      >
                        {meta.emoji} {lang === "id" ? meta.id : meta.en}
                      </button>
                    );
                  })}
                </div>

                {/* No results state */}
                {isSearching && totalResultCount === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">{t.help.noResults}</p>
                  </div>
                )}

                {/* FAQ groups */}
                <div className="space-y-10">
                  {Object.entries(displayedGroups).map(([cat, items]) => {
                    const meta = CATEGORY_LABELS[cat as FaqItem["category"]];
                    return (
                      <div key={cat}>
                        {activeCategory === "All" && (
                          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                            <span>{meta.emoji}</span>
                            <span>{lang === "id" ? meta.id : meta.en}</span>
                          </h3>
                        )}
                        <div className="space-y-2">
                          {items.map((faq) => (
                            <FaqAccordionItem key={faq.id} faq={faq} highlight={searchQuery} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Fallback: show hardcoded FAQs if DB has no items */}
            {!isLoading && !isError && (!faqItems || faqItems.length === 0) && (
              <div className="space-y-4">
                {t.help.faqs.map((faq) => (
                  <div key={faq.q} className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl font-extrabold text-primary-foreground mb-8">{t.help.stillHaveQuestions}</h2>
          <Button variant="hero" size="xl" asChild>
            <a href={`mailto:${email}`}>{t.common.emailUs} <ArrowRight className="h-5 w-5" /></a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
