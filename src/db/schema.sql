-- Quiet Storm — PostgreSQL schema for Render deployment
-- Run via: node scripts/migrate.mjs

-- Articles table — stores all article content
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  category_slug TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  date_iso TEXT NOT NULL DEFAULT '',
  date_human TEXT NOT NULL DEFAULT '',
  reading_time TEXT NOT NULL DEFAULT '',
  hero_image_url TEXT NOT NULL DEFAULT '',
  hero_alt TEXT NOT NULL DEFAULT '',
  og_image TEXT NOT NULL DEFAULT '',
  opener_type TEXT NOT NULL DEFAULT '',
  faq_count INTEGER NOT NULL DEFAULT 0,
  faqs JSONB NOT NULL DEFAULT '[]',
  backlink_type TEXT NOT NULL DEFAULT '',
  conclusion_type TEXT NOT NULL DEFAULT '',
  named_references TEXT[] NOT NULL DEFAULT '{}',
  voice_phrases TEXT[] NOT NULL DEFAULT '{}',
  internal_links TEXT[] NOT NULL DEFAULT '{}',
  has_affiliate_links BOOLEAN NOT NULL DEFAULT false,
  asins_used TEXT[] NOT NULL DEFAULT '{}',
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_refreshed_30d TIMESTAMPTZ,
  last_refreshed_90d TIMESTAMPTZ
);

-- Verified ASINs catalog
CREATE TABLE IF NOT EXISTS verified_asins (
  asin CHAR(10) PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'valid',
  last_checked TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Failed ASINs tracking
CREATE TABLE IF NOT EXISTS failed_asins (
  asin CHAR(10) PRIMARY KEY,
  reason TEXT NOT NULL,
  last_attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attempts INTEGER NOT NULL DEFAULT 1
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category_slug ON articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_last_refreshed_30d ON articles(last_refreshed_30d);
CREATE INDEX IF NOT EXISTS idx_articles_last_refreshed_90d ON articles(last_refreshed_90d);
CREATE INDEX IF NOT EXISTS idx_verified_asins_status ON verified_asins(status);
CREATE INDEX IF NOT EXISTS idx_verified_asins_last_checked ON verified_asins(last_checked);
