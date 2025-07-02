"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useGitHubAuth } from '@/hooks/use-github-auth';
import { SubmissionData, usePRSubmission } from '@/hooks/use-pr-submission';
import { AlertCircle, ArrowRight, CheckCircle2, Copy, ExternalLink, Github, Loader2, LogOut } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Libs and Components',
  'Plugins and Extensions',
  'Colors and Customizations',
  'Animations',
  'Tools',
  'Websites and Portfolios Inspirations',
  'Platforms',
  'Ports',
  'Design System',
  'Boilerplates / Templates',
];

interface PRSubmissionDialogProps {
  trigger?: React.ReactNode;
}

export function PRSubmissionDialog({ trigger }: PRSubmissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'auth' | 'form' | 'success'>('auth');
  const [formData, setFormData] = useState<SubmissionData>({
    name: '',
    description: '',
    url: '',
    category: '',
  });
  const [submissionResult, setSubmissionResult] = useState<{
    prNumber?: number;
    prUrl?: string;
  } | null>(null);

  const { authState, isLoading: authLoading, error: authError, startDeviceFlow, logout, createAuthenticatedOctokit } = useGitHubAuth();
  const { isSubmitting, error: submissionError, submitPR } = usePRSubmission();

  const handleStartAuth = useCallback(async () => {
    const result = await startDeviceFlow();
    
    if (!result.success) {
      toast.error(authError || 'Failed to start authentication');
    }
  }, [startDeviceFlow, authError]);

  const copyUserCode = useCallback(async () => {
    if (authState.userCode) {
      try {
        await navigator.clipboard.writeText(authState.userCode);
        toast.success('Code copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy code');
      }
    }
  }, [authState.userCode]);

  const handleSubmit = useCallback(async () => {
    if (!formData.name || !formData.description || !formData.url || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!authState.isAuthenticated) {
      toast.error('Please authenticate first');
      return;
    }

    const octokit = createAuthenticatedOctokit();
    if (!octokit) {
      toast.error('Failed to create GitHub client');
      return;
    }

    const result = await submitPR(octokit, formData, { login: authState.username! });
    
    if (result.success) {
      setSubmissionResult({
        prNumber: result.prNumber,
        prUrl: result.prUrl,
      });
      setStep('success');
      toast.success('Pull request submitted successfully!');
    } else {
      toast.error(result.error || 'Failed to submit pull request');
    }
  }, [formData, authState, submitPR, createAuthenticatedOctokit]);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Reset state when dialog closes
    setTimeout(() => {
      setStep('auth');
      setFormData({ name: '', description: '', url: '', category: '' });
      setSubmissionResult(null);
      logout();
    }, 300);
  }, [logout]);

  const handleBackToAuth = useCallback(() => {
    // Logout and go back to auth step
    logout();
    setStep('auth');
    toast.info('Disconnected from GitHub');
  }, [logout]);

  // Move to form step when authentication completes
  useEffect(() => {
    if (authState.isAuthenticated && step === 'auth') {
      setStep('form');
    }
  }, [authState.isAuthenticated, step]);

  const renderAuthStep = () => {
    if (authState.userCode && authState.verificationUri) {
      return (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Github className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">Authorize with GitHub</h3>
            <p className="text-sm text-muted-foreground">
              Complete the authorization on GitHub using the code below
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Verification Code:</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-lg px-4 py-2 font-mono">
                  {authState.userCode}
                </Badge>
                <Button size="sm" variant="ghost" onClick={copyUserCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <Button asChild className="w-full">
                <a
                  href={authState.verificationUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Open GitHub Authorization
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            
            {authState.isPolling && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Waiting for authorization...
              </div>
            )}
          </div>
          
          {authError && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              {authError}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground text-center">
            Enter the code above on GitHub to authorize this application
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <Github className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">GitHub Authorization</h3>
          <p className="text-sm text-muted-foreground">
            Authorize this app to submit pull requests on your behalf
          </p>
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded-md">
            <strong>Permissions requested:</strong> Read public repositories and create pull requests
          </div>
        </div>
        
        <Button onClick={handleStartAuth} disabled={authLoading} className="w-full">
          {authLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              Authorize with GitHub
            </>
          )}
        </Button>
        
        {authError && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            {authError}
          </div>
        )}
      </div>
    );
  };

  const renderFormStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={authState.avatar || ''} alt="Avatar" className="h-8 w-8 rounded-full" />
          <div>
            <p className="font-medium">Authenticated as {authState.username}</p>
            <p className="text-sm text-muted-foreground">Ready to submit your resource</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleBackToAuth} className="text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4 mr-1" />
          Disconnect
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Resource Name</Label>
          <Input
            id="name"
            placeholder="e.g., shadcn-nextjs-dashboard"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="e.g., Admin Dashboard UI built with Shadcn and NextJS"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://github.com/username/project"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {submissionError && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            {submissionError}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit PR
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
      <div>
        <h3 className="text-lg font-semibold">Pull Request Submitted!</h3>
        <p className="text-sm text-muted-foreground">
          Your resource has been submitted for review
        </p>
      </div>
      
      {submissionResult && (
        <div className="space-y-2">
          <Badge variant="secondary">PR #{submissionResult.prNumber}</Badge>
          <div>
            <Button asChild variant="outline" className="w-full">
              <a
                href={submissionResult.prUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Pull Request
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )}
      
      <Button onClick={handleClose} className="w-full">
        Close
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="w-full lg:w-auto text-base">
            <Github className="mr-2 h-5 w-5" />
            Submit Resource
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'auth' && 'Submit New Resource'}
            {step === 'form' && 'Add Resource Details'}
            {step === 'success' && 'Success!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'auth' && 'Authorize with GitHub to submit a pull request directly from this site.'}
            {step === 'form' && 'Fill in the details for your awesome shadcn/ui resource.'}
            {step === 'success' && 'Your resource has been submitted and will be reviewed by the maintainers.'}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'auth' && renderAuthStep()}
        {step === 'form' && renderFormStep()}
        {step === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
} 