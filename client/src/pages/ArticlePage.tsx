import { useParams, Link, useLocation } from "wouter";
import { articles } from "@/data/articles";
import { SITE_CONFIG, CATEGORIES } from "@/lib/types";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO, { articleSchema } from "@/components/SEO";
import Layout from "@/components/Layout";
import NewsletterInline from "@/components/NewsletterInline";
import { useEffect, useState, useMemo } from "react";

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

  const sameCatSidebar = useMemo(
    () =>
      sortByDate(
        published.filter(
          (a) => a.categorySlug === article.categorySlug && a.slug !== article.slug
        )
      ).slice(0, 4),
    [published, article.categorySlug, article.slug]
  );

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

  const keepReading = useMemo(() => {
    const sidebarSlugs = new Set([
      ...sameCatSidebar.map((a) => a.slug),
      ...popularSidebar.map((a) => a.slug),
      article.slug,
    ]);
    return sortByDate(published.filter((a) => !sidebarSlugs.has(a.slug))).slice(0, 6);
  }, [published, sameCatSidebar, popularSidebar, article.slug]);

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

      {/* Hero Image — full bleed with rounded corners */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 mb-8">
        <div className="rounded-2xl overflow-hidden aspect-[21/9] bg-muted">
          <img
            src={article.heroImage}
            alt={article.heroAlt}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Two-column layout: 70/30 on desktop */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:flex lg:gap-10">
        {/* LEFT COLUMN */}
        <article className="lg:w-[68%] min-w-0">
          {/* Category + Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href={`/category/${article.categorySlug}`}
              className="no-underline category-badge"
            >
              {article.category}
            </Link>
            <span className="text-sm text-muted-foreground">{article.dateHuman}</span>
            <span className="text-sm text-muted-foreground">&middot;</span>
            <span className="text-sm text-muted-foreground">{article.readingTime} min read</span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight text-foreground mb-6">
            {article.title}
          </h1>

          {/* Excerpt as lead */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 pl-5" style={{ borderColor: "oklch(0.72 0.16 75)" }}>
            {article.excerpt}
          </p>

          {/* Table of Contents */}
          {headings.length > 0 && (
            <nav className="mb-8 rounded-xl overflow-hidden section-sage">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-foreground transition-colors"
              >
                <span>Table of Contents</span>
                <svg
                  className={`w-4 h-4 transition-transform ${tocOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {tocOpen && (
                <ul className="px-5 pb-4 space-y-2 list-none m-0">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-sm text-muted-foreground hover:text-foreground no-underline transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
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
            <section className="mt-12 mb-8 p-6 sm:p-8 rounded-2xl section-amber">
              <h2 className="font-heading text-2xl font-semibold mb-6 text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {article.faqs.map((faq, i) => (
                  <div key={i} className="border-b pb-6 last:border-b-0 last:pb-0" style={{ borderColor: "oklch(0.72 0.16 75 / 0.2)" }}>
                    <h3 className="font-heading text-lg font-medium mb-2 text-foreground">
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
          <div className="mt-10 mb-8 p-5 rounded-xl text-xs text-muted-foreground leading-relaxed" style={{ background: "oklch(0.94 0.04 145 / 0.3)" }}>
            <strong className="text-foreground">Disclaimer:</strong> This article is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </div>

          {/* Share Buttons */}
          <ShareButtons slug={article.slug} title={article.title} />

          {/* Keep Reading */}
          {keepReading.length > 0 && (
            <div className="mt-12 pt-8 border-t" style={{ borderColor: "oklch(0.88 0.015 90)" }}>
              <h2 className="font-heading text-xl font-semibold mb-6 text-foreground">
                Keep Reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {keepReading.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/article/${a.slug}`}
                    className="group block no-underline article-card"
                  >
                    <div className="img-zoom rounded-xl overflow-hidden aspect-[16/9] mb-3 bg-muted">
                      <img
                        src={a.heroImage}
                        alt={a.heroAlt}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="category-badge">{a.category}</span>
                    <p className="text-sm font-semibold text-foreground group-hover:text-sage transition-colors mt-1 leading-snug">
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter */}
          <div className="mt-12 pt-8 border-t pb-16" style={{ borderColor: "oklch(0.88 0.015 90)" }}>
            <NewsletterInline source={`article-${article.slug}`} />
          </div>
        </article>

        {/* RIGHT COLUMN — Sticky Sidebar (desktop only) */}
        <aside className="hidden lg:block lg:w-[30%]">
          <div className="sticky top-24 space-y-8">
            {/* Kalesh Bio */}
            <div className="p-5 rounded-xl" style={{ background: "linear-gradient(135deg, oklch(0.94 0.04 145 / 0.5), oklch(0.97 0.005 90))" }}>
              <p className="font-heading text-base font-semibold mb-1 text-foreground">
                {SITE_CONFIG.author}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: "oklch(0.62 0.12 145)" }}>
                {SITE_CONFIG.authorTitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {SITE_CONFIG.authorBio}
              </p>
              <a
                href={SITE_CONFIG.authorLink}
                className="inline-block text-sm font-semibold px-4 py-2 rounded-lg text-white no-underline transition-all hover:shadow-md"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
              >
                {SITE_CONFIG.authorLinkText}
              </a>
            </div>

            {/* Same Category Articles */}
            {sameCatSidebar.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "oklch(0.62 0.12 145)" }}>
                  More in {category?.name || article.category}
                </p>
                <div className="space-y-3">
                  {sameCatSidebar.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/article/${a.slug}`}
                      className="group flex gap-3 no-underline"
                    >
                      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={a.heroImage}
                          alt={a.heroAlt}
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
                <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "oklch(0.72 0.16 75)" }}>
                  Popular Articles
                </p>
                <div className="space-y-3">
                  {popularSidebar.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/article/${a.slug}`}
                      className="group flex gap-3 no-underline"
                    >
                      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={a.heroImage}
                          alt={a.heroAlt}
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
        <div className="p-5 rounded-xl mb-8" style={{ background: "linear-gradient(135deg, oklch(0.94 0.04 145 / 0.5), oklch(0.97 0.005 90))" }}>
          <p className="font-heading text-base font-semibold mb-1 text-foreground">
            {SITE_CONFIG.author}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: "oklch(0.62 0.12 145)" }}>
            {SITE_CONFIG.authorTitle}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {SITE_CONFIG.authorBio}
          </p>
          <a
            href={SITE_CONFIG.authorLink}
            className="inline-block text-sm font-semibold px-4 py-2 rounded-lg text-white no-underline transition-all hover:shadow-md"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
          >
            {SITE_CONFIG.authorLinkText}
          </a>
        </div>

        {/* Same Category */}
        {sameCatSidebar.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "oklch(0.62 0.12 145)" }}>
              More in {category?.name || article.category}
            </p>
            <div className="space-y-3">
              {sameCatSidebar.map((a) => (
                <Link
                  key={a.slug}
                  href={`/article/${a.slug}`}
                  className="group flex gap-3 no-underline"
                >
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={a.heroImage}
                      alt={a.heroAlt}
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
        className="px-3 py-1.5 text-xs font-medium border rounded-lg hover:bg-muted transition-colors"
        style={{ borderColor: "oklch(0.88 0.015 90)" }}
        aria-label="Copy link to clipboard"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <a
        href={twitterUrl}
        rel="nofollow noopener noreferrer"
        target="_blank"
        className="px-3 py-1.5 text-xs font-medium border rounded-lg hover:bg-muted transition-colors no-underline text-foreground"
        style={{ borderColor: "oklch(0.88 0.015 90)" }}
        aria-label="Share on Twitter/X"
      >
        X / Twitter
      </a>
      <a
        href={facebookUrl}
        rel="nofollow noopener noreferrer"
        target="_blank"
        className="px-3 py-1.5 text-xs font-medium border rounded-lg hover:bg-muted transition-colors no-underline text-foreground"
        style={{ borderColor: "oklch(0.88 0.015 90)" }}
        aria-label="Share on Facebook"
      >
        Facebook
      </a>
    </div>
  );
}
