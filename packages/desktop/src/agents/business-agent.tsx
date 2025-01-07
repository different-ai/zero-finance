import { Agent, RecognizedContext, AgentType } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import * as React from 'react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import path from 'path';

// Schemas for different business information types
const companySchema = z.object({
  name: z.string(),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }).optional(),
  bankDetails: z.object({
    bankName: z.string(),
    accountName: z.string(),
    routingNumber: z.string(),
    accountNumber: z.string()
  }).optional()
});

const clientSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  industry: z.string().optional(),
  contacts: z.array(z.object({
    name: z.string(),
    role: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional()
  })).optional(),
  billing: z.object({
    method: z.string().optional(),
    currency: z.string().optional(),
    taxRate: z.number().optional()
  }).optional(),
  projects: z.array(z.object({
    name: z.string(),
    status: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    value: z.number().optional()
  })).optional()
});

interface BusinessInfo {
  type: 'company' | 'client' | 'invoice' | 'project';
  content: any;
  timestamp: number;
  filePath: string;
}

const BusinessInfoView: React.FC = () => {
  const { data: businessInfo, isLoading } = useQuery<BusinessInfo[]>({
    queryKey: ['business-info'],
    queryFn: async () => {
      const hyperscrollDir = await window.api.ensureHyperscrollDir();
      const files = await window.api.listMarkdownFiles(hyperscrollDir);
      const contents = await Promise.all(
        files.map(async (file) => {
          const content = await window.api.readMarkdownFile(file.path);
          return {
            type: content.frontMatter.type,
            content: content.content,
            timestamp: new Date(content.stats.mtime).getTime(),
            filePath: file.path,
          };
        })
      );
      return contents.filter(info => info.type);
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading business information...</div>;
  }

  if (!businessInfo?.length) {
    return <div className="p-4">No business information found</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Business Information</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>File</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessInfo.map((info) => (
            <TableRow key={info.filePath}>
              <TableCell>
                {format(info.timestamp, 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{info.type}</TableCell>
              <TableCell className="max-w-md truncate">
                {info.content}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => window.api.revealInFileSystem(info.filePath)}
                >
                  View File
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface BusinessAgentUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

const BusinessAgentUI: React.FC<BusinessAgentUIProps> = ({
  context,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const parseContext = async () => {
    try {
      setIsLoading(true);
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key in settings');
      }

      const openai = createOpenAI({ apiKey });
      
      // First, determine the type of business information
      const { object: typeInfo } = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          type: z.enum(['company', 'client', 'invoice', 'project']),
          explanation: z.string(),
        }),
        prompt: `
          Analyze this content and determine what type of business information it contains:
          ${context.vitalInformation}
          
          Determine if this is company information, client information, an invoice, or project details.
          Explain your reasoning.
        `.trim(),
      });

      // Then parse the content based on the determined type
      const schema = typeInfo.type === 'company' ? companySchema : clientSchema;
      const { object: parsedInfo } = await generateObject({
        model: openai('gpt-4o'),
        schema,
        prompt: `
          Extract ${typeInfo.type} information from this content:
          ${context.vitalInformation}
          
          Parse this into a well-structured format following the schema.
        `.trim(),
      });

      // Format as markdown
      const { object: markdown } = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          content: z.string().describe('The markdown content with proper formatting')
        }),
        prompt: `Convert this ${typeInfo.type} information into a well-formatted markdown document with proper headers and sections: ${JSON.stringify(parsedInfo, null, 2)}`
      });

      // Save the file
      const hyperscrollDir = await window.api.ensureHyperscrollDir();
      const baseDir = path.join(hyperscrollDir, typeInfo.type === 'company' ? 'business-details' : 'clients');
      const fileName = typeInfo.type === 'company' ? 'company.md' : `${parsedInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
      const filePath = path.join(baseDir, fileName);

      const now = new Date().toISOString();
      const content = `---
type: ${typeInfo.type}
updated: ${now}
version: 1.0
---

${markdown.content}`;

      await window.api.writeMarkdownFile(filePath, content);
      
      toast.success(`${typeInfo.type} information saved successfully`);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('0xHypr', 'Error parsing business information:', error);
      toast.error('Failed to parse business information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex flex-col">
        <h3 className="font-medium">Business Information</h3>
        <p className="text-sm text-muted-foreground">{context.title}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={parseContext}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Process Information'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[60vw]">
          <DialogHeader>
            <DialogTitle>Processing Business Information</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            Processing content...
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const BusinessAgent: Agent = {
  id: 'business-agent',
  name: 'Business Information Manager',
  description: 'Automatically processes and stores business-related information from your screen content',
  type: 'business' as AgentType,
  isActive: true,
  isReady: false,
  miniApp: () => <BusinessInfoView />,

  eventAction(context: RecognizedContext, onSuccess?: () => void): React.ReactNode {
    return <BusinessAgentUI context={context} onSuccess={onSuccess} />;
  },
}; 