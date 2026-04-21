import { Link } from "wouter";
import { articles } from "@/data/articles";
import { CATEGORIES, SITE_CONFIG } from "@/lib/types";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import { FullPracticesSection } from "@/components/CalmingPractices";
import { useMemo } from "react";

export default function StartHere() {
  const published = useMemo(() => sortByDate(filterPublished(articles)), []);

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

  return (
    <Layout>
      <SEO
        title="Start Here"
        description={`New to ${SITE_CONFIG.title}? Start with these essential articles on anxiety, the nervous system, and finding your way back to yourself.`}
        canonical={`https://${SITE_CONFIG.domain}/start-here`}
      />

      {/* Header */}
      <section className="section-sage py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-6">
            Start Here
          </h1>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              If you've just found this site, you're probably in one of two places: either anxiety has become loud enough that you're actively searching for answers, or someone you trust sent you a link and said "read this." Either way, you're here. That matters.
            </p>
            <p>
              {SITE_CONFIG.title} covers anxiety from multiple angles — the nervous system science behind it, the somatic practices that help regulate it, the cognitive patterns that sustain it, and the deeper philosophical questions it forces you to confront.
            </p>
          </div>
        </div>
      </section>

      {/* Pillar Articles */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-8" style={{ color: "oklch(0.62 0.12 145)" }}>
          Essential Reading
        </p>
        <div className="space-y-8">
          {pillarArticles.map((article) =>
            article ? (
              <Link
                key={article.slug}
                href={`/article/${article.slug}`}
                className="group no-underline block article-card"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-5 items-center p-5 rounded-xl bg-card border border-border/50 hover:border-sage/30 transition-all hover:shadow-md">
                  <div className="img-zoom rounded-lg overflow-hidden aspect-[4/3] bg-muted">
                    <img
                      src={article.heroImage}
                      alt={article.heroAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span className="category-badge mb-2">
                      {CATEGORIES.find((c) => c.slug === article.categorySlug)?.name || article.category}
                    </span>
                    <h2 className="font-heading text-xl font-semibold text-foreground group-hover:text-sage transition-colors mt-2 mb-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                      {article.excerpt}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {article.readingTime} min read
                    </span>
                  </div>
                </div>
              </Link>
            ) : null
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl section-amber">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
            Explore by topic
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="no-underline flex items-center gap-3 p-3 rounded-lg bg-card hover:shadow-sm transition-all group"
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "oklch(0.62 0.12 145)" }} />
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-sage transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Calming Practices */}
        <div className="mt-16">
          <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            25+ Things You Can Do Right Now
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-8">
            You don't need a prescription or a therapist's office for these. Meditation, chanting, the butterfly hug, hands on heart, loving-kindness practice, cold water resets, humming, gentle rocking, physiological sighs. These are things real people use every day to find deep peace in the middle of struggling with anxiety. Pick one. Try it right now.
          </p>
          <FullPracticesSection />
        </div>

        {/* Assessments CTA */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl section-sage text-center">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
            Not sure where to start?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Take one of our gentle self-assessments. They'll help you understand your anxiety patterns and point you toward the practices and articles that are most likely to help.
          </p>
          <Link
            href="/assessments"
            className="inline-block no-underline px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
          >
            Take a Self-Assessment
          </Link>
        </div>

        {/* Calm Now CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            If you need something right now — not an article, just a moment of calm:
          </p>
          <Link
            href="/calm-now"
            className="inline-block no-underline px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
          >
            Open Calm Now
          </Link>
        </div>
      </div>
    </Layout>
  );
}
