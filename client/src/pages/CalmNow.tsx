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

  const phaseNum = phase === "breathe" ? 1 : phase === "ground" ? 2 : phase === "scan" ? 3 : 4;

  return (
    <Layout>
      <SEO
        title="Calm Now"
        description="Emergency grounding tool for panic and acute anxiety. Physiological sigh, 5-4-3-2-1 grounding, body scan, and reassurance."
        canonical={`https://${SITE_CONFIG.domain}/calm-now`}
      />

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ background: "oklch(0.94 0.04 145 / 0.5)" }}>
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${phaseNum * 25}%`,
            background: "linear-gradient(90deg, oklch(0.62 0.12 145), oklch(0.72 0.16 75))",
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 min-h-[70vh]">
        {phase === "breathe" && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-10" style={{ color: "oklch(0.62 0.12 145)" }}>
              Step 1 of 4 — Physiological Sigh
            </p>
            <div
              className="w-40 h-40 mx-auto rounded-full mb-10 flex items-center justify-center transition-all"
              style={{
                background: breathState === "exhale"
                  ? "radial-gradient(circle, oklch(0.62 0.12 145 / 0.15), oklch(0.62 0.12 145 / 0.05))"
                  : "radial-gradient(circle, oklch(0.62 0.12 145 / 0.25), oklch(0.62 0.12 145 / 0.08))",
                transform: breathState === "inhale" ? "scale(1.4)" : breathState === "hold" ? "scale(1.4)" : "scale(0.7)",
                transitionDuration: breathState === "inhale" ? "4s" : breathState === "hold" ? "0.5s" : "6s",
                transitionTimingFunction: "ease-in-out",
                boxShadow: `0 0 60px oklch(0.62 0.12 145 / ${breathState === "exhale" ? "0.05" : "0.15"})`,
              }}
            >
              <span className="font-heading text-base font-medium text-foreground">
                {breathState === "inhale" && "Breathe in"}
                {breathState === "hold" && "Hold"}
                {breathState === "exhale" && "Slowly out"}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading text-foreground leading-relaxed mb-6">
              {breathState === "inhale" && "Double inhale through your nose."}
              {breathState === "hold" && "Hold gently."}
              {breathState === "exhale" && "Long, slow exhale through your mouth."}
            </p>
            <p className="text-muted-foreground mb-10">
              Breath {Math.min(breathCount + 1, 5)} of 5
            </p>
            <button
              onClick={nextPhase}
              className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
            >
              I'm ready for the next step &rarr;
            </button>
          </div>
        )}

        {phase === "ground" && (
          <div className="py-12 sm:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-10 text-center" style={{ color: "oklch(0.62 0.12 145)" }}>
              Step 2 of 4 — 5-4-3-2-1 Grounding
            </p>
            <div className="space-y-8 max-w-lg mx-auto">
              {[
                { n: "5", text: "things you can see right now." },
                { n: "4", text: "things you can touch." },
                { n: "3", text: "things you can hear." },
                { n: "2", text: "things you can smell." },
                { n: "1", text: "thing you can taste." },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-5">
                  <span className="font-heading text-4xl font-bold flex-shrink-0 w-12 text-right" style={{ color: "oklch(0.62 0.12 145)" }}>
                    {item.n}
                  </span>
                  <span className="text-xl font-heading text-foreground leading-relaxed pt-2">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-10 text-center italic">
              Take your time. There is no rush.
            </p>
            <div className="text-center mt-10">
              <button
                onClick={nextPhase}
                className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
              >
                Next step &rarr;
              </button>
            </div>
          </div>
        )}

        {phase === "scan" && (
          <div className="py-12 sm:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-10 text-center" style={{ color: "oklch(0.62 0.12 145)" }}>
              Step 3 of 4 — Body Scan
            </p>
            <div className="space-y-8 text-xl font-heading text-foreground leading-relaxed text-center max-w-md mx-auto">
              <p>Notice your feet on the ground.</p>
              <p>Feel the weight of your body in the chair.</p>
              <p>Soften your jaw. Unclench your teeth.</p>
              <p>Drop your shoulders away from your ears.</p>
              <p>Let your hands be heavy.</p>
              <p>Notice the temperature of the air on your skin.</p>
            </div>
            <p className="text-muted-foreground mt-10 text-center italic">
              You are here. You are safe. Your body knows how to do this.
            </p>
            <div className="text-center mt-10">
              <button
                onClick={nextPhase}
                className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 145), oklch(0.55 0.1 145))" }}
              >
                One more step &rarr;
              </button>
            </div>
          </div>
        )}

        {phase === "reassure" && (
          <div className="py-12 sm:py-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-10" style={{ color: "oklch(0.62 0.12 145)" }}>
              Step 4 of 4 — Reassurance
            </p>
            <div className="space-y-6 text-xl sm:text-2xl font-heading text-foreground leading-relaxed max-w-lg mx-auto">
              <p>This feeling is temporary.</p>
              <p>Your nervous system is doing what it was designed to do.</p>
              <p>You have survived every panic attack you've ever had.</p>
              <p className="font-semibold">You will survive this one too.</p>
            </div>
            <div className="mt-8 p-6 rounded-2xl section-amber max-w-md mx-auto">
              <p className="text-muted-foreground italic text-lg font-heading">
                The wave is passing. Let it pass.
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restart}
                className="px-6 py-3 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
                style={{ borderColor: "oklch(0.88 0.015 90)" }}
              >
                Start over
              </button>
              <Link
                href="/"
                className="no-underline px-6 py-3 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
                style={{ borderColor: "oklch(0.88 0.015 90)" }}
              >
                Go home
              </Link>
            </div>

            {/* More practices */}
            <div className="mt-12 text-left p-6 rounded-2xl section-sage">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "oklch(0.62 0.12 145)" }}>
                More things that help
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "Butterfly Hug", desc: "Cross arms over chest, alternate tapping shoulders" },
                  { name: "Hands on Heart", desc: "Place both palms on your chest, breathe slowly" },
                  { name: "Humming", desc: "Hum on the exhale to vibrate your vagus nerve" },
                  { name: "Cold Water Reset", desc: "Splash cold water on your face" },
                  { name: "Gentle Rocking", desc: "Rock side to side, the oldest calming technique" },
                  { name: "Self-Holding", desc: "Wrap your arms around yourself and squeeze" },
                  { name: "Chanting", desc: "A simple 'Om' or 'Voo' on the exhale" },
                  { name: "Physiological Sigh", desc: "Double inhale, long exhale" },
                ].map((p) => (
                  <div key={p.name} className="flex items-start gap-3 p-3 rounded-lg bg-card">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "oklch(0.62 0.12 145)" }} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Find all 25+ practices on our <Link href="/start-here" className="underline" style={{ color: "oklch(0.55 0.12 145)" }}>Start Here</Link> page.
              </p>
            </div>

            {/* Article links */}
            <div className="mt-16 text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "oklch(0.62 0.12 145)" }}>
                When you're ready
              </p>
              <div className="space-y-3">
                {published.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/article/${a.slug}`}
                    className="no-underline flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <img
                      src={a.heroImage}
                      alt={a.heroAlt}
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <span className="text-sm font-medium text-foreground group-hover:text-sage transition-colors">
                      {a.title}
                    </span>
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
