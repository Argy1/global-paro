import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Globe, Calendar, Loader2, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useContentBySlug, useContent } from "@/hooks/useContent";
import { useTranslation } from "@/i18n/LanguageContext";
import { useArticleSEO } from "@/hooks/useSEO";
import { WHATSAPP_URL } from "@/lib/contact";

export default function SuccessStoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: story, isLoading } = useContentBySlug(slug || "");

  // Dynamic per-article SEO (includes og:image for social previews)
  useArticleSEO({ title: story?.title, excerpt: story?.excerpt, coverImage: story?.cover_image_url, type: "success-story" });
  const { data: allStories } = useContent("SuccessStory");

  const related = allStories?.filter((s) => s.slug !== slug).slice(0, 3);

  if (isLoading) {
    return <Layout><div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }
  if (!story) {
    return (
      <Layout>
        <div className="container py-32 text-center">
          <h1 className="text-2xl font-bold">{t.stories.comingSoon}</h1>
          <Link to="/success-stories" className="text-primary hover:underline mt-4 inline-block">{t.storyDetail.backToStories}</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 bg-card border-b border-border">
        <div className="container">
          <Link to="/success-stories" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> {t.storyDetail.backToStories}
          </Link>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {story.country_focus && (
                <div className="flex items-center gap-2 text-sm text-accent mb-4">
                  <Globe className="h-4 w-4" />{story.country_focus}
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">{story.title}</h1>
              {story.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag) => <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground">{tag}</span>)}
                </div>
              )}
              {story.publish_date && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
                  <Calendar className="h-4 w-4" />{new Date(story.publish_date).toLocaleDateString()}
                </div>
              )}
              {story.cover_image_url && (
                <img src={story.cover_image_url} alt={story.title} className="w-full rounded-xl mb-8 max-h-[400px] object-cover" />
              )}
              <div className="prose prose-lg max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: story.body.replace(/\n/g, "<br/>") }} />
            </div>

            {/* Sidebar CTAs */}
            <aside className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-card border border-border sticky top-24 space-y-4">
                <h3 className="font-bold text-lg text-foreground">{t.storyDetail.startYourJourney}</h3>
                <p className="text-sm text-muted-foreground">{t.storyDetail.startYourJourneyDesc}</p>
                <Button variant="cta" className="w-full" asChild>
                  <Link to="/register">{t.common.registerNow} <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/quickstart">{t.footer.quickstartGuide}</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/help">{t.storyDetail.chatWithUs} <MessageCircle className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{t.storyDetail.whatsappSupport}</a>
                </Button>
              </div>

              {related && related.length > 0 && (
                <div>
                  <h3 className="font-bold text-foreground mb-4">{t.storyDetail.moreStories}</h3>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link key={r.id} to={`/success-stories/${r.slug}`} className="block bg-card rounded-lg p-4 border border-border hover:border-primary/30 transition-colors">
                        {r.country_focus && <span className="text-[10px] font-medium text-accent">{r.country_focus}</span>}
                        <h4 className="font-medium text-foreground text-sm mt-1">{r.title}</h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
