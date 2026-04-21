import { SITE_CONFIG } from "@/lib/types";
import SEO, { profilePageSchema } from "@/components/SEO";
import Layout from "@/components/Layout";

const EDITORIAL_TEAM = [
  {
    name: "Maya Chen",
    role: "Editor-in-Chief",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/5L92HNX2jQriZGmWknDJPd/editorial-maya-chen-4EfGA3YiahDHoRjT93g9zG.webp",
    bio: "Maya spent fifteen years as a health journalist at The Atlantic and Vox before founding The Quiet Storm's editorial team. After her own decade-long struggle with generalized anxiety disorder, she became passionate about bridging the gap between clinical research and the real, messy experience of living with anxiety. She holds an MS in Science Communication from Northwestern and has completed a 500-hour yoga teacher training focused on trauma-sensitive practice.",
    focus: "Editorial direction, research standards, and making sure every article actually helps someone at 3 AM.",
  },
  {
    name: "Dr. James Okafor",
    role: "Clinical Review Editor",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/5L92HNX2jQriZGmWknDJPd/editorial-dr-james-okafor-SMPqmJ9eDZDASH7dKaSyBn.webp",
    bio: "James is a licensed clinical psychologist with a specialty in anxiety disorders, somatic experiencing, and polyvagal-informed therapy. He practiced for twelve years at Mount Sinai's Anxiety and Depression Center before transitioning to full-time editorial work. He reviews every article on the site for clinical accuracy and ensures our guidance stays grounded in evidence without losing its warmth.",
    focus: "Clinical accuracy, research validation, and keeping the science honest.",
  },
  {
    name: "Sofia Reyes",
    role: "Contemplative Practices Editor",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/5L92HNX2jQriZGmWknDJPd/editorial-sofia-reyes-6eL2ZerFSTUjyRQNZjrZ3V.webp",
    bio: "Sofia brings twenty years of study in contemplative traditions spanning Zen Buddhism, Vedantic meditation, and indigenous healing practices from her native Colombia. She holds an MA in Contemplative Psychology from Naropa University and has trained under teachers in both Eastern and Western somatic traditions. Her writing explores the places where ancient wisdom and modern neuroscience say the same thing in different languages.",
    focus: "Breathwork, meditation, somatic practices, and the contemplative dimension of healing.",
  },
];

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
            {SITE_CONFIG.title} is an independent editorial resource for people living with anxiety. Not the kind that shows up in listicles and disappears by morning, but the kind that rewires your days, disrupts your sleep, and makes you question whether you'll ever feel normal again.
          </p>
          <p>
            We publish evidence-based guidance that draws equally from modern neuroscience and ancient contemplative traditions. Our editorial approach is grounded in the understanding that anxiety is not merely a cognitive problem to be solved, but a whole-body experience that requires whole-body responses: somatic awareness, nervous system regulation, breathwork, and the philosophical courage to sit with uncertainty.
          </p>
          <p>
            Every article on this site is written with care, reviewed for accuracy, and designed to meet you where you are. Whether that's 3 AM with a racing heart or a quiet Tuesday afternoon when the dread arrives uninvited. We don't promise quick fixes. We offer honest guidance, grounded in research and lived experience.
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

        {/* Editorial Team Section */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: "oklch(0.62 0.12 145)" }}>
            The People Behind the Words
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            Our Editorial Team
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Every article passes through three sets of eyes before it reaches you. Our team brings clinical expertise, contemplative depth, and a shared commitment to writing that actually meets people where they are.
          </p>

          <div className="space-y-10">
            {EDITORIAL_TEAM.map((member, i) => (
              <div
                key={member.name}
                className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 rounded-2xl border transition-all hover:shadow-md"
                style={{
                  borderColor: "oklch(0.85 0.03 60 / 0.4)",
                  background: i % 2 === 0
                    ? "linear-gradient(135deg, oklch(0.97 0.01 90 / 0.6), oklch(0.98 0.005 60))"
                    : "linear-gradient(135deg, oklch(0.96 0.02 145 / 0.3), oklch(0.98 0.005 90))",
                }}
              >
                <div className="shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-sm"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-1" style={{ color: "oklch(0.62 0.12 145)" }}>
                    {member.role}
                  </p>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                    {member.name}
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed mb-3">
                    {member.bio}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {member.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kalesh Advisor Card */}
        <div className="p-6 sm:p-8 rounded-2xl border-2 transition-colors" style={{ borderColor: "oklch(0.62 0.12 145 / 0.2)", background: "linear-gradient(135deg, oklch(0.94 0.04 145 / 0.5), oklch(0.97 0.005 90))" }}>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <img
              src="https://quiet-storm.b-cdn.net/images/kalesh-headshot.webp"
              alt={SITE_CONFIG.author}
              className="w-28 h-28 rounded-2xl object-cover shrink-0 shadow-md"
              loading="lazy"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "oklch(0.62 0.12 145)" }}>
                {SITE_CONFIG.authorTitle}
              </p>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                {SITE_CONFIG.author}
              </h2>
              <p className="text-foreground leading-relaxed mb-5">
                {SITE_CONFIG.authorBio}
              </p>
            </div>
          </div>
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
