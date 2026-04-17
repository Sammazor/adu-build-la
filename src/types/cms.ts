// src/types/cms.ts
import type { Post, PostPlain, ServicePage, SiteSettings, Author } from "./prisma-app";
import type { Section } from "./sections";

// Re-export app-derived Prisma types
export type PostWithAuthor = PostPlain & { author: Author };

// Slim card types for list views
export interface PostCard {
  id: string;
  title: string;
  slug: string;
  fullPath: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  status: string;
  publishedAt: Date | null;
  readingTimeMinutes: number;
  author: { name: string; slug: string };
}

export interface ServiceCard {
  id: string;
  name: string;
  slug: string;
  fullPath: string;
  shortDescription: string | null;
  iconName: string | null;
  heroImageUrl: string | null;
}

// Parsed service page with typed sections
export interface ServicePageWithSections extends Omit<ServicePage, "sections"> {
  sections: Section[];
}

// Parsed post with typed sections
export interface PostWithSections extends Omit<PostPlain, "sections"> {
  sections: Section[];
  author: Author;
}

export type { Post, PostPlain, ServicePage, SiteSettings, Author };
