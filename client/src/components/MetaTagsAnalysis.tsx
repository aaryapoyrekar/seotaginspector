import { MetaTags } from "@shared/schema";
import { CheckCircle, XCircle, AlertTriangle, Code } from "lucide-react";

interface MetaTagsAnalysisProps {
  metaTags: MetaTags;
}

interface TagAnalysis {
  name: string;
  value?: string;
  status: 'good' | 'warning' | 'error';
  message: string;
  recommendation?: string;
}

export default function MetaTagsAnalysis({ metaTags }: MetaTagsAnalysisProps) {
  const analyzeTag = (
    name: string, 
    value: string | undefined, 
    optimalLength?: { min: number; max: number }
  ): TagAnalysis => {
    if (!value) {
      return {
        name,
        status: 'error',
        message: `No ${name.toLowerCase()} found`,
        recommendation: `Add a ${name.toLowerCase()}`
      };
    }

    if (optimalLength) {
      const length = value.length;
      if (length >= optimalLength.min && length <= optimalLength.max) {
        return {
          name,
          value,
          status: 'good',
          message: `Length: ${length} characters (Optimal: ${optimalLength.min}-${optimalLength.max})`
        };
      } else {
        return {
          name,
          value,
          status: 'warning',
          message: `Length: ${length} characters (Optimal: ${optimalLength.min}-${optimalLength.max})`,
          recommendation: `Adjust length to ${optimalLength.min}-${optimalLength.max} characters`
        };
      }
    }

    return {
      name,
      value,
      status: 'good',
      message: 'Present'
    };
  };

  const tags: TagAnalysis[] = [
    analyzeTag('Title Tag', metaTags.title, { min: 50, max: 60 }),
    analyzeTag('Meta Description', metaTags.description, { min: 150, max: 160 }),
    analyzeTag('Meta Keywords', metaTags.keywords),
    analyzeTag('Canonical URL', metaTags.canonical),
  ];

  // Analyze Open Graph tags
  const ogTagsPresent = [
    metaTags.ogTitle,
    metaTags.ogDescription,
    metaTags.ogImage,
    metaTags.ogUrl,
    metaTags.ogType
  ].filter(Boolean).length;

  const ogAnalysis: TagAnalysis = {
    name: 'Open Graph Tags',
    status: ogTagsPresent >= 4 ? 'good' : ogTagsPresent >= 2 ? 'warning' : 'error',
    message: `${ogTagsPresent}/5 Present`,
    recommendation: ogTagsPresent < 4 ? 'Add missing Open Graph tags for better social sharing' : undefined
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-amber-600" size={20} />;
      case 'error':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-amber-600 bg-amber-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center">
            <Code className="text-blue-600 mr-3" size={18} />
            Detailed Analysis
          </h3>
          <div className="text-xs text-slate-500">
            {tags.filter(t => t.status === 'good').length + (ogAnalysis.status === 'good' ? 1 : 0)}/{tags.length + 1} optimized
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-2">Breakdown of individual SEO elements and their optimization status</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {[...tags, ogAnalysis].map((tag, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${getStatusBg(tag.status)} hover:shadow-md transition-shadow duration-200`}>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    {getStatusIcon(tag.status)}
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">{tag.name}</span>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(tag.status)} self-start`}>
                    {tag.status === 'good' ? '✓ Optimized' : tag.status === 'warning' ? '⚠ Needs Work' : '✗ Missing'}
                  </span>
                </div>
                
                {tag.value && (
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Current Value:</p>
                    <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded border-l-4 border-blue-200 break-words">
                      {tag.value}
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 font-medium">{tag.message}</p>
                  {tag.recommendation && (
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="text-xs text-blue-800">
                        <strong>💡 Recommendation:</strong> {tag.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Enhanced Open Graph breakdown */}
          {ogTagsPresent > 0 && (
            <div className={`p-4 rounded-lg border-2 ${getStatusBg(ogAnalysis.status)} hover:shadow-md transition-shadow duration-200`}>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  {getStatusIcon(ogAnalysis.status)}
                  <span className="font-semibold text-slate-900 text-sm sm:text-base">Social Media Tags Breakdown</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{ogTagsPresent}/5 Present</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'ogTitle', label: 'og:title', description: 'Title for social shares' },
                    { key: 'ogDescription', label: 'og:description', description: 'Description for social shares' },
                    { key: 'ogImage', label: 'og:image', description: 'Image for social shares' },
                    { key: 'ogUrl', label: 'og:url', description: 'Canonical URL for sharing' },
                    { key: 'ogType', label: 'og:type', description: 'Content type (article, website, etc.)' }
                  ].map((item, idx) => {
                    const isPresent = metaTags[item.key as keyof MetaTags];
                    return (
                      <div key={idx} className={`p-3 rounded-md border ${isPresent ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-900">{item.label}</span>
                          {isPresent ? <CheckCircle className="text-green-600" size={16} /> : <XCircle className="text-red-600" size={16} />}
                        </div>
                        <p className="text-xs text-slate-600">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
                
                {ogTagsPresent < 4 && (
                  <div className="mt-3 bg-amber-50 p-3 rounded-md border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <strong>📱 Social Media Impact:</strong> Missing tags will result in poor preview appearance when shared on Facebook, Twitter, and LinkedIn.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
