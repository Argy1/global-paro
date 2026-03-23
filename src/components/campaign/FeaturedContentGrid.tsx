import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/useContent";

interface FeaturedContentGridProps {
  limit?: number;
  showViewAll?: boolean;
}

export function FeaturedContentGrid({ limit = 6, showViewAll = true }: FeaturedContentGridProps) {
  const { data: articles, isLoading } = useContent("News");
  const displayedArticles = articles?.slice(0, limit);

  if (!isLoading && (!displayedArticles || displayedArticles.length === 0)) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-card border border-border animate-pulse">
                <div className="h-4 w-20 bg-muted-foreground/20 rounded mb-3" />
                <div className="h-6 w-full bg-muted-foreground/20 rounded mb-2" />
                <div className="h-4 w-3/4 bg-muted-foreground/20 rounded" />
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
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">Resources & Guides</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Free resources to help you prepare for your international nursing career.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles?.map((article) => (
            <Link key={article.id} to={`/news/${article.slug}`} className="group bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-lg hover:border-primary/30 transition-all">
              {article.tags?.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-3">
                  <BookOpen className="h-3 w-3" />{article.tags[0]}
                </span>
              )}
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
              <span className="text-primary font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Read <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
        {showViewAll && (
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/news">Explore Content <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
