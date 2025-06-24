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

    // Essential meta tags scoring
    if (metaTags.title) metaTagsScore += 3;
    if (metaTags.description) metaTagsScore += 3;
    if (metaTags.keywords) metaTagsScore += 1;
    if (metaTags.canonical) metaTagsScore += 2;
    if (metaTags.viewport) metaTagsScore += 2;
    if (metaTags.robots) metaTagsScore += 1;

    // Title optimization
    if (metaTags.title) {
      const titleLength = metaTags.title.length;
      if (titleLength >= 50 && titleLength <= 60) metaTagsScore += 2;
      else if (titleLength >= 30 && titleLength <= 70) metaTagsScore += 1;
    }

    // Description optimization
    if (metaTags.description) {
      const descLength = metaTags.description.length;
      if (descLength >= 150 && descLength <= 160) metaTagsScore += 1;
    }

    // Open Graph tags scoring
    if (metaTags.ogTitle) socialTagsScore += 2;
    if (metaTags.ogDescription) socialTagsScore += 2;
    if (metaTags.ogImage) socialTagsScore += 3;
    if (metaTags.ogUrl) socialTagsScore += 1;
    if (metaTags.ogType) socialTagsScore += 1;

    // Twitter Card tags scoring
    if (metaTags.twitterCard) socialTagsScore += 1;
    if (metaTags.twitterTitle) socialTagsScore += 1;
    if (metaTags.twitterDescription) socialTagsScore += 1;

    const metaPercentage = Math.round((metaTagsScore / maxMetaTags) * 100);
    const socialPercentage = Math.round((socialTagsScore / maxSocialTags) * 100);
    const overall = Math.round((metaPercentage + socialPercentage) / 2);

    return {
      overall,
      metaTags: metaTagsScore,
      socialTags: socialTagsScore,
      performance: 'Fast'
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
