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

      {/* Header */}
      <section className="section-sage py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            About {SITE_CONFIG.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            An independent editorial resource for the anxious mind.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Editorial Mission */}
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

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Evidence-Based",
              text: "Every claim is grounded in peer-reviewed research, clinical practice, or established contemplative traditions.",
            },
            {
              title: "Whole-Body",
              text: "Anxiety lives in the body as much as the mind. Our approach integrates somatic, cognitive, and philosophical perspectives.",
            },
            {
              title: "Honest",
              text: "No quick fixes, no toxic positivity, no shortcuts. We meet you where you are with real guidance.",
            },
          ].map((value) => (
            <div key={value.title} className="p-5 rounded-xl section-amber">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mb-3" style={{ background: "oklch(0.72 0.16 75 / 0.2)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "oklch(0.72 0.16 75)" }} />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.text}</p>
            </div>
          ))}
        </div>

        {/* Kalesh Advisor Card */}
        <div className="p-6 sm:p-8 rounded-2xl border-2 transition-colors" style={{ borderColor: "oklch(0.62 0.12 145 / 0.2)", background: "linear-gradient(135deg, oklch(0.94 0.04 145 / 0.5), oklch(0.97 0.005 90))" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "oklch(0.62 0.12 145)" }}>
            {SITE_CONFIG.authorTitle}
          </p>
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
            {SITE_CONFIG.author}
          </h2>
          <p className="text-foreground leading-relaxed mb-5">
            {SITE_CONFIG.authorBio}
          </p>
          <a
            href={SITE_CONFIG.authorLink}
            className="inline-block no-underline px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
          >
            {SITE_CONFIG.authorLinkText} &rarr;
          </a>
        </div>
      </div>
    </Layout>
  );
}
