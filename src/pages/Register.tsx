import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, CheckCircle, Loader2, Upload, FileText,
  AlertCircle, Lock, Mail, MessageCircle, BookOpen, SkipForward,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { useCreateCandidate, CandidateInsert } from "@/hooks/useCandidates";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/LanguageContext";
import { WHATSAPP_URL } from "@/lib/contact";

const englishOptions = ["Basic", "Intermediate", "Fluent"] as const;

type FlowPath = "idle" | "with-docs" | "skip";

interface FormData {
  full_name: string;
  email: string;
  whatsapp_number: string;
  date_of_birth: string;
  graduation_year: string;
  university: string;
  str_active_number: string;
  english_capability: string;
  consent_contact: boolean;
  consent_privacy: boolean;
  email_verified: boolean;
}

export default function Register() {
  const createCandidate = useCreateCandidate();
  const whatsappHref = WHATSAPP_URL;
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [path, setPath] = useState<FlowPath>("idle");
  const [submitted, setSubmitted] = useState(false);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [strFile, setStrFile] = useState<File | null>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const strRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    full_name: "", email: "", whatsapp_number: "",
    date_of_birth: "", graduation_year: "", university: "",
    str_active_number: "", english_capability: "",
    consent_contact: false, consent_privacy: false,
    email_verified: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const fieldErr = (f: string) =>
    errors[f] ? (
      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" />{errors[f]}
      </p>
    ) : null;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 2) {
      if (!form.full_name.trim()) e.full_name = `${t.register.fullName} ${t.register.required}`;
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = t.register.validEmail;
      if (!form.whatsapp_number.trim()) e.whatsapp_number = `${t.register.whatsappNumber} ${t.register.required}`;
      if (path === "skip") {
        if (!form.university.trim()) e.university = `${t.register.university} ${t.register.required}`;
        if (!form.graduation_year) e.graduation_year = `${t.register.graduationYear} ${t.register.required}`;
        if (!form.english_capability) e.english_capability = `${t.register.englishCapability} ${t.register.required}`;
      }
      if (!form.consent_contact) e.consent_contact = `${t.register.consentTitle} ${t.register.required}`;
      if (!form.consent_privacy) e.consent_privacy = `${t.register.consentTitle} ${t.register.required}`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const choosePath = (chosen: "with-docs" | "skip") => {
    setPath(chosen);
    setStep(2);
  };

  const back = () => {
    if (step === 2) { setStep(1); setPath("idle"); }
    else setStep((p) => Math.max(p - 1, 1));
  };

  const nextToVerify = () => {
    if (!validate()) return;
    setStep(3);
  };

  const sendEmailCode = () => {
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors((p) => ({ ...p, email: t.register.validEmail }));
      return;
    }
    setEmailCodeSent(true);
    toast({ title: t.register.sendVerification, description: "Check your email inbox (mock: use code 1234)" });
  };

  const verifyEmail = () => {
    if (emailCode === "1234") {
      set("email_verified", true);
      toast({ title: `✅ ${t.register.emailVerified}!` });
    } else {
      toast({ title: "Invalid code", variant: "destructive" });
    }
  };

  const getDeviceType = (): string => {
    const w = window.innerWidth;
    if (w < 768) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  };

  const handleSubmit = async () => {
    const data: CandidateInsert = {
      full_name: form.full_name.trim(),
      date_of_birth: form.date_of_birth || undefined,
      graduation_year: form.graduation_year ? parseInt(form.graduation_year) : undefined,
      university: form.university.trim() || undefined,
      str_active_number: form.str_active_number.trim() || undefined,
      english_capability: (form.english_capability as CandidateInsert["english_capability"]) || undefined,
      email: form.email.trim(),
      email_verified: form.email_verified,
      whatsapp_number: form.whatsapp_number.trim(),
      whatsapp_verified: false,
      motivations: [],
      challenges: [],
      help_needed: [],
      consent_contact: form.consent_contact,
      consent_privacy: form.consent_privacy,
      journey_stage: "New",
      device_type: getDeviceType(),
    };
    createCandidate.mutate(data, {
      onSuccess: () => setSubmitted(true),
      onError: () => toast({ title: t.register.thankYouTitle, description: t.register.thankYouDesc, variant: "destructive" }),
    });
  };

  // ── Thank you ──
  if (submitted) {
    return (
      <Layout>
        <section
          className="relative py-20 lg:py-32 overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)" }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
          <div className="relative container max-w-lg mx-auto text-center z-10">
            <div className="h-24 w-24 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6 ring-4 ring-primary-foreground/30">
              <CheckCircle className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-black font-heading text-primary-foreground mb-3">{t.register.profileCreated}</h1>
            <p className="text-primary-foreground/85 mb-2 text-lg">{t.register.welcomeGlobalParo}</p>
            <p className="text-sm text-primary-foreground/70 mb-10">{t.register.profileReceived}</p>
            <div className="flex flex-col gap-3">
              <Button size="lg" asChild className="rounded-full font-bold"
                style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--primary))" }}>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> {t.register.joinWhatsappCta}
                </a>
              </Button>
              <Button size="lg" asChild className="rounded-full font-bold"
                style={{ backgroundColor: "hsl(var(--primary-foreground) / 0.2)", color: "hsl(var(--primary-foreground))" }}>
                <Link to="/quickstart"><BookOpen className="h-5 w-5" /> {t.register.readQuickstartCta}</Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const STEPS_WITH_DOCS = [t.register.stepUploadDocs, t.register.stepPersonalInfo, t.register.stepVerifyEmail];
  const STEPS_SKIP = [t.register.stepUploadDocs, t.register.stepYourProfile, t.register.stepVerifyEmail];
  const stepLabels = path === "with-docs" ? STEPS_WITH_DOCS : STEPS_SKIP;
  const progress = ((step - 1) / (stepLabels.length - 1)) * 100;

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative py-12 lg:py-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(198 80% 22%) 60%, hsl(var(--accent)) 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative container text-center max-w-2xl mx-auto z-10">
          <p className="text-sm font-bold tracking-widest uppercase text-primary-foreground/70 mb-2">Global PARO</p>
          <h1 className="text-3xl md:text-4xl font-black font-heading text-primary-foreground mb-3">{t.register.heroTitle}</h1>
          <p className="text-primary-foreground/85 text-lg">{t.register.heroSubtitle}</p>
          <p className="text-xs text-primary-foreground/60 mt-3 flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" /> {t.register.privacyNote}
          </p>
        </div>
      </section>

      {/* Step bar */}
      {path !== "idle" && (
        <section className="py-4 bg-card border-b border-border">
          <div className="container max-w-2xl mx-auto">
            <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: "hsl(var(--accent))" }} />
            </div>
            <div className="flex justify-between">
              {stepLabels.map((label, idx) => {
                const stepNum = idx + 1;
                const done = step > stepNum;
                const active = step === stepNum;
                return (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className={`flex items-center justify-center h-9 w-9 rounded-full text-sm font-bold transition-colors ${done ? "bg-accent text-accent-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {done ? <CheckCircle className="h-4 w-4" /> : <span>{stepNum}</span>}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-medium text-center ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Form body */}
      <section className="py-10 lg:py-14">
        <div className="container max-w-2xl mx-auto">
          <div className="bg-card rounded-xl p-6 lg:p-8 shadow-card border border-border border-l-4"
            style={{ borderLeftColor: "hsl(var(--accent))" }}>

            {/* Error summary */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30" role="alert">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-1">{t.register.fixErrors}</h3>
                    <ul className="text-sm text-destructive space-y-0.5">
                      {Object.values(errors).map((e, i) => <li key={i}>• {e}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Upload or Skip */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}>
                    <Upload className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{t.register.uploadTitle}</h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">{t.register.uploadDesc}</p>
                </div>

                {/* CV upload */}
                <div className="space-y-2">
                  <Label>{t.register.cvLabel}</Label>
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => cvRef.current?.click()}
                  >
                    <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                      onChange={(e) => setCvFile(e.target.files?.[0] ?? null)} />
                    {cvFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="h-5 w-5 text-accent" />
                        <span className="text-sm font-medium text-foreground">{cvFile.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setCvFile(null); }}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">{t.register.uploadCvHint} <span className="text-xs">(PDF, DOC)</span></p>
                      </div>
                    )}
                  </div>
                </div>

                {/* STR upload */}
                <div className="space-y-2">
                  <Label>{t.register.strLabel}</Label>
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => strRef.current?.click()}
                  >
                    <input ref={strRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                      onChange={(e) => setStrFile(e.target.files?.[0] ?? null)} />
                    {strFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="h-5 w-5 text-accent" />
                        <span className="text-sm font-medium text-foreground">{strFile.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setStrFile(null); }}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">{t.register.uploadStrHint} <span className="text-xs">(PDF, JPG, PNG)</span></p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button variant="cta" className="flex-1 text-base py-6" disabled={!cvFile && !strFile} onClick={() => choosePath("with-docs")}>
                    <Upload className="h-4 w-4" />
                    {t.register.continueWithDocs}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="flex-1 text-base py-6 border-dashed" onClick={() => choosePath("skip")}>
                    <SkipForward className="h-4 w-4" />
                    {t.register.skipFillDetails}
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">{t.register.uploadingHelps}</p>
              </div>
            )}

            {/* STEP 2 (with-docs): Minimal personal info */}
            {step === 2 && path === "with-docs" && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-foreground">{t.register.personalInfoTitle}</h2>
                  <p className="text-sm text-muted-foreground">{t.register.personalInfoDesc}</p>
                </div>

                <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3 text-sm text-muted-foreground border-l-4 border-accent">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>{[cvFile?.name, strFile?.name].filter(Boolean).join(" · ")} uploaded</span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="full_name">{t.register.fullName} *</Label>
                  <Input id="full_name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)}
                    placeholder={t.register.fullName} maxLength={100}
                    className={errors.full_name ? "border-destructive" : ""} />
                  {fieldErr("full_name")}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">{t.register.emailAddress} *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    placeholder="your@email.com" maxLength={255}
                    className={errors.email ? "border-destructive" : ""} />
                  {fieldErr("email")}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wa">{t.register.whatsappNumber} *</Label>
                  <Input id="wa" value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)}
                    placeholder="+62 812 3456 7890" maxLength={20}
                    className={errors.whatsapp_number ? "border-destructive" : ""} />
                  {fieldErr("whatsapp_number")}
                </div>

                {/* Consent */}
                <div className="bg-muted rounded-lg p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="cc" checked={form.consent_contact}
                      onCheckedChange={(v) => set("consent_contact", !!v)}
                      className={errors.consent_contact ? "border-destructive" : ""} />
                    <Label htmlFor="cc" className="text-sm leading-relaxed cursor-pointer">
                      {t.register.consentContactLabel}
                    </Label>
                  </div>
                  {fieldErr("consent_contact")}
                  <div className="flex items-start gap-3">
                    <Checkbox id="cp" checked={form.consent_privacy}
                      onCheckedChange={(v) => set("consent_privacy", !!v)}
                      className={errors.consent_privacy ? "border-destructive" : ""} />
                    <Label htmlFor="cp" className="text-sm leading-relaxed cursor-pointer">
                      {t.register.consentPrivacyLabel.replace("Privacy Policy", "")}
                      <Link to="/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link>
                      {" *"}
                    </Label>
                  </div>
                  {fieldErr("consent_privacy")}
                </div>
              </div>
            )}

            {/* STEP 2 (skip): Full profile form */}
            {step === 2 && path === "skip" && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-foreground">{t.register.profileTitle}</h2>
                  <p className="text-sm text-muted-foreground">{t.register.profileDesc}</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="full_name">{t.register.fullName} *</Label>
                  <Input id="full_name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)}
                    placeholder={t.register.fullName} maxLength={100}
                    className={errors.full_name ? "border-destructive" : ""} />
                  {fieldErr("full_name")}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">{t.register.emailAddress} *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                      placeholder="your@email.com" maxLength={255}
                      className={errors.email ? "border-destructive" : ""} />
                    {fieldErr("email")}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wa">{t.register.whatsappNumber} *</Label>
                    <Input id="wa" value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)}
                      placeholder="+62 812 3456 7890" maxLength={20}
                      className={errors.whatsapp_number ? "border-destructive" : ""} />
                    {fieldErr("whatsapp_number")}
                  </div>
                </div>

                <div className="h-px bg-border" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.register.professionalBackground}</p>

                <div className="space-y-1.5">
                  <Label htmlFor="uni">{t.register.university} *</Label>
                  <Input id="uni" value={form.university} onChange={(e) => set("university", e.target.value)}
                    placeholder={t.register.university} maxLength={200}
                    className={errors.university ? "border-destructive" : ""} />
                  {fieldErr("university")}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="grad">{t.register.graduationYear} *</Label>
                    <Input id="grad" type="number" value={form.graduation_year}
                      onChange={(e) => set("graduation_year", e.target.value)}
                      placeholder="e.g. 2020" min={1980} max={new Date().getFullYear()}
                      className={errors.graduation_year ? "border-destructive" : ""} />
                    {fieldErr("graduation_year")}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dob">{t.register.dateOfBirth}</Label>
                    <Input id="dob" type="date" value={form.date_of_birth}
                      onChange={(e) => set("date_of_birth", e.target.value)} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="str">{t.register.strActive}</Label>
                    <Input id="str" value={form.str_active_number}
                      onChange={(e) => set("str_active_number", e.target.value)}
                      placeholder={t.register.strActive} maxLength={50} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.register.englishCapability} *</Label>
                    <Select value={form.english_capability} onValueChange={(v) => set("english_capability", v)}>
                      <SelectTrigger className={errors.english_capability ? "border-destructive" : ""}>
                        <SelectValue placeholder={t.register.selectLevel} />
                      </SelectTrigger>
                      <SelectContent>
                        {englishOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {fieldErr("english_capability")}
                  </div>
                </div>

                {/* Consent */}
                <div className="h-px bg-border" />
                <div className="bg-muted rounded-lg p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="cc" checked={form.consent_contact}
                      onCheckedChange={(v) => set("consent_contact", !!v)}
                      className={errors.consent_contact ? "border-destructive" : ""} />
                    <Label htmlFor="cc" className="text-sm leading-relaxed cursor-pointer">
                      {t.register.consentContactLabel}
                    </Label>
                  </div>
                  {fieldErr("consent_contact")}
                  <div className="flex items-start gap-3">
                    <Checkbox id="cp" checked={form.consent_privacy}
                      onCheckedChange={(v) => set("consent_privacy", !!v)}
                      className={errors.consent_privacy ? "border-destructive" : ""} />
                    <Label htmlFor="cp" className="text-sm leading-relaxed cursor-pointer">
                      {t.register.consentPrivacyLabel.replace("Privacy Policy", "")}
                      <Link to="/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link>
                      {" *"}
                    </Label>
                  </div>
                  {fieldErr("consent_privacy")}
                </div>
              </div>
            )}

            {/* STEP 3: Verify Email */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}>
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{t.register.verifyEmailTitle}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t.register.verifyEmailDesc} <span className="font-semibold text-foreground">{form.email}</span>
                  </p>
                </div>

                {!form.email_verified ? (
                  <div className="space-y-4">
                    {!emailCodeSent ? (
                      <Button variant="cta" className="w-full py-6 text-base" onClick={sendEmailCode}>
                        <Mail className="h-4 w-4" />
                        {t.register.sendVerificationCode}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Label htmlFor="code">{t.register.codeLabel}</Label>
                        <div className="flex gap-3">
                          <Input id="code" value={emailCode} onChange={(e) => setEmailCode(e.target.value)}
                            placeholder="1234" maxLength={6} className="text-center text-lg tracking-widest font-bold" />
                          <Button onClick={verifyEmail} variant="cta" className="px-6">{t.register.verify}</Button>
                        </div>
                        <button type="button" onClick={sendEmailCode} className="text-xs text-primary hover:underline">
                          {t.register.resendCode}
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 py-2">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">{t.register.orLabel}</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleSubmit} disabled={createCandidate.isPending}>
                      {createCandidate.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      {t.register.skipVerification}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">{t.register.skipVerifyHint}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-accent/50 bg-accent/10">
                      <CheckCircle className="h-6 w-6 text-accent" />
                      <div>
                        <p className="font-semibold text-foreground">{t.register.emailVerifiedBadge}</p>
                        <p className="text-sm text-muted-foreground">{form.email}</p>
                      </div>
                    </div>
                    <Button variant="cta" className="w-full py-6 text-base" onClick={handleSubmit} disabled={createCandidate.isPending}>
                      {createCandidate.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      {t.register.submitMyProfile}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            {step > 1 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={back}>
                  <ArrowLeft className="h-4 w-4" /> {t.common.back}
                </Button>
                {step === 2 && (
                  <Button variant="cta" onClick={nextToVerify}>
                    {t.common.next} <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3" /> {t.register.noFeeDisclaimer}{" "}
            <Link to="/privacy" className="underline text-primary">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </Layout>
  );
}
