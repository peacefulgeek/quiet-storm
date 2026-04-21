import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { ASSESSMENTS, type Assessment, type ResultTier } from "@/data/assessments";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Activity, Heart, Moon, Scan, HeartHandshake, ChevronRight, RotateCcw, ArrowLeft } from "lucide-react";

const ICONS: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  Activity, Heart, Moon, Scan, HeartHandshake,
};

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "oklch(0.92 0.02 90)" }}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%`, background: "linear-gradient(90deg, oklch(0.62 0.12 145), oklch(0.55 0.15 145))" }}
      />
    </div>
  );
}

function ResultScreen({ result, assessment, onRetake }: { result: ResultTier; assessment: Assessment; onRetake: () => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Comforting Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <img
          src={result.image}
          alt={result.title}
          className="w-full h-56 sm:h-72 object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-[0.15em] mb-1">Your Result</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-white">{result.title}</h2>
        </div>
      </div>

      {/* Message */}
      <div className="p-6 rounded-xl" style={{ background: "linear-gradient(135deg, oklch(0.96 0.02 145 / 0.4), oklch(0.98 0.005 90))" }}>
        <p className="text-foreground leading-relaxed text-base">{result.message}</p>
      </div>

      {/* Recommended Practices */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Practices We Recommend</h3>
        <div className="space-y-3">
          {result.practices.map((practice, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl border transition-colors" style={{ borderColor: "oklch(0.85 0.03 60 / 0.4)", background: "oklch(0.98 0.005 90 / 0.5)" }}>
              <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "oklch(0.62 0.12 145)" }}>
                {i + 1}
              </div>
              <p className="text-foreground text-sm leading-relaxed">{practice}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Articles */}
      {result.articles.length > 0 && (
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Articles That May Help</h3>
          <div className="space-y-2">
            {result.articles.map((slug) => (
              <Link
                key={slug}
                href={`/${slug}`}
                className="flex items-center gap-2 p-3 rounded-lg border transition-all hover:shadow-sm no-underline"
                style={{ borderColor: "oklch(0.85 0.03 60 / 0.4)" }}
              >
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "oklch(0.62 0.12 145)" }} />
                <span className="text-foreground text-sm">{slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Liability Disclaimer */}
      <div className="p-5 rounded-xl border-2 border-dashed" style={{ borderColor: "oklch(0.72 0.16 75 / 0.3)", background: "oklch(0.97 0.01 75 / 0.3)" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: "oklch(0.62 0.12 75)" }}>
          Important Disclaimer
        </p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          This assessment is for informational and educational purposes only. It is not a clinical diagnostic tool and does not replace professional medical advice, diagnosis, or treatment. The results are not intended to be used as a substitute for consultation with a qualified healthcare provider. If you are experiencing a mental health crisis, please contact the 988 Suicide & Crisis Lifeline (call or text 988), go to your nearest emergency room, or call 911. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetake}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-md text-white"
          style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
        >
          <RotateCcw className="w-4 h-4" />
          Retake Assessment
        </button>
        <Link
          href="/assessments"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold border transition-all hover:shadow-sm no-underline text-foreground"
          style={{ borderColor: "oklch(0.85 0.03 60 / 0.6)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          All Assessments
        </Link>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const assessment = ASSESSMENTS.find((a) => a.id === id);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [result, setResult] = useState<ResultTier | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentQ(0);
    setScores([]);
    setResult(null);
    setSelectedOption(null);
  }, [id]);

  if (!assessment) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-2xl font-semibold text-foreground mb-4">Assessment Not Found</h1>
          <Link href="/assessments" className="text-sm underline" style={{ color: "oklch(0.62 0.12 145)" }}>
            View all assessments
          </Link>
        </div>
      </Layout>
    );
  }

  const Icon = ICONS[assessment.icon] || Activity;

  function handleAnswer(score: number, optionIndex: number) {
    setSelectedOption(optionIndex);
    setTimeout(() => {
      const newScores = [...scores, score];
      setScores(newScores);
      setSelectedOption(null);

      if (currentQ + 1 >= assessment!.questions.length) {
        const total = newScores.reduce((a, b) => a + b, 0);
        const tier = assessment!.results.find(
          (r) => total >= r.range[0] && total <= r.range[1]
        ) || assessment!.results[assessment!.results.length - 1];
        setResult(tier);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCurrentQ((q) => q + 1);
        questionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 400);
  }

  function handleRetake() {
    setCurrentQ(0);
    setScores([]);
    setResult(null);
    setSelectedOption(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Layout>
      <SEO
        title={assessment.title}
        description={assessment.description}
        canonical={`https://quietstorm.love/assessments/${assessment.id}`}
      />

      <section className="section-sage py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <Link href="/assessments" className="inline-flex items-center gap-1 text-xs font-medium mb-4 no-underline" style={{ color: "oklch(0.62 0.12 145)" }}>
            <ArrowLeft className="w-3.5 h-3.5" />
            All Assessments
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.62 0.12 145 / 0.15)" }}>
              <Icon className="w-5 h-5" style={{ color: "oklch(0.62 0.12 145)" } as React.CSSProperties} />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">{assessment.title}</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">{assessment.description}</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {result ? (
          <ResultScreen result={result} assessment={assessment} onRetake={handleRetake} />
        ) : (
          <div ref={questionRef} className="space-y-8">
            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Question {currentQ + 1} of {assessment.questions.length}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {Math.round(((currentQ + 1) / assessment.questions.length) * 100)}%
                </span>
              </div>
              <ProgressBar current={currentQ} total={assessment.questions.length} />
            </div>

            {/* Question */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-500" key={currentQ}>
              <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-6 leading-snug">
                {assessment.questions[currentQ].text}
              </h2>

              <div className="space-y-3">
                {assessment.questions[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.score, i)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedOption === i
                        ? "shadow-md scale-[1.01]"
                        : "hover:shadow-sm hover:scale-[1.005]"
                    }`}
                    style={{
                      borderColor: selectedOption === i ? "oklch(0.62 0.12 145)" : "oklch(0.88 0.02 60 / 0.5)",
                      background: selectedOption === i
                        ? "linear-gradient(135deg, oklch(0.94 0.04 145 / 0.5), oklch(0.97 0.005 90))"
                        : "oklch(0.99 0.002 90)",
                    }}
                  >
                    <span className="text-foreground text-sm leading-relaxed">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
