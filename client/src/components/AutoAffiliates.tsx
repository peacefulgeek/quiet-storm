/**
 * AutoAffiliates - Automatically injects 2-4 Amazon product recommendations
 * into article pages. Includes:
 * 1. Inline product mentions at natural breakpoints in the body
 * 2. A "Healing Journey" section at the bottom with 3-4 product cards
 * 
 * All links use tag=spankyspinola-20 and end with (paid link).
 * Total Amazon links per article: strictly 2-4.
 */

import { useMemo } from "react";
import { findMatchingProducts, getAmazonUrl, type Product } from "@/data/product-catalog";
import { INLINE_TEMPLATES, HEALING_JOURNEY_INTRO_TEMPLATES, getTemplateIndex } from "@/data/inline-affiliate-links";

interface AutoAffiliatesProps {
  articleTitle: string;
  articleCategory: string;
  articleBody: string;
  articleSlug: string;
}

/**
 * Injects inline product links into article body HTML at natural breakpoints.
 * Returns modified body HTML with up to 2 inline product mentions.
 */
function injectInlineLinks(
  body: string,
  products: Product[],
  slug: string
): string {
  if (products.length === 0) return body;

  // Only inject up to 2 inline links (the rest go in Healing Journey section)
  const inlineProducts = products.slice(0, Math.min(2, products.length));

  // Find paragraph breaks to insert at (after ~3-4 paragraphs)
  const paragraphBreaks: number[] = [];
  const breakPattern = /<\/p>\s*\n*\s*<p>/g;
  let match;
  let count = 0;
  while ((match = breakPattern.exec(body)) !== null) {
    count++;
    // Insert after paragraphs 3-4 and 6-8 (natural breakpoints)
    if (count === 3 || count === 4 || count === 6 || count === 7 || count === 8) {
      paragraphBreaks.push(match.index + match[0].length);
    }
  }

  if (paragraphBreaks.length < 2) return body;

  // Insert inline links at spread-out positions
  let modifiedBody = body;
  let offset = 0;

  for (let i = 0; i < inlineProducts.length; i++) {
    const product = inlineProducts[i];
    const posIndex = i === 0 ? 0 : Math.min(2, paragraphBreaks.length - 1);
    const insertPos = paragraphBreaks[posIndex] + offset;

    const templateIdx = getTemplateIndex(slug + product.asin + i, INLINE_TEMPLATES.length);
    const template = INLINE_TEMPLATES[templateIdx];
    const link = getAmazonUrl(product.asin);
    const sentence = template
      .replace("{product}", product.name)
      .replace("{link}", link);

    const insertion = ` ${sentence}`;
    modifiedBody = modifiedBody.slice(0, insertPos) + insertion + modifiedBody.slice(insertPos);
    offset += insertion.length;
  }

  return modifiedBody;
}

/**
 * The AutoAffiliates component renders:
 * 1. Modified article body with inline product links
 * 2. A "Healing Journey" section below the body
 */
export function useAutoAffiliates({ articleTitle, articleCategory, articleBody, articleSlug }: AutoAffiliatesProps) {
  const matchedProducts = useMemo(
    () => findMatchingProducts(articleTitle, articleCategory, articleBody, 4),
    [articleTitle, articleCategory, articleBody]
  );

  const modifiedBody = useMemo(
    () => injectInlineLinks(articleBody, matchedProducts, articleSlug),
    [articleBody, matchedProducts, articleSlug]
  );

  return {
    modifiedBody,
    healingJourneyProducts: matchedProducts.slice(0, 4),
    hasProducts: matchedProducts.length > 0,
  };
}

/**
 * Healing Journey section component - renders 3-4 product cards at the bottom
 */
export function HealingJourneySection({ products, slug }: { products: Product[]; slug: string }) {
  if (products.length === 0) return null;

  const introIdx = getTemplateIndex(slug, HEALING_JOURNEY_INTRO_TEMPLATES.length);
  const intro = HEALING_JOURNEY_INTRO_TEMPLATES[introIdx];

  return (
    <section className="mt-10 mb-8 p-6 sm:p-8 rounded-2xl" style={{ background: "oklch(0.96 0.02 145 / 0.4)", border: "1px solid oklch(0.88 0.06 145 / 0.3)" }}>
      <h2 className="font-heading text-xl font-semibold mb-2 text-foreground">
        Your Healing Journey
      </h2>
      <p className="text-sm text-muted-foreground mb-6">{intro}</p>
      <div className="space-y-4">
        {products.map((product, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/60">
            <div className="flex-1 min-w-0">
              <a
                href={getAmazonUrl(product.asin)}
                target="_blank"
                rel="nofollow sponsored"
                className="text-sm font-semibold text-foreground hover:text-sage transition-colors no-underline"
                style={{ color: "oklch(0.45 0.1 145)" }}
              >
                {product.name}
              </a>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {product.description}
              </p>
              <span className="text-xs text-muted-foreground/60 mt-1 inline-block">(paid link)</span>
            </div>
            <span className="text-xs text-muted-foreground/50 whitespace-nowrap">{product.priceRange}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground/70 mt-4 italic">
        As an Amazon Associate, I earn from qualifying purchases.
      </p>
    </section>
  );
}

export default HealingJourneySection;
