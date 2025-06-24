import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SEOAnalysisResult } from "@shared/schema";
import URLAnalysisForm from "@/components/URLAnalysisForm";
import SEOScoreDashboard from "@/components/SEOScoreDashboard";
import CategoryScoreCards from "@/components/CategoryScoreCards";
import VisualSummaryCards from "@/components/VisualSummaryCards";
import MetaTagsAnalysis from "@/components/MetaTagsAnalysis";
import SEORecommendations from "@/components/SEORecommendations";
import GoogleSearchPreview from "@/components/GoogleSearchPreview";
import SocialMediaPreviews from "@/components/SocialMediaPreviews";
import QuickActions from "@/components/QuickActions";
import { Search, Shield, HelpCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SEOAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<SEOAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json() as Promise<SEOAnalysisResult>;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: "SEO analysis has been completed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  const handleExportReport = () => {
    if (!analysisResult) return;
    
    // Create a simple text report for now
    const report = `
SEO Analysis Report
==================
URL: ${analysisResult.url}
Overall Score: ${analysisResult.score.overall}/100
Meta Tags Score: ${analysisResult.score.metaTags}/15
Social Tags Score: ${analysisResult.score.socialTags}/12
Performance: ${analysisResult.score.performance}

Title: ${analysisResult.metaTags.title || 'Not found'}
Description: ${analysisResult.metaTags.description || 'Not found'}
Keywords: ${analysisResult.metaTags.keywords || 'Not found'}

Recommendations:
${analysisResult.recommendations.map(rec => `- ${rec.title}: ${rec.description}`).join('\n')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "SEO report has been downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">SEO Analyzer</h1>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Meta Tag Analysis Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <HelpCircle size={18} />
              </Button>
              <Button 
                onClick={handleExportReport}
                disabled={!analysisResult}
                className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4"
                size="sm"
              >
                <Download className="mr-1 sm:mr-2" size={14} />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* URL Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-lg font-semibold text-slate-900">Website Analysis</h2>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Shield className="text-green-500" size={16} />
              <span>Secure Analysis</span>
            </div>
          </div>
          
          <URLAnalysisForm 
            onAnalyze={handleAnalyze} 
            isLoading={analyzeMutation.isPending}
          />
        </div>

        {analysisResult && (
          <>
            {/* SEO Score Overview */}
            <SEOScoreDashboard 
              score={analysisResult.score}
              loadTime={analysisResult.loadTime}
              recommendations={analysisResult.recommendations}
            />

            {/* Visual Summary Cards - At-a-glance view */}
            <VisualSummaryCards analysisResult={analysisResult} />

            {/* Category Score Cards */}
            <CategoryScoreCards score={analysisResult.score} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Meta Tags Analysis */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <MetaTagsAnalysis metaTags={analysisResult.metaTags} />
                <SEORecommendations recommendations={analysisResult.recommendations} />
              </div>

              {/* Right Column - Previews */}
              <div className="space-y-4 sm:space-y-6">
                <GoogleSearchPreview 
                  url={analysisResult.url}
                  title={analysisResult.metaTags.title}
                  description={analysisResult.metaTags.description}
                />
                <SocialMediaPreviews metaTags={analysisResult.metaTags} />
                <QuickActions 
                  onExportReport={handleExportReport}
                  hasResults={!!analysisResult}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Loading Overlay */}
      {analyzeMutation.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Analyzing Website</h3>
              <p className="text-sm text-slate-600">Fetching and analyzing SEO data...</p>
              <div className="mt-4">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
