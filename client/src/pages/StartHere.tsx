import { Link } from "wouter";
import { articles } from "@/data/articles";
import { SITE_CONFIG } from "@/lib/types";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import { useMemo } from "react";

export default function StartHere() {
  const published = useMemo(() => sortByDate(filterPublished(articles)), []);

  // Pick one pillar article from each category
  const pillarSlugs = [
    "the-nervous-system",
    "the-body",
    "the-mind",
    "the-specific",
    "the-deeper-question",
  ];

  const pillarArticles = pillarSlugs
    .map((catSlug) => published.find((a) => a.categorySlug === catSlug))
    .filter(Boolean);

  // Add one more from the most recent
  const extra = published.find(
    (a) => !pillarArticles.some((p) => p?.slug === a.slug)
  );
  if (extra) pillarArticles.push(extra);

  return (
    <Layout>
      <SEO
        title="Start Here"
        description={`New to ${SITE_CONFIG.title}? Start with these essential articles on anxiety, the nervous system, and finding your way back to yourself.`}
        canonical={`https://${SITE_CONFIG.domain}/start-here`}
      />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-6">
          Start Here
        </h1>

        <div className="space-y-6 text-foreground leading-relaxed mb-12">
          <p>
            If you've just found this site, you're probably in one of two places: either anxiety has become loud enough that you're actively searching for answers, or someone you trust sent you a link and said "read this." Either way, you're here. That matters.
          </p>
          <p>
            {SITE_CONFIG.title} covers anxiety from multiple angles — the nervous system science behind it, the somatic practices that help regulate it, the cognitive patterns that sustain it, and the deeper philosophical questions it forces you to confront. These articles are a good place to begin.
          </p>
        </div>

        <div className="space-y-6">
          {pillarArticles.map((article) =>
            article ? (
              <Link
                key={article.slug}
                href={`/article/${article.slug}`}
                className="block no-underline p-5 border border-border/50 rounded-lg hover:border-sage/30 transition-colors group"
              >
                <span
                  className="text-xs font-medium uppercase tracking-wider mb-2 block"
                  style={{ color: "oklch(0.68 0.1 140)" }}
                >
                  {article.category}
                </span>
                <h2 className="font-heading text-xl font-medium text-foreground group-hover:text-sage transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="text-xs text-muted-foreground/70 mt-2 block">
                  {article.readingTime} min read
                </span>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </Layout>
  );
}
