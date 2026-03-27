import { Link } from "wouter";
import { articles } from "@/data/articles";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import { useMemo } from "react";

export default function NotFound() {
  const published = useMemo(() => sortByDate(filterPublished(articles)).slice(0, 6), []);

  return (
    <Layout>
      <SEO title="Page Not Found" noIndex />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-16">
        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
          404
        </p>

        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-8">
          This page doesn't exist.
        </h1>

        <blockquote
          className="border-l-[3px] pl-6 mb-12 font-heading text-xl leading-relaxed text-muted-foreground italic"
          style={{ borderColor: "oklch(0.72 0.15 80)" }}
        >
          "The mind is not the enemy. The identification with it is."
        </blockquote>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for may have moved or never existed. But since you're here, these might be worth your time:
        </p>

        <div className="space-y-3 mb-12">
          {published.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="block no-underline text-foreground hover:text-sage transition-colors py-2 border-b border-border/30"
            >
              {article.title}
            </Link>
          ))}
        </div>

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
