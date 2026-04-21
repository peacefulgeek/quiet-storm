import { Link } from "wouter";
import { ASSESSMENTS } from "@/data/assessments";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { SITE_CONFIG } from "@/lib/types";
import { Activity, Heart, Moon, Scan, HeartHandshake, ChevronRight } from "lucide-react";

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  Activity, Heart, Moon, Scan, HeartHandshake,
};

const COLORS = [
  { bg: "oklch(0.94 0.04 145 / 0.4)", accent: "oklch(0.62 0.12 145)" },
  { bg: "oklch(0.94 0.04 75 / 0.3)", accent: "oklch(0.62 0.12 75)" },
  { bg: "oklch(0.94 0.04 260 / 0.3)", accent: "oklch(0.55 0.12 260)" },
  { bg: "oklch(0.94 0.04 30 / 0.3)", accent: "oklch(0.62 0.12 30)" },
  { bg: "oklch(0.94 0.04 340 / 0.3)", accent: "oklch(0.55 0.12 340)" },
];

export default function Assessments() {
  return (
    <Layout>
      <SEO
        title={`Self-Assessments | ${SITE_CONFIG.title}`}
        description="Gentle self-assessments to help you understand your anxiety, nervous system state, sleep patterns, body awareness, and self-compassion. Not diagnostic tools — mirrors to help you see where you are."
        canonical={`https://${SITE_CONFIG.domain}/assessments`}
      />

      <section className="section-sage py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Self-Assessments
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            These are not diagnostic tools. They're mirrors. Sometimes just naming where you are can take some of the weight off your shoulders. Take your time. There are no wrong answers.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-5">
          {ASSESSMENTS.map((assessment, i) => {
            const Icon = ICONS[assessment.icon] || Activity;
            const color = COLORS[i % COLORS.length];
            return (
              <Link
                key={assessment.id}
                href={`/assessments/${assessment.id}`}
                className="group flex flex-col sm:flex-row items-start gap-5 p-6 sm:p-8 rounded-2xl border-2 transition-all hover:shadow-lg no-underline"
                style={{
                  borderColor: `${color.accent}33`,
                  background: `linear-gradient(135deg, ${color.bg}, oklch(0.98 0.005 90))`,
                }}
              >
                <div
                  className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `${color.accent}22` }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground group-hover:underline decoration-1 underline-offset-4">
                      {assessment.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-2">{assessment.subtitle}</p>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-2">{assessment.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs font-semibold transition-colors" style={{ color: color.accent }}>
                    Take Assessment <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-5 rounded-xl border-2 border-dashed" style={{ borderColor: "oklch(0.72 0.16 75 / 0.3)", background: "oklch(0.97 0.01 75 / 0.3)" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: "oklch(0.62 0.12 75)" }}>
            Important Note
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            These assessments are for informational and educational purposes only. They are not clinical diagnostic tools and do not replace professional medical advice, diagnosis, or treatment. If you are experiencing a mental health crisis, please contact the 988 Suicide & Crisis Lifeline (call or text 988), go to your nearest emergency room, or call 911.
          </p>
        </div>
      </div>
    </Layout>
  );
}
