import { useState } from "react";
import { CheckCircle, MessageCircle, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Constants } from "@/integrations/supabase/types";
import { WHATSAPP_URL } from "@/lib/contact";

const professionOptions = Constants.public.Enums.profession_type;
const licenseStatusOptions = Constants.public.Enums.license_status_type;
const englishLevelOptions = Constants.public.Enums.english_level_type;
const availabilityOptions = Constants.public.Enums.availability_type;

const targetCountryOptions = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Germany",
  "Ireland",
  "Other",
];

interface QuizData {
  profession: string;
  experience_years: string;
  license_status: string;
  english_level: string;
  target_countries: string;
  availability: string;
}

export function EligibilityQuickCheck() {
  const [quizData, setQuizData] = useState<QuizData>({
    profession: "",
    experience_years: "",
    license_status: "",
    english_level: "",
    target_countries: "",
    availability: "",
  });
  const [showResult, setShowResult] = useState(false);

  const handleChange = (field: keyof QuizData, value: string) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const isComplete = Object.values(quizData).every((v) => v !== "");

  const handleCheck = () => {
    if (isComplete) {
      setShowResult(true);
    }
  };

  const isLikelyReady =
    parseInt(quizData.experience_years) >= 1 &&
    quizData.license_status !== "Not Available";

  const resetQuiz = () => {
    setQuizData({
      profession: "",
      experience_years: "",
      license_status: "",
      english_level: "",
      target_countries: "",
      availability: "",
    });
    setShowResult(false);
  };

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Users className="h-4 w-4" />
              Quick Eligibility Check
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
              Are You Ready to Apply?
            </h2>
            <p className="text-lg text-muted-foreground">
              Answer a few quick questions to see if you're ready for international opportunities.
            </p>
          </div>

          {!showResult ? (
            <div className="bg-card rounded-xl p-6 lg:p-8 shadow-card border border-border">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Select
                    value={quizData.profession}
                    onValueChange={(v) => handleChange("profession", v)}
                  >
                    <SelectTrigger id="profession">
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select
                    value={quizData.experience_years}
                    onValueChange={(v) => handleChange("experience_years", v)}
                  >
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Less than 1 year</SelectItem>
                      <SelectItem value="1">1-2 years</SelectItem>
                      <SelectItem value="3">3-5 years</SelectItem>
                      <SelectItem value="6">6-10 years</SelectItem>
                      <SelectItem value="10">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">License Status</Label>
                  <Select
                    value={quizData.license_status}
                    onValueChange={(v) => handleChange("license_status", v)}
                  >
                    <SelectTrigger id="license">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {licenseStatusOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="english">English Level</Label>
                  <Select
                    value={quizData.english_level}
                    onValueChange={(v) => handleChange("english_level", v)}
                  >
                    <SelectTrigger id="english">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {englishLevelOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Target Country</Label>
                  <Select
                    value={quizData.target_countries}
                    onValueChange={(v) => handleChange("target_countries", v)}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetCountryOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={quizData.availability}
                    onValueChange={(v) => handleChange("availability", v)}
                  >
                    <SelectTrigger id="availability">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  variant="cta"
                  size="lg"
                  onClick={handleCheck}
                  disabled={!isComplete}
                >
                  Check My Eligibility
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`rounded-xl p-8 text-center ${
                isLikelyReady
                  ? "bg-accent/20 border-2 border-accent"
                  : "bg-secondary border-2 border-secondary"
              }`}
            >
              <div
                className={`h-16 w-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                  isLikelyReady ? "bg-accent" : "bg-primary"
                }`}
              >
                {isLikelyReady ? (
                  <CheckCircle className="h-8 w-8 text-accent-foreground" />
                ) : (
                  <MessageCircle className="h-8 w-8 text-primary-foreground" />
                )}
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">
                {isLikelyReady
                  ? "You're Likely Ready to Apply!"
                  : "Start With Community Guidance"}
              </h3>

              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {isLikelyReady
                  ? "Based on your experience and qualifications, you may be a strong candidate for international nursing opportunities."
                  : "Connect with our community to learn more about the requirements and get guidance from nurses who've been through the process."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isLikelyReady ? (
                  <>
                    <Button variant="cta" size="lg" asChild>
                      <Link to="/apply">
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" onClick={resetQuiz}>
                      Check Again
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="whatsapp" size="lg" asChild>
                      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        Join WhatsApp Community
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" onClick={resetQuiz}>
                      Check Again
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
