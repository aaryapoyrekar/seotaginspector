import { SEORecommendation } from "@shared/schema";
import { Lightbulb, AlertCircle, Info, CheckCircle } from "lucide-react";

interface SEORecommendationsProps {
  recommendations: SEORecommendation[];
}

export default function SEORecommendations({ recommendations }: SEORecommendationsProps) {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="text-red-600" size={12} />;
      case 'warning':
        return <Info className="text-amber-600" size={12} />;
      case 'success':
        return <CheckCircle className="text-green-600" size={12} />;
      default:
        return <Info className="text-blue-600" size={12} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-amber-600 bg-amber-100';
      case 'low':
        return 'text-slate-600 bg-slate-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityText = (priority: string) => {
    return `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`;
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Lightbulb className="text-amber-600 mr-3" size={20} />
            SEO Recommendations
          </h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">Great Job!</h4>
            <p className="text-slate-600">No recommendations at this time. Your SEO is well optimized.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <Lightbulb className="text-amber-600 mr-3" size={20} />
          SEO Recommendations
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
              <div className={`w-6 h-6 ${
                recommendation.type === 'error' ? 'bg-red-100' : 
                recommendation.type === 'warning' ? 'bg-amber-100' : 'bg-green-100'
              } rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {getRecommendationIcon(recommendation.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 mb-1">{recommendation.title}</h4>
                <p className="text-sm text-slate-600 mb-2">{recommendation.description}</p>
                <span className={`text-xs px-2 py-1 rounded ${getPriorityBadge(recommendation.priority)}`}>
                  {getPriorityText(recommendation.priority)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
