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
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <Code className="text-blue-600 mr-3" size={20} />
          Meta Tags Analysis
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[...tags, ogAnalysis].map((tag, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusBg(tag.status)}`}>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(tag.status)}
                  <span className="font-medium text-slate-900">{tag.name}</span>
                  <span className={`text-sm px-2 py-1 rounded ${getStatusBadge(tag.status)}`}>
                    {tag.status === 'good' ? 'Good' : tag.status === 'warning' ? 'Warning' : 'Missing'}
                  </span>
                </div>
                {tag.value && (
                  <p className="text-sm text-slate-600 mb-2 break-words">{tag.value}</p>
                )}
                <p className="text-xs text-slate-500">{tag.message}</p>
                {tag.recommendation && (
                  <p className="text-xs text-slate-500 mt-1">Recommendation: {tag.recommendation}</p>
                )}
              </div>
            </div>
          ))}

          {/* Detailed Open Graph breakdown */}
          {ogTagsPresent > 0 && (
            <div className={`p-4 rounded-lg border ${getStatusBg(ogAnalysis.status)}`}>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(ogAnalysis.status)}
                  <span className="font-medium text-slate-900">Open Graph Details</span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>og:title</span>
                    {metaTags.ogTitle ? <CheckCircle className="text-green-600" size={12} /> : <XCircle className="text-red-600" size={12} />}
                  </div>
                  <div className="flex justify-between">
                    <span>og:description</span>
                    {metaTags.ogDescription ? <CheckCircle className="text-green-600" size={12} /> : <XCircle className="text-red-600" size={12} />}
                  </div>
                  <div className="flex justify-between">
                    <span>og:image</span>
                    {metaTags.ogImage ? <CheckCircle className="text-green-600" size={12} /> : <XCircle className="text-red-600" size={12} />}
                  </div>
                  <div className="flex justify-between">
                    <span>og:url</span>
                    {metaTags.ogUrl ? <CheckCircle className="text-green-600" size={12} /> : <XCircle className="text-red-600" size={12} />}
                  </div>
                  <div className="flex justify-between">
                    <span>og:type</span>
                    {metaTags.ogType ? <CheckCircle className="text-green-600" size={12} /> : <XCircle className="text-red-600" size={12} />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
