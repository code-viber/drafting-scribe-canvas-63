
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share, Mail, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

const ShareDialog = ({ isOpen, onClose, fileName }: ShareDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  const shareableLink = `https://app.example.com/reports/shared/${Math.random().toString(36).substr(2, 9)}`;

  const handleEmailShare = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to share the report.",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report shared successfully",
        description: `The report has been shared with ${email}`,
      });
      setEmail('');
      setIsSharing(false);
      onClose();
    }, 1500);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setLinkCopied(true);
      toast({
        title: "Link copied",
        description: "Shareable link has been copied to clipboard",
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5 text-blue-600" />
            Share Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Share the analysis report for <span className="font-medium">{fileName}</span>
          </div>

          {/* Email Share */}
          <div className="space-y-3">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Share via Email
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleEmailShare} 
                disabled={isSharing}
                className="px-6"
              >
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Or copy shareable link
            </Label>
            <div className="flex gap-2">
              <Input
                value={shareableLink}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <Button 
                variant="outline" 
                onClick={handleCopyLink}
                className="px-6"
              >
                {linkCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Note:</strong> Shared reports will be accessible for 30 days. Recipients can view but not edit the analysis.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
