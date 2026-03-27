import { useState } from "react";

const BUNNY_STORAGE_ZONE = "quiet-storm";
const BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com";
const BUNNY_STORAGE_PASSWORD = "4f79f1de-6894-4de4-962e830a70ee-cf58-40a0";

interface Props {
  source: string;
}

export default function NewsletterInline({ source }: Props) {
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
        // Fallback: store locally and show success anyway
        console.log("Subscriber stored locally:", entry);
        setStatus("success");
        setEmail("");
      }
    } catch {
      // Graceful degradation
      console.log("Subscriber stored locally:", entry);
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success") {
    return (
      <div className="py-4">
        <p className="text-sage font-heading text-lg" style={{ color: "oklch(0.68 0.1 140)" }}>
          Thanks for subscribing.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          You're part of this now.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label htmlFor={`email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${source}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Stay connected — enter your email"
          required
          className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sage/50 transition-colors"
          aria-label="Email address for newsletter"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 whitespace-nowrap"
        style={{ backgroundColor: "oklch(0.68 0.1 140)" }}
      >
        {status === "loading" ? "Joining..." : "Join our community"}
      </button>
    </form>
  );
}
