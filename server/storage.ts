import { users, seoAnalyses, type User, type InsertUser, type SEOAnalysis, type InsertSEOAnalysis } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSEOAnalysis(analysis: InsertSEOAnalysis): Promise<SEOAnalysis>;
  getSEOAnalyses(limit?: number): Promise<SEOAnalysis[]>;
  getSEOAnalysisByUrl(url: string): Promise<SEOAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private seoAnalyses: Map<number, SEOAnalysis>;
  private currentUserId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.seoAnalyses = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSEOAnalysis(insertAnalysis: InsertSEOAnalysis): Promise<SEOAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: SEOAnalysis = { 
      id, 
      analyzedAt: new Date(),
      url: insertAnalysis.url,
      title: insertAnalysis.title || null,
      metaDescription: insertAnalysis.metaDescription || null,
      metaKeywords: insertAnalysis.metaKeywords || null,
      canonicalUrl: insertAnalysis.canonicalUrl || null,
      ogTags: insertAnalysis.ogTags || null,
      twitterTags: insertAnalysis.twitterTags || null,
      overallScore: insertAnalysis.overallScore || null,
      recommendations: insertAnalysis.recommendations || null
    };
    this.seoAnalyses.set(id, analysis);
    return analysis;
  }

  async getSEOAnalyses(limit: number = 50): Promise<SEOAnalysis[]> {
    const analyses = Array.from(this.seoAnalyses.values())
      .sort((a, b) => (b.analyzedAt?.getTime() || 0) - (a.analyzedAt?.getTime() || 0))
      .slice(0, limit);
    return analyses;
  }

  async getSEOAnalysisByUrl(url: string): Promise<SEOAnalysis | undefined> {
    return Array.from(this.seoAnalyses.values()).find(
      (analysis) => analysis.url === url,
    );
  }
}

export const storage = new MemStorage();
