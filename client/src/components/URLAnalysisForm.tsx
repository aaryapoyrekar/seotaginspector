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
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="website-url" className="block text-sm font-medium text-slate-700 mb-2">
          Website URL
        </Label>
        <div className="relative">
          <Input
            type="url"
            id="website-url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pr-12 h-11"
            required
          />
          <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
        </div>
      </div>
      <div className="flex items-end">
        <Button 
          type="submit"
          disabled={isLoading || !url.trim()}
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
