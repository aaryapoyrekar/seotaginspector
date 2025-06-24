import { Button } from "@/components/ui/button";
import { FileText, Clock, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onExportReport: () => void;
  hasResults: boolean;
}

export default function QuickActions({ onExportReport, hasResults }: QuickActionsProps) {
  const { toast } = useToast();

  const handleScheduleCheck = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Scheduled monitoring will be available in a future update.",
    });
  };

  const handleShareResults = () => {
    if (!hasResults) return;
    
    // Create a shareable URL (simplified for demo)
    const shareUrl = `${window.location.origin}?shared=true`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied",
        description: "Shareable link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Share Failed",
        description: "Could not copy the share link.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
      </div>
      <div className="p-6 space-y-3">
        <Button 
          onClick={onExportReport}
          disabled={!hasResults}
          className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          variant="outline"
        >
          <FileText className="mr-2" size={16} />
          Export PDF Report
        </Button>
        
        <Button 
          onClick={handleScheduleCheck}
          className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
          variant="outline"
        >
          <Clock className="mr-2" size={16} />
          Schedule Monitoring
        </Button>
        
        <Button 
          onClick={handleShareResults}
          disabled={!hasResults}
          className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
          variant="outline"
        >
          <Share2 className="mr-2" size={16} />
          Share Results
        </Button>
      </div>
    </div>
  );
}
