import { Agent, RecognizedContext, AgentType } from './base-agent';
import * as React from 'react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { AgentStepsView } from '@/components/agent-steps-view';
import { useAsyncMarkdown } from './async-markdown-agent';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarkdownAgentUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

const MarkdownAgentUI: React.FC<MarkdownAgentUIProps> = ({
  context,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const { result, processMarkdown, isProcessing } = useAsyncMarkdown(context.id);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !result && !isProcessing) {
      console.log('0xHypr', 'Starting markdown processing', {
        contextId: context.id,
        vitalInfo: context.vitalInformation,
      });
      processMarkdown(context.vitalInformation);
    }
    setOpen(newOpen);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Markdown Search</h3>
          <Search className="h-4 w-4 opacity-80" />
        </div>
        <p className="text-sm text-muted-foreground">{context.title}</p>
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'View Results'
            )}
          </Button>
        </DialogTrigger>
        {open && (
          <DialogContent className="max-w-[80vw] h-[90vh] p-0">
            <div className="flex h-full">
              <div className="flex-1 min-w-0 p-6">
                <ScrollArea className="h-full">
                  {result?.data?.results.map((item, index) => (
                    <Card key={index} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {item.content.metadata?.title || item.content.fileName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-2">
                          <div className="text-muted-foreground">
                            {item.content.matchContext}
                          </div>
                          {item.content.metadata?.tags && (
                            <div className="flex gap-2">
                              {item.content.metadata.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-muted px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {item.content.filePath}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              </div>
              <div className="w-[350px] border-l">
                <AgentStepsView
                  recognizedItemId={context.id}
                  className="h-full"
                />
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export const MarkdownAgent: Agent = {
  id: 'markdown-agent',
  name: 'Markdown Search',
  displayName: () => (
    <div className="flex items-center gap-2">
      <Search className="h-4 w-4" />
      Markdown Search
    </div>
  ),
  description: 'Searches and analyzes markdown files in your workspace',
  type: 'business' as AgentType,
  isActive: true,
  isReady: true,
  detectorPrompt: `
    Look for queries or questions that might be answered by searching through markdown files.
    This includes:
    - Questions about previous notes or documentation
    - Searches for specific topics or keywords in markdown files
    - Requests to find information from past meetings or discussions
    - Queries about project documentation or specifications
    
    The search should be semantic and context-aware, not just exact matches.
  `,

  eventAction(
    context: RecognizedContext,
    onSuccess?: () => void
  ): React.ReactNode {
    return <MarkdownAgentUI context={context} onSuccess={onSuccess} />;
  },
}; 