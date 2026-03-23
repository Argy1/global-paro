import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function ScrollManager() {
  const location = useLocation();
  const prevPathRef = useRef<string>("");
  const prevHashRef = useRef<string>("");

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`;
    const isNewPage = prevPathRef.current !== currentPath;
    const hash = location.hash.replace("#", "");

    const getHeaderOffset = () => {
      const stickyHeader = document.querySelector("header.sticky") as HTMLElement | null;
      return stickyHeader?.offsetHeight ?? 80;
    };

    const scrollToHash = (id: string) => {
      if (!id) return false;
      if (id === "global-paro") {
        window.scrollTo({ top: 0, behavior: "auto" });
        return true;
      }
      const el = document.getElementById(id);
      if (!el) return false;
      const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
      window.scrollTo({ top, behavior: "auto" });
      return true;
    };

    if (hash) {
      if (!scrollToHash(hash)) {
        let attempts = 0;
        const timer = window.setInterval(() => {
          attempts += 1;
          if (scrollToHash(hash) || attempts >= 20) {
            window.clearInterval(timer);
          }
        }, 80);
        return () => window.clearInterval(timer);
      }
    } else if (isNewPage || prevHashRef.current) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    prevPathRef.current = currentPath;
    prevHashRef.current = hash;
  }, [location.pathname, location.search, location.hash]);

  return null;
}
