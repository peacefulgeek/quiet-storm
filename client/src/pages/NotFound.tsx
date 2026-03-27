import { Link, useLocation } from "wouter";
import { articles } from "@/data/articles";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import { useMemo, useState } from "react";

const INSIGHTS = [
  "Your nervous system is not broken — it is doing exactly what it was designed to do under perceived threat.",
  "Anxiety is not a character flaw. It is a signal from a body that has learned the world is not safe.",
  "The breath is the only autonomic function you can consciously override. That is not a coincidence.",
  "Healing does not mean the absence of symptoms. It means a different relationship with them.",
  "The vagus nerve carries 80% of its signals from body to brain, not the other way around.",
  "What you resist persists. What you befriend transforms.",
  "The gut produces 95% of the body's serotonin. Your belly knows things your mind refuses to hear.",
  "Stillness is not the absence of movement. It is the presence of attention.",
  "Every panic attack has a peak. Every peak has a descent. You have survived every one so far.",
  "The mind that created the anxiety cannot think its way out of it. The body can.",
];

export default function NotFound() {
  const published = useMemo(
    () => sortByDate(filterPublished(articles)).slice(0, 3),
    []
  );
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/articles?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <Layout>
      <SEO title="Page Not Found" noIndex />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-16">
        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
          404
        </p>

        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-6">
          This page doesn't exist.
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for may have moved or never existed. But since
          you're here — perhaps something below will meet you where you are.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 px-4 py-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium rounded-md transition-colors text-white"
              style={{ backgroundColor: "oklch(0.68 0.1 140)" }}
            >
              Search
            </button>
          </div>
        </form>

        {/* 10 Insights */}
        <div className="mb-12">
          <h2 className="font-heading text-lg font-semibold mb-6">
            Ten things worth remembering
          </h2>
          <ol className="space-y-4 list-none m-0 p-0">
            {INSIGHTS.map((insight, i) => (
              <li
                key={i}
                className="flex gap-3 text-muted-foreground leading-relaxed"
              >
                <span
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mt-0.5"
                  style={{
                    backgroundColor: "oklch(0.68 0.1 140 / 0.12)",
                    color: "oklch(0.58 0.1 140)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 3 Article Cards */}
        {published.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-lg font-semibold mb-6">
              Start here instead
            </h2>
            <div className="space-y-4">
              {published.map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className="group flex gap-4 no-underline p-3 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden">
                    <img
                      src={article.heroImage}
                      alt={article.heroAlt}
                      width={80}
                      height={80}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "oklch(0.68 0.1 140)" }}
                    >
                      {article.category}
                    </span>
                    <p className="text-sm font-medium text-foreground group-hover:text-sage transition-colors mt-1 leading-snug">
                      {article.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {article.readingTime} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/"
          className="no-underline text-sm font-medium transition-colors"
          style={{ color: "oklch(0.68 0.1 140)" }}
        >
          ← Back to home
        </Link>
      </div>
    </Layout>
  );
}
