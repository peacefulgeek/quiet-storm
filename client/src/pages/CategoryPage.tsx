import { useParams, Link, useLocation } from "wouter";
import { articles } from "@/data/articles";
import { CATEGORIES, SITE_CONFIG } from "@/lib/types";
import { filterPublished, sortByDate, getArticlesByCategory } from "@/lib/utils";
import SEO, { collectionPageSchema } from "@/components/SEO";
import Layout from "@/components/Layout";
import { useState, useMemo } from "react";

const PER_PAGE = 20;

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

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-3">
          {category.name}
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {category.description}
        </p>
        <p className="text-sm text-muted-foreground/70 mb-8">
          {published.length} {published.length === 1 ? "article" : "articles"}
        </p>

        <div className="space-y-0">
          {pageArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="block no-underline py-4 border-b border-border/50 group"
            >
              <h2
                className="text-foreground group-hover:text-sage transition-colors font-medium text-lg leading-snug mb-1"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {article.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{article.dateHuman}</span>
                <span aria-hidden>·</span>
                <span>{article.readingTime} min</span>
              </div>
            </Link>
          ))}
        </div>

        {published.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">
            No articles published yet in this category. Check back soon.
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-border rounded-md disabled:opacity-30 hover:bg-muted transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground px-3">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-border rounded-md disabled:opacity-30 hover:bg-muted transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
