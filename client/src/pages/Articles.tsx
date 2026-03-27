import { Link, useSearch } from "wouter";
import { articles } from "@/data/articles";
import { CATEGORIES, SITE_CONFIG } from "@/lib/types";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO, { collectionPageSchema } from "@/components/SEO";
import Layout from "@/components/Layout";
import { useState, useMemo } from "react";

const PER_PAGE = 18;

export default function Articles() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialQ = params.get("q") || "";
  const initialCat = params.get("category") || "";

  const [query, setQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [page, setPage] = useState(1);

  const published = useMemo(() => sortByDate(filterPublished(articles)), []);

  const filtered = useMemo(() => {
    let result = published;
    if (selectedCategory) {
      result = result.filter((a) => a.categorySlug === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [published, selectedCategory, query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentPage = Math.min(page, totalPages || 1);
  const pageArticles = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <Layout>
      <SEO
        title="Articles"
        description={`Browse ${published.length} articles on anxiety, the nervous system, somatic healing, and contemplative wisdom.`}
        canonical={`https://${SITE_CONFIG.domain}/articles`}
        jsonLd={collectionPageSchema("Articles", "articles", `All published articles from ${SITE_CONFIG.title}`)}
      />

      {/* Page Header */}
      <section className="section-sage py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-3">
            Articles
          </h1>
          <p className="text-muted-foreground max-w-xl">
            {published.length} pieces on anxiety, the nervous system, and the deeper questions. Each one written to be read slowly.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <label htmlFor="article-search" className="sr-only">Search articles</label>
            <input
              id="article-search"
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
              style={{ borderColor: "oklch(0.88 0.015 90)" }}
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedCategory(""); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !selectedCategory
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground bg-muted"
              }`}
              style={!selectedCategory ? { background: "oklch(0.62 0.12 145)" } : {}}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.slug
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground bg-muted"
                }`}
                style={selectedCategory === cat.slug ? { background: "oklch(0.62 0.12 145)" } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-muted-foreground mt-4">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          {selectedCategory && ` in ${CATEGORIES.find((c) => c.slug === selectedCategory)?.name}`}
          {query && ` matching "${query}"`}
        </p>
      </div>

      {/* Article Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {pageArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No articles found matching your search.</p>
            <button
              onClick={() => { setQuery(""); setSelectedCategory(""); setPage(1); }}
              className="mt-4 text-sm font-medium transition-colors"
              style={{ color: "oklch(0.55 0.12 145)" }}
            >
              Clear filters
            </button>
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="category-badge">
                      {CATEGORIES.find((c) => c.slug === article.categorySlug)?.name || article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{article.readingTime} min</span>
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-sage transition-colors leading-snug mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{article.dateHuman}</p>
                </Link>
              ))}
            </div>

            {/* Pagination */}
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
