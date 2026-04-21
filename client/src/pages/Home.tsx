import { Link } from "wouter";
import { useMemo, useEffect, useRef } from "react";
import { articles } from "@/data/articles";
import { SITE_CONFIG, CATEGORIES } from "@/lib/types";
import { filterPublished, sortByDate } from "@/lib/utils";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { PracticeHighlights } from "@/components/CalmingPractices";

const HERO_IMAGE = "https://quiet-storm.b-cdn.net/images/hero-home.webp";

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeUp({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeUp();
  return <div ref={ref} className={`fade-up ${className}`}>{children}</div>;
}

export default function Home() {
  const published = useMemo(() => sortByDate(filterPublished(articles)), []);
  const featured = published.slice(0, 1)[0];
  const latest = published.slice(1, 7);
  const categoryArticles = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      articles: published.filter((a) => a.categorySlug === cat.slug).slice(0, 3),
    }));
  }, [published]);

  return (
    <Layout>
      <SEO
        title={`${SITE_CONFIG.subtitle}`}
        description={`${SITE_CONFIG.subtitle}. ${SITE_CONFIG.tagline}`}
        canonical={`https://${SITE_CONFIG.domain}/`}
        ogType="website"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="A calm morning scene with soft light streaming through curtains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, oklch(0.22 0.01 60 / 0.65) 0%, oklch(0.22 0.01 60 / 0.35) 50%, oklch(0.22 0.01 60 / 0.55) 100%)"
          }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "oklch(0.72 0.16 75)" }}>
              Anxiety &middot; Nervous System &middot; Inner Peace
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
              {SITE_CONFIG.title}
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: "oklch(0.9 0.005 90)" }}>
              {SITE_CONFIG.subtitle}. Evidence-based guidance for the anxious mind, the overwhelmed body, and the questions that keep you up at night.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/start-here"
                className="inline-block no-underline px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
              >
                Start Here
              </Link>
              <Link
                href="/articles"
                className="inline-block no-underline px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 border"
                style={{ color: "oklch(0.95 0.005 90)", borderColor: "oklch(0.95 0.005 90 / 0.3)" }}
              >
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <FadeUp>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-8" style={{ color: "oklch(0.62 0.12 145)" }}>
              Featured
            </p>
            <Link href={`/article/${featured.slug}`} className="group no-underline block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="img-zoom rounded-xl overflow-hidden aspect-[4/3]">
                  <img
                    src={featured.heroImage}
                    alt={featured.heroAlt}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div>
                  <span className="category-badge mb-4">
                    {CATEGORIES.find((c) => c.slug === featured.categorySlug)?.name || featured.category}
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mt-4 mb-4 group-hover:text-sage transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4 text-base">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{featured.readingTime}</span>
                    <span>&middot;</span>
                    <span>{featured.dateHuman}</span>
                  </div>
                </div>
              </div>
            </Link>
          </FadeUp>
        </section>
      )}

      {/* Breathing Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="breathing-divider" />
      </div>

      {/* Latest Articles Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <FadeUp>
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
              Latest Articles
            </h2>
            <Link
              href="/articles"
              className="no-underline text-sm font-medium transition-colors"
              style={{ color: "oklch(0.55 0.12 145)" }}
            >
              View all &rarr;
            </Link>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latest.map((article, i) => (
            <FadeUp key={article.slug}>
              <Link href={`/article/${article.slug}`} className="group no-underline block article-card">
                <div className="img-zoom rounded-xl overflow-hidden aspect-[4/3] mb-4">
                  <img
                    src={article.heroImage}
                    alt={article.heroAlt}
                    className="w-full h-full object-cover"
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                </div>
                <span className="category-badge mb-3">
                  {CATEGORIES.find((c) => c.slug === article.categorySlug)?.name || article.category}
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground mt-3 mb-2 group-hover:text-sage transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                  <span>{article.readingTime}</span>
                  <span>&middot;</span>
                  <span>{article.dateHuman}</span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Pull Quote Section */}
      <section className="section-sage py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="mb-4" style={{ color: "oklch(0.72 0.16 75)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="pull-quote mb-6">
              The storm isn't what happens to you. It's the space between what happens and how you respond.
            </p>
            <p className="text-sm font-medium" style={{ color: "oklch(0.5 0.08 145)" }}>
              &mdash; {SITE_CONFIG.author}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <FadeUp>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4 text-center">
            Explore by Topic
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Five pathways into the work of understanding your nervous system, your mind, and your capacity for peace.
          </p>
        </FadeUp>
        <div className="space-y-16">
          {categoryArticles.map((cat, catIndex) => (
            <FadeUp key={cat.slug}>
              <div className={`rounded-2xl p-6 sm:p-8 ${catIndex % 2 === 0 ? "section-sage" : "section-amber"}`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                  </div>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="no-underline text-sm font-medium whitespace-nowrap ml-4 transition-colors"
                    style={{ color: "oklch(0.55 0.12 145)" }}
                  >
                    See all &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {cat.articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/article/${article.slug}`}
                      className="group no-underline block bg-card rounded-xl overflow-hidden article-card shadow-sm"
                    >
                      <div className="img-zoom aspect-[16/10]">
                        <img
                          src={article.heroImage}
                          alt={article.heroAlt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-heading text-sm font-semibold text-foreground group-hover:text-sage transition-colors leading-snug mb-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{article.readingTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Calming Practices */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <FadeUp>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-3 text-center">
            Things You Can Do Right Now
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            You don't need a therapist's appointment or a meditation retreat. These are things you can do in your living room, at your desk, or in a parking lot before you walk into work.
          </p>
          <PracticeHighlights />
          <div className="text-center mt-8">
            <Link
              href="/start-here"
              className="no-underline text-sm font-semibold transition-colors"
              style={{ color: "oklch(0.55 0.12 145)" }}
            >
              See all 25+ practices &rarr;
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* Assessments CTA */}
      <section className="section-sage py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4">
              Where are you right now?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Take one of our gentle self-assessments. Not a diagnosis. Just a mirror to help you see your patterns more clearly.
            </p>
            <Link
              href="/assessments"
              className="inline-block no-underline px-8 py-4 rounded-lg text-base font-semibold transition-all duration-200 border-2"
              style={{ color: "oklch(0.45 0.1 145)", borderColor: "oklch(0.62 0.12 145)" }}
            >
              Take a Self-Assessment
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Calm Now CTA */}
      <section className="section-amber py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4">
              Need calm right now?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              A guided breathing exercise and grounding technique you can use in this moment. No signup required.
            </p>
            <Link
              href="/calm-now"
              className="inline-block no-underline px-8 py-4 rounded-lg text-base font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
            >
              Open Calm Now
            </Link>
          </FadeUp>
        </div>
      </section>
    </Layout>
  );
}
