import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { SEOAnalyzer } from "./services/seoAnalyzer";
import { z } from "zod";

const seoAnalyzer = new SEOAnalyzer();

const analyzeUrlSchema = z.object({
  url: z.string().url("Please provide a valid URL")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // SEO Analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = analyzeUrlSchema.parse(req.body);
      
      const result = await seoAnalyzer.analyzeUrl(url);
      
      // Store analysis result
      await storage.createSEOAnalysis({
        url: result.url,
        title: result.metaTags.title || null,
        metaDescription: result.metaTags.description || null,
        metaKeywords: result.metaTags.keywords || null,
        canonicalUrl: result.metaTags.canonical || null,
        ogTags: {
          title: result.metaTags.ogTitle,
          description: result.metaTags.ogDescription,
          image: result.metaTags.ogImage,
          url: result.metaTags.ogUrl,
          type: result.metaTags.ogType
        },
        twitterTags: {
          card: result.metaTags.twitterCard,
          title: result.metaTags.twitterTitle,
          description: result.metaTags.twitterDescription,
          image: result.metaTags.twitterImage,
          site: result.metaTags.twitterSite
        },
        overallScore: result.score.overall,
        recommendations: result.recommendations
      });
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors.map(e => e.message)
        });
      }
      
      const message = error instanceof Error ? error.message : "Failed to analyze URL";
      res.status(500).json({ message });
    }
  });

  // Get analysis history
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getSEOAnalyses();
      res.json(analyses);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch analyses";
      res.status(500).json({ message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
