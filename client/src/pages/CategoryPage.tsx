import { useParams, Link, useLocation } from "wouter";
import { articles } from "@/data/articles";
import { CATEGORIES, SITE_CONFIG } from "@/lib/types";
import { filterPublished, sortByDate, getArticlesByCategory } from "@/lib/utils";
import SEO, { collectionPageSchema } from "@/components/SEO";
import Layout from "@/components/Layout";
import { useState, useMemo } from "react";

const PER_PAGE = 18;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const category = CATEGORIES.find((c) => c.slug === slug);
  const [page, setPage] = useState(1);

  if (!category) {
    navigate("/404");
    return null;
  }

  const published = useMemo(
    () => sortByDate(filterPublished(getArticlesByCategory(articles, slug))),
    [slug]
  );

  const totalPages = Math.ceil(published.length / PER_PAGE);
  const currentPage = Math.min(page, totalPages || 1);
  const pageArticles = published.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <Layout>
      <SEO
        title={category.name}
        description={category.metaDescription}
        canonical={`https://${SITE_CONFIG.domain}/category/${slug}`}
        jsonLd={collectionPageSchema(category.name, slug, category.metaDescription)}
      />

      {/* Category Header */}
      <section className="section-sage py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/articles" className="no-underline text-sm font-medium mb-4 inline-block transition-colors" style={{ color: "oklch(0.55 0.12 145)" }}>
            &larr; All Articles
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-3">
            {category.name}
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-2">
            {category.description}
          </p>
          <p className="text-sm text-muted-foreground">
            {published.length} {published.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </section>

      {/* Article Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {pageArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No articles published yet in this category. Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className="group no-underline block article-card"
                >
                  <div className="img-zoom rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-muted">
                    <img
                      src={article.heroImage}
                      alt={article.heroAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-sage transition-colors leading-snug mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.readingTime} min</span>
                    <span>&middot;</span>
                    <span>{article.dateHuman}</span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-sage-light transition-colors disabled:opacity-30"
                >
                  &larr; Previous
                </button>
                <span className="text-sm text-muted-foreground px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-sage-light transition-colors disabled:opacity-30"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
