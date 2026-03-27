import { useEffect } from "react";
import { SITE_CONFIG } from "@/lib/types";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  jsonLd,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title
    ? `${title} — ${SITE_CONFIG.title}`
    : `${SITE_CONFIG.title} — ${SITE_CONFIG.subtitle}`;
  const desc = description || `${SITE_CONFIG.subtitle}. ${SITE_CONFIG.tagline}`;
  const url = canonical || `https://${SITE_CONFIG.domain}/`;
  const image = ogImage || `https://quiet-storm.b-cdn.net/og/site-og.png`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", desc);
    setMeta("author", SITE_CONFIG.editorialName);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", desc, true);
    setMeta("og:url", url, true);
    setMeta("og:image", image, true);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", SITE_CONFIG.title, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", image);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;

    // JSON-LD
    const existingScripts = document.querySelectorAll('script[data-seo="true"]');
    existingScripts.forEach((s) => s.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "true");
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      const scripts = document.querySelectorAll('script[data-seo="true"]');
      scripts.forEach((s) => s.remove());
    };
  }, [fullTitle, desc, url, image, ogType, noIndex, jsonLd]);

  return null;
}

// JSON-LD helpers
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.title,
    url: `https://${SITE_CONFIG.domain}`,
    description: SITE_CONFIG.subtitle,
    logo: `https://quiet-storm.b-cdn.net/og/site-og.png`,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.title,
    url: `https://${SITE_CONFIG.domain}`,
    description: SITE_CONFIG.subtitle,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://${SITE_CONFIG.domain}/articles?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleSchema(article: {
  title: string;
  slug: string;
  excerpt: string;
  dateISO: string;
  heroImage: string;
  readingTime: number;
  body: string;
  faqs: { question: string; answer: string }[];
}) {
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      url: `https://${SITE_CONFIG.domain}/article/${article.slug}`,
      image: article.heroImage,
      datePublished: article.dateISO,
      dateModified: article.dateISO,
      author: {
        "@type": "Person",
        name: SITE_CONFIG.author,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_CONFIG.title,
        logo: {
          "@type": "ImageObject",
          url: `https://quiet-storm.b-cdn.net/og/site-og.png`,
        },
      },
      wordCount: article.body.replace(/<[^>]+>/g, "").split(/\s+/).length,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".article-body p:first-of-type", "h1"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `https://${SITE_CONFIG.domain}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Articles",
          item: `https://${SITE_CONFIG.domain}/articles`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: `https://${SITE_CONFIG.domain}/article/${article.slug}`,
        },
      ],
    },
  ];

  // FAQPage schema if article has FAQs
  if (article.faqs && article.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return schemas;
}

export function collectionPageSchema(categoryName: string, categorySlug: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: categoryName,
    description,
    url: `https://${SITE_CONFIG.domain}/category/${categorySlug}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_CONFIG.title,
      url: `https://${SITE_CONFIG.domain}`,
    },
  };
}

export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: SITE_CONFIG.author,
      jobTitle: SITE_CONFIG.authorTitle,
      description: SITE_CONFIG.authorBio,
      url: SITE_CONFIG.authorLink,
    },
  };
}

export function subscribeActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SubscribeAction",
    object: {
      "@type": "Product",
      name: `${SITE_CONFIG.title} Newsletter`,
    },
    target: {
      "@type": "EntryPoint",
      urlTemplate: `https://${SITE_CONFIG.domain}/#newsletter`,
    },
  };
}
