import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useQuickstartChapterBySlug, useQuickstartChapters } from "@/hooks/useQuickstartChapters";
import { useTranslation } from "@/i18n/LanguageContext";

export default function QuickstartChapter() {
  const { slug } = useParams<{ slug: string }>();
  const { data: chapter, isLoading } = useQuickstartChapterBySlug(slug || "");
  const { data: allChapters } = useQuickstartChapters();
  const { t } = useTranslation();

  const currentIndex = allChapters?.findIndex((c) => c.slug === slug) ?? -1;
  const prevChapter = currentIndex > 0 ? allChapters?.[currentIndex - 1] : null;
  const nextChapter = allChapters && currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  if (isLoading) {
    return <Layout><div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }

  if (!chapter) {
    return (
      <Layout>
        <div className="container py-32 text-center">
          <h1 className="text-2xl font-bold">{t.quickstartChapter.notFound}</h1>
          <Link to="/quickstart" className="text-primary hover:underline mt-4 inline-block">
            {t.quickstartChapter.notFoundBack}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 bg-card border-b border-border">
        <div className="container">
          <Link to="/quickstart" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> {t.quickstartChapter.backToGuide}
          </Link>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container max-w-3xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-6">{chapter.title}</h1>
          <div className="prose prose-lg max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: chapter.body.replace(/\n/g, "<br/>") }} />

          {/* Chapter navigation */}
          <div className="flex justify-between mt-12 pt-8 border-t border-border">
            {prevChapter ? (
              <Button variant="outline" asChild>
                <Link to={`/quickstart/${prevChapter.slug}`}><ArrowLeft className="h-4 w-4" /> {prevChapter.title}</Link>
              </Button>
            ) : <div />}
            {nextChapter ? (
              <Button variant="cta" asChild>
                <Link to={`/quickstart/${nextChapter.slug}`}>{nextChapter.title} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            ) : (
              <Button variant="cta" asChild>
                <Link to="/register">{t.quickstartChapter.registerNow} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
