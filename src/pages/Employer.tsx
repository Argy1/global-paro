import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { useSubmitEmployerInquiry } from "@/hooks/useEmployerInquiry";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTranslation } from "@/i18n/LanguageContext";
import { toast } from "@/hooks/use-toast";

export default function Employer() {
  const navigate = useNavigate();
  const submitInquiry = useSubmitEmployerInquiry();
  const { data: settings } = useSiteSettings();
  const { t } = useTranslation();
  const bookingLink = settings?.booking_20min_link;
  const hasBooking = bookingLink && bookingLink !== "UPDATE_ME" && bookingLink.startsWith("http");

  const [form, setForm] = useState({ institution_name: "", institutional_email: "", title: "", contact_mobile: "", workforce_needs: "", preferred_timeline: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.institution_name.trim()) e.institution_name = `${t.employer.institutionName} ${t.register.required}`;
    if (!form.institutional_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.institutional_email)) e.institutional_email = t.register.validEmail;
    if (!form.title.trim()) e.title = `${t.employer.yourTitle} ${t.register.required}`;
    if (!form.contact_mobile.trim()) e.contact_mobile = `${t.employer.contactMobile} ${t.register.required}`;
    if (!form.workforce_needs.trim()) e.workforce_needs = `${t.employer.workforceNeeds} ${t.register.required}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submitInquiry.mutate(
      { institution_name: form.institution_name.trim(), institutional_email: form.institutional_email.trim(), title: form.title.trim(), contact_mobile: form.contact_mobile.trim(), workforce_needs: form.workforce_needs.trim(), preferred_timeline: form.preferred_timeline.trim() || undefined },
      { onSuccess: () => navigate("/employer/thanks"), onError: () => toast({ title: "Submission failed", description: "Please try again.", variant: "destructive" }) }
    );
  };

  return (
    <Layout>
      <section className="gradient-hero py-16 lg:py-24">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4">{t.employer.title}</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">{t.employer.subtitle}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground mb-6">{t.employer.whyWorkWithUs}</h2>
              <div className="space-y-4">
                {t.employer.whyList.map((item) => (
                  <p key={item} className="flex items-start gap-3 text-muted-foreground"><span className="text-accent font-bold mt-0.5">✓</span> {item}</p>
                ))}
              </div>
              {hasBooking && (
                <div className="mt-8 p-6 bg-secondary rounded-xl">
                  <h3 className="font-bold text-foreground mb-2">{t.employer.bookCall}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t.employer.bookCallDesc}</p>
                  <Button variant="cta" asChild>
                    <a href={bookingLink} target="_blank" rel="noopener noreferrer">{t.employer.bookNow} <ArrowRight className="h-4 w-4" /></a>
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl p-8 shadow-card border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">{t.employer.submitInquiry}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "institution_name", label: `${t.employer.institutionName} *`, placeholder: "Hospital / Organization" },
                  { id: "institutional_email", label: `${t.employer.institutionalEmail} *`, placeholder: "work@hospital.com", type: "email" },
                  { id: "title", label: `${t.employer.yourTitle} *`, placeholder: "e.g., HR Director" },
                  { id: "contact_mobile", label: `${t.employer.contactMobile} *`, placeholder: "+1 234 567 8900" },
                  { id: "preferred_timeline", label: t.employer.preferredTimeline, placeholder: "e.g., Q2 2026" },
                ].map((field) => (
                  <div key={field.id} className="space-y-1">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input id={field.id} type={field.type || "text"} value={form[field.id as keyof typeof form]} onChange={(e) => setForm((p) => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} maxLength={255} className={errors[field.id] ? "border-destructive" : ""} />
                    {errors[field.id] && <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors[field.id]}</p>}
                  </div>
                ))}
                <div className="space-y-1">
                  <Label htmlFor="workforce_needs">{t.employer.workforceNeeds} *</Label>
                  <textarea id="workforce_needs" value={form.workforce_needs} onChange={(e) => setForm((p) => ({ ...p, workforce_needs: e.target.value }))} placeholder={t.employer.workforceNeedsPlaceholder} maxLength={2000} className={`w-full rounded-lg border bg-background px-3 py-2 text-sm min-h-[100px] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.workforce_needs ? "border-destructive" : "border-input"}`} />
                  {errors.workforce_needs && <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.workforce_needs}</p>}
                </div>
                <Button type="submit" variant="cta" className="w-full" disabled={submitInquiry.isPending}>
                  {submitInquiry.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
                  {t.employer.submitInquiry}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
