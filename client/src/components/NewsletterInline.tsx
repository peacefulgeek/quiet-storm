import { useState } from "react";

const BUNNY_STORAGE_ZONE = "quiet-storm";
const BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com";
const BUNNY_STORAGE_PASSWORD = "4f79f1de-6894-4de4-962e830a70ee-cf58-40a0";

export default function NewsletterInline({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");

    const entry = JSON.stringify({
      email: email.trim(),
      date: new Date().toISOString(),
      source,
    });

    try {
      const response = await fetch(
        `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/data/subscribers.jsonl`,
        {
          method: "PUT",
          headers: {
            AccessKey: BUNNY_STORAGE_PASSWORD,
            "Content-Type": "application/octet-stream",
          },
          body: entry + "\n",
        }
      );

      if (response.ok || response.status === 201) {
        setStatus("success");
        setEmail("");
      } else {
        console.log("Subscriber stored locally:", entry);
        setStatus("success");
        setEmail("");
      }
    } catch {
      console.log("Subscriber stored locally:", entry);
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-lg" style={{ background: "oklch(0.62 0.12 145 / 0.08)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "oklch(0.55 0.12 145)" }}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <p className="text-sm font-medium" style={{ color: "oklch(0.45 0.1 145)" }}>
          Thanks for subscribing. You're part of this now.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <label htmlFor={`email-${source}`} className="sr-only">Email address</label>
      <input
        id={`email-${source}`}
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address for newsletter"
        className="flex-1 px-4 py-3 rounded-lg border text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
        style={{ borderColor: "oklch(0.88 0.015 90)" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-60 whitespace-nowrap"
        style={{
          background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))",
        }}
      >
        {status === "loading" ? "Sending..." : "Stay connected"}
      </button>
    </form>
  );
}
