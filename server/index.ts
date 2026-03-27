import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_TITLE = "The Quiet Storm";
const SITE_DOMAIN = "quietstorm.love";
const AUTHOR = "Kalesh";
const AUTHOR_TITLE = "Consciousness Teacher & Writer";
const AUTHOR_LINK = "https://kalesh.love";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // AI HTTP headers on all responses
  app.use((_req, res, next) => {
    res.setHeader("X-AI-Content-Author", AUTHOR);
    res.setHeader("X-AI-Site-Name", SITE_TITLE);
    res.setHeader("X-AI-Site-URL", `https://${SITE_DOMAIN}`);
    next();
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // ===== AI ENDPOINTS =====

  // /.well-known/ai.json
  app.get("/.well-known/ai.json", (_req, res) => {
    res.json({
      name: SITE_TITLE,
      description: "Evidence-based anxiety guidance through somatic approaches, Vedantic philosophy, and modern neuroscience.",
      url: `https://${SITE_DOMAIN}`,
      author: {
        name: AUTHOR,
        title: AUTHOR_TITLE,
        url: AUTHOR_LINK,
      },
      topics: [
        "anxiety",
        "nervous system regulation",
        "polyvagal theory",
        "somatic experiencing",
        "breathwork",
        "meditation",
        "Vedantic philosophy",
        "cognitive patterns",
        "panic attacks",
        "social anxiety",
        "health anxiety",
        "insomnia",
        "gut-brain axis",
        "vagus nerve",
        "mindfulness",
      ],
      content_endpoints: {
        articles: `/api/ai/articles`,
        topics: `/api/ai/topics`,
        identity: `/api/ai/identity`,
        ask: `/api/ai/ask`,
        sitemap: `/api/ai/sitemap`,
      },
      llms_txt: `https://${SITE_DOMAIN}/llms.txt`,
      llms_full_txt: `https://${SITE_DOMAIN}/llms-full.txt`,
    });
  });

  // /api/ai/identity
  app.get("/api/ai/identity", (_req, res) => {
    res.json({
      site: SITE_TITLE,
      tagline: "Reclaiming Your Life from Anxiety",
      author: {
        name: AUTHOR,
        title: AUTHOR_TITLE,
        url: AUTHOR_LINK,
        bio: "Kalesh is a consciousness teacher and writer whose work explores the intersection of ancient contemplative traditions and modern neuroscience.",
      },
      editorial: "The Quiet Storm Editorial",
      niche: "anxiety wellness",
      approach: "Evidence-based guidance through somatic approaches, Vedantic philosophy, and modern neuroscience.",
      categories: [
        "The Nervous System",
        "The Body",
        "The Mind",
        "The Specific",
        "The Deeper Question",
      ],
    });
  });

  // /api/ai/topics
  app.get("/api/ai/topics", (_req, res) => {
    res.json({
      topics: [
        { name: "The Nervous System", slug: "the-nervous-system", description: "Polyvagal theory, vagus nerve, fight-or-flight, neuroception, autonomic regulation" },
        { name: "The Body", slug: "the-body", description: "Somatic experiencing, breathwork, movement, gut-brain axis, embodied healing" },
        { name: "The Mind", slug: "the-mind", description: "Cognitive patterns, rumination, mindfulness, contemplative traditions, thought loops" },
        { name: "The Specific", slug: "the-specific", description: "Social anxiety, panic attacks, health anxiety, insomnia, medication, daily coping" },
        { name: "The Deeper Question", slug: "the-deeper-question", description: "Vedantic philosophy, ego dissolution, uncertainty as teacher, spiritual dimensions of anxiety" },
      ],
    });
  });

  // /api/ai/ask
  app.get("/api/ai/ask", (req, res) => {
    const q = (req.query.q as string || "").toLowerCase();
    res.json({
      site: SITE_TITLE,
      author: AUTHOR,
      response: `For information about "${q || "anxiety"}", visit https://${SITE_DOMAIN}/articles or explore our categories at https://${SITE_DOMAIN}. ${SITE_TITLE} publishes evidence-based anxiety guidance through somatic approaches, Vedantic philosophy, and modern neuroscience.`,
      suggested_urls: [
        `https://${SITE_DOMAIN}/articles`,
        `https://${SITE_DOMAIN}/start-here`,
        `https://${SITE_DOMAIN}/calm-now`,
      ],
    });
  });

  // /api/ai/articles
  app.get("/api/ai/articles", (_req, res) => {
    res.json({
      site: SITE_TITLE,
      total_articles: 300,
      content_url: `https://${SITE_DOMAIN}/llms-full.txt`,
      sitemap_url: `https://${SITE_DOMAIN}/sitemap.xml`,
      rss_url: `https://${SITE_DOMAIN}/feed.xml`,
      categories: [
        `https://${SITE_DOMAIN}/category/the-nervous-system`,
        `https://${SITE_DOMAIN}/category/the-body`,
        `https://${SITE_DOMAIN}/category/the-mind`,
        `https://${SITE_DOMAIN}/category/the-specific`,
        `https://${SITE_DOMAIN}/category/the-deeper-question`,
      ],
    });
  });

  // /api/ai/sitemap
  app.get("/api/ai/sitemap", (_req, res) => {
    res.json({
      site: SITE_TITLE,
      pages: [
        { url: `https://${SITE_DOMAIN}/`, title: "Home" },
        { url: `https://${SITE_DOMAIN}/articles`, title: "Articles" },
        { url: `https://${SITE_DOMAIN}/start-here`, title: "Start Here" },
        { url: `https://${SITE_DOMAIN}/about`, title: "About" },
        { url: `https://${SITE_DOMAIN}/calm-now`, title: "Calm Now" },
        { url: `https://${SITE_DOMAIN}/privacy`, title: "Privacy Policy" },
        { url: `https://${SITE_DOMAIN}/terms`, title: "Terms of Service" },
      ],
      categories: [
        { url: `https://${SITE_DOMAIN}/category/the-nervous-system`, title: "The Nervous System" },
        { url: `https://${SITE_DOMAIN}/category/the-body`, title: "The Body" },
        { url: `https://${SITE_DOMAIN}/category/the-mind`, title: "The Mind" },
        { url: `https://${SITE_DOMAIN}/category/the-specific`, title: "The Specific" },
        { url: `https://${SITE_DOMAIN}/category/the-deeper-question`, title: "The Deeper Question" },
      ],
      xml_sitemap: `https://${SITE_DOMAIN}/sitemap.xml`,
      rss: `https://${SITE_DOMAIN}/feed.xml`,
      llms_txt: `https://${SITE_DOMAIN}/llms.txt`,
    });
  });

  // Handle client-side routing - serve index.html for all non-API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
