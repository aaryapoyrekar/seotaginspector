import { MetaTags } from "@shared/schema";

interface SocialMediaPreviewsProps {
  metaTags: MetaTags;
}

export default function SocialMediaPreviews({ metaTags }: SocialMediaPreviewsProps) {
  const domain = metaTags.canonical || metaTags.ogUrl || 'example.com';
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
  
  const fbTitle = metaTags.ogTitle || metaTags.title || 'No title found';
  const fbDescription = metaTags.ogDescription || metaTags.description || 'No description found';
  
  const twitterTitle = metaTags.twitterTitle || metaTags.ogTitle || metaTags.title || 'No title found';
  const twitterDescription = metaTags.twitterDescription || metaTags.ogDescription || metaTags.description || 'No description found';
  
  const linkedinTitle = metaTags.ogTitle || metaTags.title || 'No title found';

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 2.32l4.94 2.47A3 3 0 1015 8zM10 8a1 1 0 11-2 0 1 1 0 012 0zm-5 4a1 1 0 11-2 0 1 1 0 012 0zm11-1a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
          Social Previews
        </h3>
      </div>
      <div className="p-6">
        {/* Facebook Preview */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="font-medium text-slate-900">Facebook</span>
          </div>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            {metaTags.ogImage ? (
              <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-slate-500 text-sm">Image: {truncateText(metaTags.ogImage, 50)}</span>
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                <span className="text-slate-400 text-sm">No Open Graph image found</span>
              </div>
            )}
            <div className="p-3 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase mb-1">{cleanDomain}</p>
              <h4 className="text-sm font-medium text-gray-900 mb-1">{truncateText(fbTitle, 60)}</h4>
              <p className="text-xs text-gray-600">{truncateText(fbDescription, 80)}</p>
            </div>
          </div>
        </div>

        {/* Twitter Preview */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span className="font-medium text-slate-900">Twitter</span>
          </div>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            {metaTags.twitterImage || metaTags.ogImage ? (
              <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">
                <span className="text-slate-500 text-sm">Image: {truncateText(metaTags.twitterImage || metaTags.ogImage || '', 50)}</span>
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                <span className="text-slate-400 text-sm">No Twitter image found</span>
              </div>
            )}
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-1">{cleanDomain}</p>
              <h4 className="text-sm font-medium text-gray-900 mb-1">{truncateText(twitterTitle, 60)}</h4>
              <p className="text-xs text-gray-600">{truncateText(twitterDescription, 120)}</p>
            </div>
          </div>
        </div>

        {/* LinkedIn Preview */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="font-medium text-slate-900">LinkedIn</span>
          </div>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            {metaTags.ogImage ? (
              <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <span className="text-slate-500 text-sm">Image: {truncateText(metaTags.ogImage, 50)}</span>
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                <span className="text-slate-400 text-sm">No LinkedIn preview image found</span>
              </div>
            )}
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{truncateText(linkedinTitle, 60)}</h4>
              <p className="text-xs text-gray-500">{cleanDomain}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
