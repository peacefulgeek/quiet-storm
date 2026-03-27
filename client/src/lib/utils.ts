import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Article } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterPublished(articles: Article[]): Article[] {
  const now = new Date();
  return articles.filter(a => new Date(a.dateISO) <= now);
}

export function sortByDate(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
}

export function getReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 250);
}

export function formatDate(dateISO: string): string {
  const d = new Date(dateISO);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getArticlesByCategory(articles: Article[], categorySlug: string): Article[] {
  return articles.filter(a => a.categorySlug === categorySlug);
}

export function getPublishedCount(articles: Article[]): number {
  return filterPublished(articles).length;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
