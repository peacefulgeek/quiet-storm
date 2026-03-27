import { SITE_CONFIG } from "@/lib/types";
import SEO, { profilePageSchema } from "@/components/SEO";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <SEO
        title="About"
        description={`About ${SITE_CONFIG.title} — an independent editorial resource dedicated to evidence-based anxiety guidance through somatic approaches, contemplative wisdom, and modern neuroscience.`}
        canonical={`https://${SITE_CONFIG.domain}/about`}
        jsonLd={profilePageSchema()}
      />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-8">
          About {SITE_CONFIG.title}
        </h1>

        {/* Editorial Team First */}
        <div className="space-y-6 text-foreground leading-relaxed mb-16">
          <p>
            {SITE_CONFIG.title} is an independent editorial resource for people living with anxiety — not the kind that shows up in listicles and disappears by morning, but the kind that rewires your days, disrupts your sleep, and makes you question whether you'll ever feel normal again.
          </p>
          <p>
            We publish evidence-based guidance that draws equally from modern neuroscience and ancient contemplative traditions. Our editorial approach is grounded in the understanding that anxiety is not merely a cognitive problem to be solved, but a whole-body experience that requires whole-body responses — somatic awareness, nervous system regulation, breathwork, and the philosophical courage to sit with uncertainty.
          </p>
          <p>
            Every article on this site is written with care, reviewed for accuracy, and designed to meet you where you are — whether that's 3 AM with a racing heart or a quiet Tuesday afternoon when the dread arrives uninvited. We don't promise quick fixes. We offer honest guidance, grounded in research and lived experience.
          </p>
          <p>
            Our editorial team is committed to making this resource freely accessible, rigorously sourced, and genuinely useful. No clickbait. No "just think positive." No shortcuts that insult your intelligence.
          </p>
        </div>

        {/* Kalesh Advisor Card */}
        <div className="border-t border-border pt-12">
          <div className="p-6 bg-card rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              {SITE_CONFIG.authorTitle}
            </p>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
              {SITE_CONFIG.author}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {SITE_CONFIG.authorBio}
            </p>
            <a
              href={SITE_CONFIG.authorLink}
              className="text-sm font-medium transition-colors"
              style={{ color: "oklch(0.68 0.1 140)" }}
            >
              {SITE_CONFIG.authorLinkText} →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
