import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, X } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Page: "bg-blue-100 text-blue-700",
  Program: "bg-purple-100 text-purple-700",
  Learning: "bg-emerald-100 text-emerald-700",
  Blog: "bg-orange-100 text-orange-700",
  News: "bg-sky-100 text-sky-700",
  FAQ: "bg-yellow-100 text-yellow-700",
  Webinar: "bg-pink-100 text-pink-700",
  Pathway: "bg-teal-100 text-teal-700",
  "Success Story": "bg-green-100 text-green-700",
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { results, loading } = useSearch(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    const [path, hash] = url.split("#");
    navigate(url);
    if (hash) {
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative hidden md:flex flex-1 max-w-xs">
      {/* Input */}
      <div className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1 w-full transition-all",
        "bg-primary-foreground/10 focus-within:bg-primary-foreground/20"
      )}>
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 text-primary-foreground/70 shrink-0 animate-spin" />
        ) : (
          <Search className="h-3.5 w-3.5 text-primary-foreground/70 shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search..."
          className="bg-transparent text-xs text-primary-foreground placeholder-primary-foreground/60 outline-none w-full"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
            <X className="h-3 w-3 text-primary-foreground/60 hover:text-primary-foreground" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl border border-border z-[100] overflow-hidden"
          style={{ backgroundColor: "hsl(var(--card))", minWidth: "320px" }}
        >
          {results.length === 0 && !loading ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results found for "<strong>{query}</strong>"
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-border">
              {results.map((item) => (
                <li key={item.id + item.url}>
                  <button
                    onClick={() => handleSelect(item.url)}
                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex flex-col gap-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
                        CATEGORY_COLORS[item.category] || "bg-muted text-muted-foreground"
                      )}>
                        {item.category}
                      </span>
                      <span className="text-sm font-semibold text-foreground truncate">{item.title}</span>
                    </div>
                    {item.excerpt && (
                      <p className="text-xs text-muted-foreground line-clamp-1 pl-1">{item.excerpt}</p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="px-4 py-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground">
              {results.length > 0 ? `${results.length} results` : "Type at least 2 characters"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
