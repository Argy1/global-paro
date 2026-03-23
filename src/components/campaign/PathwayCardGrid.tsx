import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathways } from "@/hooks/usePathways";
import { WHATSAPP_URL } from "@/lib/contact";

const countryFlags: Record<string, string> = {
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  "Canada": "🇨🇦",
  "Australia": "🇦🇺",
  "Germany": "🇩🇪",
  "Ireland": "🇮🇪",
};

interface PathwayCardGridProps {
  limit?: number;
  showViewAll?: boolean;
}

export function PathwayCardGrid({ limit, showViewAll = true }: PathwayCardGridProps) {
  const { data: pathways, isLoading } = usePathways();

  const displayedPathways = limit ? pathways?.slice(0, limit) : pathways;

  // Empty state when no pathways are active
  if (!isLoading && (!displayedPathways || displayedPathways.length === 0)) {
    return (
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
              Popular Destination Pathways
            </h2>
          </div>
          <div className="max-w-md mx-auto text-center">
            <div className="bg-card rounded-xl p-8 shadow-card border border-border">
              <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">
                Pathways are being updated
              </h3>
              <p className="text-muted-foreground mb-6">
                Join the community for the latest updates on new destination pathways.
              </p>
              <Button variant="whatsapp" asChild>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Join WhatsApp Community
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit || 4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-card border border-border animate-pulse">
                <div className="h-10 w-10 bg-muted-foreground/20 rounded mb-4" />
                <div className="h-6 w-24 bg-muted-foreground/20 rounded mb-2" />
                <div className="h-4 w-full bg-muted-foreground/20 rounded mb-4" />
                <div className="h-10 w-full bg-muted-foreground/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            Popular Destination Pathways
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore verified opportunities in top healthcare destinations worldwide.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedPathways?.map((pathway) => {
            const requirements = Array.isArray(pathway.requirements) 
              ? (pathway.requirements as string[]).slice(0, 3) 
              : [];
            const timelineSteps = Array.isArray(pathway.timeline_steps) 
              ? (pathway.timeline_steps as string[]) 
              : [];

            return (
              <div
                key={pathway.id}
                className="group bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-lg hover:border-primary/30 transition-all flex flex-col"
              >
                <span className="text-4xl mb-4 block">{countryFlags[pathway.country] || "🌍"}</span>
                
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {pathway.country}
                </h3>

                {/* 3 requirement bullets */}
                <ul className="space-y-1.5 mb-4 flex-1">
                  {requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{req}</span>
                    </li>
                  ))}
                </ul>

                {/* Timeline note */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{timelineSteps.length} steps • Timeline varies</span>
                </div>

                {/* CTAs */}
                <div className="space-y-2">
                  <Button variant="tertiary" size="sm" className="w-full" asChild>
                    <Link to={`/pathways/${pathway.slug}`}>
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button variant="cta" size="sm" className="w-full" asChild>
                    <Link to="/apply">Apply Now</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {showViewAll && (
          <div className="text-center mt-10">
            <Button variant="tertiary" size="lg" asChild>
              <Link to="/pathways">
                Explore Pathways
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
