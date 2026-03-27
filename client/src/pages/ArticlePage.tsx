import { useParams, Link, useLocation } from "wouter";
import { articles } from "@/data/articles";
import { SITE_CONFIG, CATEGORIES } from "@/lib/types";
import { filterPublished, sortByDate, getArticlesByCategory } from "@/lib/utils";
import SEO, { articleSchema } from "@/components/SEO";
import Layout from "@/components/Layout";
import NewsletterInline from "@/components/NewsletterInline";
import { useEffect, useState, useRef } from "react";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    navigate("/404");
    return null;
  }

  // Check if published
  const now = new Date().toISOString();
  if (article.dateISO > now) {
    navigate("/404");
    return null;
  }

  const published = filterPublished(articles);
  const sameCat = sortByDate(
    published.filter((a) => a.categorySlug === article.categorySlug && a.slug !== article.slug)
  ).slice(0, 3);

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

      <article className="max-w-[720px] mx-auto px-4 sm:px-6">
        {/* Hero Image - NOT lazy loaded */}
        <div className="mt-6 mb-8 -mx-4 sm:-mx-6 lg:-mx-16">
          <img
            src={article.heroImage}
            alt={article.heroAlt}
            width={1200}
            height={675}
            className="w-full h-auto"
            fetchPriority="high"
          />
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight text-foreground mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8">
          <Link
            href={`/category/${article.categorySlug}`}
            className="no-underline px-3 py-1 rounded-full text-xs font-medium border border-sage/30 text-sage hover:bg-sage/10 transition-colors"
            style={{ color: "oklch(0.68 0.1 140)", borderColor: "oklch(0.68 0.1 140 / 0.3)" }}
          >
            {article.category}
          </Link>
          <span>{article.dateHuman}</span>
          <span aria-hidden>·</span>
          <span>{article.readingTime} min read</span>
        </div>

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
                <div key={i} className="border-b border-border/50 pb-6 last:border-b-0">
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
          <strong>Disclaimer:</strong> This article is for educational and informational purposes only.
          It is not a substitute for professional medical advice, diagnosis, or treatment.
        </div>

        {/* Share Buttons */}
        <ShareButtons slug={article.slug} title={article.title} />

        {/* Author Bio - Inline */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="font-heading text-lg font-medium mb-2">
            About {SITE_CONFIG.author}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            {SITE_CONFIG.authorBio}
          </p>
          <a
            href={SITE_CONFIG.authorLink}
            className="text-sage hover:text-amber transition-colors text-sm"
            style={{ color: "oklch(0.68 0.1 140)" }}
          >
            {SITE_CONFIG.authorLinkText}
          </a>
        </div>

        {/* Cross-links */}
        {sameCat.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="font-heading text-lg font-medium mb-4">
              More from {category?.name || article.category}
            </h2>
            <div className="space-y-3">
              {sameCat.map((a) => (
                <Link
                  key={a.slug}
                  href={`/article/${a.slug}`}
                  className="block no-underline text-foreground hover:text-sage transition-colors py-1"
                >
                  {a.title}
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
      // Fallback
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
