import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("qs-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("qs-cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-card border-t border-border p-4 sm:p-6 shadow-lg animate-in slide-in-from-bottom duration-500">
      <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
          This site uses cookies to remember your preferences and improve your experience.
          We do not track you across other sites. Read our{" "}
          <a href="/privacy" className="text-sage underline underline-offset-2">
            Privacy Policy
          </a>.
        </p>
        <button
          onClick={accept}
          className="px-5 py-2 bg-sage text-white text-sm font-medium rounded-md hover:bg-sage/90 transition-colors whitespace-nowrap"
          style={{ backgroundColor: "oklch(0.68 0.1 140)" }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
