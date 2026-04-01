import { SITE_CONFIG } from "@/lib/types";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";

const CATEGORIES = [
  {
    name: "Books on Anxiety & the Nervous System",
    products: [
      { name: "The Body Keeps the Score", asin: "0143127748", desc: "Bessel van der Kolk's landmark work on how trauma reshapes the body and brain. If you read one book on why your nervous system does what it does, this is the one. It changed how an entire generation of therapists thinks about healing." },
      { name: "Dare: The New Way to End Anxiety", asin: "0956596258", desc: "Barry McDonagh's approach is disarmingly simple — stop fighting the anxiety and dare it to do its worst. This book has helped more people break the panic cycle than most clinical programs I've seen referenced in research." },
      { name: "Hope and Help for Your Nerves", asin: "0451167228", desc: "Claire Weekes wrote this in 1962 and it remains the clearest, most compassionate guide to nervous illness ever published. Her four-step method — face, accept, float, let time pass — is still the foundation of modern anxiety treatment." },
      { name: "When the Body Says No", asin: "0470923350", desc: "Gabor Maté connects the dots between chronic stress, repressed emotion, and physical illness. If you've ever wondered why anxiety lives in your body and not just your mind, this book provides the answer." },
      { name: "My Grandmother's Hands", asin: "1942094477", desc: "Resmaa Menakem explores how trauma lives in the body across generations. Essential reading for understanding why your nervous system carries patterns that didn't originate with you." },
      { name: "Waking the Tiger", asin: "155643233X", desc: "Peter Levine's foundational text on somatic experiencing. He observed that animals in the wild discharge trauma naturally — and asked why humans don't. The answer changed everything about how we approach healing." },
      { name: "The Polyvagal Theory in Therapy", asin: "0393712370", desc: "Deb Dana translates Stephen Porges' polyvagal theory into practical, accessible language. If you want to understand why your body shifts between states of safety, fight-or-flight, and shutdown, start here." },
      { name: "Breath: The New Science of a Lost Art", asin: "0735213615", desc: "James Nestor spent years investigating how modern humans forgot how to breathe — and what happens when we remember. The research on nasal breathing alone will change how you think about your daily experience." },
    ]
  },
  {
    name: "Journals & Workbooks",
    products: [
      { name: "The Five Minute Journal", asin: "0991846206", desc: "The simplest gratitude practice that actually sticks. Five minutes in the morning, five at night. It won't cure anxiety, but it will slowly retrain your brain to notice what's going well alongside what feels threatening." },
      { name: "The Anxiety and Phobia Workbook", asin: "1684034833", desc: "Edmund Bourne's workbook has been the gold standard for self-directed anxiety work for over 30 years. Structured exercises, clear explanations, and a pace that respects where you are. We reference this in our guide to <a href=\"/cognitive-behavioral-approaches-to-anxiety\">cognitive behavioral approaches</a>." },
      { name: "The Mindfulness and Acceptance Workbook for Anxiety", asin: "1626253346", desc: "If CBT feels too cognitive for you, this ACT-based workbook meets you in the body. It teaches you to hold anxiety without fighting it — which, paradoxically, is often what allows it to release." },
      { name: "Burnout: The Secret to Unlocking the Stress Cycle", asin: "1984818325", desc: "Emily and Amelia Nagoski explain why completing the stress cycle matters more than eliminating the stressor. Practical, science-backed, and written with genuine warmth." },
    ]
  },
  {
    name: "Body & Somatic Tools",
    products: [
      { name: "Weighted Blanket (15 lbs)", asin: "B07H2517CF", desc: "Deep pressure stimulation activates the parasympathetic nervous system. A weighted blanket is the simplest way to give your body the signal that it's safe to rest. We discuss the science behind this in our article on <a href=\"/sleep-anxiety-when-rest-feels-dangerous\">sleep anxiety</a>." },
      { name: "Acupressure Mat and Pillow Set", asin: "B07BGZQXNF", desc: "Lying on an acupressure mat for 15-20 minutes triggers endorphin release and deep relaxation. It's uncomfortable for the first two minutes and profoundly calming after that — which is a useful metaphor for most anxiety work." },
      { name: "Theragun Mini Massage Gun", asin: "B09CC6QFKV", desc: "Percussion therapy for releasing the tension patterns that anxiety builds in the body. The jaw, shoulders, and hip flexors are where most people store their fight-or-flight activation." },
      { name: "Yoga Mat (Extra Thick)", asin: "B01LP0V1GI", desc: "A quality mat makes the difference between a grounding practice and an uncomfortable chore. The extra thickness matters — your body needs to feel supported to let go." },
      { name: "Calm Strips Sensory Stickers", asin: "B08YRXJM1V", desc: "Textured adhesive strips you can put on your phone, laptop, or desk. When anxiety spikes, the tactile stimulation gives your nervous system something to orient to besides the internal alarm." },
    ]
  },
  {
    name: "Sleep & Relaxation",
    products: [
      { name: "White Noise Machine (LectroFan)", asin: "B00HD0ELFK", desc: "Consistent ambient sound masks the environmental triggers that keep a hypervigilant nervous system on alert at night. The LectroFan uses non-looping sounds, which matters — your brain will detect a loop." },
      { name: "Blue Light Blocking Glasses", asin: "B08B4GLDYJ", desc: "Blue light after sunset suppresses melatonin production and keeps the nervous system in daytime activation mode. These glasses are a simple intervention that many readers report makes a noticeable difference in sleep onset." },
      { name: "Essential Oil Diffuser", asin: "B07L4LHFQR", desc: "Lavender and chamomile have genuine research support for calming the nervous system. A diffuser in the bedroom creates an olfactory anchor for your wind-down routine." },
      { name: "Magnesium Glycinate Supplement", asin: "B000BD0RT0", desc: "Magnesium deficiency is remarkably common and directly affects nervous system excitability. Glycinate is the form best absorbed and least likely to cause digestive issues. As always, consult your healthcare provider before starting any supplement." },
    ]
  },
  {
    name: "Technology & Devices",
    products: [
      { name: "Muse 2 Brain Sensing Headband", asin: "B07HL2S9GQ", desc: "Real-time neurofeedback during meditation. The Muse headband translates your brain activity into weather sounds — calm mind, calm weather. It's the closest thing to having a meditation teacher with you at all times." },
      { name: "Fidget Cube", asin: "B071FMSYNF", desc: "Six sides of tactile stimulation for anxious hands. Discreet enough for meetings, effective enough to redirect nervous energy. Sometimes the simplest tools are the most useful." },
      { name: "Apple Watch SE", url: "https://www.apple.com/apple-watch-se/", desc: "Heart rate monitoring and breathing exercises on your wrist. The ability to check your actual heart rate during a panic attack — and see that it's elevated but safe — can break the catastrophic thinking cycle." },
      { name: "Oura Ring", url: "https://ouraring.com/", desc: "Sleep and recovery tracking that helps you understand the relationship between your daily habits and your nervous system state. The readiness score alone has helped many readers identify their anxiety triggers." },
    ]
  },
  {
    name: "Apps & Digital Resources",
    products: [
      { name: "Insight Timer", url: "https://insighttimer.com/", desc: "The largest free library of guided meditations in the world. Over 150,000 tracks from teachers across every tradition. The anxiety-specific collections are genuinely excellent." },
      { name: "Waking Up (Sam Harris)", url: "https://www.wakingup.com/", desc: "The most intellectually rigorous meditation app available. Sam Harris doesn't just teach you to meditate — he teaches you to understand what meditation actually is and why it works." },
      { name: "Calm", url: "https://www.calm.com/", desc: "Sleep stories, breathing exercises, and guided meditations designed specifically for anxiety. The Sleep Stories feature has become a lifeline for readers who struggle with nighttime anxiety." },
      { name: "Headspace", url: "https://www.headspace.com/", desc: "Structured meditation courses that build progressively. If you've never meditated before and the idea feels overwhelming, Headspace's guided approach removes the guesswork." },
    ]
  }
];

export default function Tools() {
  const totalProducts = CATEGORIES.reduce((sum, cat) => sum + cat.products.length, 0);
  const amazonProducts = CATEGORIES.reduce((sum, cat) => sum + cat.products.filter(p => p.asin).length, 0);

  // Build ItemList schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Anxiety & Nervous System Tools We Recommend",
    "description": "Curated list of the best books, tools, apps, and resources for anxiety and nervous system health.",
    "numberOfItems": totalProducts,
    "itemListElement": CATEGORIES.flatMap((cat, ci) =>
      cat.products.map((product, pi) => ({
        "@type": "ListItem",
        "position": ci * 10 + pi + 1,
        "name": product.name,
        "url": product.asin
          ? `https://www.amazon.com/dp/${product.asin}?tag=spankyspinola-20`
          : product.url
      }))
    )
  };

  return (
    <Layout>
      <SEO
        title={`Best Anxiety Tools & Resources We Recommend | ${SITE_CONFIG.title}`}
        description="Curated list of the best books, tools, apps, and resources for anxiety and nervous system health. Personally vetted recommendations from Kalesh."
        canonical={`https://${SITE_CONFIG.domain}/tools`}
      />

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero */}
      <section className="section-sage py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Anxiety & Nervous System Toolkit
          </h1>

          {/* Affiliate disclosure */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-sm" style={{ color: "oklch(0.35 0.05 75)" }}>
            This page contains affiliate links. We may earn a small commission if you make a purchase — at no extra cost to you.
          </div>

          <p className="text-lg leading-relaxed text-charcoal-light">
            These are the tools, books, and resources we actually trust. Every recommendation here has been chosen because it serves the work this site is about — understanding your nervous system, working with anxiety rather than against it, and building a life that doesn't require constant vigilance. Nothing here is filler. If it's on this list, it's because we've seen it help.
          </p>
        </div>
      </section>

      {/* Products */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {CATEGORIES.map((category) => (
            <section key={category.name}>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 pb-3 border-b-2" style={{ borderColor: "oklch(0.62 0.12 145 / 0.3)" }}>
                {category.name}
              </h2>
              <div className="space-y-6">
                {category.products.map((product) => {
                  const url = product.asin
                    ? `https://www.amazon.com/dp/${product.asin}?tag=spankyspinola-20`
                    : product.url;
                  const isAmazon = !!product.asin;

                  return (
                    <div
                      key={product.name}
                      className="bg-card rounded-xl border border-border/60 p-5 sm:p-6 hover:shadow-md transition-shadow duration-300"
                    >
                      <h3 className="font-heading text-lg font-medium mb-2">
                        <a
                          href={url}
                          target="_blank"
                          rel={isAmazon ? "noopener" : "noopener nofollow"}
                          className="text-sage hover:underline"
                        >
                          {product.name}
                        </a>
                        {isAmazon && (
                          <span className="text-xs text-muted-foreground ml-2">(paid link)</span>
                        )}
                      </h3>
                      <p
                        className="text-foreground/80 leading-relaxed text-[15px]"
                        dangerouslySetInnerHTML={{ __html: product.desc }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This page is updated periodically as we discover new tools worth recommending. Every product listed here has been selected for its relevance to anxiety and nervous system health. We only recommend what we genuinely believe serves the work.
          </p>
        </div>
      </div>
    </Layout>
  );
}

interface Product {
  name: string;
  asin?: string;
  url?: string;
  desc: string;
}
