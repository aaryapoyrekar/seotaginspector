import { SEOScore, SEORecommendation } from "@shared/schema";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

  const getScoreLabel = (scoreValue: number) => {
    if (scoreValue >= 90) return "Excellent";
    if (scoreValue >= 80) return "Good";
    if (scoreValue >= 60) return "Needs Work";
    return "Critical";
  };

  const criticalIssues = recommendations.filter(r => r.type === 'error').length;
  const warnings = recommendations.filter(r => r.type === 'warning').length;
  const improvements = recommendations.filter(r => r.type === 'success').length;

  return (
    <div className="mb-8">
      {/* Overall Score Hero Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <div className={`w-20 h-20 ${getScoreBgColor(score.overall)} rounded-full flex items-center justify-center mx-auto`}>
              <TrendingUp className={getScoreColor(score.overall)} size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            SEO Score: {score.overall}/100
          </CardTitle>
          <CardDescription className="text-lg">
            <Badge className={`${getScoreColor(score.overall).replace('text-', 'bg-').replace('-600', '-100')} ${getScoreColor(score.overall)} text-sm px-3 py-1`}>
              {getScoreLabel(score.overall)}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={score.overall} className="h-3" />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="text-red-600 mr-2" size={20} />
                  <span className="font-semibold text-red-600">{criticalIssues}</span>
                </div>
                <p className="text-sm text-slate-600">Critical Issues</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="text-amber-600 mr-2" size={20} />
                  <span className="font-semibold text-amber-600">{warnings}</span>
                </div>
                <p className="text-sm text-slate-600">Warnings</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  <span className="font-semibold text-green-600">{improvements}</span>
                </div>
                <p className="text-sm text-slate-600">Opportunities</p>
              </div>
            </div>

            {/* Performance Info */}
            {loadTime && (
              <div className="mt-4 p-3 bg-white rounded-lg border text-center">
                <p className="text-sm text-slate-600">
                  Page Load Time: <span className="font-semibold">{(loadTime / 1000).toFixed(1)}s</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    loadTime < 2000 ? 'bg-green-100 text-green-600' : 
                    loadTime < 4000 ? 'bg-amber-100 text-amber-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    {score.performance}
                  </span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
