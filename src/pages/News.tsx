import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Loader2, Newspaper } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContent } from "@/hooks/useContent";
import { useTranslation } from "@/i18n/LanguageContext";

export default function News() {
  const { t } = useTranslation();
  const { data: articles, isLoading } = useContent("News");
  const [search, setSearch] = useState("");

  const filtered = articles?.filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a.excerpt || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <section className="gradient-hero py-16 lg:py-24">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4">{t.news.title}</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">{t.news.subtitle}</p>
        </div>
      </section>

      <section className="py-8 bg-card border-b border-border">
        <div className="container">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.news.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <Link key={article.id} to={`/news/${article.slug}`} className="bg-card rounded-xl overflow-hidden shadow-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group">
                  <div className="p-6">
                    {article.tags?.length > 0 && <span className="text-xs font-medium text-accent">{article.tags[0]}</span>}
                    <h3 className="font-bold text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                    {article.publish_date && <p className="text-xs text-muted-foreground mt-4">{new Date(article.publish_date).toLocaleDateString()}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-bold text-foreground mb-2">{t.news.noArticles}</h3>
              <p className="text-muted-foreground">{t.news.noArticlesDesc}</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl font-extrabold text-primary-foreground mb-8">{t.news.readyNextStep}</h2>
          <Button variant="hero" size="xl" asChild>
            <Link to="/register">{t.common.registerNow} <ArrowRight className="h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
