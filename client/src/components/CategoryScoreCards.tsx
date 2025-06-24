import { SEOScore } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, Zap, Globe, Settings, FileText } from "lucide-react";

interface CategoryScoreCardsProps {
  score: SEOScore;
}

export default function CategoryScoreCards({ score }: CategoryScoreCardsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'needs-work':
        return 'text-amber-600 bg-amber-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'good':
        return <CheckCircle className="text-blue-600" size={20} />;
      case 'needs-work':
        return <AlertTriangle className="text-amber-600" size={20} />;
      case 'critical':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-600';
      case 'good':
        return 'bg-blue-600';
      case 'needs-work':
        return 'bg-amber-600';
      case 'critical':
        return 'bg-red-600';
      default:
        return 'bg-slate-400';
    }
  };

  const categories = [
    {
      title: "Basic SEO",
      icon: <Globe className="text-blue-600" size={24} />,
      data: score.categories.basicSEO,
      description: "Essential meta tags and page structure"
    },
    {
      title: "Social Media",
      icon: <Zap className="text-purple-600" size={24} />,
      data: score.categories.socialSEO,
      description: "Social sharing and Open Graph tags"
    },
    {
      title: "Technical SEO",
      icon: <Settings className="text-green-600" size={24} />,
      data: score.categories.technicalSEO,  
      description: "Technical optimization and crawlability"
    },
    {
      title: "Content Optimization",
      icon: <FileText className="text-amber-600" size={24} />,
      data: score.categories.contentOptimization,
      description: "Content length and keyword optimization"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {categories.map((category, index) => {
        const percentage = Math.round((category.data.score / category.data.maxScore) * 100);
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <div>
                    <CardTitle className="text-sm font-semibold">{category.title}</CardTitle>
                  </div>
                </div>
                {getStatusIcon(category.data.status)}
              </div>
              <CardDescription className="text-xs text-slate-500">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900">
                    {category.data.score}/{category.data.maxScore}
                  </span>
                  <Badge className={`text-xs ${getStatusColor(category.data.status)}`}>
                    {percentage}%
                  </Badge>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(category.data.status)} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  {category.data.summary}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}