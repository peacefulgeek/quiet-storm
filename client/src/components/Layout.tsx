import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/types";
import { articles } from "@/data/articles";
import { filterPublished } from "@/lib/utils";
import CookieConsent from "./CookieConsent";
import NewsletterInline from "./NewsletterInline";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const publishedCount = filterPublished(articles).length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header currentPath={location} />
      <main className="flex-1">{children}</main>
      <Footer publishedCount={publishedCount} />
      <CookieConsent />
    </div>
  );
}

function Header({ currentPath }: { currentPath: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[720px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="no-underline">
          <span className="font-heading text-xl font-semibold text-foreground tracking-tight">
            {SITE_CONFIG.title}
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 text-[15px]">
          <Link
            href="/start-here"
            className={`no-underline transition-colors hidden sm:inline ${
              currentPath === "/start-here"
                ? "text-sage font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Start Here
          </Link>
          <Link
            href="/articles"
            className={`no-underline transition-colors ${
              currentPath.startsWith("/articles") || currentPath.startsWith("/article/")
                ? "text-sage font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Articles
          </Link>
          <Link
            href="/calm-now"
            className={`no-underline transition-colors ${
              currentPath === "/calm-now"
                ? "text-sage font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Calm Now
          </Link>
          <Link
            href="/about"
            className={`no-underline transition-colors ${
              currentPath === "/about"
                ? "text-sage font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer({ publishedCount }: { publishedCount: number }) {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <NewsletterInline source="footer" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-heading text-foreground font-medium">
              {SITE_CONFIG.title}
            </span>
            <span className="ml-2">
              {publishedCount} articles published
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors no-underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors no-underline">
              Terms
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-6 leading-relaxed">
          <strong>Disclaimer:</strong> The content on this site is for educational and informational purposes only.
          It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice
          of a qualified health provider with any questions you may have regarding a medical condition. If you are
          in crisis, contact the 988 Suicide &amp; Crisis Lifeline by calling or texting 988.
        </p>
      </div>
    </footer>
  );
}
