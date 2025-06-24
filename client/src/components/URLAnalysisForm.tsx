import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Globe } from "lucide-react";

interface URLAnalysisFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export default function URLAnalysisForm({ onAnalyze, isLoading }: URLAnalysisFormProps) {
  const [domain, setDomain] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      // Automatically prepend https:// if not already present
      let fullUrl = domain.trim();
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = 'https://' + fullUrl;
      }
      onAnalyze(fullUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="website-url" className="block text-sm font-medium text-slate-700 mb-2">
          Website Domain
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">
            https://
          </div>
          <Input
            type="text"
            id="website-url"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="pl-20 pr-12 h-11"
            required
          />
          <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
        </div>
        <p className="text-xs text-slate-500 mt-1">Just enter the domain name - we'll add https:// automatically</p>
      </div>
      <div className="flex items-end">
        <Button 
          type="submit"
          disabled={isLoading || !domain.trim()}
          className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 h-11 w-full sm:w-auto"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Search className="mr-2" size={16} />
          )}
          <span className="text-sm sm:text-base">Analyze SEO</span>
        </Button>
      </div>
    </form>
  );
}
