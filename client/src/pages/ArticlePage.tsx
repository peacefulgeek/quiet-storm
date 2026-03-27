import { useParams, Link, useLocation } from "wouter";
import { articles } from "@/data/articles";
import { SITE_CONFIG, CATEGORIES } from "@/lib/types";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO, { articleSchema } from "@/components/SEO";
import Layout from "@/components/Layout";
import NewsletterInline from "@/components/NewsletterInline";
import { useEffect, useState, useMemo, useRef } from "react";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const article = articles.find((a) => a.slug === slug);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    navigate("/404");
    return null;
  }

  const now = new Date().toISOString();
  if (article.dateISO > now) {
    navigate("/404");
    return null;
  }

  const published = useMemo(() => filterPublished(articles), []);

  // Same-category articles for sidebar
  const sameCatSidebar = useMemo(
    () =>
      sortByDate(
        published.filter(
          (a) => a.categorySlug === article.categorySlug && a.slug !== article.slug
        )
      ).slice(0, 4),
    [published, article.categorySlug, article.slug]
  );

  // Popular articles (cross-category) for sidebar
  const popularSidebar = useMemo(
    () =>
      sortByDate(
        published.filter(
          (a) =>
            a.slug !== article.slug &&
            !sameCatSidebar.some((s) => s.slug === a.slug)
        )
      ).slice(0, 4),
    [published, article.slug, sameCatSidebar]
  );

  // Keep Reading (cross-category, no overlap with sidebar popular)
  const keepReading = useMemo(() => {
    const sidebarSlugs = new Set([
      ...sameCatSidebar.map((a) => a.slug),
      ...popularSidebar.map((a) => a.slug),
      article.slug,
    ]);
    return sortByDate(published.filter((a) => !sidebarSlugs.has(a.slug))).slice(
      0,
      6
    );
  }, [published, sameCatSidebar, popularSidebar, article.slug]);

  // Extract H2 headings from body for TOC
  const headings = useMemo(() => {
    const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
    const results: { id: string; text: string }[] = [];
    let match;
    while ((match = regex.exec(article.body)) !== null) {
      results.push({
        id: match[1],
        text: match[2].replace(/<[^>]+>/g, ""),
      });
    }
    return results;
  }, [article.body]);

  const category = CATEGORIES.find((c) => c.slug === article.categorySlug);

  return (
    <Layout>
      <SEO
        title={article.title}
        description={article.excerpt}
        canonical={`https://${SITE_CONFIG.domain}/article/${article.slug}`}
        ogImage={article.ogImage}
        ogType="article"
        jsonLd={articleSchema(article)}
      />

      {/* Hero Image - full width, NOT lazy loaded */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 mt-6 mb-8">
        <img
          src={article.heroImage}
          alt={article.heroAlt}
          width={1200}
          height={675}
          className="w-full h-auto rounded-sm"
          fetchPriority="high"
        />
      </div>

      {/* Two-column layout: 70/30 on desktop */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:flex lg:gap-10">
        {/* LEFT COLUMN - 70% */}
        <article className="lg:w-[68%] min-w-0">
          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight text-foreground mb-4">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <Link
              href={`/category/${article.categorySlug}`}
              className="no-underline px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                color: "oklch(0.68 0.1 140)",
                borderColor: "oklch(0.68 0.1 140 / 0.3)",
              }}
            >
              {article.category}
            </Link>
            <span>{article.dateHuman}</span>
            <span aria-hidden>·</span>
            <span>{article.readingTime} min read</span>
          </div>

          {/* Table of Contents */}
          {headings.length > 0 && (
            <nav className="mb-8 border border-border/50 rounded-md overflow-hidden">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span>Table of Contents</span>
                <svg
                  className={`w-4 h-4 transition-transform ${tocOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {tocOpen && (
                <ul className="px-4 py-3 space-y-2 list-none m-0">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-sm text-muted-foreground hover:text-foreground no-underline transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(h.id)
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          )}

          {/* Article Body */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* FAQ Section */}
          {article.faqs && article.faqs.length > 0 && (
            <section className="mt-12 mb-8">
              <h2 className="font-heading text-2xl font-semibold mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {article.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border-b border-border/50 pb-6 last:border-b-0"
                  >
                    <h3 className="font-heading text-lg font-medium mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <div className="mt-12 mb-8 p-4 bg-muted/50 rounded-md text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> This article is for educational and
            informational purposes only. It is not a substitute for professional
            medical advice, diagnosis, or treatment. Always seek the advice of
            your physician or other qualified health provider with any questions
            you may have regarding a medical condition.
          </div>

          {/* Share Buttons */}
          <ShareButtons slug={article.slug} title={article.title} />

          {/* Keep Reading - cross-category */}
          {keepReading.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="font-heading text-xl font-semibold mb-6">
                Keep Reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {keepReading.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/article/${a.slug}`}
                    className="group block no-underline"
                  >
                    <div className="aspect-[16/9] overflow-hidden rounded-sm mb-2">
                      <img
                        src={a.heroImage}
                        alt={a.heroAlt}
                        width={400}
                        height={225}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "oklch(0.68 0.1 140)" }}
                    >
                      {a.category}
                    </span>
                    <p className="text-sm font-medium text-foreground group-hover:text-sage transition-colors mt-1 leading-snug">
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter */}
          <div className="mt-12 pt-8 border-t border-border pb-16">
            <p className="font-heading text-lg font-medium mb-4">
              Stay connected
            </p>
            <NewsletterInline source={`article-${article.slug}`} />
          </div>
        </article>

        {/* RIGHT COLUMN - 30% Sticky Sidebar (desktop only) */}
        <aside className="hidden lg:block lg:w-[30%]">
          <div className="sticky top-24 space-y-8">
            {/* Kalesh Bio */}
            <div className="border border-border/50 rounded-md p-5">
              <p className="font-heading text-base font-semibold mb-2">
                {SITE_CONFIG.author}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                {SITE_CONFIG.authorTitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {SITE_CONFIG.authorBio}
              </p>
              <a
                href={SITE_CONFIG.authorLink}
                className="inline-block text-sm font-medium px-4 py-2 rounded-md border transition-colors no-underline"
                style={{
                  color: "oklch(0.68 0.1 140)",
                  borderColor: "oklch(0.68 0.1 140 / 0.4)",
                }}
              >
                {SITE_CONFIG.authorLinkText}
              </a>
            </div>

            {/* Same Category Articles */}
            {sameCatSidebar.length > 0 && (
              <div>
                <p className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  More in {category?.name || article.category}
                </p>
                <div className="space-y-3">
                  {sameCatSidebar.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/article/${a.slug}`}
                      className="group flex gap-3 no-underline"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden">
                        <img
                          src={a.heroImage}
                          alt={a.heroAlt}
                          width={64}
                          height={64}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-foreground group-hover:text-sage transition-colors leading-snug">
                        {a.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Articles */}
            {popularSidebar.length > 0 && (
              <div>
                <p className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Popular Articles
                </p>
                <div className="space-y-3">
                  {popularSidebar.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/article/${a.slug}`}
                      className="group flex gap-3 no-underline"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden">
                        <img
                          src={a.heroImage}
                          alt={a.heroAlt}
                          width={64}
                          height={64}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-foreground group-hover:text-sage transition-colors leading-snug">
                        {a.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile: Sidebar content below article */}
      <div className="lg:hidden max-w-[720px] mx-auto px-4 sm:px-6 pb-16">
        {/* Bio */}
        <div className="border border-border/50 rounded-md p-5 mb-8">
          <p className="font-heading text-base font-semibold mb-2">
            {SITE_CONFIG.author}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {SITE_CONFIG.authorTitle}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {SITE_CONFIG.authorBio}
          </p>
          <a
            href={SITE_CONFIG.authorLink}
            className="inline-block text-sm font-medium px-4 py-2 rounded-md border transition-colors no-underline"
            style={{
              color: "oklch(0.68 0.1 140)",
              borderColor: "oklch(0.68 0.1 140 / 0.4)",
            }}
          >
            {SITE_CONFIG.authorLinkText}
          </a>
        </div>

        {/* Same Category */}
        {sameCatSidebar.length > 0 && (
          <div className="mb-8">
            <p className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              More in {category?.name || article.category}
            </p>
            <div className="space-y-2">
              {sameCatSidebar.map((a) => (
                <Link
                  key={a.slug}
                  href={`/article/${a.slug}`}
                  className="block no-underline text-sm text-foreground hover:text-sage transition-colors py-1"
                >
                  {a.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://${SITE_CONFIG.domain}/article/${slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3 mt-8">
      <span className="text-sm text-muted-foreground">Share:</span>
      <button
        onClick={copyLink}
        className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors"
        aria-label="Copy link to clipboard"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <a
        href={twitterUrl}
        rel="nofollow noopener noreferrer"
        target="_blank"
        className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors no-underline text-foreground"
        aria-label="Share on Twitter/X"
      >
        X / Twitter
      </a>
      <a
        href={facebookUrl}
        rel="nofollow noopener noreferrer"
        target="_blank"
        className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors no-underline text-foreground"
        aria-label="Share on Facebook"
      >
        Facebook
      </a>
    </div>
  );
}
