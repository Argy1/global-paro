import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  category: string;
}

// Static nav pages to also include in search
const staticPages: SearchResult[] = [
  { id: "about", title: "About Us – Global PARO", excerpt: "Learn about Global PARO, our vision, mission, and values.", url: "/about", category: "Page" },
  { id: "vision", title: "Our Vision", excerpt: "Global PARO's vision to bridge nurses and global opportunities.", url: "/about#vision", category: "Page" },
  { id: "mission", title: "Our Mission", excerpt: "Our mission: Provide, Accelerate, Empower international nurses.", url: "/about#mission", category: "Page" },
  { id: "values", title: "Our Values – P.A.R.O.", excerpt: "Our core values: Passion, Accountability, Resilience, Opportunity.", url: "/about#values", category: "Page" },
  { id: "team", title: "Our Team", excerpt: "Meet the Global PARO leadership and advisory team.", url: "/team", category: "Page" },
  { id: "what-we-do", title: "What We Do", excerpt: "Services for nurses and healthcare employers.", url: "/what-we-do", category: "Page" },
  { id: "candidates", title: "For Candidates", excerpt: "How Global PARO supports nurses seeking international careers.", url: "/what-we-do#candidates", category: "Page" },
  { id: "employers", title: "For Employers", excerpt: "Connect with qualified international nurses for your facility.", url: "/what-we-do/employers", category: "Page" },
  { id: "how-we-do-it", title: "How We Do It", excerpt: "Our approach and your journey step by step.", url: "/how-we-do-it", category: "Page" },
  { id: "why-choose-us", title: "Why Choose Us", excerpt: "The P.A.R.O. advantage: Personalized, Accessible, Reputable, One-stop.", url: "/why-choose-us", category: "Page" },
  { id: "batch", title: "Batch Program", excerpt: "Join our structured batch program for international nurses.", url: "/programs/batch", category: "Program" },
  { id: "requirements", title: "Global Job Opportunities Now", excerpt: "Check eligibility and document requirements.", url: "/programs/requirements", category: "Program" },
  { id: "webinar", title: "Webinars", excerpt: "Free and paid webinars for nurse career development.", url: "/programs/webinar", category: "Program" },
  { id: "lms", title: "LMS – Learning Management System", excerpt: "Courses: IELTS prep, Certified Global Nurse, NCLEX 2026.", url: "/lms", category: "Learning" },
  { id: "ielts", title: "IELTS Preparation", excerpt: "Prepare for your IELTS exam with Global PARO resources.", url: "/lms/ielts", category: "Learning" },
  { id: "certified", title: "Certified Global Nurse", excerpt: "Earn your Certified Global Nurse credential.", url: "/lms/certified", category: "Learning" },
  { id: "nclex", title: "NCLEX 2026 Resources", excerpt: "Up-to-date NCLEX preparation materials.", url: "/lms/nclex", category: "Learning" },
  { id: "quickstart", title: "Nurse Blog / Quickstart", excerpt: "Articles and guides for nurses going global.", url: "/quickstart", category: "Blog" },
  { id: "register", title: "Register", excerpt: "Sign up and start your global nursing journey.", url: "/register", category: "Page" },
  { id: "help", title: "Help & FAQ", excerpt: "Frequently asked questions and support.", url: "/help", category: "Page" },
];

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const abortController = new AbortController();

    const search = async () => {
      setLoading(true);
      try {
        // 1. Static pages filter
        const pageResults = staticPages.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );

        // 2. Content items (News, SuccessStory, QuickstartChapter)
        const { data: contentItems } = await supabase
          .from("content_items" as any)
          .select("id, title, excerpt, slug, type")
          .eq("published", true)
          .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,body.ilike.%${q}%`)
          .limit(8);

        const contentResults: SearchResult[] = ((contentItems as any[]) || []).map((item: any) => {
          let url = "/quickstart";
          if (item.type === "News") url = `/news/${item.slug}`;
          else if (item.type === "SuccessStory") url = `/success-stories/${item.slug}`;
          else if (item.type === "QuickstartChapter") url = `/quickstart/${item.slug}`;
          return {
            id: item.id,
            title: item.title,
            excerpt: item.excerpt || "",
            url,
            category: item.type === "SuccessStory" ? "Success Story" : item.type === "News" ? "News" : "Blog",
          };
        });

        // 3. FAQs
        const { data: faqs } = await supabase
          .from("faq_items")
          .select("id, question, answer")
          .or(`question.ilike.%${q}%,answer.ilike.%${q}%`)
          .limit(4);

        const faqResults: SearchResult[] = ((faqs as any[]) || []).map((f: any) => ({
          id: f.id,
          title: f.question,
          excerpt: f.answer.substring(0, 100) + "...",
          url: "/help",
          category: "FAQ",
        }));

        // 4. Webinars
        const { data: webinars } = await supabase
          .from("webinars")
          .select("id, title, description, slug")
          .eq("is_published", true)
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .limit(4);

        const webinarResults: SearchResult[] = ((webinars as any[]) || []).map((w: any) => ({
          id: w.id,
          title: w.title,
          excerpt: w.description?.substring(0, 100) || "",
          url: w.slug ? `/programs/webinar/${w.slug}` : "/programs/webinar",
          category: "Webinar",
        }));

        // 5. Pathways
        const { data: pathways } = await supabase
          .from("pathways")
          .select("id, title, short_summary, slug")
          .eq("is_active", true)
          .or(`title.ilike.%${q}%,short_summary.ilike.%${q}%,country.ilike.%${q}%`)
          .limit(4);

        const pathwayResults: SearchResult[] = ((pathways as any[]) || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          excerpt: p.short_summary || "",
          url: `/programs/requirements`,
          category: "Pathway",
        }));

        if (!abortController.signal.aborted) {
          setResults([...pageResults, ...contentResults, ...faqResults, ...webinarResults, ...pathwayResults].slice(0, 12));
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    };

    const timer = setTimeout(search, 250);
    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query]);

  return { results, loading };
}
