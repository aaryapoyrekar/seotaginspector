import { SEOScore, SEORecommendation } from "@shared/schema";
import { TrendingUp, Tags, Share, Gauge } from "lucide-react";

interface SEOScoreDashboardProps {
  score: SEOScore;
  loadTime?: number;
  recommendations: SEORecommendation[];
}

export default function SEOScoreDashboard({ score, loadTime, recommendations }: SEOScoreDashboardProps) {
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return "text-green-600";
    if (scoreValue >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBgColor = (scoreValue: number) => {
    if (scoreValue >= 80) return "bg-green-100";
    if (scoreValue >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  const getProgressColor = (scoreValue: number) => {
    if (scoreValue >= 80) return "bg-green-600";
    if (scoreValue >= 60) return "bg-amber-600";
    return "bg-red-600";
  };

  const missingTags = 15 - score.metaTags;
  const socialRecommendations = recommendations.filter(r => 
    r.field?.includes('og') || r.field?.includes('twitter')
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col items-center text-center">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getScoreBgColor(score.overall)} rounded-full flex items-center justify-center mb-3`}>
            <TrendingUp className={getScoreColor(score.overall)} size={20} />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Overall Score</p>
          <p className={`text-2xl sm:text-3xl font-bold ${getScoreColor(score.overall)}`}>{score.overall}</p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(score.overall)}`} 
              style={{width: `${score.overall}%`}}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Tags className="text-blue-600" size={20} />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Meta Tags</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{score.metaTags}/15</p>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 text-center">
          {missingTags > 0 ? `${missingTags} missing tags` : "All tags present"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <Share className="text-amber-600" size={20} />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Social Tags</p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600">{score.socialTags}/12</p>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 text-center">
          {socialRecommendations > 0 ? `${socialRecommendations} recommendations` : "Optimized"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <Gauge className="text-green-600" size={20} />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Performance</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{score.performance}</p>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 text-center">
          Load time: {loadTime ? `${(loadTime / 1000).toFixed(1)}s` : 'N/A'}
        </p>
      </div>
    </div>
  );
}
