import { Octokit } from '@octokit/rest';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';

export interface SubmissionData {
  name: string;
  description: string;
  url: string;
  category: string;
}

export interface PRSubmissionResult {
  success: boolean;
  prNumber?: number;
  prUrl?: string;
  error?: string;
}

const REPO_OWNER = 'birobirobiro';
const REPO_NAME = 'awesome-shadcn-ui';

export function usePRSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insertResourceIntoReadme = useCallback((readmeContent: string, submission: SubmissionData): string => {
    const lines = readmeContent.split('\n');
    const today = format(new Date(), 'yyyy-MM-dd');
    const newEntry = `| ${submission.name} | ${submission.description} | [Link](${submission.url}) | ${today} |`;
    
    let insertIndex = -1;
    let inTargetSection = false;
    let inTable = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we're in the target section
      if (line.startsWith('## ') && line.toLowerCase().includes(submission.category.toLowerCase())) {
        inTargetSection = true;
        continue;
      }
      
      // Check if we've moved to a new section
      if (inTargetSection && line.startsWith('## ') && !line.toLowerCase().includes(submission.category.toLowerCase())) {
        // We've reached the end of our target section
        break;
      }
      
      // Check if we're in a table within our target section
      if (inTargetSection && line.startsWith('| Name')) {
        inTable = true;
        continue;
      }
      
      // Skip table header separator
      if (inTable && line.match(/^\|[\s-]+\|/)) {
        continue;
      }
      
      // Process table rows
      if (inTable && line.startsWith('|') && !line.match(/^\|[\s-]+\|/)) {
        const parts = line.split('|').map(part => part.trim());
        if (parts.length >= 2) {
          const existingName = parts[1];
          
          // Check for duplicates
          if (existingName.toLowerCase() === submission.name.toLowerCase()) {
            throw new Error(`Resource "${submission.name}" already exists in this section.`);
          }
          
          // Find alphabetical insertion point
          if (existingName.toLowerCase() > submission.name.toLowerCase()) {
            insertIndex = i;
            break;
          }
        }
      }
      
      // End of table
      if (inTable && (!line.startsWith('|') || line.trim() === '')) {
        // If we haven't found an insertion point yet, insert at the end of the table
        if (insertIndex === -1) {
          insertIndex = i;
        }
        break;
      }
    }
    
    if (insertIndex === -1) {
      throw new Error(`Could not find insertion point for category "${submission.category}".`);
    }
    
    // Insert the new entry
    lines.splice(insertIndex, 0, newEntry);
    
    return lines.join('\n');
  }, []);

  const submitPR = useCallback(async (
    octokit: Octokit,
    submission: SubmissionData,
    userInfo: { login: string; name?: string }
  ): Promise<PRSubmissionResult> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get the current README content
      const { data: readmeData } = await octokit.rest.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: 'README.md',
      });

      if (Array.isArray(readmeData) || !('content' in readmeData)) {
        throw new Error('Could not fetch README.md');
      }

      const currentContent = Buffer.from(readmeData.content, 'base64').toString();
      
      // Insert the new resource
      const updatedContent = insertResourceIntoReadme(currentContent, submission);
      
      // Create a new branch
      const branchName = `add-${submission.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
      
      // Get the default branch SHA
      const { data: mainBranch } = await octokit.rest.repos.getBranch({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        branch: 'main',
      });
      
      // Create the new branch
      await octokit.rest.git.createRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: `refs/heads/${branchName}`,
        sha: mainBranch.commit.sha,
      });
      
      // Update the README on the new branch
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: 'README.md',
        message: `feat: Add ${submission.name}`,
        content: Buffer.from(updatedContent).toString('base64'),
        sha: readmeData.sha,
        branch: branchName,
      });
      
      // Create the pull request
      const prBody = `## Describe the awesome resource you want to add

**What is it?**  
${submission.description}

## **Which section does it belong to?**  
- [x] ${submission.category}

**Additional details**  
Resource URL: ${submission.url}

## **Checklist**
- [x] I verified that the resource is listed in alphabetical order within its section.
- [x] I checked that the resource is not already listed.
- [x] I provided a clear and concise description of the resource.
- [x] I included a valid and working link to the resource.
- [x] I assigned the correct section to the resource.

Submitted via awesome-shadcn/ui website by @${userInfo.login}`;

      const { data: pr } = await octokit.rest.pulls.create({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        title: `feat: Add ${submission.name}`,
        head: branchName,
        base: 'main',
        body: prBody,
      });

      return {
        success: true,
        prNumber: pr.number,
        prUrl: pr.html_url,
      };
    } catch (err: any) {
      console.error('PR submission error:', err);
      const errorMessage = err.message || 'Failed to submit pull request';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [insertResourceIntoReadme]);

  return {
    isSubmitting,
    error,
    submitPR,
  };
} 