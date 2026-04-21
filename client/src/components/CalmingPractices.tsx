import { useState } from "react";
import { Link } from "wouter";

export interface Practice {
  name: string;
  shortDesc: string;
  howTo: string;
  category: "breathwork" | "somatic" | "meditation" | "movement" | "self-compassion" | "grounding" | "vagal";
}

export const ALL_PRACTICES: Practice[] = [
  {
    name: "Meditation",
    shortDesc: "Sitting with what is, without trying to change it",
    howTo: "Find a quiet spot. Sit comfortably. Close your eyes and focus on the sensation of breathing. When your mind wanders (it will), gently bring it back. Start with 5 minutes. That's enough.",
    category: "meditation",
  },
  {
    name: "Chanting",
    shortDesc: "Using your voice to vibrate calm through your body",
    howTo: "Choose a simple sound like 'Om' or 'Voo.' Take a deep breath and let the sound flow out slowly on the exhale. Feel the vibration in your chest and throat. The vibration stimulates your vagus nerve and signals safety to your nervous system.",
    category: "vagal",
  },
  {
    name: "Butterfly Hug",
    shortDesc: "Bilateral stimulation you can do anywhere",
    howTo: "Cross your arms over your chest so your fingertips rest on your shoulders. Alternate tapping left and right, slowly and rhythmically. Breathe naturally. This bilateral stimulation helps your brain process distress and move toward calm.",
    category: "somatic",
  },
  {
    name: "Hands on Heart",
    shortDesc: "The simplest act of self-compassion there is",
    howTo: "Place both hands over your heart. Feel the warmth of your palms against your chest. Breathe slowly. Notice the rise and fall. You can whisper 'I am safe' or simply feel the contact. This activates oxytocin release and soothes your nervous system.",
    category: "self-compassion",
  },
  {
    name: "Loving Yourself",
    shortDesc: "Speaking to yourself the way you'd speak to someone you love",
    howTo: "Place a hand on your heart. Say to yourself: 'May I be safe. May I be happy. May I be healthy. May I live with ease.' Mean it or not, the words still land. Repeat until something softens.",
    category: "self-compassion",
  },
  {
    name: "Box Breathing",
    shortDesc: "A simple pattern that resets your nervous system",
    howTo: "Inhale for 4 counts. Hold for 4 counts. Exhale for 4 counts. Hold for 4 counts. Repeat 4-6 cycles. This technique is used by Navy SEALs to stay calm under pressure. It works because it gives your mind a task and your body a rhythm.",
    category: "breathwork",
  },
  {
    name: "Extended Exhale Breathing",
    shortDesc: "Making the exhale longer than the inhale signals safety",
    howTo: "Inhale gently for 4 counts. Exhale slowly for 6-8 counts. The extended exhale activates your parasympathetic nervous system, telling your body it's safe to stand down. Do this for 2-3 minutes.",
    category: "breathwork",
  },
  {
    name: "4-7-8 Breathing",
    shortDesc: "A natural tranquilizer for the nervous system",
    howTo: "Inhale through your nose for 4 counts. Hold your breath for 7 counts. Exhale completely through your mouth for 8 counts. Repeat 3-4 times. This technique was developed by Dr. Andrew Weil and is particularly effective before sleep.",
    category: "breathwork",
  },
  {
    name: "Body Scan Meditation",
    shortDesc: "Traveling through your body with gentle attention",
    howTo: "Lie down or sit comfortably. Starting at the top of your head, slowly move your attention down through your body. Notice each area without trying to change anything. Jaw. Shoulders. Chest. Belly. Hips. Legs. Feet. Just notice. Just breathe.",
    category: "meditation",
  },
  {
    name: "5-4-3-2-1 Grounding",
    shortDesc: "Anchoring yourself in the present through your senses",
    howTo: "Name 5 things you can see. 4 things you can touch. 3 things you can hear. 2 things you can smell. 1 thing you can taste. This pulls your awareness out of anxious thoughts and back into the present moment.",
    category: "grounding",
  },
  {
    name: "Cold Water Reset",
    shortDesc: "Activating your dive reflex to calm your vagus nerve",
    howTo: "Splash cold water on your face, especially your forehead and cheeks. Or hold ice cubes in your hands. This triggers the mammalian dive reflex, which slows your heart rate and activates your parasympathetic nervous system almost immediately.",
    category: "vagal",
  },
  {
    name: "Humming",
    shortDesc: "Vibrating your vagus nerve back to calm",
    howTo: "Take a deep breath and hum on the exhale. Any note, any tune. Feel the vibration in your throat, chest, and face. Humming stimulates the vagus nerve through the laryngeal muscles and can lower heart rate within minutes.",
    category: "vagal",
  },
  {
    name: "Legs Up the Wall",
    shortDesc: "Letting gravity do the calming for you",
    howTo: "Lie on your back with your legs resting up against a wall. Let your arms rest at your sides. Stay for 5-15 minutes. This gentle inversion activates your parasympathetic nervous system, reduces blood pressure, and calms racing thoughts.",
    category: "somatic",
  },
  {
    name: "Progressive Muscle Relaxation",
    shortDesc: "Tensing and releasing to teach your body the difference",
    howTo: "Starting with your feet, tense each muscle group for 5 seconds, then release for 10 seconds. Move up through calves, thighs, belly, chest, arms, hands, shoulders, face. The release teaches your body what relaxation actually feels like.",
    category: "somatic",
  },
  {
    name: "Walking Meditation",
    shortDesc: "Moving slowly enough to feel each step",
    howTo: "Walk very slowly, paying attention to each phase of the step: lifting, moving, placing, shifting weight. Feel the ground beneath you. You don't need to go anywhere. The point is the walking itself.",
    category: "movement",
  },
  {
    name: "Gentle Rocking",
    shortDesc: "The oldest calming technique in human history",
    howTo: "Sit or stand and gently rock your body side to side, or forward and back. This vestibular stimulation activates the same calming pathways that rocking a baby does. Your body remembers being soothed this way.",
    category: "somatic",
  },
  {
    name: "Bilateral Tapping",
    shortDesc: "Left-right stimulation to help your brain process distress",
    howTo: "Tap alternately on your knees, your shoulders, or the sides of your body. Left, right, left, right. Slowly and rhythmically. This bilateral stimulation helps your brain process emotional material and move from activation toward calm.",
    category: "somatic",
  },
  {
    name: "Warm Hands Technique",
    shortDesc: "Using warmth to signal safety to your nervous system",
    howTo: "Hold a warm cup of tea or wrap your hands around a warm water bottle. Focus on the sensation of warmth spreading through your palms. Warmth activates peripheral blood flow, which is a parasympathetic response. Your body reads warmth as safety.",
    category: "grounding",
  },
  {
    name: "Gratitude Body Scan",
    shortDesc: "Thanking each part of your body for what it does",
    howTo: "Move through your body and thank each part. 'Thank you, feet, for carrying me. Thank you, lungs, for breathing without being asked. Thank you, heart, for beating 100,000 times today.' This shifts your relationship with your body from adversary to ally.",
    category: "self-compassion",
  },
  {
    name: "Vagal Toning Through Gargling",
    shortDesc: "A surprisingly effective way to stimulate your vagus nerve",
    howTo: "Take a sip of water and gargle vigorously for 30 seconds. The muscles in the back of your throat are connected to your vagus nerve. Gargling activates them, which sends calming signals down to your heart and gut.",
    category: "vagal",
  },
  {
    name: "Earthing / Barefoot Walking",
    shortDesc: "Connecting your body directly to the ground",
    howTo: "Take off your shoes and walk on grass, dirt, or sand. Feel the texture and temperature under your feet. Research suggests direct contact with the earth's surface can reduce cortisol and inflammation. At minimum, it pulls you into the present.",
    category: "grounding",
  },
  {
    name: "Self-Holding",
    shortDesc: "Wrapping your arms around yourself like you matter",
    howTo: "Cross your arms and hold your own shoulders, or wrap your arms around yourself in a hug. Squeeze gently. Rock if it feels right. This is not silly. This is your body receiving the message that someone cares. And that someone is you.",
    category: "self-compassion",
  },
  {
    name: "Yoga Nidra",
    shortDesc: "Conscious sleep that restores what regular sleep cannot",
    howTo: "Lie down in a comfortable position. Follow a guided yoga nidra recording (many free ones exist online). You'll be guided through body awareness, breathing, and visualization while hovering between waking and sleeping. 30 minutes of yoga nidra is said to equal 2 hours of sleep.",
    category: "meditation",
  },
  {
    name: "Sighing",
    shortDesc: "The fastest physiological reset available to you",
    howTo: "Take a double inhale through your nose (two quick sniffs), then a long, slow exhale through your mouth. This is called a physiological sigh. Research from Stanford shows it's the fastest way to reduce stress in real time. One sigh can shift your state.",
    category: "breathwork",
  },
  {
    name: "Gentle Stretching",
    shortDesc: "Releasing what your muscles have been holding for you",
    howTo: "Stand up and stretch gently. Reach your arms overhead. Roll your shoulders. Twist your torso. Bend forward and let your head hang. Hold each stretch for 20-30 seconds and breathe into the sensation. Your muscles store emotion. Stretching releases it.",
    category: "movement",
  },
  {
    name: "Journaling Your Worries",
    shortDesc: "Getting the storm out of your head and onto paper",
    howTo: "Set a timer for 10 minutes. Write everything that's worrying you. Don't edit, don't judge, don't organize. Just dump it all out. When the timer goes off, close the notebook. The worries are still there, but they're on paper now instead of circling in your head.",
    category: "grounding",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  breathwork: "Breathwork",
  somatic: "Somatic",
  meditation: "Meditation",
  movement: "Movement",
  "self-compassion": "Self-Compassion",
  grounding: "Grounding",
  vagal: "Vagal Toning",
};

const CATEGORY_COLORS: Record<string, string> = {
  breathwork: "oklch(0.55 0.12 260)",
  somatic: "oklch(0.62 0.12 145)",
  meditation: "oklch(0.55 0.12 340)",
  movement: "oklch(0.62 0.12 75)",
  "self-compassion": "oklch(0.55 0.12 30)",
  grounding: "oklch(0.55 0.1 145)",
  vagal: "oklch(0.55 0.15 260)",
};

/** Compact grid of 6 practices for embedding in Home page */
export function PracticeHighlights() {
  const highlights = ALL_PRACTICES.slice(0, 6);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {highlights.map((p) => (
        <div
          key={p.name}
          className="p-5 rounded-xl border transition-all hover:shadow-sm"
          style={{ borderColor: `${CATEGORY_COLORS[p.category]}33`, background: `${CATEGORY_COLORS[p.category]}08` }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block" style={{ color: CATEGORY_COLORS[p.category] }}>
            {CATEGORY_LABELS[p.category]}
          </span>
          <h4 className="font-heading text-base font-semibold text-foreground mb-1">{p.name}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{p.shortDesc}</p>
        </div>
      ))}
    </div>
  );
}

/** Full practices section for Start Here or dedicated page */
export function FullPracticesSection() {
  const [filter, setFilter] = useState<string>("all");
  const categories = Array.from(new Set(ALL_PRACTICES.map((p) => p.category)));
  const filtered = filter === "all" ? ALL_PRACTICES : ALL_PRACTICES.filter((p) => p.category === filter);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === "all" ? "text-white" : "text-foreground border"}`}
          style={filter === "all" ? { background: "oklch(0.62 0.12 145)" } : { borderColor: "oklch(0.85 0.03 60 / 0.5)" }}
        >
          All ({ALL_PRACTICES.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === cat ? "text-white" : "text-foreground border"}`}
            style={filter === cat ? { background: CATEGORY_COLORS[cat] } : { borderColor: "oklch(0.85 0.03 60 / 0.5)" }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Practice cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filtered.map((p) => (
          <div
            key={p.name}
            className="p-6 rounded-xl border transition-all hover:shadow-md"
            style={{ borderColor: `${CATEGORY_COLORS[p.category]}33`, background: `${CATEGORY_COLORS[p.category]}06` }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block" style={{ color: CATEGORY_COLORS[p.category] }}>
              {CATEGORY_LABELS[p.category]}
            </span>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-2">{p.name}</h4>
            <p className="text-sm text-muted-foreground italic mb-3">{p.shortDesc}</p>
            <p className="text-sm text-foreground leading-relaxed">{p.howTo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Inline mention component for articles */
export function PracticeMention({ name }: { name: string }) {
  const practice = ALL_PRACTICES.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (!practice) return <span>{name}</span>;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium" style={{ background: `${CATEGORY_COLORS[practice.category]}12`, color: CATEGORY_COLORS[practice.category] }}>
      {practice.name}
    </span>
  );
}
