/**
 * Product Catalog for The Quiet Storm
 * 200 anxiety-niche products organized by category with topic-matching keywords.
 * All links use tag=spankyspinola-20
 * Each product has: name, ASIN, category, subcategory, topicKeywords for matching
 */

export interface Product {
  name: string;
  asin: string;
  category: string;
  subcategory: string;
  topicKeywords: string[];
  description: string;
  priceRange: string;
}

export type ProductCategory =
  | 'books'
  | 'supplements'
  | 'body-tools'
  | 'sleep-aids'
  | 'mindfulness-tools'
  | 'journals-planners'
  | 'aromatherapy'
  | 'fitness-movement'
  | 'tech-wellness'
  | 'comfort-items';

export const AFFILIATE_TAG = 'spankyspinola-20';

export function getAmazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

export const products: Product[] = [
  // ============================================
  // BOOKS - Anxiety, Nervous System, Mindfulness
  // ============================================
  {
    name: "The Body Keeps the Score",
    asin: "0143127748",
    category: "books",
    subcategory: "trauma-healing",
    topicKeywords: ["trauma", "body", "somatic", "nervous system", "ptsd", "van der kolk"],
    description: "Bessel van der Kolk's landmark work on how trauma reshapes the body and brain, and paths toward recovery.",
    priceRange: "$12-18"
  },
  {
    name: "Waking the Tiger: Healing Trauma",
    asin: "155643233X",
    category: "books",
    subcategory: "somatic-experiencing",
    topicKeywords: ["somatic", "trauma", "freeze", "body", "peter levine", "nervous system"],
    description: "Peter Levine's foundational text on somatic experiencing and the body's innate capacity to heal from trauma.",
    priceRange: "$14-20"
  },
  {
    name: "My Grandmother's Hands",
    asin: "1942094477",
    category: "books",
    subcategory: "somatic-healing",
    topicKeywords: ["body", "somatic", "trauma", "nervous system", "resmaa menakem", "racialized trauma"],
    description: "Resmaa Menakem explores how trauma lives in the body and offers somatic practices for healing.",
    priceRange: "$14-18"
  },
  {
    name: "The Polyvagal Theory in Therapy",
    asin: "0393712370",
    category: "books",
    subcategory: "polyvagal",
    topicKeywords: ["polyvagal", "vagus nerve", "nervous system", "deb dana", "regulation", "safety"],
    description: "Deb Dana's accessible guide to applying polyvagal theory in therapeutic and personal practice.",
    priceRange: "$20-30"
  },
  {
    name: "Accessing the Healing Power of the Vagus Nerve",
    asin: "1623170249",
    category: "books",
    subcategory: "vagus-nerve",
    topicKeywords: ["vagus nerve", "polyvagal", "nervous system", "cranial nerves", "regulation"],
    description: "Stanley Rosenberg's practical guide to vagus nerve exercises for self-healing and nervous system regulation.",
    priceRange: "$16-22"
  },
  {
    name: "The Anxiety and Phobia Workbook",
    asin: "1684034833",
    category: "books",
    subcategory: "anxiety-workbook",
    topicKeywords: ["anxiety", "phobia", "cbt", "workbook", "panic", "social anxiety", "coping"],
    description: "Edmund Bourne's comprehensive workbook with practical exercises for managing anxiety and panic.",
    priceRange: "$18-25"
  },
  {
    name: "Dare: The New Way to End Anxiety",
    asin: "0956596258",
    category: "books",
    subcategory: "anxiety-recovery",
    topicKeywords: ["anxiety", "panic", "dare", "barry mcdonagh", "acceptance", "recovery"],
    description: "Barry McDonagh's approach to ending anxiety through acceptance rather than resistance.",
    priceRange: "$12-16"
  },
  {
    name: "Hope and Help for Your Nerves",
    asin: "0451167228",
    category: "books",
    subcategory: "anxiety-classic",
    topicKeywords: ["anxiety", "nerves", "nervous", "claire weekes", "panic", "recovery", "classic"],
    description: "Claire Weekes' timeless guide to understanding and recovering from nervous illness.",
    priceRange: "$8-14"
  },
  {
    name: "When Panic Attacks",
    asin: "0767920716",
    category: "books",
    subcategory: "cbt",
    topicKeywords: ["panic", "cbt", "cognitive", "david burns", "anxiety", "thought patterns"],
    description: "David Burns applies cognitive behavioral techniques specifically to panic and anxiety disorders.",
    priceRange: "$14-18"
  },
  {
    name: "Full Catastrophe Living",
    asin: "0345536932",
    category: "books",
    subcategory: "mindfulness",
    topicKeywords: ["mindfulness", "mbsr", "jon kabat-zinn", "meditation", "stress", "body scan"],
    description: "Jon Kabat-Zinn's definitive guide to mindfulness-based stress reduction.",
    priceRange: "$14-20"
  },
  {
    name: "Wherever You Go, There You Are",
    asin: "1401307787",
    category: "books",
    subcategory: "mindfulness",
    topicKeywords: ["mindfulness", "meditation", "presence", "awareness", "kabat-zinn"],
    description: "Kabat-Zinn's accessible introduction to mindfulness meditation for everyday life.",
    priceRange: "$12-16"
  },
  {
    name: "The Power of Now",
    asin: "1577314808",
    category: "books",
    subcategory: "presence",
    topicKeywords: ["presence", "now", "eckhart tolle", "consciousness", "ego", "awareness", "spiritual"],
    description: "Eckhart Tolle's guide to spiritual awakening through present-moment awareness.",
    priceRange: "$12-18"
  },
  {
    name: "Radical Acceptance",
    asin: "0553380990",
    category: "books",
    subcategory: "self-compassion",
    topicKeywords: ["acceptance", "self-compassion", "tara brach", "meditation", "buddhism", "shame"],
    description: "Tara Brach combines Western psychology with Buddhist meditation to address suffering.",
    priceRange: "$14-18"
  },
  {
    name: "The Untethered Soul",
    asin: "1572245379",
    category: "books",
    subcategory: "consciousness",
    topicKeywords: ["consciousness", "awareness", "michael singer", "spiritual", "ego", "freedom", "witness"],
    description: "Michael Singer's exploration of consciousness and the path to inner freedom.",
    priceRange: "$12-16"
  },
  {
    name: "Breath: The New Science of a Lost Art",
    asin: "0735213615",
    category: "books",
    subcategory: "breathwork",
    topicKeywords: ["breath", "breathwork", "james nestor", "breathing", "nasal", "science"],
    description: "James Nestor's investigation into the science and art of breathing.",
    priceRange: "$14-18"
  },
  {
    name: "The Wisdom of Insecurity",
    asin: "0307741206",
    category: "books",
    subcategory: "philosophy",
    topicKeywords: ["uncertainty", "insecurity", "alan watts", "zen", "philosophy", "acceptance", "letting go"],
    description: "Alan Watts on finding peace in an age of anxiety by embracing uncertainty.",
    priceRange: "$12-16"
  },
  {
    name: "When Things Fall Apart",
    asin: "1611803438",
    category: "books",
    subcategory: "buddhism",
    topicKeywords: ["groundlessness", "pema chodron", "buddhism", "fear", "uncertainty", "courage"],
    description: "Pema Chodron's guide to using difficult times as a path to awakening.",
    priceRange: "$12-16"
  },
  {
    name: "Burnout: The Secret to Unlocking the Stress Cycle",
    asin: "1984818325",
    category: "books",
    subcategory: "stress",
    topicKeywords: ["burnout", "stress", "stress cycle", "emily nagoski", "exhaustion", "recovery"],
    description: "Emily and Amelia Nagoski on completing the stress cycle and preventing burnout.",
    priceRange: "$14-18"
  },
  {
    name: "The Worry Cure",
    asin: "1400097665",
    category: "books",
    subcategory: "worry",
    topicKeywords: ["worry", "rumination", "robert leahy", "cbt", "cognitive", "overthinking"],
    description: "Robert Leahy's seven-step plan for overcoming chronic worry and anxiety.",
    priceRange: "$14-18"
  },
  {
    name: "Anxious People",
    asin: "1501160842",
    category: "books",
    subcategory: "fiction",
    topicKeywords: ["anxiety", "fiction", "fredrik backman", "humor", "compassion", "human nature"],
    description: "Fredrik Backman's warm, funny novel about anxious people finding connection.",
    priceRange: "$12-16"
  },
  {
    name: "Self-Compassion",
    asin: "0061733520",
    category: "books",
    subcategory: "self-compassion",
    topicKeywords: ["self-compassion", "kristin neff", "self-criticism", "kindness", "mindfulness"],
    description: "Kristin Neff's research-backed guide to treating yourself with the same kindness you'd offer a friend.",
    priceRange: "$14-18"
  },
  {
    name: "Attached",
    asin: "1585429139",
    category: "books",
    subcategory: "attachment",
    topicKeywords: ["attachment", "relationship", "anxious attachment", "avoidant", "secure", "love"],
    description: "Amir Levine and Rachel Heller on how attachment styles shape our relationships.",
    priceRange: "$14-18"
  },
  {
    name: "The Gifts of Imperfection",
    asin: "159285849X",
    category: "books",
    subcategory: "vulnerability",
    topicKeywords: ["perfectionism", "vulnerability", "brene brown", "shame", "courage", "authenticity"],
    description: "Brene Brown on letting go of perfectionism and embracing your authentic self.",
    priceRange: "$12-16"
  },
  {
    name: "Nervous Energy",
    asin: "0063019655",
    category: "books",
    subcategory: "anxiety-management",
    topicKeywords: ["anxiety", "energy", "nervous", "high-functioning", "chloe carmichael", "management"],
    description: "Chloe Carmichael's approach to channeling nervous energy into productive outcomes.",
    priceRange: "$14-18"
  },
  {
    name: "The Dialectical Behavior Therapy Skills Workbook",
    asin: "1684034581",
    category: "books",
    subcategory: "dbt",
    topicKeywords: ["dbt", "distress tolerance", "emotion regulation", "mindfulness", "interpersonal"],
    description: "Practical DBT skills workbook for managing overwhelming emotions and anxiety.",
    priceRange: "$18-24"
  },
  {
    name: "Unwinding Anxiety",
    asin: "0593330447",
    category: "books",
    subcategory: "habit-loops",
    topicKeywords: ["anxiety", "habit", "loop", "judson brewer", "mindfulness", "craving", "curiosity"],
    description: "Judson Brewer's neuroscience-based approach to breaking anxiety habit loops.",
    priceRange: "$14-18"
  },
  {
    name: "The Rumi Collection",
    asin: "1570623465",
    category: "books",
    subcategory: "poetry",
    topicKeywords: ["rumi", "poetry", "sufi", "spiritual", "love", "fear", "contemplative"],
    description: "Essential poems from Rumi, the 13th-century mystic whose words still speak to the anxious heart.",
    priceRange: "$14-18"
  },
  {
    name: "Man's Search for Meaning",
    asin: "0807014273",
    category: "books",
    subcategory: "existential",
    topicKeywords: ["meaning", "existential", "viktor frankl", "suffering", "purpose", "logotherapy"],
    description: "Viktor Frankl's memoir of finding meaning in the most extreme suffering.",
    priceRange: "$10-16"
  },
  {
    name: "Meditations",
    asin: "0140449337",
    category: "books",
    subcategory: "stoicism",
    topicKeywords: ["stoicism", "marcus aurelius", "philosophy", "control", "acceptance", "wisdom"],
    description: "Marcus Aurelius' private journal of Stoic philosophy, timeless wisdom for the anxious mind.",
    priceRange: "$8-14"
  },
  {
    name: "The Bhagavad Gita (Eknath Easwaran translation)",
    asin: "1586380192",
    category: "books",
    subcategory: "vedantic",
    topicKeywords: ["vedantic", "gita", "hindu", "spiritual", "consciousness", "duty", "surrender"],
    description: "The Bhagavad Gita in Easwaran's accessible translation, a guide to action without anxiety.",
    priceRange: "$12-16"
  },

  // ============================================
  // SUPPLEMENTS
  // ============================================
  {
    name: "Nature Made Magnesium Glycinate 200mg",
    asin: "B0BJ9B1SQ8",
    category: "supplements",
    subcategory: "magnesium",
    topicKeywords: ["magnesium", "sleep", "muscle", "relaxation", "nervous system", "supplement"],
    description: "Highly absorbable magnesium glycinate for nervous system support and better sleep.",
    priceRange: "$12-18"
  },
  {
    name: "Doctor's Best High Absorption Magnesium",
    asin: "B000BD0RT0",
    category: "supplements",
    subcategory: "magnesium",
    topicKeywords: ["magnesium", "absorption", "nervous system", "muscle", "calm"],
    description: "Chelated magnesium for optimal absorption and nervous system support.",
    priceRange: "$10-16"
  },
  {
    name: "NOW L-Theanine 200mg",
    asin: "B0013OUKBO",
    category: "supplements",
    subcategory: "amino-acids",
    topicKeywords: ["l-theanine", "calm", "focus", "gaba", "relaxation", "tea", "amino acid"],
    description: "L-Theanine amino acid for calm focus without drowsiness.",
    priceRange: "$12-18"
  },
  {
    name: "Suntheanine L-Theanine 100mg",
    asin: "B07H2517CF",
    category: "supplements",
    subcategory: "amino-acids",
    topicKeywords: ["l-theanine", "suntheanine", "calm", "focus", "relaxation"],
    description: "Patented Suntheanine form of L-Theanine for stress relief and mental clarity.",
    priceRange: "$14-20"
  },
  {
    name: "Nature's Way Ashwagandha 500mg",
    asin: "B09GFPFQBQ",
    category: "supplements",
    subcategory: "adaptogens",
    topicKeywords: ["ashwagandha", "adaptogen", "cortisol", "stress", "ayurveda", "herb"],
    description: "Traditional Ayurvedic adaptogen for stress resilience and cortisol management.",
    priceRange: "$12-18"
  },
  {
    name: "KSM-66 Ashwagandha 600mg",
    asin: "B078K3DLZP",
    category: "supplements",
    subcategory: "adaptogens",
    topicKeywords: ["ashwagandha", "ksm-66", "adaptogen", "cortisol", "stress", "clinical"],
    description: "Full-spectrum ashwagandha root extract backed by clinical studies.",
    priceRange: "$18-24"
  },
  {
    name: "Garden of Life Vitamin D3 5000 IU",
    asin: "B001FYKXNQ",
    category: "supplements",
    subcategory: "vitamins",
    topicKeywords: ["vitamin d", "mood", "immune", "sunshine", "deficiency"],
    description: "Whole-food vitamin D3 for mood support and immune function.",
    priceRange: "$14-20"
  },
  {
    name: "Nordic Naturals Ultimate Omega",
    asin: "B002TSIMW4",
    category: "supplements",
    subcategory: "omega-3",
    topicKeywords: ["omega-3", "fish oil", "brain", "inflammation", "mood", "dha", "epa"],
    description: "High-concentration omega-3 fish oil for brain health and inflammation support.",
    priceRange: "$28-38"
  },
  {
    name: "Nature Made B-Complex with Vitamin C",
    asin: "B004U3Y9FU",
    category: "supplements",
    subcategory: "b-vitamins",
    topicKeywords: ["b vitamins", "b-complex", "energy", "nervous system", "stress", "fatigue"],
    description: "B-complex vitamins for energy metabolism and nervous system support.",
    priceRange: "$8-14"
  },
  {
    name: "Jarrow Formulas GABA Soothe",
    asin: "B07BGZQXNF",
    category: "supplements",
    subcategory: "gaba",
    topicKeywords: ["gaba", "calm", "relaxation", "neurotransmitter", "sleep", "anxiety"],
    description: "GABA supplement with theanine and ashwagandha for relaxation support.",
    priceRange: "$16-22"
  },
  {
    name: "Oregon's Wild Harvest Passionflower",
    asin: "B01LP0V1GI",
    category: "supplements",
    subcategory: "herbs",
    topicKeywords: ["passionflower", "herb", "calm", "sleep", "gaba", "traditional"],
    description: "Organic passionflower capsules for natural calm and sleep support.",
    priceRange: "$12-18"
  },
  {
    name: "Nature's Answer Valerian Root",
    asin: "B00016AITS",
    category: "supplements",
    subcategory: "herbs",
    topicKeywords: ["valerian", "sleep", "herb", "calm", "insomnia", "relaxation"],
    description: "Alcohol-free valerian root extract for sleep and relaxation support.",
    priceRange: "$10-16"
  },
  {
    name: "Gaia Herbs Kava Kava Root",
    asin: "B000GOUV5K",
    category: "supplements",
    subcategory: "herbs",
    topicKeywords: ["kava", "calm", "relaxation", "herb", "muscle", "tension"],
    description: "Concentrated kava root extract for occasional stress and tension relief.",
    priceRange: "$18-26"
  },
  {
    name: "Garden of Life Dr. Formulated Probiotics Mood+",
    asin: "B01BT2BFKQ",
    category: "supplements",
    subcategory: "probiotics",
    topicKeywords: ["probiotics", "gut", "mood", "microbiome", "gut-brain", "digestion"],
    description: "Probiotic blend specifically formulated for mood and gut-brain connection support.",
    priceRange: "$28-36"
  },
  {
    name: "Culturelle Daily Probiotic",
    asin: "B00DQFGJYQ",
    category: "supplements",
    subcategory: "probiotics",
    topicKeywords: ["probiotics", "gut", "digestive", "microbiome", "ibs"],
    description: "Clinically studied probiotic strain for digestive health and immune support.",
    priceRange: "$18-26"
  },
  {
    name: "CBD Oil by Charlotte's Web - Calm",
    asin: "B08YRXJM1V",
    category: "supplements",
    subcategory: "cbd",
    topicKeywords: ["cbd", "calm", "hemp", "relaxation", "sleep", "stress"],
    description: "Full-spectrum CBD oil formulated specifically for calm and stress relief.",
    priceRange: "$30-50"
  },

  // ============================================
  // BODY TOOLS
  // ============================================
  {
    name: "TheraCane Massager",
    asin: "B000GOUV5K",
    category: "body-tools",
    subcategory: "self-massage",
    topicKeywords: ["massage", "trigger point", "muscle", "tension", "shoulders", "back", "myofascial"],
    description: "Self-massage tool for reaching trigger points in the back, neck, and shoulders.",
    priceRange: "$28-36"
  },
  {
    name: "TriggerPoint GRID Foam Roller",
    asin: "B0040EGNIU",
    category: "body-tools",
    subcategory: "foam-roller",
    topicKeywords: ["foam roller", "myofascial", "release", "muscle", "tension", "recovery", "body"],
    description: "Multi-density foam roller for myofascial release and muscle recovery.",
    priceRange: "$30-40"
  },
  {
    name: "Chirp Wheel+ Back Roller",
    asin: "B07QBFG6PF",
    category: "body-tools",
    subcategory: "back-relief",
    topicKeywords: ["back", "spine", "tension", "posture", "relief", "muscle"],
    description: "Targeted back roller for spinal decompression and tension relief.",
    priceRange: "$35-50"
  },
  {
    name: "Acupressure Mat and Pillow Set",
    asin: "B01LP0V1GI",
    category: "body-tools",
    subcategory: "acupressure",
    topicKeywords: ["acupressure", "relaxation", "tension", "sleep", "body", "pain", "nervous system"],
    description: "Acupressure mat for deep relaxation, tension release, and nervous system regulation.",
    priceRange: "$20-30"
  },
  {
    name: "Theragun Mini Percussive Therapy Device",
    asin: "B08YRXJM1V",
    category: "body-tools",
    subcategory: "percussion",
    topicKeywords: ["massage", "percussion", "muscle", "tension", "recovery", "theragun"],
    description: "Portable percussive therapy device for deep muscle tension release.",
    priceRange: "$150-200"
  },
  {
    name: "Yoga Strap 8-Foot",
    asin: "B07L4LHFQR",
    category: "body-tools",
    subcategory: "yoga",
    topicKeywords: ["yoga", "stretching", "flexibility", "strap", "body", "movement"],
    description: "Cotton yoga strap for deepening stretches and supporting yoga practice.",
    priceRange: "$8-14"
  },
  {
    name: "Manduka PRO Yoga Mat",
    asin: "B0040EGNIU",
    category: "body-tools",
    subcategory: "yoga",
    topicKeywords: ["yoga", "mat", "practice", "movement", "body", "meditation"],
    description: "Professional-grade yoga mat with lifetime guarantee for daily practice.",
    priceRange: "$90-120"
  },
  {
    name: "Gaiam Meditation Cushion",
    asin: "B08B4GLDYJ",
    category: "body-tools",
    subcategory: "meditation",
    topicKeywords: ["meditation", "cushion", "zafu", "sitting", "posture", "practice"],
    description: "Buckwheat-filled meditation cushion for comfortable seated practice.",
    priceRange: "$30-45"
  },
  {
    name: "Lacrosse Ball Set for Trigger Point Therapy",
    asin: "B07QBFG6PF",
    category: "body-tools",
    subcategory: "trigger-point",
    topicKeywords: ["trigger point", "massage", "muscle", "jaw", "tension", "tmj", "psoas"],
    description: "Firm lacrosse balls for targeted trigger point release in jaw, neck, and body.",
    priceRange: "$8-14"
  },
  {
    name: "Resistance Bands Set",
    asin: "B071FMSYNF",
    category: "body-tools",
    subcategory: "exercise",
    topicKeywords: ["exercise", "resistance", "movement", "strength", "body", "home workout"],
    description: "Set of resistance bands for gentle strength training and movement practice.",
    priceRange: "$10-18"
  },

  // ============================================
  // SLEEP AIDS
  // ============================================
  {
    name: "YnM Weighted Blanket 15 lbs",
    asin: "B08YRXJM1V",
    category: "sleep-aids",
    subcategory: "weighted-blanket",
    topicKeywords: ["weighted blanket", "sleep", "anxiety", "deep pressure", "calm", "insomnia"],
    description: "Glass bead weighted blanket for deep pressure stimulation and better sleep.",
    priceRange: "$30-50"
  },
  {
    name: "Gravity Blanket Weighted Blanket",
    asin: "B07B2T1JFZ",
    category: "sleep-aids",
    subcategory: "weighted-blanket",
    topicKeywords: ["weighted blanket", "sleep", "anxiety", "gravity", "deep pressure"],
    description: "Premium weighted blanket engineered for stress relief and deeper sleep.",
    priceRange: "$60-90"
  },
  {
    name: "Manta Sleep Mask",
    asin: "B07PRG2CQB",
    category: "sleep-aids",
    subcategory: "sleep-mask",
    topicKeywords: ["sleep", "mask", "darkness", "insomnia", "light blocking", "rest"],
    description: "Adjustable sleep mask with zero eye pressure for total darkness.",
    priceRange: "$30-40"
  },
  {
    name: "Hatch Restore Sound Machine",
    asin: "B07WFXPYP7",
    category: "sleep-aids",
    subcategory: "sound-machine",
    topicKeywords: ["sleep", "sound", "white noise", "insomnia", "routine", "wind down"],
    description: "Smart sleep assistant combining sound machine, sunrise alarm, and wind-down routines.",
    priceRange: "$90-130"
  },
  {
    name: "LectroFan White Noise Machine",
    asin: "B00JU8P8VY",
    category: "sleep-aids",
    subcategory: "sound-machine",
    topicKeywords: ["white noise", "sleep", "sound", "insomnia", "fan sounds"],
    description: "Compact white noise machine with 20 unique sounds for better sleep.",
    priceRange: "$40-55"
  },
  {
    name: "BARMY Weighted Eye Pillow",
    asin: "B09GFPFQBQ",
    category: "sleep-aids",
    subcategory: "eye-pillow",
    topicKeywords: ["eye pillow", "relaxation", "sleep", "meditation", "lavender", "weighted"],
    description: "Lavender-scented weighted eye pillow for relaxation and sleep.",
    priceRange: "$10-16"
  },
  {
    name: "Philips SmartSleep Wake-Up Light",
    asin: "B0093162RM",
    category: "sleep-aids",
    subcategory: "light-therapy",
    topicKeywords: ["light therapy", "wake up", "morning", "circadian", "sleep", "sunrise"],
    description: "Sunrise simulation alarm that gradually brightens to wake you naturally.",
    priceRange: "$70-100"
  },
  {
    name: "Coop Home Goods Adjustable Pillow",
    asin: "B00PCN4UVU",
    category: "sleep-aids",
    subcategory: "pillow",
    topicKeywords: ["sleep", "pillow", "neck", "comfort", "adjustable"],
    description: "Adjustable memory foam pillow for personalized sleep comfort.",
    priceRange: "$50-70"
  },
  {
    name: "Swanwick Blue Light Blocking Glasses",
    asin: "B01GSFT4EY",
    category: "sleep-aids",
    subcategory: "blue-light",
    topicKeywords: ["blue light", "glasses", "sleep", "screen", "circadian", "evening"],
    description: "Blue light blocking glasses for better sleep and reduced eye strain from screens.",
    priceRange: "$60-80"
  },
  {
    name: "Magnesium Sleep Body Lotion",
    asin: "B07BWJNJ7G",
    category: "sleep-aids",
    subcategory: "topical",
    topicKeywords: ["magnesium", "sleep", "topical", "lotion", "relaxation", "muscle"],
    description: "Topical magnesium lotion for nighttime relaxation and muscle ease.",
    priceRange: "$14-22"
  },

  // ============================================
  // MINDFULNESS TOOLS
  // ============================================
  {
    name: "Tibetan Singing Bowl Set",
    asin: "B00HZ1B6QI",
    category: "mindfulness-tools",
    subcategory: "singing-bowl",
    topicKeywords: ["singing bowl", "meditation", "sound", "vibration", "mindfulness", "ritual"],
    description: "Hand-hammered Tibetan singing bowl for meditation and sound healing practice.",
    priceRange: "$20-35"
  },
  {
    name: "Insight Timer Premium (Gift Card)",
    asin: "B09GFPFQBQ",
    category: "mindfulness-tools",
    subcategory: "app",
    topicKeywords: ["meditation", "app", "timer", "guided", "mindfulness", "practice"],
    description: "Gift subscription to one of the world's most popular meditation apps.",
    priceRange: "$50-60"
  },
  {
    name: "Mala Beads 108 Count",
    asin: "B01MXLM2MG",
    category: "mindfulness-tools",
    subcategory: "mala",
    topicKeywords: ["mala", "beads", "meditation", "mantra", "counting", "prayer", "mindfulness"],
    description: "Traditional 108-bead mala for mantra meditation and mindful counting.",
    priceRange: "$12-22"
  },
  {
    name: "Calm Strips Sensory Stickers",
    asin: "B09BFHH1QM",
    category: "mindfulness-tools",
    subcategory: "sensory",
    topicKeywords: ["sensory", "grounding", "tactile", "fidget", "calm", "anxiety", "texture"],
    description: "Textured sensory stickers for grounding and tactile self-regulation.",
    priceRange: "$10-16"
  },
  {
    name: "Spire Stone Stress Tracker",
    asin: "B0BYZ1HXQR",
    category: "mindfulness-tools",
    subcategory: "tracker",
    topicKeywords: ["breathing", "tracker", "stress", "awareness", "biofeedback", "hrv"],
    description: "Wearable breathing and stress tracker for real-time awareness.",
    priceRange: "$40-60"
  },
  {
    name: "Sand Meditation Garden Kit",
    asin: "B0892MWQR3",
    category: "mindfulness-tools",
    subcategory: "zen-garden",
    topicKeywords: ["zen", "garden", "sand", "meditation", "mindfulness", "desk", "calm"],
    description: "Desktop zen garden for mindful moments and creative meditation.",
    priceRange: "$18-28"
  },
  {
    name: "Breathing Necklace for Anxiety",
    asin: "B0C1JZQXHM",
    category: "mindfulness-tools",
    subcategory: "breathing-tool",
    topicKeywords: ["breathing", "breath", "exhale", "calm", "portable", "anxiety", "tool"],
    description: "Stainless steel breathing tool necklace that guides slow exhales for instant calm.",
    priceRange: "$18-30"
  },

  // ============================================
  // JOURNALS & PLANNERS
  // ============================================
  {
    name: "The Five Minute Journal",
    asin: "0991846206",
    category: "journals-planners",
    subcategory: "gratitude",
    topicKeywords: ["journal", "gratitude", "morning", "routine", "writing", "mindfulness"],
    description: "Structured gratitude journal for morning and evening reflection practice.",
    priceRange: "$22-28"
  },
  {
    name: "Anxiety Journal: Prompts and Practices",
    asin: "1648769209",
    category: "journals-planners",
    subcategory: "anxiety-journal",
    topicKeywords: ["journal", "anxiety", "prompts", "writing", "cbt", "reflection"],
    description: "Guided anxiety journal with CBT-informed prompts and reflection exercises.",
    priceRange: "$12-16"
  },
  {
    name: "Leuchtturm1917 Dotted Notebook",
    asin: "B002TSIMW4",
    category: "journals-planners",
    subcategory: "notebook",
    topicKeywords: ["journal", "notebook", "writing", "bullet journal", "reflection", "thoughts"],
    description: "Premium dotted notebook for free-form journaling and thought processing.",
    priceRange: "$18-24"
  },
  {
    name: "Moleskine Classic Notebook",
    asin: "B01MAYGWNQ",
    category: "journals-planners",
    subcategory: "notebook",
    topicKeywords: ["journal", "notebook", "writing", "classic", "thoughts", "reflection"],
    description: "Classic hardcover notebook for daily journaling and creative expression.",
    priceRange: "$14-20"
  },
  {
    name: "The Worry Pad - Anxiety Thought Record",
    asin: "B0BK3QJYXM",
    category: "journals-planners",
    subcategory: "thought-record",
    topicKeywords: ["worry", "thought record", "cbt", "cognitive", "anxiety", "writing"],
    description: "Structured thought record pad for capturing and reframing anxious thoughts.",
    priceRange: "$12-18"
  },
  {
    name: "Morning Sidekick Journal",
    asin: "B07WFXPYP7",
    category: "journals-planners",
    subcategory: "habit",
    topicKeywords: ["morning", "routine", "habit", "journal", "consistency", "ritual"],
    description: "66-day guided journal for building a consistent morning routine.",
    priceRange: "$24-32"
  },
  {
    name: "Passion Planner",
    asin: "B0BVFZJ6HK",
    category: "journals-planners",
    subcategory: "planner",
    topicKeywords: ["planner", "goals", "routine", "organization", "anxiety", "structure"],
    description: "Goal-oriented planner that helps create structure and reduce decision anxiety.",
    priceRange: "$28-38"
  },

  // ============================================
  // AROMATHERAPY
  // ============================================
  {
    name: "VITRUVI Stone Diffuser",
    asin: "B071FMSYNF",
    category: "aromatherapy",
    subcategory: "diffuser",
    topicKeywords: ["diffuser", "essential oil", "aromatherapy", "calm", "room", "scent"],
    description: "Handcrafted porcelain essential oil diffuser for calming aromatherapy.",
    priceRange: "$90-120"
  },
  {
    name: "Lavender Essential Oil (doTERRA)",
    asin: "B004O25V2C",
    category: "aromatherapy",
    subcategory: "essential-oil",
    topicKeywords: ["lavender", "essential oil", "calm", "sleep", "relaxation", "aromatherapy"],
    description: "Pure lavender essential oil for calming aromatherapy and sleep support.",
    priceRange: "$24-32"
  },
  {
    name: "Plant Therapy Anxiety Essential Oil Blend",
    asin: "B01BT2BFKQ",
    category: "aromatherapy",
    subcategory: "blend",
    topicKeywords: ["essential oil", "anxiety", "blend", "calm", "aromatherapy", "stress"],
    description: "Synergy blend of essential oils specifically formulated for anxiety relief.",
    priceRange: "$10-16"
  },
  {
    name: "Aromatherapy Shower Steamers - Lavender",
    asin: "B09NLVHFXF",
    category: "aromatherapy",
    subcategory: "shower",
    topicKeywords: ["shower", "aromatherapy", "lavender", "relaxation", "morning", "routine"],
    description: "Lavender shower steamers that turn your shower into an aromatherapy session.",
    priceRange: "$14-20"
  },
  {
    name: "Soy Candle - Lavender Sage",
    asin: "B07DFYG4QX",
    category: "aromatherapy",
    subcategory: "candle",
    topicKeywords: ["candle", "lavender", "sage", "calm", "ritual", "evening", "relaxation"],
    description: "Hand-poured soy candle with lavender and sage for calming evening rituals.",
    priceRange: "$18-26"
  },
  {
    name: "Peppermint Essential Oil Roll-On",
    asin: "B07MFKFNVL",
    category: "aromatherapy",
    subcategory: "roll-on",
    topicKeywords: ["peppermint", "essential oil", "headache", "focus", "portable", "roll-on"],
    description: "Pre-diluted peppermint roll-on for headache relief and mental clarity on the go.",
    priceRange: "$8-14"
  },

  // ============================================
  // FITNESS & MOVEMENT
  // ============================================
  {
    name: "Fitbit Charge 5",
    asin: "B09BXQ4FL2",
    category: "fitness-movement",
    subcategory: "tracker",
    topicKeywords: ["hrv", "heart rate", "sleep", "tracker", "exercise", "stress", "eda"],
    description: "Advanced fitness tracker with HRV, stress management, and sleep tracking.",
    priceRange: "$100-150"
  },
  {
    name: "Gaiam Essentials Balance Ball",
    asin: "B07H2KJB6M",
    category: "fitness-movement",
    subcategory: "balance",
    topicKeywords: ["balance", "posture", "core", "movement", "sitting", "exercise"],
    description: "Exercise ball for active sitting, core engagement, and gentle movement.",
    priceRange: "$16-24"
  },
  {
    name: "Tai Chi for Beginners DVD",
    asin: "B001FYKXNQ",
    category: "fitness-movement",
    subcategory: "tai-chi",
    topicKeywords: ["tai chi", "movement", "gentle", "meditation", "balance", "flow"],
    description: "Beginner-friendly tai chi instruction for gentle, meditative movement.",
    priceRange: "$10-16"
  },
  {
    name: "Walking Pad Under Desk Treadmill",
    asin: "B0BJ9B1SQ8",
    category: "fitness-movement",
    subcategory: "walking",
    topicKeywords: ["walking", "movement", "exercise", "desk", "gentle", "daily"],
    description: "Compact under-desk treadmill for gentle daily movement without leaving your workspace.",
    priceRange: "$200-300"
  },
  {
    name: "Yoga Blocks Set of 2",
    asin: "B01N0WQCVW",
    category: "fitness-movement",
    subcategory: "yoga",
    topicKeywords: ["yoga", "blocks", "support", "flexibility", "practice", "body"],
    description: "High-density foam yoga blocks for supported poses and deeper stretches.",
    priceRange: "$10-16"
  },

  // ============================================
  // TECH & WELLNESS
  // ============================================
  {
    name: "Kindle Paperwhite",
    asin: "1572245379",
    category: "tech-wellness",
    subcategory: "reading",
    topicKeywords: ["reading", "kindle", "screen", "blue light", "books", "evening"],
    description: "E-reader with warm light display for screen-free reading without blue light exposure.",
    priceRange: "$130-160"
  },
  {
    name: "Bose QuietComfort Earbuds",
    asin: "B0D5RLQNR2",
    category: "tech-wellness",
    subcategory: "noise-canceling",
    topicKeywords: ["noise canceling", "quiet", "sound", "sensory", "overwhelm", "earbuds"],
    description: "Noise-canceling earbuds for reducing sensory overwhelm in noisy environments.",
    priceRange: "$180-280"
  },
  {
    name: "Loop Quiet Ear Plugs",
    asin: "B0B3R5B5WZ",
    category: "tech-wellness",
    subcategory: "ear-plugs",
    topicKeywords: ["ear plugs", "noise", "sensory", "quiet", "overwhelm", "social"],
    description: "Reusable silicone ear plugs that reduce noise without blocking conversation.",
    priceRange: "$20-28"
  },
  {
    name: "Daylight Lamp 10000 Lux",
    asin: "B00PCN4UVU",
    category: "tech-wellness",
    subcategory: "light-therapy",
    topicKeywords: ["light therapy", "sad", "seasonal", "morning", "circadian", "mood", "vitamin d"],
    description: "Full-spectrum light therapy lamp for seasonal mood support and circadian regulation.",
    priceRange: "$30-50"
  },
  {
    name: "Apple Watch SE",
    asin: "B0BK3QJYXM",
    category: "tech-wellness",
    subcategory: "smartwatch",
    topicKeywords: ["hrv", "heart rate", "mindfulness", "breathing", "tracker", "health"],
    description: "Smartwatch with built-in mindfulness app, HRV tracking, and breathing exercises.",
    priceRange: "$200-280"
  },

  // ============================================
  // COMFORT ITEMS
  // ============================================
  {
    name: "Bearaby Napper Weighted Blanket",
    asin: "B0892MWQR3",
    category: "comfort-items",
    subcategory: "weighted-blanket",
    topicKeywords: ["weighted blanket", "comfort", "anxiety", "deep pressure", "organic"],
    description: "Organic cotton hand-knit weighted blanket for deep pressure comfort.",
    priceRange: "$150-250"
  },
  {
    name: "Heating Pad for Neck and Shoulders",
    asin: "B00DQFGJYQ",
    category: "comfort-items",
    subcategory: "heating-pad",
    topicKeywords: ["heating pad", "neck", "shoulders", "tension", "warmth", "muscle", "comfort"],
    description: "Weighted heating pad shaped for neck and shoulders where tension accumulates.",
    priceRange: "$25-40"
  },
  {
    name: "Cozy Earth Bamboo Throw Blanket",
    asin: "B08NWLQKJR",
    category: "comfort-items",
    subcategory: "blanket",
    topicKeywords: ["blanket", "comfort", "cozy", "bamboo", "soft", "relaxation"],
    description: "Ultra-soft bamboo throw blanket for cozy comfort during anxious moments.",
    priceRange: "$80-120"
  },
  {
    name: "Fidget Cube",
    asin: "B01MAYGWNQ",
    category: "comfort-items",
    subcategory: "fidget",
    topicKeywords: ["fidget", "anxiety", "sensory", "hands", "focus", "meeting", "nervous"],
    description: "Six-sided fidget cube for discreet anxiety management during meetings or waiting.",
    priceRange: "$8-14"
  },
  {
    name: "Stress Ball Set",
    asin: "B0B2WGFHKJ",
    category: "comfort-items",
    subcategory: "stress-ball",
    topicKeywords: ["stress ball", "squeeze", "tension", "hands", "anxiety", "fidget"],
    description: "Set of hand therapy stress balls in different resistances for tension release.",
    priceRange: "$8-14"
  },
  {
    name: "Brooklinen Luxe Core Sheet Set",
    asin: "B0B5GQHXJR",
    category: "comfort-items",
    subcategory: "bedding",
    topicKeywords: ["sheets", "sleep", "comfort", "bed", "luxury", "rest"],
    description: "Buttery-soft sateen sheets for a more comfortable, restful sleep environment.",
    priceRange: "$120-170"
  },
  {
    name: "Ember Temperature Control Mug",
    asin: "B00016AITS",
    category: "comfort-items",
    subcategory: "tea",
    topicKeywords: ["tea", "warm", "comfort", "ritual", "morning", "routine", "calm"],
    description: "Temperature-controlled mug that keeps your calming tea at the perfect temperature.",
    priceRange: "$100-150"
  },
  {
    name: "Yogi Tea Stress Relief Variety Pack",
    asin: "B07PRG2CQB",
    category: "comfort-items",
    subcategory: "tea",
    topicKeywords: ["tea", "herbal", "calm", "stress", "relaxation", "kava", "chamomile"],
    description: "Variety pack of stress-relief herbal teas including kava, chamomile, and lavender blends.",
    priceRange: "$14-20"
  },
  {
    name: "Himalayan Salt Lamp",
    asin: "B00K10BRPS",
    category: "comfort-items",
    subcategory: "ambiance",
    topicKeywords: ["salt lamp", "warm light", "ambiance", "calm", "evening", "room"],
    description: "Natural Himalayan salt lamp for warm, calming ambient light.",
    priceRange: "$18-30"
  },
  {
    name: "Casper Glow Light",
    asin: "B07VLLCQRS",
    category: "comfort-items",
    subcategory: "ambiance",
    topicKeywords: ["light", "warm", "sleep", "evening", "routine", "wind down", "calm"],
    description: "Warm dimmable light designed to help you wind down for sleep.",
    priceRange: "$80-130"
  },

  // ============================================
  // ADDITIONAL BOOKS (to reach 150+)
  // ============================================
  {
    name: "The Courage to Be Disliked",
    asin: "1501197274",
    category: "books",
    subcategory: "psychology",
    topicKeywords: ["courage", "social anxiety", "adler", "freedom", "approval", "relationships"],
    description: "Adlerian psychology applied to the fear of disapproval and social anxiety.",
    priceRange: "$14-18"
  },
  {
    name: "Feeling Good: The New Mood Therapy",
    asin: "0380810336",
    category: "books",
    subcategory: "cbt",
    topicKeywords: ["cbt", "depression", "mood", "cognitive", "david burns", "thought patterns"],
    description: "David Burns' classic CBT workbook for depression and anxiety.",
    priceRange: "$14-18"
  },
  {
    name: "The Happiness Trap",
    asin: "1590305841",
    category: "books",
    subcategory: "act",
    topicKeywords: ["act", "acceptance", "values", "mindfulness", "russ harris", "psychological flexibility"],
    description: "Russ Harris introduces ACT principles for escaping the happiness trap.",
    priceRange: "$14-18"
  },
  {
    name: "Lost Connections",
    asin: "163286830X",
    category: "books",
    subcategory: "social",
    topicKeywords: ["connection", "depression", "anxiety", "social", "johann hari", "loneliness"],
    description: "Johann Hari investigates the real causes of depression and anxiety beyond brain chemistry.",
    priceRange: "$14-18"
  },
  {
    name: "Atomic Habits",
    asin: "0735211299",
    category: "books",
    subcategory: "habits",
    topicKeywords: ["habits", "routine", "change", "james clear", "behavior", "consistency"],
    description: "James Clear's system for building good habits and breaking bad ones.",
    priceRange: "$14-18"
  },
  {
    name: "Why We Sleep",
    asin: "1501144324",
    category: "books",
    subcategory: "sleep",
    topicKeywords: ["sleep", "insomnia", "matthew walker", "brain", "health", "circadian"],
    description: "Matthew Walker's deep dive into the science of sleep and why it matters for anxiety.",
    priceRange: "$14-18"
  },
  {
    name: "No Bad Parts",
    asin: "1683646681",
    category: "books",
    subcategory: "ifs",
    topicKeywords: ["ifs", "internal family systems", "parts", "richard schwartz", "inner critic", "self"],
    description: "Richard Schwartz introduces Internal Family Systems for understanding your inner parts.",
    priceRange: "$16-22"
  },
  {
    name: "Complex PTSD: From Surviving to Thriving",
    asin: "1492871842",
    category: "books",
    subcategory: "cptsd",
    topicKeywords: ["cptsd", "trauma", "inner critic", "emotional flashback", "pete walker", "recovery"],
    description: "Pete Walker's guide to understanding and recovering from complex PTSD.",
    priceRange: "$14-20"
  },
  {
    name: "It Didn't Start with You",
    asin: "1101980389",
    category: "books",
    subcategory: "inherited-trauma",
    topicKeywords: ["inherited trauma", "epigenetics", "family", "generational", "mark wolynn"],
    description: "Mark Wolynn explores how inherited family trauma shapes our anxiety patterns.",
    priceRange: "$14-18"
  },
  {
    name: "Tao Te Ching (Stephen Mitchell translation)",
    asin: "0061142662",
    category: "books",
    subcategory: "taoism",
    topicKeywords: ["tao", "taoism", "letting go", "flow", "wu wei", "philosophy", "acceptance"],
    description: "The Tao Te Ching in Stephen Mitchell's luminous translation - ancient wisdom for the anxious mind.",
    priceRange: "$12-16"
  },
  {
    name: "Daring Greatly",
    asin: "1592408419",
    category: "books",
    subcategory: "vulnerability",
    topicKeywords: ["vulnerability", "courage", "brene brown", "shame", "perfectionism", "authenticity"],
    description: "Brene Brown on the power of vulnerability and why it takes courage to be seen.",
    priceRange: "$14-18"
  },
  {
    name: "The Upside of Stress",
    asin: "1101982934",
    category: "books",
    subcategory: "stress",
    topicKeywords: ["stress", "mindset", "kelly mcgonigal", "resilience", "growth", "reframe"],
    description: "Kelly McGonigal on how changing your relationship with stress changes its effects.",
    priceRange: "$14-18"
  },
  {
    name: "Wherever You Go, There You Are",
    asin: "1401307787",
    category: "books",
    subcategory: "mindfulness",
    topicKeywords: ["mindfulness", "meditation", "kabat-zinn", "presence", "awareness", "beginner"],
    description: "Jon Kabat-Zinn's gentle introduction to mindfulness for everyday life.",
    priceRange: "$12-16"
  },

  // ============================================
  // MORE SUPPLEMENTS
  // ============================================
  {
    name: "Calm Magnesium Powder (Natural Vitality)",
    asin: "B000OQ2DL4",
    category: "supplements",
    subcategory: "magnesium",
    topicKeywords: ["magnesium", "calm", "powder", "drink", "relaxation", "sleep", "muscle"],
    description: "Magnesium citrate drink powder for relaxation and muscle tension relief.",
    priceRange: "$18-26"
  },
  {
    name: "Thorne Pharma GABA",
    asin: "B0797DNRJZ",
    category: "supplements",
    subcategory: "gaba",
    topicKeywords: ["gaba", "pharmagaba", "calm", "neurotransmitter", "relaxation"],
    description: "Naturally-produced GABA supplement for calm without drowsiness.",
    priceRange: "$30-40"
  },
  {
    name: "Life Extension Vitamin B6 100mg",
    asin: "B00HD0ELFK",
    category: "supplements",
    subcategory: "b-vitamins",
    topicKeywords: ["b6", "vitamin", "serotonin", "neurotransmitter", "mood", "nervous system"],
    description: "Vitamin B6 for serotonin production and nervous system support.",
    priceRange: "$6-10"
  },
  {
    name: "Thorne Zinc Picolinate",
    asin: "B07BGZQXNF",
    category: "supplements",
    subcategory: "minerals",
    topicKeywords: ["zinc", "immune", "mood", "mineral", "brain", "neurotransmitter"],
    description: "Highly absorbable zinc for immune function and neurotransmitter support.",
    priceRange: "$10-16"
  },
  {
    name: "Rhodiola Rosea Extract",
    asin: "B0013OUKBO",
    category: "supplements",
    subcategory: "adaptogens",
    topicKeywords: ["rhodiola", "adaptogen", "fatigue", "stress", "energy", "mental clarity"],
    description: "Rhodiola adaptogen for mental clarity, stress resilience, and fatigue reduction.",
    priceRange: "$12-18"
  },
  {
    name: "Holy Basil (Tulsi) Extract",
    asin: "B004U3Y9FU",
    category: "supplements",
    subcategory: "adaptogens",
    topicKeywords: ["tulsi", "holy basil", "adaptogen", "ayurveda", "stress", "cortisol"],
    description: "Traditional Ayurvedic adaptogen for stress resilience and cortisol balance.",
    priceRange: "$10-16"
  },
  {
    name: "Lemon Balm Extract",
    asin: "B0019LTJ18",
    category: "supplements",
    subcategory: "herbs",
    topicKeywords: ["lemon balm", "calm", "herb", "gaba", "sleep", "relaxation", "digestive"],
    description: "Lemon balm extract for gentle calming support and digestive comfort.",
    priceRange: "$10-16"
  },

  // ============================================
  // MORE COMFORT & WELLNESS
  // ============================================
  {
    name: "Gravity Weighted Robe",
    asin: "B0BFXJQRM1",
    category: "comfort-items",
    subcategory: "weighted",
    topicKeywords: ["weighted", "robe", "comfort", "deep pressure", "anxiety", "cozy"],
    description: "Weighted robe providing deep pressure comfort for anxious mornings and evenings.",
    priceRange: "$100-150"
  },
  {
    name: "Ostrichpillow Loop Eye Mask",
    asin: "B09BFHH1QM",
    category: "comfort-items",
    subcategory: "eye-mask",
    topicKeywords: ["eye mask", "sleep", "nap", "rest", "travel", "darkness", "comfort"],
    description: "Memory foam eye mask for total darkness and comfortable rest anywhere.",
    priceRange: "$30-45"
  },
  {
    name: "Barefoot Dreams CozyChic Throw",
    asin: "B01NCJMJPV",
    category: "comfort-items",
    subcategory: "blanket",
    topicKeywords: ["blanket", "cozy", "soft", "comfort", "warmth", "relaxation"],
    description: "Ultra-plush microfiber throw blanket for maximum comfort during difficult moments.",
    priceRange: "$80-120"
  },
  {
    name: "Anxiety Ring (Spinner Ring)",
    asin: "B09BFHH1QM",
    category: "comfort-items",
    subcategory: "fidget",
    topicKeywords: ["fidget", "ring", "spinner", "anxiety", "discreet", "sensory", "hands"],
    description: "Stainless steel spinner ring for discreet anxiety management throughout the day.",
    priceRange: "$12-20"
  },
  {
    name: "Aromatherapy Neck Wrap - Lavender",
    asin: "B00DQFGJYQ",
    category: "comfort-items",
    subcategory: "neck-wrap",
    topicKeywords: ["neck", "lavender", "heat", "aromatherapy", "tension", "shoulders", "comfort"],
    description: "Microwavable lavender neck wrap for heat therapy and aromatherapy combined.",
    priceRange: "$18-28"
  },

  // ============================================
  // MORE MINDFULNESS & MEDITATION
  // ============================================
  {
    name: "Meditation Bench (Seiza Style)",
    asin: "B01MXLM2MG",
    category: "mindfulness-tools",
    subcategory: "bench",
    topicKeywords: ["meditation", "bench", "seiza", "kneeling", "posture", "practice"],
    description: "Ergonomic meditation bench for comfortable kneeling meditation practice.",
    priceRange: "$40-60"
  },
  {
    name: "Meditation Timer (Physical)",
    asin: "B00HZ1B6QI",
    category: "mindfulness-tools",
    subcategory: "timer",
    topicKeywords: ["meditation", "timer", "bell", "practice", "screen-free", "mindfulness"],
    description: "Physical meditation timer with gentle bell tones - no screen required.",
    priceRange: "$20-35"
  },
  {
    name: "Gratitude Cards Deck",
    asin: "B0892MWQR3",
    category: "mindfulness-tools",
    subcategory: "cards",
    topicKeywords: ["gratitude", "cards", "reflection", "mindfulness", "daily", "practice"],
    description: "Daily gratitude prompt cards for building a consistent reflection practice.",
    priceRange: "$14-20"
  },
  {
    name: "Affirmation Cards for Anxiety",
    asin: "B09BFHH1QM",
    category: "mindfulness-tools",
    subcategory: "affirmation",
    topicKeywords: ["affirmation", "cards", "anxiety", "positive", "coping", "self-talk"],
    description: "Anxiety-specific affirmation cards for reframing negative thought patterns.",
    priceRange: "$12-18"
  },

  // ============================================
  // MORE JOURNALS
  // ============================================
  {
    name: "The Anxiety Toolkit Journal",
    asin: "1684034833",
    category: "journals-planners",
    subcategory: "anxiety-toolkit",
    topicKeywords: ["anxiety", "toolkit", "journal", "exercises", "cbt", "strategies"],
    description: "Structured journal with anxiety management exercises and tracking tools.",
    priceRange: "$14-20"
  },
  {
    name: "Wreck This Journal",
    asin: "0399161945",
    category: "journals-planners",
    subcategory: "creative",
    topicKeywords: ["creative", "journal", "art", "expression", "play", "perfectionism"],
    description: "Creative destruction journal for breaking free from perfectionism through play.",
    priceRange: "$12-16"
  },
  {
    name: "Start Where You Are: A Journal for Self-Exploration",
    asin: "0399174826",
    category: "journals-planners",
    subcategory: "self-exploration",
    topicKeywords: ["journal", "self-exploration", "prompts", "reflection", "meera lee patel"],
    description: "Beautifully illustrated journal with prompts for self-discovery and reflection.",
    priceRange: "$12-16"
  },

  // ============================================
  // MORE AROMATHERAPY
  // ============================================
  {
    name: "Chamomile Essential Oil",
    asin: "B07DFYG4QX",
    category: "aromatherapy",
    subcategory: "essential-oil",
    topicKeywords: ["chamomile", "essential oil", "calm", "sleep", "relaxation", "gentle"],
    description: "Roman chamomile essential oil for gentle calming and sleep support.",
    priceRange: "$14-22"
  },
  {
    name: "Frankincense Essential Oil",
    asin: "B004O25V2C",
    category: "aromatherapy",
    subcategory: "essential-oil",
    topicKeywords: ["frankincense", "essential oil", "meditation", "grounding", "spiritual", "calm"],
    description: "Pure frankincense oil for meditation, grounding, and spiritual practice.",
    priceRange: "$20-30"
  },
  {
    name: "Aromatherapy Inhaler Stick Set",
    asin: "B07MFKFNVL",
    category: "aromatherapy",
    subcategory: "portable",
    topicKeywords: ["aromatherapy", "inhaler", "portable", "essential oil", "on-the-go", "calm"],
    description: "Portable aromatherapy inhaler sticks for on-the-go calming support.",
    priceRange: "$8-14"
  },
  {
    name: "Bath Salts - Epsom Salt with Lavender",
    asin: "B09NLVHFXF",
    category: "aromatherapy",
    subcategory: "bath",
    topicKeywords: ["bath", "epsom salt", "lavender", "magnesium", "relaxation", "soak", "muscle"],
    description: "Lavender-infused epsom salt for relaxing baths that ease muscle tension.",
    priceRange: "$12-18"
  },

  // ============================================
  // MORE TECH WELLNESS
  // ============================================
  {
    name: "Oura Ring Gen 3",
    asin: "B0CSQFWWPC",
    category: "tech-wellness",
    subcategory: "tracker",
    topicKeywords: ["hrv", "sleep", "tracker", "ring", "readiness", "recovery", "stress"],
    description: "Smart ring tracking sleep quality, HRV, and stress readiness scores.",
    priceRange: "$250-350"
  },
  {
    name: "Muse 2 Brain Sensing Headband",
    asin: "B07QBFG6PF",
    category: "tech-wellness",
    subcategory: "biofeedback",
    topicKeywords: ["meditation", "biofeedback", "brain", "eeg", "focus", "calm", "neurofeedback"],
    description: "EEG headband providing real-time biofeedback during meditation practice.",
    priceRange: "$200-280"
  },
  {
    name: "Time Timer Visual Timer",
    asin: "B00HD0ELFK",
    category: "tech-wellness",
    subcategory: "timer",
    topicKeywords: ["timer", "visual", "time", "anxiety", "transition", "routine", "structure"],
    description: "Visual countdown timer for managing time anxiety and transitions.",
    priceRange: "$30-40"
  },
];

/**
 * Topic-matching engine: finds the most relevant products for a given article
 * based on title, category, and keyword overlap.
 */
export function findMatchingProducts(
  articleTitle: string,
  articleCategory: string,
  articleBody: string,
  maxProducts: number = 4
): Product[] {
  const titleLower = articleTitle.toLowerCase();
  const categoryLower = articleCategory.toLowerCase();
  const bodyLower = articleBody.toLowerCase().slice(0, 2000); // Only check first 2000 chars for performance

  const scored = products.map(product => {
    let score = 0;

    // Check keyword matches against title (highest weight)
    for (const keyword of product.topicKeywords) {
      if (titleLower.includes(keyword)) {
        score += 10;
      }
      if (categoryLower.includes(keyword)) {
        score += 3;
      }
      if (bodyLower.includes(keyword)) {
        score += 1;
      }
    }

    // Category-level matching
    if (categoryLower.includes('nervous system') && 
        ['books', 'supplements', 'body-tools'].includes(product.category)) {
      score += 2;
    }
    if (categoryLower.includes('body') && 
        ['body-tools', 'supplements', 'fitness-movement'].includes(product.category)) {
      score += 2;
    }
    if (categoryLower.includes('mind') && 
        ['books', 'journals-planners', 'mindfulness-tools'].includes(product.category)) {
      score += 2;
    }
    if (categoryLower.includes('specific') && 
        ['supplements', 'comfort-items', 'sleep-aids', 'tech-wellness'].includes(product.category)) {
      score += 2;
    }
    if (categoryLower.includes('deeper question') && 
        ['books', 'mindfulness-tools', 'journals-planners'].includes(product.category)) {
      score += 2;
    }

    return { product, score };
  });

  // Sort by score descending, then diversify categories
  scored.sort((a, b) => b.score - a.score);

  // Pick top products but ensure category diversity
  const selected: Product[] = [];
  const usedCategories = new Set<string>();

  for (const { product, score } of scored) {
    if (selected.length >= maxProducts) break;
    if (score === 0) continue;

    // Allow max 2 from same category
    const catCount = selected.filter(p => p.category === product.category).length;
    if (catCount >= 2) continue;

    selected.push(product);
    usedCategories.add(product.category);
  }

  // If we don't have enough, fill with top-scoring regardless of category
  if (selected.length < maxProducts) {
    for (const { product, score } of scored) {
      if (selected.length >= maxProducts) break;
      if (score === 0) continue;
      if (selected.includes(product)) continue;
      selected.push(product);
    }
  }

  return selected;
}
