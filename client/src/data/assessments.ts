/**
 * 5 Self-Assessments for The Quiet Storm
 * Each has 10 questions, 4 answer options (scored 0-3),
 * 4 result tiers with comforting images and recommendations.
 */

export interface AssessmentQuestion {
  text: string;
  options: { label: string; score: number }[];
}

export interface ResultTier {
  range: [number, number];
  title: string;
  image: string;
  message: string;
  practices: string[];
  articles: string[];
}

export interface Assessment {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  questions: AssessmentQuestion[];
  results: ResultTier[];
}

const IMAGES = {
  forest: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/5L92HNX2jQriZGmWknDJPd/assess-gentle-dawn-jEQKTtaQ5Ad4BUjnDbxnjU.webp",
  lake: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/5L92HNX2jQriZGmWknDJPd/assess-calm-waters-HgNztQ6grNwsLZT5rNgmGY.webp",
  meadow: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/5L92HNX2jQriZGmWknDJPd/assess-mountain-peace-9iH6BZndydViEq8vomysbi.webp",
  garden: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/5L92HNX2jQriZGmWknDJPd/assess-garden-sanctuary-WiNvXio6JZRvCPAaBcyDkS.webp",
  ocean: "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/5L92HNX2jQriZGmWknDJPd/assess-ocean-horizon-QyZXceZGr5wYNUXPyEHves.webp",
};

export const ASSESSMENTS: Assessment[] = [
  // ─── 1. Anxiety Intensity Check-In ───
  {
    id: "anxiety-intensity",
    title: "Anxiety Intensity Check-In",
    subtitle: "Where is your anxiety right now?",
    description: "A gentle check-in to help you understand the current intensity of your anxiety. This is not a diagnosis. It is a mirror, and sometimes just naming what you feel can take some of its power away.",
    icon: "Activity",
    questions: [
      {
        text: "How often do you feel a sense of dread or unease that you can't quite explain?",
        options: [
          { label: "Rarely or never", score: 0 },
          { label: "A few times a month", score: 1 },
          { label: "Several times a week", score: 2 },
          { label: "Almost every day", score: 3 },
        ],
      },
      {
        text: "When anxiety shows up, how much does it interfere with what you're trying to do?",
        options: [
          { label: "It doesn't really get in the way", score: 0 },
          { label: "It slows me down a little", score: 1 },
          { label: "It makes things significantly harder", score: 2 },
          { label: "It stops me from functioning normally", score: 3 },
        ],
      },
      {
        text: "How often do you notice physical symptoms like a tight chest, shallow breathing, or a knot in your stomach?",
        options: [
          { label: "Almost never", score: 0 },
          { label: "Occasionally", score: 1 },
          { label: "Frequently", score: 2 },
          { label: "Most of the time", score: 3 },
        ],
      },
      {
        text: "Do you find yourself avoiding situations because of how they might make you feel?",
        options: [
          { label: "No, I go about my life normally", score: 0 },
          { label: "Sometimes I'll skip something", score: 1 },
          { label: "I regularly avoid certain things", score: 2 },
          { label: "My world has gotten much smaller because of avoidance", score: 3 },
        ],
      },
      {
        text: "How would you describe your sleep over the past two weeks?",
        options: [
          { label: "I sleep well most nights", score: 0 },
          { label: "It takes me a while to fall asleep sometimes", score: 1 },
          { label: "I wake up often or have trouble falling asleep most nights", score: 2 },
          { label: "Sleep feels nearly impossible", score: 3 },
        ],
      },
      {
        text: "How often do racing thoughts make it hard to concentrate?",
        options: [
          { label: "Rarely", score: 0 },
          { label: "Now and then", score: 1 },
          { label: "Most days", score: 2 },
          { label: "It's constant", score: 3 },
        ],
      },
      {
        text: "Do you feel like you're always waiting for something bad to happen?",
        options: [
          { label: "Not really", score: 0 },
          { label: "Sometimes, in certain situations", score: 1 },
          { label: "Often, even when things are going well", score: 2 },
          { label: "Yes, it's like a background hum that never stops", score: 3 },
        ],
      },
      {
        text: "How often do you feel overwhelmed by everyday tasks?",
        options: [
          { label: "Almost never", score: 0 },
          { label: "When things pile up", score: 1 },
          { label: "Most days feel like too much", score: 2 },
          { label: "Even small things feel impossible", score: 3 },
        ],
      },
      {
        text: "Do you experience sudden spikes of intense fear or panic?",
        options: [
          { label: "No", score: 0 },
          { label: "It's happened once or twice", score: 1 },
          { label: "It happens regularly", score: 2 },
          { label: "Frequently, and it's terrifying", score: 3 },
        ],
      },
      {
        text: "Overall, how much is anxiety affecting your quality of life right now?",
        options: [
          { label: "Minimally", score: 0 },
          { label: "It's noticeable but manageable", score: 1 },
          { label: "It's significantly impacting my life", score: 2 },
          { label: "It feels like it's running my life", score: 3 },
        ],
      },
    ],
    results: [
      {
        range: [0, 7],
        title: "Gentle Waves",
        image: IMAGES.lake,
        message: "Your anxiety seems to be at a manageable level right now. That doesn't mean it's not real or that it doesn't matter. It means you have a good foundation to build on. This is a wonderful time to develop practices that can keep you steady when the waters get rougher.",
        practices: [
          "Daily 5-minute meditation to build your baseline calm",
          "Hands-on-heart breathing when you notice tension creeping in",
          "Gentle walking in nature to keep your nervous system regulated",
          "Gratitude journaling before bed to close the day softly",
        ],
        articles: ["why-your-nervous-system-wont-let-you-relax", "the-polyvagal-ladder-and-what-it-means-for-your-anxiety"],
      },
      {
        range: [8, 15],
        title: "Rising Tides",
        image: IMAGES.forest,
        message: "You're carrying more than a little weight right now, and that takes real courage to acknowledge. Your anxiety is present and it's asking for your attention. The good news is that you're here, you're aware, and awareness is always the first step toward something different.",
        practices: [
          "Butterfly hug technique when anxiety spikes (cross arms, tap alternately)",
          "Box breathing: inhale 4 counts, hold 4, exhale 4, hold 4",
          "Body scan meditation before sleep to release stored tension",
          "Cold water on wrists or face to activate your dive reflex and calm your vagus nerve",
          "Humming or chanting to stimulate vagal tone",
        ],
        articles: ["vagus-nerve-stimulation-without-the-device", "how-your-body-keeps-the-score-of-daily-stress"],
      },
      {
        range: [16, 23],
        title: "Weathering the Storm",
        image: IMAGES.garden,
        message: "This is hard. Really hard. And the fact that you're still showing up, still looking for answers, still trying to understand what's happening in your body and mind says something important about you. Your anxiety is significant right now, and you deserve support that matches what you're going through.",
        practices: [
          "Legs-up-the-wall pose for 10 minutes to activate your parasympathetic nervous system",
          "Extended exhale breathing (inhale 4, exhale 8) to signal safety to your body",
          "Loving-kindness meditation directed toward yourself",
          "Bilateral tapping while repeating a grounding phrase",
          "Warm bath with lavender to soothe your nervous system",
          "Consider speaking with a therapist who understands somatic approaches",
        ],
        articles: ["when-anxiety-becomes-your-identity", "the-window-of-tolerance-and-why-yours-keeps-shrinking"],
      },
      {
        range: [24, 30],
        title: "In the Deep",
        image: IMAGES.ocean,
        message: "We want you to know something: what you're experiencing is real, it's valid, and it doesn't have to stay this way. When anxiety reaches this level, it can feel like there's no way out. But there is. You found this page, which means some part of you still believes that things can change. Trust that part. Please consider reaching out to a mental health professional. You don't have to do this alone.",
        practices: [
          "Place both hands on your heart and breathe slowly. Feel the warmth of your own hands.",
          "The 5-4-3-2-1 grounding technique: name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste",
          "Gentle rocking or swaying to soothe your nervous system like you would a child",
          "Call or text the 988 Suicide & Crisis Lifeline if you're in crisis",
          "Reach out to a trusted person today. Connection is medicine.",
          "Seek professional support from a trauma-informed therapist",
        ],
        articles: ["when-anxiety-becomes-your-identity", "the-window-of-tolerance-and-why-yours-keeps-shrinking"],
      },
    ],
  },

  // ─── 2. Nervous System State Assessment ───
  {
    id: "nervous-system-state",
    title: "Nervous System State Assessment",
    subtitle: "Where is your nervous system right now?",
    description: "Your autonomic nervous system shifts between states throughout the day. Understanding where you are on the polyvagal ladder can help you choose the right practice to bring yourself back toward safety and connection.",
    icon: "Heart",
    questions: [
      {
        text: "Right now, does your body feel more tense or more relaxed?",
        options: [
          { label: "Relaxed and at ease", score: 0 },
          { label: "A little tense but okay", score: 1 },
          { label: "Noticeably tense or tight", score: 2 },
          { label: "Extremely tense, like I can't unclench", score: 3 },
        ],
      },
      {
        text: "How does your breathing feel right now?",
        options: [
          { label: "Slow and easy", score: 0 },
          { label: "Normal, I guess", score: 1 },
          { label: "Shallow or a bit restricted", score: 2 },
          { label: "Tight, fast, or like I can't get enough air", score: 3 },
        ],
      },
      {
        text: "If someone startled you right now, how would you react?",
        options: [
          { label: "I'd recover quickly", score: 0 },
          { label: "I'd be jumpy for a moment", score: 1 },
          { label: "My heart would race for a while", score: 2 },
          { label: "I'd probably freeze or feel panicked", score: 3 },
        ],
      },
      {
        text: "How connected do you feel to the people around you?",
        options: [
          { label: "Warm and connected", score: 0 },
          { label: "Somewhat connected", score: 1 },
          { label: "Disconnected or withdrawn", score: 2 },
          { label: "Completely shut down or numb", score: 3 },
        ],
      },
      {
        text: "What's your energy level like right now?",
        options: [
          { label: "Calm and steady", score: 0 },
          { label: "A bit wired or restless", score: 1 },
          { label: "Either very agitated or very flat", score: 2 },
          { label: "Exhausted, frozen, or completely depleted", score: 3 },
        ],
      },
      {
        text: "How does your gut feel?",
        options: [
          { label: "Fine, no complaints", score: 0 },
          { label: "A little uneasy", score: 1 },
          { label: "Churning, tight, or nauseous", score: 2 },
          { label: "In knots or completely shut down", score: 3 },
        ],
      },
      {
        text: "Can you make eye contact comfortably right now?",
        options: [
          { label: "Yes, easily", score: 0 },
          { label: "With some effort", score: 1 },
          { label: "It feels uncomfortable", score: 2 },
          { label: "I'd rather not look at anyone", score: 3 },
        ],
      },
      {
        text: "How does sound feel to you right now?",
        options: [
          { label: "Normal, background noise is fine", score: 0 },
          { label: "I'm a little more sensitive than usual", score: 1 },
          { label: "Sounds feel louder or more irritating", score: 2 },
          { label: "Everything feels overwhelming or I feel like I'm underwater", score: 3 },
        ],
      },
      {
        text: "If you had to describe your emotional state in one word, which fits best?",
        options: [
          { label: "Peaceful", score: 0 },
          { label: "Uneasy", score: 1 },
          { label: "Anxious or angry", score: 2 },
          { label: "Numb or hopeless", score: 3 },
        ],
      },
      {
        text: "How safe does your body feel right now, regardless of your actual surroundings?",
        options: [
          { label: "Safe and grounded", score: 0 },
          { label: "Mostly safe", score: 1 },
          { label: "On edge, like something could go wrong", score: 2 },
          { label: "Unsafe, even though I know I'm not in danger", score: 3 },
        ],
      },
    ],
    results: [
      {
        range: [0, 7],
        title: "Ventral Vagal: Safe & Connected",
        image: IMAGES.meadow,
        message: "Your nervous system is in its most regulated state right now. You're in what polyvagal theory calls the ventral vagal state, where connection, curiosity, and calm are accessible. This is a great time to build resilience practices that will serve you when things get harder.",
        practices: [
          "Meditation to deepen your baseline calm",
          "Gentle yoga or tai chi to maintain nervous system flexibility",
          "Social connection and meaningful conversation",
          "Creative expression like journaling, art, or music",
        ],
        articles: ["the-polyvagal-ladder-and-what-it-means-for-your-anxiety", "why-your-nervous-system-wont-let-you-relax"],
      },
      {
        range: [8, 15],
        title: "Sympathetic Activation: Fight or Flight",
        image: IMAGES.forest,
        message: "Your nervous system has shifted into a mobilized state. Your body is preparing to fight or flee, even if there's no actual threat. This is your body doing its job, just a little too enthusiastically. The key right now is to send signals of safety back to your body.",
        practices: [
          "Extended exhale breathing (inhale 4, exhale 6-8) to activate your vagus nerve",
          "Humming, singing, or chanting to stimulate vagal tone",
          "Cold water on your face or wrists to trigger the dive reflex",
          "Butterfly hug with slow bilateral tapping",
          "Gentle rocking or swaying movements",
        ],
        articles: ["vagus-nerve-stimulation-without-the-device", "how-your-body-keeps-the-score-of-daily-stress"],
      },
      {
        range: [16, 23],
        title: "Mixed State: Freeze with Agitation",
        image: IMAGES.garden,
        message: "You're in a mixed state where your body is both activated and shutting down at the same time. This can feel like being wired and tired, anxious but unable to move. It's one of the most uncomfortable places to be, and it makes sense that you're struggling. Gentle, titrated movement can help.",
        practices: [
          "Legs-up-the-wall for 10 minutes with hands on your belly",
          "Very gentle movement: slow walking, stretching, or shaking",
          "Place both hands on your heart and whisper kind words to yourself",
          "Warm compress on the back of your neck",
          "Listen to slow, rhythmic music (60 BPM or less)",
          "Consider reaching out to a somatic experiencing practitioner",
        ],
        articles: ["the-window-of-tolerance-and-why-yours-keeps-shrinking", "when-anxiety-becomes-your-identity"],
      },
      {
        range: [24, 30],
        title: "Dorsal Vagal: Shutdown",
        image: IMAGES.ocean,
        message: "Your nervous system has gone into its deepest protective state. You may feel numb, disconnected, or like you're watching life from behind glass. This is not weakness. This is your body's ancient wisdom protecting you from overwhelm. Coming back happens slowly, gently, one small sensation at a time.",
        practices: [
          "Wrap yourself in a heavy blanket and feel its weight",
          "Hold something warm in your hands (a cup of tea, a warm stone)",
          "Gentle rocking, like you would comfort a child",
          "Splash cold water on your face to gently wake your system",
          "Call someone you trust, even if you don't know what to say",
          "Please reach out to a mental health professional. You deserve support.",
        ],
        articles: ["when-anxiety-becomes-your-identity", "the-window-of-tolerance-and-why-yours-keeps-shrinking"],
      },
    ],
  },

  // ─── 3. Sleep & Anxiety Assessment ───
  {
    id: "sleep-anxiety",
    title: "Sleep & Anxiety Assessment",
    subtitle: "How is anxiety affecting your sleep?",
    description: "Sleep and anxiety are deeply intertwined. When one suffers, the other almost always follows. This assessment helps you understand how anxiety is showing up in your sleep patterns so you can find the right practices to break the cycle.",
    icon: "Moon",
    questions: [
      {
        text: "How long does it typically take you to fall asleep?",
        options: [
          { label: "Under 20 minutes", score: 0 },
          { label: "20-45 minutes", score: 1 },
          { label: "45 minutes to an hour", score: 2 },
          { label: "Over an hour, sometimes much longer", score: 3 },
        ],
      },
      {
        text: "Do anxious thoughts increase when you lie down at night?",
        options: [
          { label: "No, my mind settles down", score: 0 },
          { label: "A little, but I can redirect", score: 1 },
          { label: "Yes, my mind starts racing", score: 2 },
          { label: "It's the worst time of day for my anxiety", score: 3 },
        ],
      },
      {
        text: "How often do you wake up in the middle of the night?",
        options: [
          { label: "Rarely", score: 0 },
          { label: "Once or twice, and I fall back asleep", score: 1 },
          { label: "Multiple times, and it takes a while to fall back asleep", score: 2 },
          { label: "I'm up for hours or can't fall back asleep at all", score: 3 },
        ],
      },
      {
        text: "How do you feel when you wake up in the morning?",
        options: [
          { label: "Rested and ready", score: 0 },
          { label: "A little groggy but okay", score: 1 },
          { label: "Tired, like I barely slept", score: 2 },
          { label: "Exhausted, anxious, or dreading the day", score: 3 },
        ],
      },
      {
        text: "Do you have anxious or disturbing dreams?",
        options: [
          { label: "Rarely or never", score: 0 },
          { label: "Occasionally", score: 1 },
          { label: "Frequently", score: 2 },
          { label: "Most nights, and they feel very real", score: 3 },
        ],
      },
      {
        text: "Do you dread bedtime?",
        options: [
          { label: "No, I look forward to it", score: 0 },
          { label: "I'm neutral about it", score: 1 },
          { label: "I put it off because I know I'll struggle", score: 2 },
          { label: "Yes, it's become a source of anxiety itself", score: 3 },
        ],
      },
      {
        text: "How often do you use your phone, TV, or other screens to avoid being alone with your thoughts at night?",
        options: [
          { label: "Rarely", score: 0 },
          { label: "Sometimes", score: 1 },
          { label: "Most nights", score: 2 },
          { label: "Every night, I can't be in silence", score: 3 },
        ],
      },
      {
        text: "Do you experience physical symptoms (racing heart, sweating, muscle tension) when trying to sleep?",
        options: [
          { label: "No", score: 0 },
          { label: "Occasionally", score: 1 },
          { label: "Often", score: 2 },
          { label: "Almost every night", score: 3 },
        ],
      },
      {
        text: "How many hours of actual sleep do you get on a typical night?",
        options: [
          { label: "7-9 hours", score: 0 },
          { label: "5-7 hours", score: 1 },
          { label: "3-5 hours", score: 2 },
          { label: "Less than 3 hours", score: 3 },
        ],
      },
      {
        text: "Has poor sleep made your daytime anxiety worse?",
        options: [
          { label: "My sleep is fine, so no", score: 0 },
          { label: "A little", score: 1 },
          { label: "Significantly", score: 2 },
          { label: "They feed each other in a vicious cycle", score: 3 },
        ],
      },
    ],
    results: [
      {
        range: [0, 7],
        title: "Restful Nights",
        image: IMAGES.lake,
        message: "Your sleep seems to be in a good place. Anxiety isn't significantly disrupting your rest, which is a real gift. Protecting this is worth your attention, because good sleep is one of the strongest buffers against anxiety.",
        practices: [
          "Keep a consistent sleep schedule, even on weekends",
          "5-minute evening meditation to close the day",
          "Hands-on-heart breathing as a bedtime ritual",
          "Limit screens 30 minutes before bed",
        ],
        articles: ["why-your-nervous-system-wont-let-you-relax", "the-polyvagal-ladder-and-what-it-means-for-your-anxiety"],
      },
      {
        range: [8, 15],
        title: "Restless Nights",
        image: IMAGES.forest,
        message: "Anxiety is starting to creep into your sleep. You might not be in crisis, but the pattern is worth paying attention to. Small changes to your evening routine can make a real difference before this becomes a bigger problem.",
        practices: [
          "Yoga nidra (guided sleep meditation) as you fall asleep",
          "4-7-8 breathing: inhale 4, hold 7, exhale 8",
          "Progressive muscle relaxation from toes to head",
          "Lavender aromatherapy on your pillow",
          "Write your worries on paper before bed to externalize them",
        ],
        articles: ["vagus-nerve-stimulation-without-the-device", "how-your-body-keeps-the-score-of-daily-stress"],
      },
      {
        range: [16, 23],
        title: "Troubled Sleep",
        image: IMAGES.garden,
        message: "Sleep has become a real struggle, and the anxiety-sleep cycle is feeding itself. You're probably exhausted, which makes everything harder. Breaking this cycle is possible, but it takes patience and the right tools. You're not failing at sleep. Your nervous system just needs help finding the off switch.",
        practices: [
          "Legs-up-the-wall for 15 minutes before bed",
          "Body scan meditation focused on releasing each body part",
          "Warm bath with Epsom salts 90 minutes before bed",
          "Bilateral tapping while lying in bed",
          "If you can't sleep after 20 minutes, get up and do something calming, then return",
          "Consider a sleep-focused therapist (CBT-I is evidence-based and effective)",
        ],
        articles: ["the-window-of-tolerance-and-why-yours-keeps-shrinking", "when-anxiety-becomes-your-identity"],
      },
      {
        range: [24, 30],
        title: "Sleep in Crisis",
        image: IMAGES.ocean,
        message: "Your sleep is severely disrupted, and that level of sleep deprivation makes everything feel more intense and more hopeless. Please know that this is treatable. You are not broken. Your nervous system is stuck in a protective mode that makes rest feel unsafe. Professional support can help you find your way back to sleep.",
        practices: [
          "Place both hands on your heart. Breathe. You are safe right now.",
          "Weighted blanket to provide deep pressure stimulation",
          "Listen to binaural beats or brown noise",
          "Gentle self-massage on your neck and jaw",
          "Please talk to your doctor about your sleep. This level of disruption deserves medical attention.",
          "988 Suicide & Crisis Lifeline is available 24/7 if you're in distress",
        ],
        articles: ["when-anxiety-becomes-your-identity", "the-window-of-tolerance-and-why-yours-keeps-shrinking"],
      },
    ],
  },

  // ─── 4. Body Awareness & Somatic Check-In ───
  {
    id: "body-awareness",
    title: "Body Awareness & Somatic Check-In",
    subtitle: "How connected are you to your body?",
    description: "Anxiety often lives in the body long before it shows up in our thoughts. This assessment explores your relationship with physical sensation, body awareness, and somatic experience. Understanding this connection is the first step toward whole-body healing.",
    icon: "Scan",
    questions: [
      {
        text: "How aware are you of tension in your body throughout the day?",
        options: [
          { label: "Very aware, I notice and release it regularly", score: 0 },
          { label: "Somewhat aware", score: 1 },
          { label: "I usually don't notice until it becomes pain", score: 2 },
          { label: "I feel disconnected from my body most of the time", score: 3 },
        ],
      },
      {
        text: "Where do you tend to hold stress in your body?",
        options: [
          { label: "I'm not sure, I don't hold much", score: 0 },
          { label: "I know my spots (jaw, shoulders, etc.) and can release them", score: 1 },
          { label: "I hold tension but struggle to release it", score: 2 },
          { label: "My whole body feels like one big knot", score: 3 },
        ],
      },
      {
        text: "How often do you take a moment to check in with how your body feels?",
        options: [
          { label: "Multiple times a day", score: 0 },
          { label: "Once a day or so", score: 1 },
          { label: "Rarely, unless something hurts", score: 2 },
          { label: "Almost never", score: 3 },
        ],
      },
      {
        text: "Can you tell the difference between hunger, anxiety, and excitement in your body?",
        options: [
          { label: "Yes, pretty clearly", score: 0 },
          { label: "Sometimes", score: 1 },
          { label: "They all feel similar", score: 2 },
          { label: "I can't really feel much of anything", score: 3 },
        ],
      },
      {
        text: "How comfortable are you sitting still with no distractions?",
        options: [
          { label: "Very comfortable", score: 0 },
          { label: "I can do it for a few minutes", score: 1 },
          { label: "It makes me anxious", score: 2 },
          { label: "I avoid it completely", score: 3 },
        ],
      },
      {
        text: "Do you ever feel like your body is not quite yours, or like you're watching yourself from outside?",
        options: [
          { label: "No, I feel present in my body", score: 0 },
          { label: "Occasionally, when stressed", score: 1 },
          { label: "Fairly often", score: 2 },
          { label: "Yes, it's a regular experience", score: 3 },
        ],
      },
      {
        text: "How does your body respond to deep breathing exercises?",
        options: [
          { label: "It calms me down noticeably", score: 0 },
          { label: "It helps a little", score: 1 },
          { label: "I find it hard to breathe deeply", score: 2 },
          { label: "It actually makes me more anxious", score: 3 },
        ],
      },
      {
        text: "Do you experience unexplained physical symptoms (headaches, stomach issues, muscle pain) that doctors can't fully explain?",
        options: [
          { label: "No", score: 0 },
          { label: "Occasionally", score: 1 },
          { label: "Frequently", score: 2 },
          { label: "Yes, and it's frustrating", score: 3 },
        ],
      },
      {
        text: "How often do you engage in body-based practices (yoga, stretching, dance, walking)?",
        options: [
          { label: "Regularly, it's part of my routine", score: 0 },
          { label: "A few times a week", score: 1 },
          { label: "Rarely", score: 2 },
          { label: "Almost never", score: 3 },
        ],
      },
      {
        text: "When someone asks 'How are you feeling?', do you know the answer in your body or just in your head?",
        options: [
          { label: "I can feel it in my body", score: 0 },
          { label: "Mostly in my head, but I can tune in", score: 1 },
          { label: "I usually just say 'fine' without checking", score: 2 },
          { label: "I honestly don't know how I feel most of the time", score: 3 },
        ],
      },
    ],
    results: [
      {
        range: [0, 7],
        title: "Embodied & Aware",
        image: IMAGES.meadow,
        message: "You have a strong connection to your body. You can feel what's happening inside, you know how to respond, and you have practices that keep you grounded. This body awareness is one of the most powerful tools for managing anxiety. Keep nurturing it.",
        practices: [
          "Deepen your meditation practice with longer sits",
          "Explore chanting or toning to feel vibration in your body",
          "Try ecstatic dance or free movement",
          "Practice loving-kindness meditation directed at your body",
        ],
        articles: ["the-polyvagal-ladder-and-what-it-means-for-your-anxiety", "vagus-nerve-stimulation-without-the-device"],
      },
      {
        range: [8, 15],
        title: "Growing Awareness",
        image: IMAGES.forest,
        message: "You're developing body awareness, and that's something to feel good about. There are places where the connection is strong and places where it could use some attention. The practices below can help you build a deeper, more consistent relationship with your body.",
        practices: [
          "Daily body scan meditation (even 5 minutes counts)",
          "Butterfly hug when you notice disconnection",
          "Gentle self-massage on your jaw, neck, and shoulders",
          "Walking meditation with attention to each step",
          "Hands-on-heart breathing to reconnect",
        ],
        articles: ["how-your-body-keeps-the-score-of-daily-stress", "vagus-nerve-stimulation-without-the-device"],
      },
      {
        range: [16, 23],
        title: "Disconnected",
        image: IMAGES.garden,
        message: "Your body and mind have become somewhat separated, which is actually a very common response to chronic stress or anxiety. Your body learned to protect you by turning down the volume on sensation. The path back is gentle, gradual, and worth every step.",
        practices: [
          "Start with just 2 minutes of body awareness per day",
          "Hold a warm cup and focus on the sensation in your hands",
          "Gentle rocking or swaying to wake up your vestibular system",
          "Place your feet flat on the ground and notice the contact",
          "Humming to feel vibration in your chest",
          "Consider working with a somatic experiencing practitioner",
        ],
        articles: ["the-window-of-tolerance-and-why-yours-keeps-shrinking", "how-your-body-keeps-the-score-of-daily-stress"],
      },
      {
        range: [24, 30],
        title: "Body Shutdown",
        image: IMAGES.ocean,
        message: "You've become quite disconnected from your body, and that disconnection is itself a form of protection. Your system learned that feeling was too much, so it turned the volume way down. Coming back to your body is possible, but it needs to happen slowly, safely, and ideally with professional support.",
        practices: [
          "Wrap yourself in a blanket and just feel its weight. That's enough for now.",
          "Hold something textured (a stone, a piece of fabric) and notice what you feel",
          "Warm water on your hands, just feeling the temperature",
          "Gentle, slow stretching with no goals",
          "A trauma-informed therapist can help you reconnect safely",
          "You deserve to feel at home in your body again",
        ],
        articles: ["when-anxiety-becomes-your-identity", "the-window-of-tolerance-and-why-yours-keeps-shrinking"],
      },
    ],
  },

  // ─── 5. Self-Compassion & Inner Dialogue Assessment ───
  {
    id: "self-compassion",
    title: "Self-Compassion & Inner Dialogue",
    subtitle: "How do you talk to yourself?",
    description: "The voice inside your head matters more than almost anything else when it comes to anxiety. This assessment explores your relationship with yourself, your inner critic, and your capacity for self-compassion. Because how you treat yourself in your worst moments shapes everything.",
    icon: "HeartHandshake",
    questions: [
      {
        text: "When you make a mistake, what's your first internal response?",
        options: [
          { label: "I'm kind to myself and move on", score: 0 },
          { label: "I'm a little hard on myself but recover quickly", score: 1 },
          { label: "I beat myself up about it for a while", score: 2 },
          { label: "I'm brutal with myself, sometimes for days", score: 3 },
        ],
      },
      {
        text: "How often do you say kind things to yourself?",
        options: [
          { label: "Regularly, it's natural for me", score: 0 },
          { label: "Sometimes, when I remember to", score: 1 },
          { label: "Rarely, it feels awkward", score: 2 },
          { label: "Never, I wouldn't know where to start", score: 3 },
        ],
      },
      {
        text: "When anxiety is at its worst, how do you treat yourself?",
        options: [
          { label: "With patience and understanding", score: 0 },
          { label: "I try to be patient but sometimes get frustrated", score: 1 },
          { label: "I get angry at myself for being anxious", score: 2 },
          { label: "I hate myself for not being able to handle it", score: 3 },
        ],
      },
      {
        text: "Do you believe you deserve to feel better?",
        options: [
          { label: "Yes, absolutely", score: 0 },
          { label: "Most of the time", score: 1 },
          { label: "I'm not sure", score: 2 },
          { label: "Honestly, not really", score: 3 },
        ],
      },
      {
        text: "How would you describe your inner voice most of the time?",
        options: [
          { label: "Supportive and encouraging", score: 0 },
          { label: "Neutral, like a commentator", score: 1 },
          { label: "Critical and demanding", score: 2 },
          { label: "Cruel, like an enemy", score: 3 },
        ],
      },
      {
        text: "Can you accept a compliment without immediately dismissing it?",
        options: [
          { label: "Yes, I can receive it gracefully", score: 0 },
          { label: "I try, but it's uncomfortable", score: 1 },
          { label: "I usually deflect or minimize", score: 2 },
          { label: "I don't believe compliments are real", score: 3 },
        ],
      },
      {
        text: "When you see others struggling with anxiety, how do you feel toward them?",
        options: [
          { label: "Deep compassion", score: 0 },
          { label: "Empathy and understanding", score: 1 },
          { label: "Compassion for them, but not for myself", score: 2 },
          { label: "I judge them the way I judge myself", score: 3 },
        ],
      },
      {
        text: "How often do you compare yourself unfavorably to others?",
        options: [
          { label: "Rarely", score: 0 },
          { label: "Sometimes", score: 1 },
          { label: "Often", score: 2 },
          { label: "Constantly", score: 3 },
        ],
      },
      {
        text: "Do you allow yourself to rest without guilt?",
        options: [
          { label: "Yes, rest is important to me", score: 0 },
          { label: "Usually, though I sometimes feel lazy", score: 1 },
          { label: "I struggle with guilt when I rest", score: 2 },
          { label: "I can't rest without feeling like I'm failing", score: 3 },
        ],
      },
      {
        text: "If your best friend were going through what you're going through, what would you say to them?",
        options: [
          { label: "The same things I say to myself", score: 0 },
          { label: "I'd be kinder to them than I am to myself", score: 1 },
          { label: "Much kinder. I'd never talk to them the way I talk to me.", score: 2 },
          { label: "I can't even imagine being that kind to myself", score: 3 },
        ],
      },
    ],
    results: [
      {
        range: [0, 7],
        title: "Compassionate Heart",
        image: IMAGES.lake,
        message: "You've cultivated a genuinely compassionate relationship with yourself. This is rare and beautiful, and it's one of the strongest protections against anxiety spiraling out of control. Your inner voice is an ally, not an enemy.",
        practices: [
          "Deepen your loving-kindness meditation practice",
          "Share your self-compassion practices with someone who needs them",
          "Explore metta (loving-kindness) chanting",
          "Journal about what you're grateful for about yourself",
        ],
        articles: ["the-polyvagal-ladder-and-what-it-means-for-your-anxiety", "why-your-nervous-system-wont-let-you-relax"],
      },
      {
        range: [8, 15],
        title: "Learning Kindness",
        image: IMAGES.meadow,
        message: "You're on the path toward self-compassion, and that matters more than you might think. You can be kind to yourself sometimes, but the inner critic still has a loud voice. The practices below can help you turn down that volume and turn up the warmth.",
        practices: [
          "Hands-on-heart breathing while saying 'I am enough'",
          "Write yourself a letter from the perspective of your wisest, kindest self",
          "Loving-kindness meditation: 'May I be safe. May I be happy. May I be healthy. May I live with ease.'",
          "Notice when the inner critic speaks and gently say 'Thank you, but I don't need that right now'",
          "Butterfly hug while repeating an affirmation that feels true",
        ],
        articles: ["how-your-body-keeps-the-score-of-daily-stress", "vagus-nerve-stimulation-without-the-device"],
      },
      {
        range: [16, 23],
        title: "The Inner Critic Runs the Show",
        image: IMAGES.garden,
        message: "Your inner critic has become very powerful, and it's making your anxiety worse. Here's what's important to understand: that critical voice developed to protect you. It thought that if it was hard enough on you, it could keep you safe. But it's not working anymore. Learning to soften that voice is some of the most important work you can do.",
        practices: [
          "Name your inner critic. Give it a character. This creates distance.",
          "Place both hands on your heart and say 'This is hard. And I'm doing my best.'",
          "Loving-kindness meditation, even if it feels fake at first",
          "Write down 3 things your body did for you today (breathed, digested, carried you)",
          "Mirror work: look into your own eyes and say something kind",
          "A therapist trained in compassion-focused therapy can help enormously",
        ],
        articles: ["when-anxiety-becomes-your-identity", "the-window-of-tolerance-and-why-yours-keeps-shrinking"],
      },
      {
        range: [24, 30],
        title: "At War with Yourself",
        image: IMAGES.ocean,
        message: "You're carrying a tremendous amount of self-criticism, and it's exhausting. The voice inside your head has become an adversary, and that makes everything, especially anxiety, so much harder to bear. We want you to hear this clearly: you are not the things your inner critic says. You are the one who showed up here, looking for something better. That takes courage.",
        practices: [
          "Just place your hands on your heart. Feel the warmth. That's you, caring for you.",
          "Whisper to yourself: 'I am doing the best I can. And that is enough.'",
          "Hold yourself the way you would hold someone you love",
          "You don't have to believe kind words yet. Just let them exist near you.",
          "Please consider working with a compassion-focused therapist",
          "You deserve the same kindness you would give to anyone else",
        ],
        articles: ["when-anxiety-becomes-your-identity", "the-window-of-tolerance-and-why-yours-keeps-shrinking"],
      },
    ],
  },
];
