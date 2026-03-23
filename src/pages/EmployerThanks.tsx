import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useSetting } from "@/hooks/useSiteSettings";
import { useTranslation } from "@/i18n/LanguageContext";
import { SUPPORT_EMAIL } from "@/lib/contact";

export default function EmployerThanks() {
  const { value: bookingLink } = useSetting("booking_20min_link");
  const { t } = useTranslation();
  const email = SUPPORT_EMAIL;

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">{t.employerThanks.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{t.employerThanks.subtitle}</p>

          <div className="bg-card border border-border rounded-xl p-6 lg:p-8 text-left mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">{t.employerThanks.howItWorks}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.employerThanks.howItWorksDesc}</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/what-we-do">{t.common.learnMore} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            {bookingLink ? (
              <Button variant="cta" size="lg" asChild>
                <a href={bookingLink} target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-5 w-5" /> {t.employerThanks.bookDiscussion}
                </a>
              </Button>
            ) : (
              <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground text-center">
                <Calendar className="h-5 w-5 mx-auto mb-1 opacity-50" />
                {t.employerThanks.bookingComingSoon} — email <a href={`mailto:${email}`} className="text-primary underline">{email}</a>
              </div>
            )}
            <Button variant="default" size="lg" asChild>
              <a href={`mailto:${email}`}><Mail className="h-5 w-5" /> {t.employerThanks.contactSupport}</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/">{t.common.backToHome}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
