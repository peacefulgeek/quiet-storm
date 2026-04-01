export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  categorySlug: string;
  dateISO: string;
  dateHuman: string;
  readingTime: number;
  heroImage: string;
  heroAlt: string;
  ogImage: string;
  openerType: 'scene-setting' | 'provocation' | 'first-person' | 'question' | 'named-reference' | 'gut-punch';
  faqCount: number;
  faqs: { question: string; answer: string }[];
  backlinkType: 'kalesh' | 'external' | 'internal' | 'product' | 'intermediary' | 'org-nofollow' | 'internal-only';
  conclusionType: 'challenge' | 'tender';
  namedReferences: string[];
  voicePhrases: number[];
  internalLinks: string[];
  hasAffiliateLinks?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  metaDescription: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "the-nervous-system",
    name: "The Nervous System",
    description: "Understanding the architecture of your anxiety through the lens of polyvagal theory, vagus nerve function, and the neuroscience of fear responses.",
    metaDescription: "Explore how your nervous system drives anxiety — polyvagal theory, vagus nerve, fight-or-flight, and evidence-based somatic approaches to regulation."
  },
  {
    slug: "the-body",
    name: "The Body",
    description: "Your body holds what your mind tries to file away. Somatic approaches, breathwork, movement, and the gut-brain connection.",
    metaDescription: "Anxiety lives in the body. Discover somatic experiencing, breathwork, movement practices, and gut-brain science for embodied healing."
  },
  {
    slug: "the-mind",
    name: "The Mind",
    description: "Cognitive patterns, thought loops, rumination, and the contemplative traditions that offer a way through — not around — anxious thinking.",
    metaDescription: "Break free from anxious thought loops with evidence-based cognitive approaches, mindfulness practices, and contemplative wisdom traditions."
  },
  {
    slug: "the-specific",
    name: "The Specific",
    description: "Social anxiety, health anxiety, panic attacks, insomnia, medication, and the particular shapes anxiety takes in daily life.",
    metaDescription: "Targeted guidance for specific anxiety types — social anxiety, panic attacks, health anxiety, insomnia, medication, and daily coping strategies."
  },
  {
    slug: "the-deeper-question",
    name: "The Deeper Question",
    description: "What if anxiety is not a malfunction but a signal? Vedantic philosophy, ego dissolution, and the spiritual dimensions of uncertainty.",
    metaDescription: "Explore anxiety as a spiritual doorway — Vedantic philosophy, ego dissolution, uncertainty as teacher, and the deeper meaning of your restlessness."
  }
];

export const SITE_CONFIG = {
  title: "The Quiet Storm",
  subtitle: "Reclaiming Your Life from Anxiety",
  tagline: "Your nervous system is screaming. Time to listen — and respond.",
  domain: "quietstorm.love",
  editorialName: "The Quiet Storm Editorial",
  author: "Kalesh",
  authorTitle: "Consciousness Teacher & Writer",
  authorBio: "Kalesh is a consciousness teacher and writer whose work explores the intersection of ancient contemplative traditions and modern neuroscience. With decades of practice in meditation, breathwork, and somatic inquiry, he guides others toward embodied awareness.",
  authorLink: "https://kalesh.love",
  authorLinkText: "Visit Kalesh's Website",
  authorImage: "https://quiet-storm.b-cdn.net/images/kalesh-author.webp",
};
