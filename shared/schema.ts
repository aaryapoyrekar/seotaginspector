import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  canonicalUrl: text("canonical_url"),
  ogTags: jsonb("og_tags"),
  twitterTags: jsonb("twitter_tags"),
  overallScore: integer("overall_score"),
  recommendations: jsonb("recommendations"),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSEOAnalysisSchema = createInsertSchema(seoAnalyses).omit({
  id: true,
  analyzedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSEOAnalysis = z.infer<typeof insertSEOAnalysisSchema>;
export type SEOAnalysis = typeof seoAnalyses.$inferSelect;

export interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  viewport?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
}

export interface SEOScore {
  overall: number;
  metaTags: number;
  socialTags: number;
  performance: string;
}

export interface SEORecommendation {
  type: 'error' | 'warning' | 'success';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  field?: string;
}

export interface SEOAnalysisResult {
  url: string;
  metaTags: MetaTags;
  score: SEOScore;
  recommendations: SEORecommendation[];
  loadTime?: number;
}
