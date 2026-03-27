/**
 * Auto-Gen Pipeline — Generate new articles via Anthropic Claude
 * ALL secrets from process.env. NEVER hardcode API keys.
 * Bunny CDN credentials stay in code per spec.
 */

const AUTO_GEN_ENABLED = false;

const BUNNY_STORAGE_ZONE = "quiet-storm";
const BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com";
const BUNNY_STORAGE_PASSWORD = "4f79f1de-6894-4de4-962e830a70ee-cf58-40a0";
const BUNNY_CDN_HOST = "quiet-storm.b-cdn.net";

const CATEGORIES = [
  { slug: "the-nervous-system", name: "The Nervous System" },
  { slug: "the-body", name: "The Body" },
  { slug: "the-mind", name: "The Mind" },
  { slug: "the-specific", name: "The Specific" },
  { slug: "the-deeper-question", name: "The Deeper Question" },
];

async function generateArticle() {
  if (!AUTO_GEN_ENABLED) {
    console.log("[auto-gen] AUTO_GEN_ENABLED is false. Skipping.");
    return null;
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const FAL_KEY = process.env.FAL_KEY;

  if (!ANTHROPIC_API_KEY) {
    console.error("[auto-gen] Missing ANTHROPIC_API_KEY");
    return null;
  }

  if (!FAL_KEY) {
    console.error("[auto-gen] Missing FAL_KEY");
    return null;
  }

  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  try {
    // Step 1: Generate article content via Claude
    const articleResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `Write a 2,500-2,800 word article for The Quiet Storm, an anxiety wellness editorial. Category: ${category.name}. 

Voice: Kalesh — consciousness teacher and writer. Direct, unflinching, compassionate. Uses somatic and Vedantic frameworks. No toxic positivity. No listicle energy. 30% spiritual/healing threads woven throughout.

Requirements:
- Varied opener (scene-setting, provocation, first-person, question, named-reference, or gut-punch)
- 4-6 H2 sections with substantive paragraphs
- 1 blockquote (philosophical or from a named researcher)
- 2-4 FAQ questions with answers
- 3-5 internal links to other articles (use realistic slugs)
- Named niche-appropriate researchers (Porges, van der Kolk, Levine, Huberman, etc.)
- Varied conclusion (challenge or tender)
- Output as JSON with: title, slug, excerpt (2 sentences), body (HTML), faqs (array of {question, answer}), heroAlt (image description)`,
          },
        ],
      }),
    });

    if (!articleResponse.ok) {
      console.error("[auto-gen] Claude API error:", articleResponse.status);
      return null;
    }

    const articleData = await articleResponse.json();
    const content = articleData.content[0].text;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[auto-gen] Could not parse JSON from Claude response");
      return null;
    }

    const article = JSON.parse(jsonMatch[0]);

    // Step 2: Generate hero image via FAL.ai
    const imageResponse = await fetch("https://queue.fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Luminous, warm, healing scene: ${article.heroAlt}. Soft natural light, no text, no people in distress, watercolor-inspired, ethereal atmosphere.`,
        image_size: { width: 1200, height: 675 },
        num_images: 1,
      }),
    });

    let heroImageUrl = `https://${BUNNY_CDN_HOST}/images/default-hero.webp`;

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      if (imageData.images && imageData.images[0]) {
        // Download and upload to Bunny CDN
        const imgResp = await fetch(imageData.images[0].url);
        const imgBuffer = await imgResp.arrayBuffer();

        const uploadResp = await fetch(
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

        if (uploadResp.ok) {
          heroImageUrl = `https://${BUNNY_CDN_HOST}/images/${article.slug}.webp`;
        }
      }
    }

    // Step 3: Build article object
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
      readingTime: Math.ceil(article.body.replace(/<[^>]+>/g, "").split(/\s+/).length / 250),
      heroImage: heroImageUrl,
      heroAlt: article.heroAlt,
      ogImage: heroImageUrl.replace("/images/", "/og/").replace(".webp", ".png"),
      faqs: article.faqs || [],
      faqCount: (article.faqs || []).length,
    };

    console.log(`[auto-gen] Generated: ${articleObj.title}`);
    return articleObj;
  } catch (err) {
    console.error("[auto-gen] Error:", err.message);
    return null;
  }
}

export { generateArticle, AUTO_GEN_ENABLED };
