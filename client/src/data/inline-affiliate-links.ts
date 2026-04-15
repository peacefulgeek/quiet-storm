/**
 * Inline Affiliate Links - Natural embedding sentences for product recommendations
 * These are soft, conversational templates that match Kalesh's voice.
 * Each template has a {product} placeholder and a {link} placeholder.
 */

export const INLINE_TEMPLATES = [
  'One option that many people like is <a href="{link}" target="_blank" rel="nofollow sponsored">{product}</a> (paid link).',
  'A tool that often helps with this is <a href="{link}" target="_blank" rel="nofollow sponsored">{product}</a> (paid link).',
  'Something worth considering might be <a href="{link}" target="_blank" rel="nofollow sponsored">{product}</a> (paid link).',
  'For those looking for a simple solution, this works well: <a href="{link}" target="_blank" rel="nofollow sponsored">{product}</a> (paid link).',
  'You could also try <a href="{link}" target="_blank" rel="nofollow sponsored">{product}</a> (paid link).',
  'A popular choice for situations like this is <a href="{link}" target="_blank" rel="nofollow sponsored">{product}</a> (paid link).',
  'If you want something practical, <a href="{link}" target="_blank" rel="nofollow sponsored">{product}</a> is a solid starting point (paid link).',
  'Many readers have found <a href="{link}" target="_blank" rel="nofollow sponsored">{product}</a> helpful here (paid link).',
];

export const HEALING_JOURNEY_INTRO_TEMPLATES = [
  "If you're looking for something to support this part of your journey, here are a few things that have helped others:",
  "Some tools that can support what we've been talking about:",
  "A few things worth exploring as you work through this:",
  "Resources that complement what we've covered here:",
];

/**
 * Get a deterministic but varied template index based on a seed string
 */
export function getTemplateIndex(seed: string, templateCount: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash) % templateCount;
}
