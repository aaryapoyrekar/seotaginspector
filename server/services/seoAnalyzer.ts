import * as cheerio from 'cheerio';
import { MetaTags, SEOScore, SEORecommendation, SEOAnalysisResult } from '@shared/schema';

export class SEOAnalyzer {
  async analyzeUrl(url: string): Promise<SEOAnalysisResult> {
    try {
      const startTime = Date.now();
      
      // Validate URL
      const validUrl = this.validateUrl(url);
      
      // Fetch HTML content
      const html = await this.fetchHtml(validUrl);
      const loadTime = Date.now() - startTime;
      
      // Parse meta tags
      const metaTags = this.extractMetaTags(html);
      
      // Calculate scores
      const score = this.calculateScore(metaTags);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(metaTags);
      
      return {
        url: validUrl,
        metaTags,
        score: {
          ...score,
          performance: loadTime < 2000 ? 'Fast' : loadTime < 4000 ? 'Average' : 'Slow'
        },
        recommendations,
        loadTime
      };
    } catch (error) {
      throw new Error(`Failed to analyze URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Only HTTP and HTTPS protocols are supported');
      }
      return urlObj.toString();
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  private async fetchHtml(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0; +https://seoanalyzer.com)'
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/html')) {
        throw new Error('URL does not return HTML content');
      }

      return await response.text();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch URL: ${error.message}`);
      }
      throw new Error('Failed to fetch URL: Network error');
    }
  }

  private extractMetaTags(html: string): MetaTags {
    const $ = cheerio.load(html);
    
    return {
      title: $('title').first().text().trim() || undefined,
      description: $('meta[name="description"]').attr('content')?.trim() || undefined,
      keywords: $('meta[name="keywords"]').attr('content')?.trim() || undefined,
      canonical: $('link[rel="canonical"]').attr('href')?.trim() || undefined,
      viewport: $('meta[name="viewport"]').attr('content')?.trim() || undefined,
      robots: $('meta[name="robots"]').attr('content')?.trim() || undefined,
      
      // Open Graph tags
      ogTitle: $('meta[property="og:title"]').attr('content')?.trim() || undefined,
      ogDescription: $('meta[property="og:description"]').attr('content')?.trim() || undefined,
      ogImage: $('meta[property="og:image"]').attr('content')?.trim() || undefined,
      ogUrl: $('meta[property="og:url"]').attr('content')?.trim() || undefined,
      ogType: $('meta[property="og:type"]').attr('content')?.trim() || undefined,
      
      // Twitter Card tags
      twitterCard: $('meta[name="twitter:card"]').attr('content')?.trim() || undefined,
      twitterTitle: $('meta[name="twitter:title"]').attr('content')?.trim() || undefined,
      twitterDescription: $('meta[name="twitter:description"]').attr('content')?.trim() || undefined,
      twitterImage: $('meta[name="twitter:image"]').attr('content')?.trim() || undefined,
      twitterSite: $('meta[name="twitter:site"]').attr('content')?.trim() || undefined,
    };
  }

  private calculateScore(metaTags: MetaTags): SEOScore {
    let metaTagsScore = 0;
    let socialTagsScore = 0;
    const maxMetaTags = 15;
    const maxSocialTags = 12;

    // Basic SEO Category Scoring
    let basicSEOScore = 0;
    const maxBasicSEO = 10;
    
    if (metaTags.title) {
      basicSEOScore += 3;
      metaTagsScore += 3;
      const titleLength = metaTags.title.length;
      if (titleLength >= 50 && titleLength <= 60) {
        basicSEOScore += 1;
        metaTagsScore += 2;
      } else if (titleLength >= 30 && titleLength <= 70) {
        metaTagsScore += 1;
      }
    }
    
    if (metaTags.description) {
      basicSEOScore += 3;
      metaTagsScore += 3;
      const descLength = metaTags.description.length;
      if (descLength >= 150 && descLength <= 160) {
        basicSEOScore += 1;
        metaTagsScore += 1;
      }
    }
    
    if (metaTags.keywords) {
      basicSEOScore += 1;
      metaTagsScore += 1;
    }

    // Technical SEO Category Scoring
    let technicalSEOScore = 0;
    const maxTechnicalSEO = 6;
    
    if (metaTags.canonical) {
      technicalSEOScore += 2;
      metaTagsScore += 2;
    }
    if (metaTags.viewport) {
      technicalSEOScore += 2;
      metaTagsScore += 2;
    }
    if (metaTags.robots) {
      technicalSEOScore += 2;
      metaTagsScore += 1;
    }

    // Social SEO Category Scoring
    let socialSEOScore = 0;
    const maxSocialSEO = 12;
    
    if (metaTags.ogTitle) {
      socialSEOScore += 2;
      socialTagsScore += 2;
    }
    if (metaTags.ogDescription) {
      socialSEOScore += 2;
      socialTagsScore += 2;
    }
    if (metaTags.ogImage) {
      socialSEOScore += 3;
      socialTagsScore += 3;
    }
    if (metaTags.ogUrl) {
      socialSEOScore += 1;
      socialTagsScore += 1;
    }
    if (metaTags.ogType) {
      socialSEOScore += 1;
      socialTagsScore += 1;
    }
    if (metaTags.twitterCard) {
      socialSEOScore += 1;
      socialTagsScore += 1;
    }
    if (metaTags.twitterTitle) {
      socialSEOScore += 1;
      socialTagsScore += 1;
    }
    if (metaTags.twitterDescription) {
      socialSEOScore += 1;
      socialTagsScore += 1;
    }

    // Content Optimization Category
    let contentOptScore = 0;
    const maxContentOpt = 8;
    
    if (metaTags.title && metaTags.title.length >= 30 && metaTags.title.length <= 70) {
      contentOptScore += 3;
    }
    if (metaTags.description && metaTags.description.length >= 120 && metaTags.description.length <= 160) {
      contentOptScore += 3;
    }
    if (metaTags.ogTitle && metaTags.title && metaTags.ogTitle !== metaTags.title) {
      contentOptScore += 1;
    }
    if (metaTags.ogDescription && metaTags.description && metaTags.ogDescription !== metaTags.description) {
      contentOptScore += 1;
    }

    const getStatus = (score: number, maxScore: number) => {
      const percentage = (score / maxScore) * 100;
      if (percentage >= 90) return 'excellent';
      if (percentage >= 70) return 'good';
      if (percentage >= 40) return 'needs-work';
      return 'critical';
    };

    const getSummary = (category: string, score: number, maxScore: number) => {
      const percentage = Math.round((score / maxScore) * 100);
      const status = getStatus(score, maxScore);
      
      switch (category) {
        case 'basic':
          if (status === 'excellent') return `Your page has excellent basic SEO foundation with ${percentage}% completion`;
          if (status === 'good') return `Good basic SEO setup, but ${100-percentage}% needs attention`;
          if (status === 'needs-work') return `Basic SEO needs significant improvement (${percentage}% complete)`;
          return `Critical: Basic SEO elements are mostly missing (${percentage}% complete)`;
          
        case 'social':
          if (status === 'excellent') return `Excellent social media optimization (${percentage}% complete)`;
          if (status === 'good') return `Good social sharing setup, minor improvements possible`;
          if (status === 'needs-work') return `Social sharing could be significantly improved`;
          return `Critical: Missing essential social media tags`;
          
        case 'technical':
          if (status === 'excellent') return `Technical SEO is excellently configured`;
          if (status === 'good') return `Good technical foundation with room for improvement`;
          if (status === 'needs-work') return `Technical SEO needs attention for better performance`;
          return `Critical technical SEO issues need immediate attention`;
          
        case 'content':
          if (status === 'excellent') return `Content is well-optimized for search engines`;
          if (status === 'good') return `Content optimization is on track with minor tweaks needed`;
          if (status === 'needs-work') return `Content needs optimization for better search visibility`;
          return `Content requires significant SEO improvements`;
          
        default:
          return `${percentage}% optimized`;
      }
    };

    const metaPercentage = Math.round((metaTagsScore / maxMetaTags) * 100);
    const socialPercentage = Math.round((socialTagsScore / maxSocialTags) * 100);
    const overall = Math.round((metaPercentage + socialPercentage) / 2);

    return {
      overall,
      metaTags: metaTagsScore,
      socialTags: socialTagsScore,
      performance: 'Fast',
      categories: {
        basicSEO: {
          score: basicSEOScore,
          maxScore: maxBasicSEO,
          status: getStatus(basicSEOScore, maxBasicSEO),
          summary: getSummary('basic', basicSEOScore, maxBasicSEO)
        },
        socialSEO: {
          score: socialSEOScore,
          maxScore: maxSocialSEO,
          status: getStatus(socialSEOScore, maxSocialSEO),
          summary: getSummary('social', socialSEOScore, maxSocialSEO)
        },
        technicalSEO: {
          score: technicalSEOScore,
          maxScore: maxTechnicalSEO,
          status: getStatus(technicalSEOScore, maxTechnicalSEO),
          summary: getSummary('technical', technicalSEOScore, maxTechnicalSEO)
        },
        contentOptimization: {
          score: contentOptScore,
          maxScore: maxContentOpt,
          status: getStatus(contentOptScore, maxContentOpt),
          summary: getSummary('content', contentOptScore, maxContentOpt)
        }
      }
    };
  }

  private generateRecommendations(metaTags: MetaTags): SEORecommendation[] {
    const recommendations: SEORecommendation[] = [];

    // Title recommendations
    if (!metaTags.title) {
      recommendations.push({
        type: 'error',
        priority: 'high',
        title: 'Missing Title Tag',
        description: 'Add a descriptive title tag to improve search engine visibility.',
        field: 'title'
      });
    } else {
      const titleLength = metaTags.title.length;
      if (titleLength < 30 || titleLength > 70) {
        recommendations.push({
          type: 'warning',
          priority: 'medium',
          title: 'Optimize Title Length',
          description: 'Title should be 50-60 characters for optimal display in search results.',
          field: 'title'
        });
      }
    }

    // Meta description recommendations
    if (!metaTags.description) {
      recommendations.push({
        type: 'error',
        priority: 'high',
        title: 'Missing Meta Description',
        description: 'Add a meta description to improve click-through rates from search results.',
        field: 'description'
      });
    } else {
      const descLength = metaTags.description.length;
      if (descLength < 120 || descLength > 160) {
        recommendations.push({
          type: 'warning',
          priority: 'medium',
          title: 'Optimize Meta Description Length',
          description: 'Meta description should be 150-160 characters for optimal display.',
          field: 'description'
        });
      }
    }

    // Open Graph recommendations
    if (!metaTags.ogImage) {
      recommendations.push({
        type: 'error',
        priority: 'high',
        title: 'Add Open Graph Image',
        description: 'Include an og:image meta tag for better social media sharing. Recommended size: 1200x630px.',
        field: 'ogImage'
      });
    }

    if (!metaTags.ogTitle) {
      recommendations.push({
        type: 'warning',
        priority: 'medium',
        title: 'Add Open Graph Title',
        description: 'Include og:title for better social media preview appearance.',
        field: 'ogTitle'
      });
    }

    // Twitter Card recommendations
    if (!metaTags.twitterCard) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        title: 'Add Twitter Card Tags',
        description: 'Include Twitter-specific meta tags for enhanced Twitter sharing appearance.',
        field: 'twitterCard'
      });
    }

    // Canonical URL recommendations
    if (!metaTags.canonical) {
      recommendations.push({
        type: 'warning',
        priority: 'medium',
        title: 'Add Canonical URL',
        description: 'Include a canonical URL to prevent duplicate content issues.',
        field: 'canonical'
      });
    }

    return recommendations;
  }
}
