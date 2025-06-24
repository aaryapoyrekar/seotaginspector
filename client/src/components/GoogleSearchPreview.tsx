import { Globe } from "lucide-react";

interface GoogleSearchPreviewProps {
  url: string;
  title?: string;
  description?: string;
}

export default function GoogleSearchPreview({ url, title, description }: GoogleSearchPreviewProps) {
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const displayTitle = title || 'No title found';
  const displayDescription = description || 'No meta description found';

  // Truncate description to simulate Google's display
  const truncatedDescription = displayDescription.length > 160 
    ? displayDescription.substring(0, 157) + '...'
    : displayDescription;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center">
          <div className="w-5 h-5 sm:w-6 sm:h-6 mr-3">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          Google Preview
        </h3>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
              <Globe size={10} className="text-gray-600" />
            </div>
            <span className="text-xs sm:text-sm text-green-700 truncate">{displayUrl}</span>
          </div>
          <h3 className="text-base sm:text-lg text-blue-600 hover:underline cursor-pointer mb-2 leading-snug">
            {displayTitle}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {truncatedDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
