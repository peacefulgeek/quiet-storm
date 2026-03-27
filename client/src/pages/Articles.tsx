import { Link, useSearch } from "wouter";
import { articles } from "@/data/articles";
import { CATEGORIES, SITE_CONFIG } from "@/lib/types";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO, { collectionPageSchema } from "@/components/SEO";
import Layout from "@/components/Layout";
import { useState, useMemo } from "react";

const PER_PAGE = 20;

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

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-2">
          Articles
        </h1>
        <p className="text-muted-foreground mb-8">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          {selectedCategory && ` in ${CATEGORIES.find((c) => c.slug === selectedCategory)?.name}`}
          {query && ` matching "${query}"`}
        </p>

        {/* Search */}
        <div className="mb-6">
          <label htmlFor="article-search" className="sr-only">Search articles</label>
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search articles..."
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sage/50 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => { setSelectedCategory(""); setPage(1); }}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              !selectedCategory
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => { setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug); setPage(1); }}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Article List */}
        <div className="space-y-0">
          {pageArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="block no-underline py-4 border-b border-border/50 group"
            >
              <h2 className="text-foreground group-hover:text-sage transition-colors font-medium text-lg leading-snug mb-1"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {article.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{article.dateHuman}</span>
                <span aria-hidden>·</span>
                <span>{article.readingTime} min</span>
                <span aria-hidden>·</span>
                <span style={{ color: "oklch(0.68 0.1 140)" }}>{article.category}</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">
            No articles found. Try a different search or category.
          </p>
        )}

        {/* Pagination */}
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
