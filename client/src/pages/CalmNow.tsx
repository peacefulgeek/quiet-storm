import { Link } from "wouter";
import { articles } from "@/data/articles";
import { SITE_CONFIG } from "@/lib/types";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import { useState, useEffect, useRef, useMemo } from "react";

type Phase = "breathe" | "ground" | "scan" | "reassure";

export default function CalmNow() {
  const [phase, setPhase] = useState<Phase>("breathe");
  const [breathCount, setBreathCount] = useState(0);
  const [breathState, setBreathState] = useState<"inhale" | "hold" | "exhale">("inhale");
  const timerRef = useRef<number | null>(null);

  const published = useMemo(
    () => sortByDate(filterPublished(articles)).slice(0, 3),
    []
  );

  // Physiological sigh: double inhale, long exhale
  useEffect(() => {
    if (phase !== "breathe") return;

    const cycle = () => {
      setBreathState("inhale");
      timerRef.current = window.setTimeout(() => {
        setBreathState("hold");
        timerRef.current = window.setTimeout(() => {
          setBreathState("exhale");
          timerRef.current = window.setTimeout(() => {
            setBreathCount((c) => c + 1);
            if (breathCount < 4) {
              cycle();
            }
          }, 6000);
        }, 2000);
      }, 4000);
    };

    cycle();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, breathCount]);

  const nextPhase = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (phase === "breathe") setPhase("ground");
    else if (phase === "ground") setPhase("scan");
    else if (phase === "scan") setPhase("reassure");
  };

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("breathe");
    setBreathCount(0);
    setBreathState("inhale");
  };

  return (
    <Layout>
      <SEO
        title="Calm Now"
        description="Emergency grounding tool for panic and acute anxiety. Physiological sigh, 5-4-3-2-1 grounding, body scan, and reassurance."
        canonical={`https://${SITE_CONFIG.domain}/calm-now`}
      />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12 min-h-[70vh]">
        {phase === "breathe" && (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8">
              Step 1 of 4 — Physiological Sigh
            </p>
            <div
              className="w-32 h-32 mx-auto rounded-full mb-8 flex items-center justify-center transition-all duration-1000"
              style={{
                backgroundColor: "oklch(0.68 0.1 140 / 0.15)",
                transform: breathState === "inhale" ? "scale(1.3)" : breathState === "hold" ? "scale(1.3)" : "scale(0.8)",
              }}
            >
              <span className="font-heading text-lg font-medium text-foreground">
                {breathState === "inhale" && "Breathe in"}
                {breathState === "hold" && "Hold"}
                {breathState === "exhale" && "Slowly out"}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading text-foreground leading-relaxed mb-8">
              {breathState === "inhale" && "Double inhale through your nose."}
              {breathState === "hold" && "Hold gently."}
              {breathState === "exhale" && "Long, slow exhale through your mouth."}
            </p>
            <p className="text-muted-foreground mb-8">
              Breath {Math.min(breathCount + 1, 5)} of 5
            </p>
            <button
              onClick={nextPhase}
              className="px-6 py-3 text-sm font-medium text-white rounded-md transition-colors"
              style={{ backgroundColor: "oklch(0.68 0.1 140)" }}
            >
              I'm ready for the next step →
            </button>
          </div>
        )}

        {phase === "ground" && (
          <div className="py-16">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8 text-center">
              Step 2 of 4 — 5-4-3-2-1 Grounding
            </p>
            <div className="space-y-8 text-xl sm:text-2xl font-heading text-foreground leading-relaxed">
              <p><strong className="text-3xl" style={{ color: "oklch(0.68 0.1 140)" }}>5</strong> things you can see right now.</p>
              <p><strong className="text-3xl" style={{ color: "oklch(0.68 0.1 140)" }}>4</strong> things you can touch.</p>
              <p><strong className="text-3xl" style={{ color: "oklch(0.68 0.1 140)" }}>3</strong> things you can hear.</p>
              <p><strong className="text-3xl" style={{ color: "oklch(0.68 0.1 140)" }}>2</strong> things you can smell.</p>
              <p><strong className="text-3xl" style={{ color: "oklch(0.68 0.1 140)" }}>1</strong> thing you can taste.</p>
            </div>
            <p className="text-muted-foreground mt-8 text-center">
              Take your time. There is no rush.
            </p>
            <div className="text-center mt-8">
              <button
                onClick={nextPhase}
                className="px-6 py-3 text-sm font-medium text-white rounded-md transition-colors"
                style={{ backgroundColor: "oklch(0.68 0.1 140)" }}
              >
                Next step →
              </button>
            </div>
          </div>
        )}

        {phase === "scan" && (
          <div className="py-16">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8 text-center">
              Step 3 of 4 — Body Scan
            </p>
            <div className="space-y-6 text-xl font-heading text-foreground leading-relaxed text-center">
              <p>Notice your feet on the ground.</p>
              <p>Feel the weight of your body in the chair.</p>
              <p>Soften your jaw. Unclench your teeth.</p>
              <p>Drop your shoulders away from your ears.</p>
              <p>Let your hands be heavy.</p>
              <p>Notice the temperature of the air on your skin.</p>
            </div>
            <p className="text-muted-foreground mt-8 text-center">
              You are here. You are safe. Your body knows how to do this.
            </p>
            <div className="text-center mt-8">
              <button
                onClick={nextPhase}
                className="px-6 py-3 text-sm font-medium text-white rounded-md transition-colors"
                style={{ backgroundColor: "oklch(0.68 0.1 140)" }}
              >
                One more step →
              </button>
            </div>
          </div>
        )}

        {phase === "reassure" && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8">
              Step 4 of 4 — Reassurance
            </p>
            <div className="space-y-6 text-xl sm:text-2xl font-heading text-foreground leading-relaxed max-w-lg mx-auto">
              <p>This feeling is temporary.</p>
              <p>Your nervous system is doing what it was designed to do.</p>
              <p>You have survived every panic attack you've ever had.</p>
              <p>You will survive this one too.</p>
              <p className="text-muted-foreground text-lg mt-8">
                The wave is passing. Let it pass.
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restart}
                className="px-6 py-3 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
              >
                Start over
              </button>
            </div>

            {/* Article links */}
            <div className="mt-16 text-left">
              <p className="text-sm text-muted-foreground mb-4">
                When you're ready, these might help:
              </p>
              <div className="space-y-3">
                {published.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/article/${a.slug}`}
                    className="block no-underline text-foreground hover:text-sage transition-colors py-2 border-b border-border/30"
                  >
                    {a.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
