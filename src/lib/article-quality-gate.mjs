/**
 * Article Quality Gate — quiet-storm
 * The Paul Voice Gate (Non-Negotiable)
 * 
 * Every article must pass this gate. If it fails, regenerate (up to 4 attempts).
 */

// ─── BANNED WORDS (regex match, case-insensitive) ───
const BANNED_WORDS = [
  "utilize", "delve", "tapestry", "landscape", "paradigm", "synergy", "leverage",
  "unlock", "empower", "pivotal", "embark", "underscore", "paramount", "seamlessly",
  "robust", "beacon", "foster", "elevate", "curate", "curated", "bespoke", "resonate",
  "harness", "intricate", "plethora", "myriad", "groundbreaking", "innovative",
  "cutting-edge", "state-of-the-art", "game-changer", "ever-evolving", "rapidly-evolving",
  "stakeholders", "navigate", "ecosystem", "framework", "comprehensive", "transformative",
  "holistic", "nuanced", "multifaceted", "profound", "furthermore",
];

// ─── BANNED PHRASES (string match, case-insensitive) ───
const BANNED_PHRASES = [
  "it's important to note that",
  "it's worth noting that",
  "in conclusion",
  "in summary",
  "a holistic approach",
  "in the realm of",
  "dive deep into",
  "at the end of the day",
  "in today's fast-paced world",
  "plays a crucial role",
];

/**
 * Count words in HTML text (strips tags first).
 */
export function countWords(html) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

/**
 * Count Amazon affiliate links in body.
 */
export function countAmazonLinks(html) {
  return (html.match(/amazon\.com\/dp\/[A-Z0-9]+\?tag=spankyspinola-20/gi) || []).length;
}

/**
 * Extract ASINs from text.
 */
export function extractAsinsFromText(html) {
  const matches = html.match(/amazon\.com\/dp\/([A-Z0-9]+)/gi) || [];
  return [...new Set(matches.map(m => m.replace(/.*\/dp\//, "")))];
}

/**
 * Check for em-dashes.
 */
export function hasEmDash(text) {
  return text.includes("\u2014") || text.includes("\u2013");
}

/**
 * Run the full quality gate on article body HTML.
 * Returns { passed: boolean, failures: string[] }
 */
export function runQualityGate(body) {
  const failures = [];
  const plainText = body.replace(/<[^>]+>/g, " ");
  const lowerText = plainText.toLowerCase();

  // 1. Banned words
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
    if (regex.test(plainText)) {
      failures.push(`BANNED_WORD: "${word}"`);
    }
  }

  // 2. Banned phrases
  for (const phrase of BANNED_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      failures.push(`BANNED_PHRASE: "${phrase}"`);
    }
  }

  // 3. Em-dashes
  if (hasEmDash(body)) {
    failures.push("EM_DASH: em-dash or en-dash found");
  }

  // 4. Word count: floor 1200, ceiling 2500
  const wordCount = countWords(body);
  if (wordCount < 1200) {
    failures.push(`WORD_COUNT_LOW: ${wordCount} (min 1200)`);
  }
  if (wordCount > 2500) {
    failures.push(`WORD_COUNT_HIGH: ${wordCount} (max 2500)`);
  }

  // 5. Amazon affiliate links: exactly 3 or 4
  const linkCount = countAmazonLinks(body);
  if (linkCount < 3) {
    failures.push(`AMAZON_LINKS_LOW: ${linkCount} (need 3-4)`);
  }
  if (linkCount > 4) {
    failures.push(`AMAZON_LINKS_HIGH: ${linkCount} (need 3-4)`);
  }

  // 6. Voice & Tone checks
  const contractions = (plainText.match(/\b(don't|can't|won't|isn't|aren't|it's|you're|they're|we're|I've|you've|that's|here's|there's|what's|doesn't|didn't|wasn't|weren't|couldn't|wouldn't|shouldn't)\b/gi) || []).length;
  if (contractions < 5) {
    failures.push(`VOICE_CONTRACTIONS: only ${contractions} (need 5+)`);
  }

  // Direct address
  const youCount = (plainText.match(/\byou\b/gi) || []).length;
  if (youCount < 10) {
    failures.push(`VOICE_DIRECT_ADDRESS: only ${youCount} "you" (need 10+)`);
  }

  // Conversational markers
  const markers = ["right?", "know what i mean", "does that land", "how does that make you feel", "here's the thing", "honestly", "look,", "truth is", "that said", "but here's"];
  const markerCount = markers.filter(m => lowerText.includes(m)).length;
  if (markerCount < 2) {
    failures.push(`VOICE_MARKERS: only ${markerCount} conversational markers (need 2+)`);
  }

  return {
    passed: failures.length === 0,
    failures,
    wordCount,
    linkCount,
  };
}

export { BANNED_WORDS, BANNED_PHRASES };
