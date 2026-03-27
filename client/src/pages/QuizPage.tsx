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
      { range: [13, 16], title: "Primarily Social Anxiety", description: "Your anxiety is relational — it activates around other people, judgment, and belonging. This isn't weakness. It's your nervous system's threat detection focused on social survival. Specific strategies for social anxiety can help.", categorySlug: "the-specific" },
      { range: [17, 20], title: "Primarily Existential Anxiety", description: "Your anxiety touches the deeper questions — meaning, mortality, identity, and the nature of certainty itself. This is the anxiety that won't be fixed by breathing exercises alone. It asks for philosophical courage.", categorySlug: "the-deeper-question" },
    ],
  },
  {
    slug: "nervous-system-state",
    title: "What State Is Your Nervous System In?",
    description: "Based on polyvagal theory, discover whether you're in ventral vagal (safe), sympathetic (fight/flight), or dorsal vagal (shutdown).",
    questions: [
      { text: "Right now, how does your body feel?", options: [{ label: "Relatively calm and present", score: 1 }, { label: "Restless, tense, or agitated", score: 2 }, { label: "Heavy, numb, or disconnected", score: 3 }] },
      { text: "How is your breathing?", options: [{ label: "Easy and natural", score: 1 }, { label: "Shallow or rapid", score: 2 }, { label: "I barely notice it", score: 3 }] },
      { text: "If someone spoke to you right now, you would...", options: [{ label: "Engage naturally", score: 1 }, { label: "Feel irritable or defensive", score: 2 }, { label: "Struggle to respond", score: 3 }] },
      { text: "What best describes your energy?", options: [{ label: "Grounded and available", score: 1 }, { label: "Wired, can't sit still", score: 2 }, { label: "Exhausted but can't rest", score: 3 }] },
      { text: "How connected do you feel to your body?", options: [{ label: "I can feel my feet, my hands, my breath", score: 1 }, { label: "I feel it too much — everything is loud", score: 2 }, { label: "I feel almost nothing", score: 3 }] },
    ],
    results: [
      { range: [5, 8], title: "Ventral Vagal — Safe & Social", description: "Your nervous system is in its regulated state. You can connect, think clearly, and respond rather than react. This is the state where healing happens. Keep doing what you're doing.", categorySlug: "the-nervous-system" },
      { range: [9, 12], title: "Sympathetic — Fight or Flight", description: "Your nervous system is mobilized. Adrenaline is up, muscles are tense, and your body is ready to run or fight. This isn't a character flaw — it's biology. Your system needs signals of safety.", categorySlug: "the-nervous-system" },
      { range: [13, 15], title: "Dorsal Vagal — Shutdown", description: "Your nervous system has gone into conservation mode. Numbness, fatigue, disconnection — these are protective responses. Gentle, bottom-up approaches can help you come back online slowly.", categorySlug: "the-body" },
    ],
  },
  {
    slug: "breathing-pattern",
    title: "What's Your Breathing Pattern?",
    description: "Your breath reveals more about your anxiety than you think. Discover your default pattern and what it means.",
    questions: [
      { text: "Where does your breath go?", options: [{ label: "Deep into my belly", score: 1 }, { label: "Into my chest", score: 2 }, { label: "I'm not sure — I don't notice", score: 3 }] },
      { text: "Do you ever catch yourself holding your breath?", options: [{ label: "Rarely", score: 1 }, { label: "Often, especially when stressed", score: 2 }, { label: "I think I hold it most of the time", score: 3 }] },
      { text: "How do you breathe when falling asleep?", options: [{ label: "Naturally and slowly", score: 1 }, { label: "I have to consciously slow it down", score: 2 }, { label: "I sometimes gasp or feel short of breath", score: 3 }] },
      { text: "After climbing stairs, how long until your breath normalizes?", options: [{ label: "30 seconds or less", score: 1 }, { label: "A minute or two", score: 2 }, { label: "It takes a while and I feel panicky", score: 3 }] },
      { text: "Do you sigh frequently throughout the day?", options: [{ label: "Not really", score: 1 }, { label: "Sometimes", score: 2 }, { label: "Constantly — deep sighs I can't control", score: 3 }] },
    ],
    results: [
      { range: [5, 8], title: "Diaphragmatic Breather", description: "Your breath is relatively healthy and regulated. You naturally engage your diaphragm, which supports vagal tone and nervous system regulation. Breathwork practices can deepen this foundation.", categorySlug: "the-body" },
      { range: [9, 12], title: "Chest Breather", description: "You've shifted into upper-chest breathing — a common pattern in chronic anxiety. This keeps your nervous system in low-grade alert. Retraining your breath is one of the most powerful interventions available.", categorySlug: "the-body" },
      { range: [13, 15], title: "Dysregulated Breather", description: "Your breathing pattern shows signs of significant dysregulation. Breath-holding, gasping, and chronic sighing are your body's attempts to reset. Gentle, guided breathwork — not forced — is the path forward.", categorySlug: "the-body" },
    ],
  },
  {
    slug: "sleep-anxiety",
    title: "How Does Anxiety Affect Your Sleep?",
    description: "The anxiety-insomnia loop is one of the most common and least understood patterns. Find out where you are in it.",
    questions: [
      { text: "What happens when you get into bed?", options: [{ label: "I fall asleep within 20 minutes", score: 1 }, { label: "My mind starts racing", score: 2 }, { label: "I dread bedtime", score: 3 }] },
      { text: "Do you wake up during the night?", options: [{ label: "Rarely", score: 1 }, { label: "Once or twice", score: 2 }, { label: "Multiple times, often with anxiety", score: 3 }] },
      { text: "How do you feel when you wake up?", options: [{ label: "Rested", score: 1 }, { label: "Tired but functional", score: 2 }, { label: "Exhausted and dreading the day", score: 3 }] },
      { text: "Do you worry about not sleeping?", options: [{ label: "Not really", score: 1 }, { label: "Sometimes", score: 2 }, { label: "The worry about sleep is worse than the insomnia", score: 3 }] },
      { text: "What's your relationship with your bed?", options: [{ label: "A place of rest", score: 1 }, { label: "Complicated", score: 2 }, { label: "A battlefield", score: 3 }] },
    ],
    results: [
      { range: [5, 8], title: "Healthy Sleep Pattern", description: "Your sleep is largely unaffected by anxiety. This is a significant protective factor. Maintaining good sleep hygiene will help keep it this way.", categorySlug: "the-specific" },
      { range: [9, 12], title: "Anxiety-Disrupted Sleep", description: "Anxiety is beginning to interfere with your sleep. The loop hasn't fully formed yet, but the pattern is developing. Addressing it now prevents escalation.", categorySlug: "the-specific" },
      { range: [13, 15], title: "Full Anxiety-Insomnia Loop", description: "You're caught in the loop where anxiety causes insomnia and insomnia causes anxiety. This is one of the most treatable patterns in anxiety — but it requires specific approaches, not just 'sleep hygiene tips.'", categorySlug: "the-specific" },
    ],
  },
  {
    slug: "gut-brain",
    title: "Is Your Gut Driving Your Anxiety?",
    description: "The gut-brain axis is real. Discover whether your digestive system might be contributing to your anxiety.",
    questions: [
      { text: "Do you experience digestive issues when anxious?", options: [{ label: "Rarely", score: 1 }, { label: "Sometimes — nausea or butterflies", score: 2 }, { label: "Always — IBS, cramping, or worse", score: 3 }] },
      { text: "Does eating affect your anxiety levels?", options: [{ label: "Not noticeably", score: 1 }, { label: "Certain foods seem to make it worse", score: 2 }, { label: "My anxiety and digestion are completely linked", score: 3 }] },
      { text: "Do you experience bloating or discomfort regularly?", options: [{ label: "Rarely", score: 1 }, { label: "A few times a week", score: 2 }, { label: "Daily", score: 3 }] },
      { text: "Have you ever had a 'gut feeling' that turned out to be anxiety?", options: [{ label: "I can tell the difference", score: 1 }, { label: "Sometimes I confuse them", score: 2 }, { label: "I can never tell if it's intuition or anxiety", score: 3 }] },
      { text: "Does your anxiety improve or worsen after meals?", options: [{ label: "No change", score: 1 }, { label: "It depends on what I eat", score: 2 }, { label: "Meals are a major trigger", score: 3 }] },
    ],
    results: [
      { range: [5, 8], title: "Minimal Gut-Brain Connection", description: "Your anxiety doesn't appear to be strongly linked to your digestive system. This doesn't mean the gut-brain axis isn't relevant — just that it's not your primary pathway.", categorySlug: "the-body" },
      { range: [9, 12], title: "Moderate Gut-Brain Involvement", description: "There's a meaningful connection between your gut and your anxiety. The vagus nerve carries information both ways, and your digestive system is sending signals your brain is interpreting as threat.", categorySlug: "the-body" },
      { range: [13, 15], title: "Strong Gut-Brain Axis Activation", description: "Your gut is a major player in your anxiety experience. The enteric nervous system — your 'second brain' — is highly activated. Addressing gut health may be one of the most impactful interventions for your anxiety.", categorySlug: "the-body" },
    ],
  },
  {
    slug: "coping-style",
    title: "What's Your Anxiety Coping Style?",
    description: "Everyone develops strategies for managing anxiety. Some help. Some make things worse. Find out which pattern you've fallen into.",
    questions: [
      { text: "When anxiety spikes, your first instinct is to...", options: [{ label: "Analyze and problem-solve", score: 1 }, { label: "Avoid the trigger entirely", score: 2 }, { label: "Push through and ignore it", score: 3 }, { label: "Reach for something to numb it", score: 4 }] },
      { text: "How do you handle uncertainty?", options: [{ label: "Research until I feel in control", score: 1 }, { label: "Avoid situations where I can't predict outcomes", score: 2 }, { label: "Force myself through it", score: 3 }, { label: "Distract myself until it passes", score: 4 }] },
      { text: "What role does control play in your anxiety?", options: [{ label: "I need to control everything", score: 1 }, { label: "I've given up trying to control anything", score: 2 }, { label: "I pretend I'm in control", score: 3 }, { label: "Control isn't the issue — feeling is", score: 4 }] },
      { text: "After a bad anxiety day, you...", options: [{ label: "Debrief with yourself about what went wrong", score: 1 }, { label: "Cancel tomorrow's plans", score: 2 }, { label: "Tell yourself to toughen up", score: 3 }, { label: "Zone out with screens, food, or substances", score: 4 }] },
      { text: "Which statement resonates most?", options: [{ label: "If I can understand it, I can fix it", score: 1 }, { label: "If I avoid it, it can't hurt me", score: 2 }, { label: "Feelings are weakness", score: 3 }, { label: "I just need to not feel this", score: 4 }] },
    ],
    results: [
      { range: [5, 8], title: "The Analyzer", description: "You cope by thinking — researching, planning, trying to understand anxiety intellectually. This works up to a point, but anxiety isn't a puzzle to solve. At some point, the analysis becomes the avoidance.", categorySlug: "the-mind" },
      { range: [9, 12], title: "The Avoider", description: "Your world has gotten smaller. You cope by removing triggers, which provides short-term relief but long-term constriction. The nervous system needs graduated exposure, not permanent retreat.", categorySlug: "the-specific" },
      { range: [13, 16], title: "The Suppressor", description: "You push through. You perform normalcy. You white-knuckle it. This takes enormous energy and eventually the body rebels. Acknowledging the anxiety isn't weakness — it's the beginning of actual strength.", categorySlug: "the-body" },
      { range: [17, 20], title: "The Numbing Pattern", description: "You cope by not feeling. Screens, food, substances, overwork — anything to avoid the raw experience of anxiety. This is the most common pattern and the most understandable. The path forward involves learning to tolerate feeling without drowning in it.", categorySlug: "the-mind" },
    ],
  },
  {
    slug: "meditation-readiness",
    title: "Are You Ready for Meditation?",
    description: "Meditation is powerful — but it's not always the right tool at the right time. Find out if your nervous system is ready.",
    questions: [
      { text: "When you sit in silence, what happens?", options: [{ label: "I can settle in after a few minutes", score: 1 }, { label: "My thoughts get louder", score: 2 }, { label: "I feel panicky or need to move", score: 3 }] },
      { text: "Can you close your eyes without feeling unsafe?", options: [{ label: "Yes, easily", score: 1 }, { label: "It depends on where I am", score: 2 }, { label: "Closing my eyes increases anxiety", score: 3 }] },
      { text: "How do you respond to guided meditations?", options: [{ label: "They help me relax", score: 1 }, { label: "I get frustrated or distracted", score: 2 }, { label: "They make me more anxious", score: 3 }] },
      { text: "Can you observe a thought without getting pulled into it?", options: [{ label: "Sometimes", score: 1 }, { label: "Rarely — thoughts are sticky", score: 2 }, { label: "I don't understand the question", score: 3 }] },
      { text: "After attempting meditation, how do you feel?", options: [{ label: "Calmer", score: 1 }, { label: "The same or slightly frustrated", score: 2 }, { label: "Worse than before", score: 3 }] },
    ],
    results: [
      { range: [5, 8], title: "Ready for Formal Practice", description: "Your nervous system has enough regulation to benefit from seated meditation. You can tolerate stillness and observe your inner experience. Deepening your practice will compound these benefits.", categorySlug: "the-mind" },
      { range: [9, 12], title: "Ready for Modified Practice", description: "Traditional meditation may not be your best entry point right now. Walking meditation, body-based practices, or very short sits (3-5 minutes) with eyes open may be more appropriate. Meet your nervous system where it is.", categorySlug: "the-body" },
      { range: [13, 15], title: "Start with Somatic Work First", description: "Your nervous system needs more regulation before formal meditation will help. Sitting still in silence can actually increase anxiety when the system is highly activated. Start with breathwork, movement, and vagal toning — meditation can come later.", categorySlug: "the-nervous-system" },
    ],
  },
  {
    slug: "anxiety-severity",
    title: "How Severe Is Your Anxiety?",
    description: "A self-assessment to help you understand where you fall on the anxiety spectrum — from manageable to needs professional support.",
    questions: [
      { text: "How often do you feel anxious in a typical week?", options: [{ label: "Once or twice", score: 1 }, { label: "Most days", score: 2 }, { label: "Constantly — it never fully stops", score: 3 }] },
      { text: "Does anxiety prevent you from doing things you want to do?", options: [{ label: "Rarely", score: 1 }, { label: "Sometimes I avoid things", score: 2 }, { label: "My life has significantly narrowed", score: 3 }] },
      { text: "Do you experience physical symptoms (racing heart, nausea, trembling)?", options: [{ label: "Occasionally", score: 1 }, { label: "Regularly", score: 2 }, { label: "Daily or near-daily", score: 3 }] },
      { text: "How does anxiety affect your relationships?", options: [{ label: "Minimally", score: 1 }, { label: "It creates tension", score: 2 }, { label: "It's damaging my closest relationships", score: 3 }] },
      { text: "Have you had panic attacks?", options: [{ label: "Never", score: 1 }, { label: "A few times", score: 2 }, { label: "Regularly", score: 3 }] },
    ],
    results: [
      { range: [5, 8], title: "Mild Anxiety", description: "Your anxiety is present but manageable. Self-help strategies, lifestyle adjustments, and the resources on this site can make a meaningful difference. This is the stage where prevention is most powerful.", categorySlug: "the-mind" },
      { range: [9, 12], title: "Moderate Anxiety", description: "Your anxiety is significantly affecting your quality of life. A combination of self-help practices and professional support would be beneficial. You don't have to figure this out alone.", categorySlug: "the-specific" },
      { range: [13, 15], title: "Severe Anxiety", description: "Your anxiety is at a level where professional support is strongly recommended. This isn't a failure — it's an appropriate response to the intensity of what you're experiencing. A therapist trained in somatic or trauma-informed approaches can help.", categorySlug: "the-nervous-system" },
    ],
  },
  {
    slug: "thought-patterns",
    title: "What Thought Pattern Drives Your Anxiety?",
    description: "Identify the cognitive distortion that most fuels your anxious thinking.",
    questions: [
      { text: "When something uncertain happens, your mind goes to...", options: [{ label: "The worst possible outcome", score: 1 }, { label: "What I should have done differently", score: 2 }, { label: "What others must be thinking about me", score: 3 }, { label: "Whether I can handle it", score: 4 }] },
      { text: "Which thought feels most familiar?", options: [{ label: "Something terrible is going to happen", score: 1 }, { label: "I always mess things up", score: 2 }, { label: "Everyone can see how anxious I am", score: 3 }, { label: "I can't cope with this", score: 4 }] },
      { text: "How do you interpret ambiguous situations?", options: [{ label: "As dangerous until proven safe", score: 1 }, { label: "As my fault somehow", score: 2 }, { label: "As a test I'm failing", score: 3 }, { label: "As evidence I'm not strong enough", score: 4 }] },
      { text: "What's the theme of your anxious thoughts?", options: [{ label: "Danger and catastrophe", score: 1 }, { label: "Regret and self-blame", score: 2 }, { label: "Judgment and rejection", score: 3 }, { label: "Inadequacy and overwhelm", score: 4 }] },
      { text: "If you could change one thought pattern, it would be...", options: [{ label: "Assuming the worst", score: 1 }, { label: "Blaming myself for everything", score: 2 }, { label: "Mind-reading what others think", score: 3 }, { label: "Believing I can't handle things", score: 4 }] },
    ],
    results: [
      { range: [5, 8], title: "Catastrophizing", description: "Your mind specializes in worst-case scenarios. The brain's prediction machinery is running at full speed, generating threat assessments for situations that haven't happened and probably won't. Learning to notice the prediction without believing it is the key skill.", categorySlug: "the-mind" },
      { range: [9, 12], title: "Self-Blame Loop", description: "You turn anxiety inward, interpreting it as evidence of personal failure. This creates a secondary layer of suffering — anxiety about being anxious, shame about being ashamed. Breaking this loop requires self-compassion, which is not the same as self-indulgence.", categorySlug: "the-mind" },
      { range: [13, 16], title: "Social Threat Detection", description: "Your mind is constantly scanning for social danger — judgment, rejection, embarrassment. This is your nervous system's threat detection focused on belonging, which is a legitimate survival need. The problem isn't the detection — it's the volume.", categorySlug: "the-specific" },
      { range: [17, 20], title: "Overwhelm Narrative", description: "Your core belief is that you can't handle what's coming. This narrative undermines your actual resilience, which is considerable — you've been handling difficult things your entire life. The gap between what you believe about your capacity and your actual capacity is where the work lives.", categorySlug: "the-deeper-question" },
    ],
  },
];

export default function QuizPage() {
  const { quizSlug } = useParams<{ quizSlug: string }>();
  const [, navigate] = useLocation();

  // Quiz list page
  if (!quizSlug) {
    return (
      <Layout>
        <SEO
          title="Quizzes"
          description="Self-assessment quizzes for anxiety, nervous system state, breathing patterns, and more."
          canonical={`https://${SITE_CONFIG.domain}/quiz`}
        />
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Self-Assessments
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            These are not diagnostic tools. They're mirrors — designed to help you see patterns you might not have noticed.
          </p>
          <div className="space-y-4">
            {QUIZZES.map((q) => (
              <Link
                key={q.slug}
                href={`/quiz/${q.slug}`}
                className="block no-underline p-5 border border-border/50 rounded-lg hover:border-sage/30 transition-colors group"
              >
                <h2 className="font-heading text-lg font-medium text-foreground group-hover:text-sage transition-colors mb-1">
                  {q.title}
                </h2>
                <p className="text-sm text-muted-foreground">{q.description}</p>
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

  // Keyboard navigation
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

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: "oklch(0.68 0.1 140)",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {result
              ? "Complete"
              : `Question ${currentQ + 1} of ${totalQuestions}`}
          </p>
        </div>

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
                  className={`w-full text-left p-4 border rounded-lg transition-all duration-200 ${
                    selectedOption === i
                      ? "border-sage bg-sage/10"
                      : "border-border/50 hover:border-sage/30"
                  }`}
                  style={
                    selectedOption === i
                      ? { borderColor: "oklch(0.68 0.1 140)" }
                      : {}
                  }
                  aria-label={`Option ${i + 1}: ${opt.label}`}
                >
                  <span className="text-xs text-muted-foreground mr-2">
                    {i + 1}.
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Press 1-{quiz.questions[currentQ].options.length} to select
            </p>
          </div>
        ) : (
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              {result.title}
            </h1>
            <p className="text-lg text-foreground leading-relaxed mb-8">
              {result.description}
            </p>

            {/* Share */}
            <div className="flex gap-3 mb-8">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors no-underline text-foreground"
                aria-label="Share result on Twitter/X"
              >
                Share on X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors no-underline text-foreground"
                aria-label="Share result on Facebook"
              >
                Share on Facebook
              </a>
            </div>

            {/* Email capture */}
            <div className="mb-12 p-6 bg-card border border-border/50 rounded-lg">
              <p className="font-heading text-lg font-medium mb-3">
                Want to go deeper?
              </p>
              <NewsletterInline source={`quiz-${quiz.slug}`} />
            </div>

            {/* Recommended articles */}
            {recommendedArticles.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-medium mb-4">
                  Recommended Reading
                </h2>
                <div className="space-y-3">
                  {recommendedArticles.map((a) => (
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
            )}

            {/* Retake */}
            <button
              onClick={() => {
                setCurrentQ(0);
                setAnswers([]);
                setResult(null);
                setSelectedOption(-1);
              }}
              className="mt-8 px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              Retake quiz
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
