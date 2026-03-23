import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Database, UserCheck, Trash2, Mail } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "@/i18n/LanguageContext";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Header */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              {t.common.backToHome}
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">{t.privacy.title}</h1>
            <p className="text-lg text-primary-foreground/80 mt-4">{t.privacy.lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Overview */}
            <div className="bg-card rounded-xl p-6 lg:p-8 shadow-card border border-border mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">{t.privacy.commitmentTitle}</h2>
              </div>
              <p className="text-muted-foreground">{t.privacy.commitmentDesc}</p>
            </div>

            {/* Data Collection */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-6 w-6 text-accent" />
                <h2 className="text-xl font-bold text-foreground">{t.privacy.dataCollectionTitle}</h2>
              </div>
              <div className="bg-muted rounded-lg p-6">
                <p className="text-foreground mb-4">{t.privacy.dataCollectionIntro}</p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>{t.privacy.contactInfo}</strong> {t.privacy.contactInfoDesc}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>{t.privacy.professionalDetails}</strong> {t.privacy.professionalDetailsDesc}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>{t.privacy.careerPreferences}</strong> {t.privacy.careerPreferencesDesc}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>{t.privacy.consentRecords}</strong> {t.privacy.consentRecordsDesc}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Consent */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">{t.privacy.howWeUseTitle}</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">{t.privacy.howWeUseIntro}</p>
                <ul className="space-y-2 text-foreground">
                  {t.privacy.howWeUseList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground"><strong>{t.privacy.importantNote}</strong></p>
              </div>
            </div>

            {/* Data Deletion */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="h-6 w-6 text-destructive" />
                <h2 className="text-xl font-bold text-foreground">{t.privacy.deletionTitle}</h2>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                <p className="text-foreground mb-4">{t.privacy.deletionDesc}</p>
                <p className="text-foreground mb-4">{t.privacy.deletionHow}</p>
                <a href="mailto:hello@globalparo.com?subject=Data Deletion Request" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                  <Mail className="h-5 w-5" />
                  hello@globalparo.com
                </a>
                <p className="text-sm text-muted-foreground mt-4">{t.privacy.deletionNote}</p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">{t.privacy.rightsTitle}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="font-medium text-foreground mb-2">{t.privacy.access}</h3>
                  <p className="text-sm text-muted-foreground">{t.privacy.accessDesc}</p>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="font-medium text-foreground mb-2">{t.privacy.correction}</h3>
                  <p className="text-sm text-muted-foreground">{t.privacy.correctionDesc}</p>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="font-medium text-foreground mb-2">{t.privacy.deletion}</h3>
                  <p className="text-sm text-muted-foreground">{t.privacy.deletionRight}</p>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="font-medium text-foreground mb-2">{t.privacy.withdrawConsent}</h3>
                  <p className="text-sm text-muted-foreground">{t.privacy.withdrawConsentDesc}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 text-center">
              <h2 className="text-xl font-bold text-foreground mb-2">{t.privacy.questionsTitle}</h2>
              <p className="text-muted-foreground mb-4">{t.privacy.questionsDesc}</p>
              <a href="mailto:hello@globalparo.com" className="text-primary font-bold hover:underline">hello@globalparo.com</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
