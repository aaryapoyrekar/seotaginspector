import { SEOAnalysisResult } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, Search, Share2, Monitor, FileText, TrendingUp, Clock } from "lucide-react";

interface VisualSummaryCardsProps {
  analysisResult: SEOAnalysisResult;
}

export default function VisualSummaryCards({ analysisResult }: VisualSummaryCardsProps) {
  const { metaTags, score, recommendations, loadTime } = analysisResult;

  // Calculate summary metrics
  const totalIssues = recommendations.filter(r => r.type === 'error').length;
  const totalWarnings = recommendations.filter(r => r.type === 'warning').length;
  const totalOpportunities = recommendations.filter(r => r.type === 'success').length;

  // Essential tags present
  const essentialTags = [
    { name: 'Title', present: !!metaTags.title, optimal: metaTags.title && metaTags.title.length >= 30 && metaTags.title.length <= 70 },
    { name: 'Description', present: !!metaTags.description, optimal: metaTags.description && metaTags.description.length >= 120 && metaTags.description.length <= 160 },
    { name: 'OG Image', present: !!metaTags.ogImage, optimal: !!metaTags.ogImage },
    { name: 'Canonical', present: !!metaTags.canonical, optimal: !!metaTags.canonical }
  ];

  const essentialPresent = essentialTags.filter(tag => tag.present).length;
  const essentialOptimal = essentialTags.filter(tag => tag.optimal).length;

  // Social media readiness
  const socialTags = [metaTags.ogTitle, metaTags.ogDescription, metaTags.ogImage, metaTags.ogUrl, metaTags.ogType].filter(Boolean).length;
  const twitterTags = [metaTags.twitterCard, metaTags.twitterTitle, metaTags.twitterDescription, metaTags.twitterImage].filter(Boolean).length;

  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-amber-600" size={16} />;
      case 'error':
        return <XCircle className="text-red-600" size={16} />;
    }
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* SEO Health Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="text-blue-600 mr-2" size={20} />
            SEO Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{score.overall}/100</span>
              {getStatusIcon(getScoreStatus(score.overall))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Critical Issues</span>
                <Badge variant={totalIssues > 0 ? "destructive" : "secondary"} className="text-xs">
                  {totalIssues}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Warnings</span>
                <Badge variant={totalWarnings > 0 ? "secondary" : "secondary"} className="text-xs bg-amber-100 text-amber-700">
                  {totalWarnings}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Opportunities</span>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  {totalOpportunities}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Essential Tags Status */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <FileText className="text-green-600 mr-2" size={20} />
            Essential Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{essentialPresent}/4</span>
              {getStatusIcon(essentialPresent >= 3 ? 'good' : essentialPresent >= 2 ? 'warning' : 'error')}
            </div>
            
            <div className="space-y-2">
              {essentialTags.map((tag, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">{tag.name}</span>
                  <div className="flex items-center space-x-1">
                    {tag.present ? (
                      tag.optimal ? (
                        <CheckCircle className="text-green-600" size={12} />
                      ) : (
                        <AlertTriangle className="text-amber-600" size={12} />
                      )
                    ) : (
                      <XCircle className="text-red-600" size={12} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Readiness */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Share2 className="text-purple-600 mr-2" size={20} />
            Social Ready
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{Math.round(((socialTags + twitterTags) / 9) * 100)}%</span>
              {getStatusIcon(socialTags >= 4 ? 'good' : socialTags >= 2 ? 'warning' : 'error')}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Open Graph</span>
                <Badge variant="secondary" className="text-xs">
                  {socialTags}/5
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Twitter Cards</span>
                <Badge variant="secondary" className="text-xs">
                  {twitterTags}/4
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {socialTags >= 4 ? 'Ready for social sharing' : 'Needs social optimization'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Performance */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Monitor className="text-amber-600 mr-2" size={20} />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{score.performance}</span>
              {loadTime && getStatusIcon(loadTime < 2000 ? 'good' : loadTime < 4000 ? 'warning' : 'error')}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Load Time</span>
                <span className="font-semibold">
                  {loadTime ? `${(loadTime / 1000).toFixed(1)}s` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Technical SEO</span>
                <Badge variant="secondary" className="text-xs">
                  {score.categories.technicalSEO.score}/{score.categories.technicalSEO.maxScore}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {loadTime && loadTime < 2000 ? 'Excellent speed' : 'Room for improvement'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Visibility */}
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Search className="text-cyan-600 mr-2" size={20} />
            Search Visibility  
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {Math.round((score.categories.basicSEO.score / score.categories.basicSEO.maxScore) * 100)}%
              </span>
              {getStatusIcon(score.categories.basicSEO.status === 'excellent' || score.categories.basicSEO.status === 'good' ? 'good' : 
                             score.categories.basicSEO.status === 'needs-work' ? 'warning' : 'error')}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Title Optimization</span>
                {metaTags.title ? (
                  metaTags.title.length >= 30 && metaTags.title.length <= 70 ? 
                    <CheckCircle className="text-green-600" size={16} /> :
                    <AlertTriangle className="text-amber-600" size={16} />
                ) : (
                  <XCircle className="text-red-600" size={16} />
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Meta Description</span>
                {metaTags.description ? (
                  metaTags.description.length >= 120 && metaTags.description.length <= 160 ? 
                    <CheckCircle className="text-green-600" size={16} /> :
                    <AlertTriangle className="text-amber-600" size={16} />
                ) : (
                  <XCircle className="text-red-600" size={16} />
                )}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {score.categories.basicSEO.status === 'excellent' ? 'Highly optimized for search' : 'Needs optimization'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Quality */}
      <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Clock className="text-rose-600 mr-2" size={20} />
            Content Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {Math.round((score.categories.contentOptimization.score / score.categories.contentOptimization.maxScore) * 100)}%
              </span>
              {getStatusIcon(score.categories.contentOptimization.status === 'excellent' || score.categories.contentOptimization.status === 'good' ? 'good' : 
                             score.categories.contentOptimization.status === 'needs-work' ? 'warning' : 'error')}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Title Length</span>
                <span className="text-xs">
                  {metaTags.title ? `${metaTags.title.length} chars` : 'Missing'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Description Length</span>
                <span className="text-xs">
                  {metaTags.description ? `${metaTags.description.length} chars` : 'Missing'}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {score.categories.contentOptimization.status === 'excellent' ? 'Well-optimized content' : 'Content needs work'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}