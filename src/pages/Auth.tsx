import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type View = "login" | "signup" | "forgot";

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { t } = useTranslation();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === "login") {
        await signIn(email, password);
        navigate(redirectTo === "portal" ? "/portal" : "/admin");
      } else if (view === "signup") {
        await signUp(email, password, displayName);
        toast({ title: t.auth.checkEmail, description: t.auth.confirmationSent });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: t.auth.resetLinkSent, description: t.auth.resetLinkDesc });
        setView("login");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const isPortal = redirectTo === "portal";

  const titles: Record<View, string> = {
    login: isPortal ? t.auth.candidateLogin : t.auth.adminLogin,
    signup: t.auth.createAccount,
    forgot: t.auth.forgotPassword,
  };

  const subtitles: Record<View, string> = {
    login: isPortal ? t.auth.candidateLoginDesc : t.auth.adminLoginDesc,
    signup: isPortal ? t.auth.createAccountPortalDesc : t.auth.createAccountAdminDesc,
    forgot: t.auth.forgotPasswordDesc,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md bg-card rounded-xl p-8 shadow-card border border-border">
        <h1 className="text-2xl font-extrabold text-foreground mb-2">{titles[view]}</h1>
        <p className="text-sm text-muted-foreground mb-6">{subtitles[view]}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === "signup" && (
            <div className="space-y-1">
              <Label htmlFor="displayName">{t.auth.displayName}</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={t.auth.displayName} />
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isPortal ? "your@email.com" : "admin@example.com"} required />
          </div>
          {view !== "forgot" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t.auth.password}</Label>
                {view === "login" && (
                  <button type="button" onClick={() => setView("forgot")} className="text-xs text-primary hover:underline">
                    {t.auth.forgotPasswordLink}
                  </button>
                )}
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
          )}
          <Button type="submit" variant="cta" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {view === "login" ? t.common.signIn : view === "signup" ? t.auth.createAccount : t.auth.sendResetLink}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground text-center mt-4 space-y-1">
          {view === "forgot" ? (
            <button onClick={() => setView("login")} className="text-primary hover:underline font-medium">
              {t.auth.backToSignIn}
            </button>
          ) : (
            <p>
              {view === "login" ? t.auth.needAccount : t.auth.haveAccount}{" "}
              <button onClick={() => setView(view === "login" ? "signup" : "login")} className="text-primary hover:underline font-medium">
                {view === "login" ? t.common.signUp : t.common.signIn}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
