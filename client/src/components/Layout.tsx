import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { SITE_CONFIG, CATEGORIES } from "@/lib/types";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    { href: "/start-here", label: "Start Here" },
    { href: "/articles", label: "Articles" },
    { href: "/calm-now", label: "Calm Now" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => {
    if (href === "/articles") return currentPath.startsWith("/articles") || currentPath.startsWith("/article/");
    return currentPath === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/97 backdrop-blur-md shadow-sm"
          : "bg-card/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="no-underline flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.72 0.16 75))" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-foreground tracking-tight">
              {SITE_CONFIG.title}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`no-underline px-4 py-2 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-sage bg-sage-light"
                    : "text-charcoal-light hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M3 7h18" />
                  <path d="M3 12h18" />
                  <path d="M3 17h18" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-border/50 pt-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block no-underline px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-sage bg-sage-light"
                    : "text-charcoal-light hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function Footer({ publishedCount }: { publishedCount: number }) {
  return (
    <footer className="mt-20">
      {/* Newsletter Section — sage gradient */}
      <div className="section-sage">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="font-heading text-2xl sm:text-3xl font-semibold mb-3" style={{ color: "oklch(0.22 0.01 60)" }}>
            Stay connected
          </h3>
          <p className="text-charcoal-light mb-6 max-w-md mx-auto">
            Quiet reflections on anxiety, the nervous system, and the deeper questions — delivered to your inbox.
          </p>
          <NewsletterInline source="footer" />
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-charcoal text-cloud">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            {/* Brand */}
            <div>
              <p className="font-heading text-lg font-semibold mb-2 text-cloud">
                {SITE_CONFIG.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.7 0.01 60)" }}>
                {SITE_CONFIG.subtitle}. {publishedCount} articles and growing.
              </p>
            </div>

            {/* Categories */}
            <div>
              <p className="font-heading text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "oklch(0.72 0.16 75)" }}>
                Explore
              </p>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block text-sm no-underline transition-colors"
                    style={{ color: "oklch(0.7 0.01 60)" }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="font-heading text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "oklch(0.72 0.16 75)" }}>
                Resources
              </p>
              <div className="space-y-2">
                <Link href="/start-here" className="block text-sm no-underline transition-colors" style={{ color: "oklch(0.7 0.01 60)" }}>
                  Start Here
                </Link>
                <Link href="/calm-now" className="block text-sm no-underline transition-colors" style={{ color: "oklch(0.7 0.01 60)" }}>
                  Calm Now
                </Link>
                <Link href="/quizzes" className="block text-sm no-underline transition-colors" style={{ color: "oklch(0.7 0.01 60)" }}>
                  Quizzes
                </Link>
                <Link href="/about" className="block text-sm no-underline transition-colors" style={{ color: "oklch(0.7 0.01 60)" }}>
                  About
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t" style={{ borderColor: "oklch(0.35 0.01 60)" }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-xs" style={{ color: "oklch(0.55 0.01 60)" }}>
                &copy; {new Date().getFullYear()} {SITE_CONFIG.title}. All rights reserved.
              </p>
              <div className="flex gap-5 text-xs" style={{ color: "oklch(0.55 0.01 60)" }}>
                <Link href="/privacy" className="hover:text-cloud transition-colors no-underline">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-cloud transition-colors no-underline">
                  Terms of Service
                </Link>
              </div>
            </div>
            <p className="text-xs mt-6 leading-relaxed" style={{ color: "oklch(0.45 0.01 60)" }}>
              <strong style={{ color: "oklch(0.55 0.01 60)" }}>Disclaimer:</strong> The content on this site is for educational and informational purposes only.
              It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice
              of a qualified health provider with any questions you may have. If you are
              in crisis, contact the 988 Suicide &amp; Crisis Lifeline by calling or texting 988.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
