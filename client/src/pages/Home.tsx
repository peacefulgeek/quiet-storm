import { Link } from "wouter";
import { articles } from "@/data/articles";
import { CATEGORIES, SITE_CONFIG } from "@/lib/types";
import { filterPublished, sortByDate, getArticlesByCategory } from "@/lib/utils";
import SEO, { organizationSchema, websiteSchema, subscribeActionSchema } from "@/components/SEO";
import NewsletterInline from "@/components/NewsletterInline";
import Layout from "@/components/Layout";
import { useEffect, useRef } from "react";

export default function Home() {
  const published = sortByDate(filterPublished(articles));
  const latest = published.slice(0, 3);
  const pullQuote = latest[0]?.excerpt || SITE_CONFIG.tagline;

  return (
    <Layout>
      <SEO
        jsonLd={[organizationSchema(), websiteSchema(), subscribeActionSchema()]}
      />
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        {/* Pull Quote Hero */}
        <section className="py-16 sm:py-24">
          <FadeUp>
            <p className="pull-quote">{pullQuote}</p>
          </FadeUp>
          <FadeUp delay={200}>
            <div className="breathing-divider mt-10" />
          </FadeUp>
        </section>

        {/* Latest Articles */}
        <section className="pb-16">
          {latest.map((article, i) => (
            <FadeUp key={article.slug} delay={i * 100}>
              <article className="mb-12 pb-12 border-b border-border last:border-b-0">
                <Link
                  href={`/article/${article.slug}`}
                  className="no-underline group"
                >
                  <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground group-hover:text-sage transition-colors leading-tight mb-3"
                    style={{ "--tw-text-opacity": 1 } as React.CSSProperties}
                  >
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground/70">
                    <span>{article.readingTime} min read</span>
                    <span aria-hidden>·</span>
                    <span>{article.dateHuman}</span>
                    <span aria-hidden>·</span>
                    <span className="text-sage" style={{ color: "oklch(0.68 0.1 140)" }}>
                      {article.category}
                    </span>
                  </div>
                </Link>
              </article>
            </FadeUp>
          ))}
        </section>

        {/* Categories */}
        <section className="pb-16">
          <FadeUp>
            <h2 className="font-heading text-xl font-medium text-foreground mb-6">
              Explore
            </h2>
          </FadeUp>
          <div className="space-y-3">
            {CATEGORIES.map((cat, i) => {
              const count = filterPublished(getArticlesByCategory(articles, cat.slug)).length;
              return (
                <FadeUp key={cat.slug} delay={i * 60}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex justify-between items-baseline py-2 no-underline group border-b border-border/50 last:border-b-0"
                  >
                    <span className="text-foreground group-hover:text-sage transition-colors font-medium">
                      {cat.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "article" : "articles"}
                    </span>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* Newsletter */}
        <section className="pb-20" id="newsletter">
          <FadeUp>
            <div className="breathing-divider mb-8" />
            <p className="font-heading text-lg text-foreground mb-4">
              Stay connected
            </p>
            <NewsletterInline source="homepage" />
          </FadeUp>
        </section>
      </div>
    </Layout>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("visible");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="fade-up">
      {children}
    </div>
  );
}
