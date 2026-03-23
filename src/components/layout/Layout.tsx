import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { StickyBottomCTA } from "./StickyBottomCTA";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { ChatWidget } from "./ChatWidget";
import { useSEO } from "@/hooks/useSEO";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useSEO();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <ChatWidget />
      <StickyBottomCTA />
    </div>
  );
}
