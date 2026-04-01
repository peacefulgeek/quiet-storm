import { SITE_CONFIG } from "@/lib/types";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import { Link } from "wouter";

const QUIZZES = [
  {
    slug: "anxiety-type",
    title: "What Type of Anxiety Do You Experience?",
    desc: "Identify whether your anxiety pattern is primarily cognitive, somatic, social, or existential — and which approaches are most likely to help.",
    time: "3 min",
    color: "oklch(0.62 0.12 145)",
  },
  {
    slug: "nervous-system-state",
    title: "What State Is Your Nervous System In?",
    desc: "A polyvagal-informed assessment that helps you understand whether you're in ventral vagal (safe), sympathetic (fight-or-flight), or dorsal vagal (shutdown).",
    time: "4 min",
    color: "oklch(0.72 0.16 75)",
  },
  {
    slug: "stress-response",
    title: "How Does Your Body Handle Stress?",
    desc: "Map your body's unique stress signature — where you hold tension, how quickly you activate, and what helps you come back down.",
    time: "3 min",
    color: "oklch(0.55 0.1 145)",
  },
  {
    slug: "sleep-anxiety",
    title: "Is Anxiety Affecting Your Sleep?",
    desc: "Assess the relationship between your anxiety and your sleep patterns — racing thoughts, hypervigilance at night, early waking, and sleep-onset difficulty.",
    time: "3 min",
    color: "oklch(0.62 0.12 145)",
  },
  {
    slug: "thought-patterns",
    title: "What Are Your Dominant Thought Patterns?",
    desc: "Identify your cognitive style under stress — catastrophizing, rumination, fortune-telling, mind-reading, or all-or-nothing thinking.",
    time: "4 min",
    color: "oklch(0.72 0.16 75)",
  },
  {
    slug: "coping-style",
    title: "What Is Your Anxiety Coping Style?",
    desc: "Discover whether you tend toward avoidance, control, reassurance-seeking, or intellectualization — and what a healthier relationship with anxiety looks like.",
    time: "3 min",
    color: "oklch(0.55 0.1 145)",
  },
  {
    slug: "social-anxiety",
    title: "How Does Social Anxiety Show Up for You?",
    desc: "Assess the specific ways social anxiety manifests — anticipatory dread, performance fear, post-event processing, or avoidance patterns.",
    time: "3 min",
    color: "oklch(0.62 0.12 145)",
  },
  {
    slug: "burnout-risk",
    title: "Are You Approaching Burnout?",
    desc: "Evaluate where you fall on the burnout spectrum — from early warning signs to full nervous system depletion.",
    time: "4 min",
    color: "oklch(0.72 0.16 75)",
  },
  {
    slug: "resilience",
    title: "How Resilient Is Your Nervous System?",
    desc: "Measure your capacity for recovery — how quickly you return to baseline after activation, and what resources you have available.",
    time: "3 min",
    color: "oklch(0.55 0.1 145)",
  },
];

export default function Assessments() {
  return (
    <Layout>
      <SEO
        title={`Self-Assessments & Quizzes | ${SITE_CONFIG.title}`}
        description="Free anxiety and nervous system self-assessments. Understand your anxiety type, nervous system state, stress response, and coping style."
        canonical={`https://${SITE_CONFIG.domain}/assessments`}
      />

      {/* Hero */}
      <section className="section-sage py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Self-Assessments
          </h1>
          <p className="text-lg leading-relaxed text-charcoal-light">
            These are not diagnostic tools. They are mirrors — ways to see your patterns more clearly so you can work with them more skillfully. Each assessment takes 3-4 minutes and provides personalized article recommendations based on your responses.
          </p>
        </div>
      </section>

      {/* Quiz Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUIZZES.map((quiz) => (
            <Link
              key={quiz.slug}
              href={`/quiz/${quiz.slug}`}
              className="group block no-underline"
            >
              <div className="h-full bg-card rounded-xl border border-border/60 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${quiz.color}20` }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: quiz.color }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-sage transition-colors">
                  {quiz.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {quiz.desc}
                </p>
                <span className="text-xs font-medium" style={{ color: quiz.color }}>
                  {quiz.time} &middot; Free
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-5 rounded-xl text-xs text-muted-foreground leading-relaxed" style={{ background: "oklch(0.94 0.04 145 / 0.3)" }}>
          <strong className="text-foreground">Important:</strong> These self-assessments are for educational purposes only. They are not clinical diagnostic tools and should not replace professional evaluation. If you are experiencing significant distress, please consult a qualified mental health professional.
        </div>
      </div>
    </Layout>
  );
}
