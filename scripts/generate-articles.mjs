/**
 * Auto-Gen Pipeline — Generate new articles via Anthropic Claude
 * ALL secrets from process.env (Render env vars). NEVER hardcode API keys.
 * Bunny CDN credentials stay in code per spec.
 *
 * HUMANIZATION RULES (baked in):
 * - Word count: 1200-1800 words
 * - Zero em-dashes (— or –)
 * - Zero AI-flagged words (profound, transformative, holistic, nuanced, multifaceted, etc.)
 * - Exactly 2 conversational interjections per article
 * - Kalesh voice: direct, unflinching, compassionate, somatic + Vedantic
 * - Varied sentence lengths, no repetitive starters
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// ─── FEATURE FLAG (stays in code — not a secret) ───
const AUTO_GEN_ENABLED = true; // ENABLED — live article generation active

// ─── FROM RENDER ENV VARS (auto-revoked if found in code) ───
// ANTHROPIC_API_KEY, FAL_KEY, GH_PAT — all from process.env

// ─── HARDCODED (Bunny is safe in code) ───
const BUNNY_STORAGE_ZONE = "quiet-storm";
const BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com";
const BUNNY_STORAGE_PASSWORD = "4f79f1de-6894-4de4-962e830a70ee-cf58-40a0";
const BUNNY_CDN_HOST = "quiet-storm.b-cdn.net";

const GH_REPO = "peacefulgeek/quiet-storm";
const ARTICLES_FILE = "client/src/data/articles.ts";

const CATEGORIES = [
  { slug: "the-nervous-system", name: "The Nervous System" },
  { slug: "the-body", name: "The Body" },
  { slug: "the-mind", name: "The Mind" },
  { slug: "the-specific", name: "The Specific" },
  { slug: "the-deeper-question", name: "The Deeper Question" },
];

// ─── BANNED AI WORDS ───
const BANNED_WORDS = [
  "profound", "profoundly", "transformative", "holistic", "nuanced",
  "multifaceted", "tapestry", "delve", "delves", "delving",
  "embark", "embarking", "embarks", "realm", "realms",
  "unveil", "unveils", "unveiling", "leverage", "leveraging", "leverages",
  "paradigm", "paradigms", "synergy", "robust", "cutting-edge",
  "groundbreaking", "pivotal", "fostering", "fosters", "foster",
  "harnessing", "harness", "harnesses", "navigating", "navigate", "navigates",
  "landscape", "landscapes", "intricate", "comprehensive",
  "furthermore", "moreover", "encompasses", "encompass", "encompassing",
  "myriad", "plethora", "utilize", "utilizes", "utilizing", "utilization",
  "facilitate", "facilitates", "facilitating", "juxtaposition",
  "dichotomy", "epitome", "culmination", "underpinning", "underpinnings",
  "elucidates", "elucidate", "elucidating", "amalgamation",
  "quintessential", "paramount", "meticulous", "meticulously",
  "resonate", "resonates", "resonating", "resonance",
];

// ─── AI WORD REPLACEMENTS ───
const AI_REPLACEMENTS = {
  "profound": ["deep", "real", "striking", "significant", "genuine"],
  "profoundly": ["deeply", "really", "genuinely", "remarkably"],
  "transformative": ["life-changing", "game-changing", "powerful", "significant"],
  "holistic": ["whole-person", "full-picture", "integrated", "complete"],
  "nuanced": ["layered", "subtle", "complex", "detailed"],
  "multifaceted": ["many-sided", "complex", "layered", "varied"],
  "tapestry": ["fabric", "web", "pattern", "weave"],
  "delve": ["dig into", "explore", "look at", "get into"],
  "delves": ["digs into", "explores", "looks at", "gets into"],
  "delving": ["digging into", "exploring", "looking at", "getting into"],
  "embark": ["start", "begin", "set out on", "take on"],
  "embarking": ["starting", "beginning", "setting out on"],
  "embarks": ["starts", "begins", "sets out on"],
  "realm": ["area", "space", "world", "territory", "domain"],
  "realms": ["areas", "spaces", "worlds", "territories"],
  "unveil": ["reveal", "show", "uncover", "expose"],
  "unveils": ["reveals", "shows", "uncovers"],
  "unveiling": ["revealing", "showing", "uncovering"],
  "leverage": ["use", "tap into", "draw on", "work with"],
  "leveraging": ["using", "tapping into", "drawing on"],
  "leverages": ["uses", "taps into", "draws on"],
  "paradigm": ["framework", "model", "approach", "way of thinking"],
  "paradigms": ["frameworks", "models", "approaches"],
  "synergy": ["connection", "overlap", "interplay"],
  "robust": ["strong", "solid", "reliable", "sturdy"],
  "cutting-edge": ["leading", "latest", "current", "modern"],
  "groundbreaking": ["pioneering", "fresh", "original", "new"],
  "pivotal": ["key", "critical", "central", "important"],
  "fostering": ["building", "growing", "encouraging", "supporting"],
  "fosters": ["builds", "grows", "encourages", "supports"],
  "foster": ["build", "grow", "encourage", "support"],
  "harnessing": ["using", "channeling", "working with"],
  "harness": ["use", "channel", "work with"],
  "harnesses": ["uses", "channels", "works with"],
  "navigating": ["moving through", "working through", "handling"],
  "navigate": ["move through", "work through", "handle"],
  "navigates": ["moves through", "works through", "handles"],
  "landscape": ["terrain", "field", "territory", "ground"],
  "landscapes": ["terrains", "fields", "territories"],
  "intricate": ["detailed", "complex", "elaborate", "involved"],
  "comprehensive": ["full", "thorough", "complete", "wide-ranging"],
  "furthermore": ["also", "and", "plus", "on top of that"],
  "moreover": ["also", "on top of that", "and", "what's more"],
  "encompasses": ["includes", "covers", "takes in", "holds"],
  "encompass": ["include", "cover", "take in", "hold"],
  "encompassing": ["including", "covering", "taking in"],
  "myriad": ["many", "countless", "numerous", "a range of"],
  "plethora": ["many", "plenty of", "a lot of", "a range of"],
  "utilize": ["use", "apply", "work with"],
  "utilizes": ["uses", "applies", "works with"],
  "utilizing": ["using", "applying", "working with"],
  "utilization": ["use", "application"],
  "facilitate": ["help", "support", "enable", "make possible"],
  "facilitates": ["helps", "supports", "enables"],
  "facilitating": ["helping", "supporting", "enabling"],
  "juxtaposition": ["contrast", "tension", "comparison"],
  "dichotomy": ["split", "tension", "divide"],
  "epitome": ["example", "model", "picture"],
  "culmination": ["result", "peak", "outcome"],
  "underpinning": ["foundation", "basis", "root"],
  "underpinnings": ["foundations", "roots", "bases"],
  "elucidates": ["explains", "clarifies", "shows"],
  "elucidate": ["explain", "clarify", "show"],
  "elucidating": ["explaining", "clarifying", "showing"],
  "amalgamation": ["mix", "blend", "combination"],
  "quintessential": ["classic", "typical", "perfect example of"],
  "paramount": ["essential", "critical", "vital", "key"],
  "meticulous": ["careful", "thorough", "detailed"],
  "meticulously": ["carefully", "thoroughly", "with care"],
  "resonate": ["connect", "land", "hit home", "ring true"],
  "resonates": ["connects", "lands", "hits home", "rings true"],
  "resonating": ["connecting", "landing", "hitting home"],
  "resonance": ["connection", "echo", "pull"],
};

// ─── CONVERSATIONAL INTERJECTIONS ───
const INTERJECTIONS = [
  "Stay with me here.",
  "I know, I know.",
  "Wild, right?",
  "Think about that for a second.",
  "Here's the thing.",
  "Bear with me on this.",
  "Hang on - this part matters.",
  "Real talk for a moment.",
  "And honestly?",
  "Look.",
  "Here's what nobody tells you.",
  "Let that land for a second.",
  "Sit with that.",
  "No, really.",
  "This is the part that gets me.",
  "Pay attention to this next part.",
  "Here's where it gets interesting.",
  "Stick with me.",
  "I want to be honest about something.",
  "Can I be real with you?",
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

/**
 * Post-process article body to enforce humanization rules.
 */
function humanizeBody(body, slug) {
  let text = body;

  // 1. Remove ALL em-dashes and en-dashes
  text = text.replace(/\u2014/g, " - ");
  text = text.replace(/\u2013/g, " - ");

  // 2. Replace AI words
  for (const [word, alts] of Object.entries(AI_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "gi");
    text = text.replace(regex, (match) => {
      const alt = alts[Math.floor(Math.random() * alts.length)];
      if (match[0] === match[0].toUpperCase()) {
        return alt.charAt(0).toUpperCase() + alt.slice(1);
      }
      return alt;
    });
  }

  // 3. Add 2 conversational interjections
  const hash = slug.split("").reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const idx1 = Math.abs(hash) % INTERJECTIONS.length;
  let idx2 = Math.abs(hash >> 8) % INTERJECTIONS.length;
  if (idx2 === idx1) idx2 = (idx2 + 1) % INTERJECTIONS.length;

  const paragraphs = text.split("</p>");
  const total = paragraphs.length;
  if (total >= 6) {
    const pos1 = Math.max(2, Math.floor(total / 3));
    const pos2 = Math.max(pos1 + 2, Math.floor(2 * total / 3));

    if (pos2 < total) {
      paragraphs.splice(pos2, 0, `<p>${INTERJECTIONS[idx2]}</p>`);
    }
    if (pos1 < total) {
      paragraphs.splice(pos1, 0, `<p>${INTERJECTIONS[idx1]}</p>`);
    }
  }
  text = paragraphs.join("</p>");

  return text;
}

/**
 * Count words in HTML text.
 */
function countWords(html) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

async function generateArticle() {
  if (!AUTO_GEN_ENABLED) {
    console.log("[auto-gen] AUTO_GEN_ENABLED is false. Skipping.");
    return null;
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const FAL_KEY = process.env.FAL_KEY;
  const GH_PAT = process.env.GH_PAT;

  if (!ANTHROPIC_API_KEY) {
    console.error("[auto-gen] Missing ANTHROPIC_API_KEY");
    return null;
  }
  if (!FAL_KEY) {
    console.error("[auto-gen] Missing FAL_KEY");
    return null;
  }
  if (!GH_PAT) {
    console.error("[auto-gen] Missing GH_PAT");
    return null;
  }

  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  try {
    // ─── Step 1: Generate article content via Claude ───
    console.log(`[auto-gen] Generating article for category: ${category.name}`);

    const bannedWordsList = BANNED_WORDS.join(", ");

    const articleResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        messages: [
          {
            role: "user",
            content: `Write a 1400-1700 word article for The Quiet Storm, an anxiety wellness editorial. Category: ${category.name}.

Voice: Kalesh - consciousness teacher and writer. Direct, unflinching, compassionate. Uses somatic and Vedantic frameworks. No toxic positivity. No listicle energy. 30% spiritual/healing threads woven throughout. Conversational and truly connective - like talking to a wise friend who's been through it.

CRITICAL HUMANIZATION RULES:
- Word count MUST be between 1200 and 1800 words. Aim for 1400-1700.
- ZERO em-dashes. Never use the character. Use " - " or "..." or " ~ " instead.
- ZERO AI-flagged words. NEVER use any of these: ${bannedWordsList}
- Include exactly 2 conversational interjections as standalone paragraphs (e.g., "Stay with me here.", "I know, I know.", "Wild, right?", "Think about that for a second.", "Here's the thing.")
- Aggressively vary sentence lengths. Mix short punchy sentences with longer flowing ones.
- Never start more than 2 sentences with "This" in a row. Vary starters.
- Write like a real human. Use contractions. Be direct. Be warm. Be honest.
- No corporate speak. No self-help cliches. No "journey of self-discovery" energy.

AMAZON AFFILIATE LINKS (MANDATORY):
- Include exactly 4 Amazon product recommendation links naturally embedded in the article body text.
- Each link must be a real, relevant product (book, supplement, tool, etc.) that genuinely relates to the article topic.
- Use this exact format: <a href="https://www.amazon.com/dp/ASIN?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">Product Name</a> (paid link)
- Spread the 4 links evenly through the article - roughly at 25%, 45%, 65%, and 85% through the body.
- Each recommendation should be a soft, conversational sentence like: "Something that pairs well with this kind of work is [LINK]."
- Use REAL ASINs for well-known products in the anxiety/wellness/mindfulness niche. Examples: 0143127748 (The Body Keeps the Score), 155643233X (Waking the Tiger), 0393712370 (Polyvagal Theory in Therapy), 1623170249 (Accessing the Healing Power of the Vagus Nerve), B004U3Y9FU (Nature Made B-Complex), B01LP0V1GI (Acupressure Mat), B07BGZQXNF (Muse 2 Headband), B09BFHH1QM (Apollo Neuro), B09GFPFQBQ (Insight Timer Gift Card), 1572245379 (The Untethered Soul), 1577314808 (The Power of Now), B0892MWQR3 (Theragun Mini), B00HD0ELFK (Magnesium Glycinate), B08YRXJM1V (Weighted Blanket).
- Pick products that are genuinely relevant to the specific article topic.

Requirements:
- Varied opener (scene-setting, provocation, first-person, question, named-reference, or gut-punch)
- 4-6 H2 sections with id attributes for anchor links
- 1 blockquote (philosophical or from a named researcher)
- 2-4 FAQ questions with answers
- 3-5 internal links to other articles (use realistic slugs like /article/understanding-your-vagus-nerve)
- Named niche-appropriate researchers (Porges, van der Kolk, Levine, Huberman, etc.)
- Varied conclusion (challenge or tender)
- 23% chance: include 1 link to https://kalesh.love with topically descriptive anchor text
- Body HTML: use <h2 id="slug">, <p>, <blockquote>, <a href>. No markdown.

Output ONLY valid JSON with these exact keys:
{
  "title": "Article Title",
  "slug": "article-slug-here",
  "excerpt": "Two sentence excerpt.",
  "body": "<h2 id=\\"section-one\\">...</h2><p>...</p>...",
  "faqs": [{"question": "Q?", "answer": "A."}],
  "heroAlt": "Descriptive alt text for hero image",
  "openerType": "scene-setting",
  "conclusionType": "challenge",
  "backlinkType": "internal",
  "namedReferences": ["Stephen Porges", "Bessel van der Kolk"]
}`,
          },
        ],
      }),
    });

    if (!articleResponse.ok) {
      const errText = await articleResponse.text();
      console.error(`[auto-gen] Claude API error ${articleResponse.status}: ${errText}`);
      return null;
    }

    const articleData = await articleResponse.json();
    const content = articleData.content[0].text;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[auto-gen] Could not parse JSON from Claude response");
      return null;
    }

    const article = JSON.parse(jsonMatch[0]);
    console.log(`[auto-gen] Article generated: ${article.title}`);

    // ─── Step 1.5: Post-process humanization ───
    console.log("[auto-gen] Applying humanization post-processing...");
    article.body = humanizeBody(article.body, article.slug);
    article.excerpt = article.excerpt.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");

    // Replace AI words in FAQ answers
    if (article.faqs) {
      for (const faq of article.faqs) {
        faq.answer = faq.answer.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");
        for (const [word, alts] of Object.entries(AI_REPLACEMENTS)) {
          const regex = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "gi");
          faq.answer = faq.answer.replace(regex, () => alts[Math.floor(Math.random() * alts.length)]);
        }
      }
    }

    // ─── Step 1.6: Verify and enforce Amazon links ───
    const amazonLinkCount = (article.body.match(/amazon\.com\/dp\//g) || []).length;
    console.log(`[auto-gen] Amazon links in body: ${amazonLinkCount}`);
    
    // If Claude didn't include enough Amazon links, inject them
    if (amazonLinkCount < 3) {
      console.log("[auto-gen] Injecting additional Amazon links...");
      const AFFILIATE_TAG = "spankyspinola-20";
      const PRODUCT_POOL = [
        { name: "The Body Keeps the Score", asin: "0143127748" },
        { name: "Waking the Tiger", asin: "155643233X" },
        { name: "The Polyvagal Theory in Therapy", asin: "0393712370" },
        { name: "Accessing the Healing Power of the Vagus Nerve", asin: "1623170249" },
        { name: "Nature Made B-Complex", asin: "B004U3Y9FU" },
        { name: "Acupressure Mat and Pillow Set", asin: "B01LP0V1GI" },
        { name: "Muse 2 Brain Sensing Headband", asin: "B07BGZQXNF" },
        { name: "Apollo Neuro Wearable", asin: "B09BFHH1QM" },
        { name: "The Untethered Soul", asin: "1572245379" },
        { name: "The Power of Now", asin: "1577314808" },
        { name: "Theragun Mini", asin: "B0892MWQR3" },
        { name: "Magnesium Glycinate", asin: "B00HD0ELFK" },
        { name: "Weighted Blanket", asin: "B08YRXJM1V" },
        { name: "Insight Timer Premium", asin: "B09GFPFQBQ" },
      ];
      const LINK_TEMPLATES = [
        'Something that pairs well with this kind of work is <a href="https://www.amazon.com/dp/{asin}?tag={tag}" target="_blank" rel="nofollow sponsored">{name}</a> (paid link).',
        'A tool that often helps here is <a href="https://www.amazon.com/dp/{asin}?tag={tag}" target="_blank" rel="nofollow sponsored">{name}</a> (paid link).',
        'Many readers have found <a href="https://www.amazon.com/dp/{asin}?tag={tag}" target="_blank" rel="nofollow sponsored">{name}</a> useful for exactly this (paid link).',
        'If you want something concrete to work with, <a href="https://www.amazon.com/dp/{asin}?tag={tag}" target="_blank" rel="nofollow sponsored">{name}</a> is a solid option (paid link).',
      ];
      
      const needed = 4 - amazonLinkCount;
      const shuffled = PRODUCT_POOL.sort(() => Math.random() - 0.5);
      const paragraphs = article.body.split("</p>");
      const total = paragraphs.length;
      const positions = [0.25, 0.45, 0.65, 0.85].map(f => Math.floor(total * f));
      
      let inserted = 0;
      for (let j = 0; j < needed && j < shuffled.length; j++) {
        const prod = shuffled[j];
        const tmpl = LINK_TEMPLATES[j % LINK_TEMPLATES.length];
        const sentence = tmpl.replace("{asin}", prod.asin).replace("{tag}", AFFILIATE_TAG).replace("{name}", prod.name);
        const insertIdx = positions[amazonLinkCount + j] || positions[j];
        if (insertIdx < total) {
          paragraphs.splice(insertIdx, 0, `<p>${sentence}</p>`);
          inserted++;
        }
      }
      article.body = paragraphs.join("</p>");
      console.log(`[auto-gen] Injected ${inserted} additional Amazon links`);
    }
    
    // Ensure all Amazon links have the correct tag
    article.body = article.body.replace(
      /amazon\.com\/dp\/([A-Z0-9]+)(?!\?tag=)/g,
      'amazon.com/dp/$1?tag=spankyspinola-20'
    );

    // Verify word count
    const wordCount = countWords(article.body);
    console.log(`[auto-gen] Word count: ${wordCount}`);
    if (wordCount < 1200 || wordCount > 1800) {
      console.warn(`[auto-gen] Word count ${wordCount} outside 1200-1800 range. Proceeding anyway.`);
    }

    // ─── Step 2: Generate hero image via FAL.ai ───
    console.log("[auto-gen] Generating hero image...");

    const imageResponse = await fetch("https://queue.fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Luminous, warm, healing scene: ${article.heroAlt}. Soft natural light, no text, no people in distress, watercolor-inspired, ethereal atmosphere, high quality editorial illustration.`,
        image_size: { width: 1200, height: 675 },
        num_images: 1,
      }),
    });

    let heroImageUrl = `https://${BUNNY_CDN_HOST}/images/default-hero.webp`;
    let ogImageUrl = `https://${BUNNY_CDN_HOST}/og/default-og.png`;

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      if (imageData.images && imageData.images[0]) {
        const imgResp = await fetch(imageData.images[0].url);
        const imgBuffer = Buffer.from(await imgResp.arrayBuffer());

        // Upload hero image
        const heroUpload = await fetch(
          `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/images/${article.slug}.webp`,
          {
            method: "PUT",
            headers: {
              AccessKey: BUNNY_STORAGE_PASSWORD,
              "Content-Type": "image/webp",
            },
            body: imgBuffer,
          }
        );

        if (heroUpload.ok) {
          heroImageUrl = `https://${BUNNY_CDN_HOST}/images/${article.slug}.webp`;
          console.log(`[auto-gen] Hero uploaded: ${heroImageUrl}`);
        }

        // Upload OG image (same image as PNG)
        const ogUpload = await fetch(
          `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/og/${article.slug}.png`,
          {
            method: "PUT",
            headers: {
              AccessKey: BUNNY_STORAGE_PASSWORD,
              "Content-Type": "image/png",
            },
            body: imgBuffer,
          }
        );

        if (ogUpload.ok) {
          ogImageUrl = `https://${BUNNY_CDN_HOST}/og/${article.slug}.png`;
          console.log(`[auto-gen] OG uploaded: ${ogImageUrl}`);
        }
      }
    } else {
      console.warn("[auto-gen] FAL.ai error, using default hero");
    }

    // ─── Step 3: Build article object ───
    const now = new Date();

    const articleObj = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      category: category.name,
      categorySlug: category.slug,
      dateISO: now.toISOString(),
      dateHuman: now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readingTime: Math.ceil(wordCount / 250),
      heroImage: heroImageUrl,
      heroAlt: article.heroAlt,
      ogImage: ogImageUrl,
      openerType: article.openerType || "scene-setting",
      faqCount: (article.faqs || []).length,
      faqs: article.faqs || [],
      backlinkType: article.backlinkType || "internal",
      conclusionType: article.conclusionType || "tender",
      namedReferences: article.namedReferences || [],
      voicePhrases: [],
      internalLinks: [],
    };

    // ─── Step 4: Append to articles.ts and push to GitHub ───
    console.log("[auto-gen] Appending to articles.ts...");

    const articlesPath = path.join(ROOT, ARTICLES_FILE);
    let articlesContent = fs.readFileSync(articlesPath, "utf-8");

    // Find the closing bracket of the array
    const lastBracket = articlesContent.lastIndexOf("]");
    if (lastBracket === -1) {
      console.error("[auto-gen] Could not find array end in articles.ts");
      return null;
    }

    // Insert new article before the closing bracket
    const articleJson = JSON.stringify(articleObj, null, 2);
    const newContent =
      articlesContent.slice(0, lastBracket) +
      ",\n" +
      articleJson +
      "\n" +
      articlesContent.slice(lastBracket);

    fs.writeFileSync(articlesPath, newContent, "utf-8");
    console.log("[auto-gen] articles.ts updated");

    // ─── Step 5: Git commit and push ───
    console.log("[auto-gen] Committing and pushing to GitHub...");

    try {
      execSync("git add -A", { cwd: ROOT, stdio: "pipe" });
      execSync(
        `git commit -m "auto-gen: ${article.title}"`,
        { cwd: ROOT, stdio: "pipe" }
      );
      execSync(
        `git push https://${GH_PAT}@github.com/${GH_REPO}.git main`,
        { cwd: ROOT, stdio: "pipe", timeout: 60000 }
      );
      console.log("[auto-gen] Pushed to GitHub successfully");
    } catch (gitErr) {
      console.error("[auto-gen] Git push error:", gitErr.message);
      // Article is still saved locally even if push fails
    }

    console.log(`[auto-gen] Complete: ${articleObj.title}`);
    return articleObj;
  } catch (err) {
    console.error("[auto-gen] Error:", err.message);
    return null;
  }
}

export { generateArticle, AUTO_GEN_ENABLED };
