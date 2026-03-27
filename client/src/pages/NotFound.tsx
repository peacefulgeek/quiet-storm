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

      {/* Header */}
      <section className="section-sage py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "oklch(0.62 0.12 145)" }}>
            404
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            This page doesn't exist.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            The page you're looking for may have moved or never existed. But since you're here — perhaps something below will meet you where you are.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 transition-all"
                style={{ borderColor: "oklch(0.88 0.015 90)" }}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-all text-white hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
            >
              Search
            </button>
          </div>
        </form>

        {/* 10 Insights */}
        <div className="mb-14">
          <h2 className="font-heading text-xl font-semibold mb-6 text-foreground">
            Ten things worth remembering
          </h2>
          <div className="space-y-4">
            {INSIGHTS.map((insight, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl transition-colors"
                style={{ background: i % 2 === 0 ? "oklch(0.94 0.04 145 / 0.3)" : "oklch(0.96 0.02 75 / 0.3)" }}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mt-0.5"
                  style={{
                    background: "oklch(0.62 0.12 145 / 0.15)",
                    color: "oklch(0.52 0.12 145)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-foreground leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Article Cards */}
        {published.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-xl font-semibold mb-6 text-foreground">
              Start here instead
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {published.map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className="group no-underline block article-card"
                >
                  <div className="img-zoom rounded-xl overflow-hidden aspect-[4/3] mb-3 bg-muted">
                    <img
                      src={article.heroImage}
                      alt={article.heroAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="category-badge mb-1">{article.category}</span>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-sage transition-colors leading-snug mt-1">
                    {article.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/"
          className="no-underline inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: "oklch(0.55 0.12 145)" }}
        >
          &larr; Back to home
        </Link>
      </div>
    </Layout>
  );
}
