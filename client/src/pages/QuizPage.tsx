import { useParams, Link, useLocation } from "wouter";
import { useState, useMemo, useCallback, useEffect } from "react";
import { articles } from "@/data/articles";
import { SITE_CONFIG } from "@/lib/types";
import { filterPublished, sortByDate } from "@/lib/utils";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import NewsletterInline from "@/components/NewsletterInline";

interface Quiz {
  slug: string;
  title: string;
  description: string;
  questions: {
    text: string;
    options: { label: string; score: number }[];
  }[];
  results: {
    range: [number, number];
    title: string;
    description: string;
    categorySlug: string;
  }[];
}

const QUIZZES: Quiz[] = [
  {
    slug: "anxiety-type",
    title: "What Type of Anxiety Do You Experience?",
    description: "Discover whether your anxiety is primarily cognitive, somatic, social, or existential — and which approaches might help most.",
    questions: [
      { text: "When anxiety hits, what do you notice first?", options: [{ label: "Racing thoughts I can't stop", score: 1 }, { label: "Tightness in my chest or stomach", score: 2 }, { label: "Fear of what others think", score: 3 }, { label: "A deep sense of meaninglessness", score: 4 }] },
      { text: "What time of day is hardest?", options: [{ label: "Morning — the dread starts before I'm fully awake", score: 1 }, { label: "Night — my body won't settle", score: 2 }, { label: "Before social events", score: 3 }, { label: "Quiet moments when I'm alone with my thoughts", score: 4 }] },
      { text: "What helps you most in the moment?", options: [{ label: "Distraction or problem-solving", score: 1 }, { label: "Movement or breathwork", score: 2 }, { label: "Reassurance from someone I trust", score: 3 }, { label: "Nothing seems to touch it", score: 4 }] },
      { text: "How would you describe your anxiety to a friend?", options: [{ label: "My mind won't shut up", score: 1 }, { label: "My body is always on alert", score: 2 }, { label: "I'm terrified of being judged", score: 3 }, { label: "I feel like something fundamental is wrong", score: 4 }] },
      { text: "What triggers it most?", options: [{ label: "Uncertainty about the future", score: 1 }, { label: "Physical sensations I can't explain", score: 2 }, { label: "Being the center of attention", score: 3 }, { label: "Existential questions about life and death", score: 4 }] },
    ],
    results: [
      { range: [5, 8], title: "Primarily Cognitive Anxiety", description: "Your anxiety lives mostly in your thoughts — rumination, what-if spirals, and catastrophic thinking. The mind is running prediction software without a stop button. Cognitive approaches combined with mindfulness may be your strongest entry point.", categorySlug: "the-mind" },
      { range: [9, 12], title: "Primarily Somatic Anxiety", description: "Your body carries the anxiety before your mind catches up. Chest tightness, gut distress, muscle tension — these are your nervous system's alarm bells. Somatic approaches and vagus nerve work may be especially helpful.", categorySlug: "the-body" },
      { range: [13, 16], title: "Primarily Social Anxiety", description: "Your anxiety is relational — it activates around other people, judgment, and belonging. This isn't weakness. It's your nervous system's threat detection focused on social survival.", categorySlug: "the-specific" },
      { range: [17, 20], title: "Primarily Existential Anxiety", description: "Your anxiety touches the deeper questions — meaning, mortality, identity, and the nature of certainty itself. This is the anxiety that won't be fixed by breathing exercises alone. It asks for philosophical courage.", categorySlug: "the-deeper-question" },
    ],
  },
  {
    slug: "nervous-system-state",
    title: "What State Is Your Nervous System In?",
    description: "Based on polyvagal theory, discover whether you're in ventral vagal (safe), sympathetic (fight/flight), or dorsal vagal (shutdown).",
    questions: [
      { text: "Right now, how does your body feel?", options: [{ label: "Relatively calm and present", score: 1 }, { label: "Restless, tense, or agitated", score: 2 }, { label: "Heavy, numb, or disconnected", score: 3 }] },
      { text: "How is your breathing?", options: [{ label: "Easy and natural", score: 1 }, { label: "Shallow or fast", score: 2 }, { label: "I barely notice it", score: 3 }] },
      { text: "If someone surprised you right now, you would:", options: [{ label: "Startle briefly, then recover", score: 1 }, { label: "Jump and stay on edge", score: 2 }, { label: "Barely react", score: 3 }] },
      { text: "How connected do you feel to the people around you?", options: [{ label: "Present and available", score: 1 }, { label: "Irritable or defensive", score: 2 }, { label: "Withdrawn or invisible", score: 3 }] },
      { text: "What sounds most appealing right now?", options: [{ label: "A conversation with someone I trust", score: 1 }, { label: "Being alone to decompress", score: 2 }, { label: "Nothing — I just want to disappear", score: 3 }] },
    ],
    results: [
      { range: [5, 7], title: "Ventral Vagal — Safe & Social", description: "Your nervous system is in its optimal state. You feel connected, present, and able to engage. This is the state from which healing happens. The work now is learning to recognize and extend these moments.", categorySlug: "the-body" },
      { range: [8, 11], title: "Sympathetic — Fight or Flight", description: "Your system is mobilized. Adrenaline is up, muscles are tense, and your brain is scanning for threats. This isn't dysfunction — it's your body doing its job. The path back is through the body, not the mind.", categorySlug: "the-body" },
      { range: [12, 15], title: "Dorsal Vagal — Freeze/Shutdown", description: "Your system has gone into conservation mode. Numbness, heaviness, disconnection — these are ancient survival responses. You're not broken. You're protected. Gentle, titrated movement can begin to shift this.", categorySlug: "the-body" },
    ],
  },
  {
    slug: "sleep-anxiety",
    title: "Is Anxiety Disrupting Your Sleep?",
    description: "Understand how anxiety affects your sleep patterns and what might help.",
    questions: [
      { text: "What happens when you get into bed?", options: [{ label: "I fall asleep within 20 minutes", score: 1 }, { label: "My mind starts racing", score: 3 }, { label: "I feel a wave of dread", score: 4 }, { label: "I scroll my phone to avoid my thoughts", score: 2 }] },
      { text: "Do you wake during the night?", options: [{ label: "Rarely", score: 1 }, { label: "Once or twice, but fall back asleep", score: 2 }, { label: "Multiple times, often with anxiety", score: 3 }, { label: "I wake at 3-4am and can't return", score: 4 }] },
      { text: "How do you feel upon waking?", options: [{ label: "Rested", score: 1 }, { label: "Groggy but okay", score: 2 }, { label: "Exhausted despite sleeping", score: 3 }, { label: "Immediately anxious", score: 4 }] },
      { text: "What's your relationship with bedtime?", options: [{ label: "Neutral or positive", score: 1 }, { label: "Slightly dreading it", score: 2 }, { label: "I avoid it as long as possible", score: 3 }, { label: "It's become a source of anxiety itself", score: 4 }] },
      { text: "Do you have anxious dreams?", options: [{ label: "Rarely", score: 1 }, { label: "Sometimes", score: 2 }, { label: "Frequently", score: 3 }, { label: "Almost every night", score: 4 }] },
    ],
    results: [
      { range: [5, 8], title: "Minimal Sleep-Anxiety Impact", description: "Your sleep is relatively protected from anxiety. This is a strength worth preserving. Small adjustments to sleep hygiene can maintain this foundation.", categorySlug: "the-body" },
      { range: [9, 13], title: "Moderate Sleep-Anxiety Pattern", description: "Anxiety is beginning to colonize your nights. The bed is becoming associated with wakefulness rather than rest. This is reversible with targeted approaches.", categorySlug: "the-body" },
      { range: [14, 20], title: "Significant Sleep-Anxiety Cycle", description: "You're caught in a feedback loop: anxiety disrupts sleep, poor sleep amplifies anxiety. Breaking this cycle requires addressing both the nervous system and the sleep environment.", categorySlug: "the-body" },
    ],
  },
  {
    slug: "coping-style",
    title: "What's Your Anxiety Coping Style?",
    description: "Discover whether you tend toward avoidance, control, accommodation, or acceptance.",
    questions: [
      { text: "When you feel anxious about something, you typically:", options: [{ label: "Avoid the situation entirely", score: 1 }, { label: "Try to control every variable", score: 2 }, { label: "Ask others for reassurance", score: 3 }, { label: "Sit with the discomfort", score: 4 }] },
      { text: "Your calendar shows a challenging event next week. You:", options: [{ label: "Cancel or find an excuse", score: 1 }, { label: "Over-prepare obsessively", score: 2 }, { label: "Ask friends if it'll be okay", score: 3 }, { label: "Notice the anxiety and go anyway", score: 4 }] },
      { text: "After an anxious episode, you:", options: [{ label: "Promise yourself never again", score: 1 }, { label: "Analyze what went wrong", score: 2 }, { label: "Seek validation that you're okay", score: 3 }, { label: "Let it pass without judgment", score: 4 }] },
      { text: "Your relationship with uncertainty is:", options: [{ label: "I can't tolerate it", score: 1 }, { label: "I try to eliminate it through planning", score: 2 }, { label: "I need others to help me manage it", score: 3 }, { label: "I'm learning to coexist with it", score: 4 }] },
      { text: "If anxiety were a houseguest, you would:", options: [{ label: "Pretend you're not home", score: 1 }, { label: "Set strict rules for their stay", score: 2 }, { label: "Ask the neighbors what to do", score: 3 }, { label: "Offer them tea and ask what they need", score: 4 }] },
    ],
    results: [
      { range: [5, 8], title: "Avoidant Coping Style", description: "Your primary strategy is escape. When anxiety shows up, you leave the room. This works short-term but shrinks your world over time. The path forward involves gentle, graduated exposure.", categorySlug: "the-specific" },
      { range: [9, 12], title: "Control-Based Coping Style", description: "You manage anxiety by managing everything else. Lists, plans, preparation — these are your armor. The paradox: the more you control, the more anxious you become about losing control.", categorySlug: "the-mind" },
      { range: [13, 16], title: "Accommodation Coping Style", description: "You outsource your safety to others. Reassurance-seeking, checking, asking — these temporarily soothe but prevent you from discovering your own capacity. Building internal trust is your edge.", categorySlug: "the-specific" },
      { range: [17, 20], title: "Acceptance-Oriented Coping", description: "You're developing the capacity to be with anxiety without being consumed by it. This is the most sustainable approach. Continue deepening this relationship.", categorySlug: "the-deeper-question" },
    ],
  },
  {
    slug: "body-awareness",
    title: "How Connected Are You to Your Body?",
    description: "Interoception — the ability to sense internal signals — is central to anxiety recovery.",
    questions: [
      { text: "Can you feel your heartbeat without touching your chest?", options: [{ label: "Yes, easily", score: 4 }, { label: "Sometimes", score: 3 }, { label: "Only when it's racing", score: 2 }, { label: "I've never tried", score: 1 }] },
      { text: "When you're hungry, do you notice before it becomes urgent?", options: [{ label: "Yes, I notice subtle hunger cues", score: 4 }, { label: "Usually", score: 3 }, { label: "I often forget to eat", score: 2 }, { label: "I eat by the clock, not by feel", score: 1 }] },
      { text: "During a conversation, are you aware of your posture?", options: [{ label: "Yes, I naturally adjust", score: 4 }, { label: "Sometimes", score: 3 }, { label: "Only when uncomfortable", score: 2 }, { label: "I'm usually in my head", score: 1 }] },
      { text: "Can you tell the difference between anxiety and excitement in your body?", options: [{ label: "Yes, they feel distinct", score: 4 }, { label: "Sometimes", score: 3 }, { label: "They feel the same", score: 2 }, { label: "I don't notice either in my body", score: 1 }] },
      { text: "When someone asks 'how do you feel?', you:", options: [{ label: "Can describe physical sensations", score: 4 }, { label: "Name an emotion", score: 3 }, { label: "Say 'fine' automatically", score: 2 }, { label: "Genuinely don't know", score: 1 }] },
    ],
    results: [
      { range: [5, 9], title: "Low Interoceptive Awareness", description: "You live primarily from the neck up. Your body sends signals, but the volume is turned down. This isn't a flaw — it's often a protective adaptation. Gentle somatic practices can slowly restore this connection.", categorySlug: "the-body" },
      { range: [10, 14], title: "Developing Body Awareness", description: "You're in the middle ground — sometimes connected, sometimes disconnected. This is actually a powerful place to be. You have enough awareness to build on, without being overwhelmed by sensation.", categorySlug: "the-body" },
      { range: [15, 20], title: "High Interoceptive Awareness", description: "You feel everything. This is a gift and a challenge. High interoception means you catch anxiety early — but it also means you feel it intensely. Learning to titrate your attention is your next edge.", categorySlug: "the-body" },
    ],
  },
  {
    slug: "thought-pattern",
    title: "What's Your Dominant Thought Pattern?",
    description: "Identify whether catastrophizing, rumination, fortune-telling, or mind-reading drives your anxious thinking.",
    questions: [
      { text: "When something goes wrong, your first thought is:", options: [{ label: "This is going to be a disaster", score: 1 }, { label: "What did I do wrong?", score: 2 }, { label: "Something worse is coming", score: 3 }, { label: "Everyone noticed and is judging me", score: 4 }] },
      { text: "Before a difficult conversation, you:", options: [{ label: "Imagine the worst possible outcome", score: 1 }, { label: "Replay past conversations that went badly", score: 2 }, { label: "Predict exactly how it will go", score: 3 }, { label: "Assume they're already angry with you", score: 4 }] },
      { text: "At 3am, your mind:", options: [{ label: "Spirals into worst-case scenarios", score: 1 }, { label: "Replays today's mistakes on loop", score: 2 }, { label: "Worries about tomorrow's problems", score: 3 }, { label: "Analyzes what people really meant", score: 4 }] },
      { text: "Your anxiety is most often about:", options: [{ label: "Everything falling apart", score: 1 }, { label: "Things I should have done differently", score: 2 }, { label: "What's going to happen next", score: 3 }, { label: "What people think of me", score: 4 }] },
      { text: "If you could turn off one mental habit:", options: [{ label: "Jumping to the worst conclusion", score: 1 }, { label: "Rehashing the past", score: 2 }, { label: "Trying to predict the future", score: 3 }, { label: "Reading other people's minds", score: 4 }] },
    ],
    results: [
      { range: [5, 8], title: "Catastrophizer", description: "Your mind is a disaster movie director. Every scenario gets the worst possible ending. The good news: catastrophizing is one of the most responsive patterns to cognitive restructuring.", categorySlug: "the-mind" },
      { range: [9, 12], title: "Ruminator", description: "Your mind is a washing machine stuck on the spin cycle. Past events get replayed, analyzed, and re-analyzed. The exit isn't through more thinking — it's through redirecting attention.", categorySlug: "the-mind" },
      { range: [13, 16], title: "Fortune Teller", description: "Your mind tries to predict the future to prevent pain. But prediction is just anxiety wearing a planning costume. Learning to tolerate uncertainty is your breakthrough.", categorySlug: "the-mind" },
      { range: [17, 20], title: "Mind Reader", description: "You assume you know what others think — and it's never good. This pattern is rooted in social threat detection. The antidote is checking assumptions rather than believing them.", categorySlug: "the-specific" },
    ],
  },
  {
    slug: "resilience-level",
    title: "How Resilient Is Your Nervous System?",
    description: "Measure your window of tolerance and capacity to bounce back from stress.",
    questions: [
      { text: "After a stressful event, how long until you feel normal?", options: [{ label: "Minutes to an hour", score: 4 }, { label: "Several hours", score: 3 }, { label: "A day or more", score: 2 }, { label: "I'm not sure I fully recover", score: 1 }] },
      { text: "How many stressors can you handle simultaneously?", options: [{ label: "Several — I can juggle", score: 4 }, { label: "Two or three", score: 3 }, { label: "One at a time", score: 2 }, { label: "Even one feels overwhelming", score: 1 }] },
      { text: "When plans change unexpectedly, you:", options: [{ label: "Adapt quickly", score: 4 }, { label: "Feel annoyed but adjust", score: 3 }, { label: "Feel significantly anxious", score: 2 }, { label: "Spiral or shut down", score: 1 }] },
      { text: "After a poor night's sleep, you:", options: [{ label: "Function reasonably well", score: 4 }, { label: "Feel off but manage", score: 3 }, { label: "Feel significantly impaired", score: 2 }, { label: "Everything feels threatening", score: 1 }] },
      { text: "Your emotional baseline is:", options: [{ label: "Generally stable", score: 4 }, { label: "Mostly okay with dips", score: 3 }, { label: "Frequently anxious", score: 2 }, { label: "Constantly on edge", score: 1 }] },
    ],
    results: [
      { range: [5, 9], title: "Narrow Window of Tolerance", description: "Your nervous system has a hair trigger. Small stressors feel enormous because your baseline is already elevated. The priority is expanding your window through consistent, gentle regulation practices.", categorySlug: "the-body" },
      { range: [10, 14], title: "Developing Resilience", description: "You have capacity, but it's inconsistent. Some days you handle stress well; others, you're overwhelmed by minor things. Building resilience is about consistency, not intensity.", categorySlug: "the-body" },
      { range: [15, 20], title: "Strong Resilience Foundation", description: "Your nervous system has good recovery capacity. This doesn't mean you don't feel anxiety — it means you bounce back. Continue building on this foundation.", categorySlug: "the-deeper-question" },
    ],
  },
  {
    slug: "anxiety-origin",
    title: "Where Did Your Anxiety Begin?",
    description: "Understanding the roots of your anxiety can illuminate the path forward.",
    questions: [
      { text: "When did you first remember feeling anxious?", options: [{ label: "As far back as I can remember", score: 1 }, { label: "Childhood, after a specific event", score: 2 }, { label: "Adolescence", score: 3 }, { label: "Adulthood, seemingly out of nowhere", score: 4 }] },
      { text: "Was anxiety modeled in your family?", options: [{ label: "Yes — a parent was very anxious", score: 1 }, { label: "There was general tension but it wasn't named", score: 2 }, { label: "Not obviously", score: 3 }, { label: "My family didn't discuss emotions", score: 4 }] },
      { text: "Did you experience any of these in childhood?", options: [{ label: "Unpredictable caregiving", score: 1 }, { label: "High expectations or perfectionism", score: 2 }, { label: "Bullying or social exclusion", score: 3 }, { label: "None that I'm aware of", score: 4 }] },
      { text: "Your anxiety feels most like:", options: [{ label: "Something I was born with", score: 1 }, { label: "Something that was taught to me", score: 2 }, { label: "A response to specific experiences", score: 3 }, { label: "Something that developed gradually", score: 4 }] },
      { text: "When you think about your anxiety's origin:", options: [{ label: "I feel it in my body immediately", score: 1 }, { label: "I can trace it to specific memories", score: 2 }, { label: "I understand it intellectually", score: 3 }, { label: "I'm not sure where it came from", score: 4 }] },
    ],
    results: [
      { range: [5, 8], title: "Early-Onset / Temperamental Anxiety", description: "Your anxiety has deep roots — possibly temperamental, possibly from very early relational experiences. This doesn't mean it's permanent. It means the approaches need to be body-based and relational, not just cognitive.", categorySlug: "the-deeper-question" },
      { range: [9, 12], title: "Learned / Modeled Anxiety", description: "You learned anxiety from your environment. It was taught through observation, expectation, or atmosphere. The good news: what was learned can be unlearned. New neural pathways can be built.", categorySlug: "the-mind" },
      { range: [13, 16], title: "Event-Triggered Anxiety", description: "Your anxiety has a clear origin point — or several. Specific experiences taught your nervous system that the world is dangerous. Trauma-informed approaches may be especially helpful.", categorySlug: "the-specific" },
      { range: [17, 20], title: "Adult-Onset / Gradual Anxiety", description: "Your anxiety developed later, possibly through accumulated stress, life transitions, or existential reckoning. This type often responds well to a combination of lifestyle changes and meaning-making work.", categorySlug: "the-deeper-question" },
    ],
  },
  {
    slug: "self-compassion",
    title: "How Do You Relate to Your Own Suffering?",
    description: "Self-compassion is the foundation of anxiety recovery. Where are you on this spectrum?",
    questions: [
      { text: "When you're struggling, your inner voice says:", options: [{ label: "You're pathetic — get it together", score: 1 }, { label: "You should be handling this better", score: 2 }, { label: "This is hard, but you'll figure it out", score: 3 }, { label: "Of course this is hard. Anyone would struggle.", score: 4 }] },
      { text: "When you see others struggling with anxiety, you feel:", options: [{ label: "Impatient — they should try harder", score: 1 }, { label: "Sympathetic but unsure how to help", score: 2 }, { label: "Compassionate and understanding", score: 3 }, { label: "Deep empathy — I know that pain", score: 4 }] },
      { text: "After a bad anxiety day, you:", options: [{ label: "Beat yourself up for being weak", score: 1 }, { label: "Feel frustrated with yourself", score: 2 }, { label: "Try to be gentle", score: 3 }, { label: "Treat yourself as you would a friend", score: 4 }] },
      { text: "The idea of being kind to yourself feels:", options: [{ label: "Indulgent or weak", score: 1 }, { label: "Uncomfortable but maybe necessary", score: 2 }, { label: "Reasonable", score: 3 }, { label: "Essential", score: 4 }] },
      { text: "If your anxiety could hear how you talk to yourself:", options: [{ label: "It would get worse", score: 1 }, { label: "It would feel criticized", score: 2 }, { label: "It would feel acknowledged", score: 3 }, { label: "It would feel safe", score: 4 }] },
    ],
    results: [
      { range: [5, 8], title: "Inner Critic Dominant", description: "Your inner critic is running the show. It believes harshness will motivate change, but research shows the opposite: self-criticism amplifies anxiety. This is the most important pattern to shift.", categorySlug: "the-mind" },
      { range: [9, 12], title: "Developing Self-Compassion", description: "You're in transition — the critic is still loud, but you're beginning to question its authority. This is the hardest stage because you're aware of the pattern but haven't fully replaced it.", categorySlug: "the-mind" },
      { range: [13, 16], title: "Growing Self-Compassion", description: "You're building a new relationship with yourself. The critic still shows up, but it no longer runs the show. Continue this practice — it compounds over time.", categorySlug: "the-deeper-question" },
      { range: [17, 20], title: "Strong Self-Compassion Foundation", description: "You've learned to be your own ally. This doesn't mean you never struggle — it means you don't add suffering to suffering. This is the foundation everything else is built on.", categorySlug: "the-deeper-question" },
    ],
  },
];

export default function QuizPage() {
  const { quizSlug } = useParams<{ quizSlug: string }>();
  const [, navigate] = useLocation();

  if (!quizSlug) {
    return (
      <Layout>
        <SEO
          title="Self-Assessment Quizzes"
          description="Nine evidence-informed self-assessment tools for understanding your anxiety patterns, nervous system state, and coping style."
          canonical={`https://${SITE_CONFIG.domain}/quiz`}
        />

        {/* Header */}
        <section className="section-sage py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "oklch(0.62 0.12 145)" }}>
              Self-Assessment
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Nine Mirrors
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              These are not diagnostic tools. They're mirrors — designed to help you see patterns you might not have noticed.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUIZZES.map((q, i) => (
              <Link
                key={q.slug}
                href={`/quiz/${q.slug}`}
                className="group block no-underline p-6 rounded-xl transition-all hover:shadow-md"
                style={{
                  background: i % 2 === 0
                    ? "oklch(0.94 0.04 145 / 0.3)"
                    : "oklch(0.96 0.02 75 / 0.3)",
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.1em] mb-2 block" style={{ color: "oklch(0.62 0.12 145)" }}>
                  Quiz {i + 1}
                </span>
                <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-sage transition-colors mb-2">
                  {q.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{q.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const quiz = QUIZZES.find((q) => q.slug === quizSlug);
  if (!quiz) {
    navigate("/404");
    return null;
  }

  return <QuizRunner quiz={quiz} />;
}

function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Quiz["results"][0] | null>(null);
  const [selectedOption, setSelectedOption] = useState(-1);

  const published = useMemo(
    () => sortByDate(filterPublished(articles)),
    []
  );

  const totalQuestions = quiz.questions.length;
  const progress = result ? 100 : ((currentQ) / totalQuestions) * 100;

  const handleSelect = useCallback(
    (score: number, index: number) => {
      setSelectedOption(index);
      setTimeout(() => {
        const newAnswers = [...answers, score];
        setAnswers(newAnswers);
        setSelectedOption(-1);

        if (currentQ + 1 >= totalQuestions) {
          const total = newAnswers.reduce((a, b) => a + b, 0);
          const match = quiz.results.find(
            (r) => total >= r.range[0] && total <= r.range[1]
          );
          setResult(match || quiz.results[quiz.results.length - 1]);
        } else {
          setCurrentQ(currentQ + 1);
        }
      }, 300);
    },
    [answers, currentQ, totalQuestions, quiz.results]
  );

  useEffect(() => {
    if (result) return;
    const handleKey = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= quiz.questions[currentQ].options.length) {
        handleSelect(quiz.questions[currentQ].options[num - 1].score, num - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentQ, result, handleSelect, quiz.questions]);

  const recommendedArticles = result
    ? published
        .filter((a) => a.categorySlug === result.categorySlug)
        .slice(0, 3)
    : [];

  const shareUrl = `https://${SITE_CONFIG.domain}/quiz/${quiz.slug}`;
  const shareText = result
    ? `I got "${result.title}" on the ${quiz.title} quiz at ${SITE_CONFIG.title}`
    : "";

  return (
    <Layout>
      <SEO
        title={result ? `${result.title} — ${quiz.title}` : quiz.title}
        description={result ? result.description : quiz.description}
        canonical={`https://${SITE_CONFIG.domain}/quiz/${quiz.slug}`}
        ogImage={`https://quiet-storm.b-cdn.net/og/site-og.png`}
      />

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ background: "oklch(0.94 0.04 145 / 0.5)" }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, oklch(0.62 0.12 145), oklch(0.72 0.16 75))",
          }}
        />
      </div>

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs text-muted-foreground mb-2">
          {result ? "Complete" : `Question ${currentQ + 1} of ${totalQuestions}`}
        </p>

        {!result ? (
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-8">
              {quiz.questions[currentQ].text}
            </h1>
            <div className="space-y-3">
              {quiz.questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt.score, i)}
                  className="w-full text-left p-5 rounded-xl transition-all duration-200 border"
                  style={{
                    borderColor: selectedOption === i ? "oklch(0.62 0.12 145)" : "oklch(0.88 0.015 90)",
                    background: selectedOption === i ? "oklch(0.94 0.04 145 / 0.5)" : "transparent",
                  }}
                  aria-label={`Option ${i + 1}: ${opt.label}`}
                >
                  <span className="text-xs font-semibold mr-3" style={{ color: "oklch(0.62 0.12 145)" }}>
                    {i + 1}
                  </span>
                  <span className="text-foreground">{opt.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Press 1-{quiz.questions[currentQ].options.length} to select
            </p>
          </div>
        ) : (
          <div>
            <div className="p-6 sm:p-8 rounded-2xl mb-8" style={{ background: "linear-gradient(135deg, oklch(0.94 0.04 145 / 0.5), oklch(0.97 0.005 90))" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "oklch(0.62 0.12 145)" }}>
                Your Result
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-4">
                {result.title}
              </h1>
              <p className="text-lg text-foreground leading-relaxed">
                {result.description}
              </p>
            </div>

            {/* Share */}
            <div className="flex gap-3 mb-8">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors no-underline text-foreground"
                style={{ borderColor: "oklch(0.88 0.015 90)" }}
                aria-label="Share result on Twitter/X"
              >
                Share on X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors no-underline text-foreground"
                style={{ borderColor: "oklch(0.88 0.015 90)" }}
                aria-label="Share result on Facebook"
              >
                Share on Facebook
              </a>
            </div>

            {/* Email capture */}
            <div className="mb-12 p-6 rounded-xl section-amber">
              <p className="font-heading text-lg font-semibold mb-3 text-foreground">
                Want to go deeper?
              </p>
              <NewsletterInline source={`quiz-${quiz.slug}`} />
            </div>

            {/* Recommended articles with images */}
            {recommendedArticles.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-semibold mb-4 text-foreground">
                  Recommended Reading
                </h2>
                <div className="space-y-4">
                  {recommendedArticles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/article/${a.slug}`}
                      className="group flex gap-4 no-underline p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={a.heroImage}
                          alt={a.heroAlt}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="category-badge">{a.category}</span>
                        <p className="text-sm font-semibold text-foreground group-hover:text-sage transition-colors mt-1 leading-snug">
                          {a.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Retake */}
            <button
              onClick={() => {
                setCurrentQ(0);
                setAnswers([]);
                setResult(null);
                setSelectedOption(-1);
              }}
              className="mt-8 px-5 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
              style={{ borderColor: "oklch(0.88 0.015 90)" }}
            >
              Retake quiz
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
