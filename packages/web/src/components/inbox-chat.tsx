'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, Loader2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { SimplifiedEmailForChat, InboxCard as InboxCardType } from '@/types/inbox';
import { api } from '@/trpc/react';
import { useInboxStore } from '@/lib/store';
import type { AiProcessedDocument } from '@/server/services/ai-service';
import { usePrivy } from '@privy-io/react-auth';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  actions?: Array<{
    label: string;
    onClick: () => void;
    type: 'button' | 'link'; // For styling or behavior distinction
    disabled?: boolean;
  }>;
}

interface InboxChatProps {
  selectedEmailData?: SimplifiedEmailForChat | null;
}

export function InboxChat({ selectedEmailData }: InboxChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = usePrivy();

  const addAiMessage = (text: string, actions?: ChatMessage['actions']) => {
    setMessages(prev => [...prev, { id: uuidv4(), text, sender: 'ai', timestamp: new Date(), actions }]);
  };

  const createInvoiceOnRNMutation = api.inbox.createRequestNetworkInvoice.useMutation({
    onMutate: () => {
      // TODO: Visually indicate in chat that RN creation is in progress
      addAiMessage('Submitting invoice to Request Network...');
      setIsProcessing(true); 
    },
    onSuccess: (data) => {
      setIsProcessing(false);
      addAiMessage(`Invoice submitted to Request Network! Request ID: ${data.requestId}`);
      // TODO: Update the original InboxCard status or add a new card representing this action
    },
    onError: (error) => {
      setIsProcessing(false);
      addAiMessage(`Error submitting to Request Network: ${error.message}`);
    },
  });

  const processDocumentMutation = api.inbox.processDocumentFromCardData.useMutation({
    onMutate: () => setIsProcessing(true),
    onSuccess: (data: AiProcessedDocument | null) => {
      setIsProcessing(false);
      if (data) {
        let message = `Document processed (Type: ${data.documentType}, Confidence: ${data.confidence}%).\n`;
        if (data.aiRationale) message += `Rationale: ${data.aiRationale}\n`;
        
        let messageActions: ChatMessage['actions'] = [];

        if (data.documentType === 'invoice' && data.confidence >= 80) {
          message += `Buyer: ${data.buyerName || 'N/A'}, Amount: ${data.amount || 'N/A'} ${data.currency || ''}.`;
          messageActions.push({
            label: 'Create Invoice on Request Network',
            type: 'button',
            onClick: () => {
              const params = new URLSearchParams();
              if (data.invoiceNumber) params.set('invoiceNumber', data.invoiceNumber);
              if (data.issueDate) params.set('issueDate', new Date(data.issueDate).toISOString());
              if (data.dueDate) params.set('dueDate', new Date(data.dueDate).toISOString());
              if (data.sellerName) params.set('sellerBusinessName', data.sellerName);
              if (data.buyerName) params.set('buyerBusinessName', data.buyerName);
              params.set('paymentType', 'crypto');
              if (data.currency) params.set('currency', data.currency);
              params.set('network', 'base');
              if (data.extractedSummary) params.set('note', data.extractedSummary);
              if (data.items && data.items.length > 0) {
                const requestNetworkItems = data.items.map((item, index) => ({
                  id: index + 1,
                  name: item.name,
                  quantity: item.quantity || 1,
                  unitPrice: item.unitPrice?.toString() || "0",
                  tax: 0,
                }));
                params.set('items', JSON.stringify(requestNetworkItems));
              }
              window.open(`/dashboard/create-invoice?${params.toString()}`, '_blank');
            }
          });
          // Add button to actually create the invoice via tRPC
          messageActions.push({
            label: 'Submit to Request Network',
            type: 'button',
            onClick: () => {
              if (!data || !data.currency || !data.amount) {
                addAiMessage('Missing critical invoice data (amount, currency) to submit to Request Network.');
                return;
              }
              const payeeAddress = user?.wallet?.address;
              if (!payeeAddress) {
                addAiMessage('Could not determine your wallet address. Please ensure your wallet is connected.');
                return;
              }
              createInvoiceOnRNMutation.mutate({
                ...data,
                payeeAddress: payeeAddress,
                network: 'base',
              });
            },
            disabled: createInvoiceOnRNMutation.isPending,
          });
        } else if (data.documentType !== 'invoice' || data.confidence < 80) {
          message += `Title: ${data.extractedTitle || 'N/A'}, Summary: ${data.extractedSummary || 'N/A'}`;
        }
        addAiMessage(message, messageActions.length > 0 ? messageActions : undefined);

        if (selectedEmailData?.emailId) {
            const cardToUpdate = useInboxStore.getState().cards.find(c => (c as any).sourceDetails?.emailId === selectedEmailData.emailId);
            if (cardToUpdate) {
                useInboxStore.getState().updateCard(cardToUpdate.id, { 
                    parsedInvoiceData: data,
                    confidence: data.confidence,
                    icon: data.documentType ? mapProcessedDocTypeToIcon(data.documentType) : cardToUpdate.icon,
                    title: data.extractedTitle || cardToUpdate.title,
                    rationale: data.aiRationale || cardToUpdate.rationale,
                } as Partial<InboxCardType>); 
            }
        }
      } else {
        addAiMessage('Sorry, I could not process the document details from this email.');
      }
    },
    onError: (error) => {
      setIsProcessing(false);
      addAiMessage(`Error during document processing: ${error.message}`);
    }
  });

  const generateInvoiceTextMutation = api.inbox.generateInvoiceFromText.useMutation({
    onMutate: () => setIsProcessing(true),
    onSuccess: (data: AiProcessedDocument | null) => {
        setIsProcessing(false);
        if (data) {
            let aiMessage = `Generated Invoice (Confidence: ${data.confidence}%):\nTitle: ${data.extractedTitle}\nSummary: ${data.extractedSummary}\nBuyer: ${data.buyerName || 'N/A'}, Amount: ${data.amount || 'N/A'} ${data.currency || ''}.`;
            let messageActions: ChatMessage['actions'] = [];

            if (data.confidence >= 80) {
                 messageActions.push({
                    label: 'Create Invoice on Request Network (Preview)',
                    type: 'button',
                    onClick: () => {
                      const params = new URLSearchParams();
                      if (data.invoiceNumber) params.set('invoiceNumber', data.invoiceNumber);
                      if (data.issueDate) params.set('issueDate', new Date(data.issueDate).toISOString());
                      if (data.dueDate) params.set('dueDate', new Date(data.dueDate).toISOString());
                      if (data.sellerName) params.set('sellerBusinessName', data.sellerName);
                      if (data.buyerName) params.set('buyerBusinessName', data.buyerName);
                      params.set('paymentType', 'crypto');
                      if (data.currency) params.set('currency', data.currency);
                      params.set('network', 'base');
                       if (data.extractedSummary) params.set('note', data.extractedSummary);
                      if (data.items && data.items.length > 0) {
                        const requestNetworkItems = data.items.map((item, index) => ({
                          id: index + 1,
                          name: item.name,
                          quantity: item.quantity || 1,
                          unitPrice: item.unitPrice?.toString() || "0",
                          tax: 0, 
                        }));
                        params.set('items', JSON.stringify(requestNetworkItems));
                      }
                      window.open(`/dashboard/create-invoice?${params.toString()}`, '_blank');
                    }
                 });
                 // Add button to actually create the invoice via tRPC
                 messageActions.push({
                    label: 'Submit to Request Network',
                    type: 'button',
                    onClick: () => {
                      if (!data || !data.currency || !data.amount) {
                        addAiMessage('Missing critical invoice data (amount, currency) to submit to Request Network.');
                        return;
                      }
                      const payeeAddress = user?.wallet?.address;
                      if (!payeeAddress) {
                        addAiMessage('Could not determine your wallet address. Please ensure your wallet is connected.');
                        return;
                      }
                      createInvoiceOnRNMutation.mutate({
                        ...data,
                        payeeAddress: payeeAddress,
                        network: 'base',
                      });
                    },
                    disabled: createInvoiceOnRNMutation.isPending,
                 });
            }
            
            addAiMessage(aiMessage, messageActions.length > 0 ? messageActions : undefined);

            const newCardFromText: InboxCardType = {
              id: uuidv4(),
              icon: 'invoice',
              title: data.extractedTitle || (data.buyerName ? `Invoice for ${data.buyerName}` : 'Generated Invoice'),
              subtitle: data.extractedSummary || `Amount: ${data.amount || 'N/A'} ${data.currency || ''}, Due: ${data.dueDate || 'N/A'}`,
              confidence: data.confidence,
              status: 'pending',
              blocked: false,
              timestamp: new Date().toISOString(),
              rationale: data.aiRationale || 'Invoice generated from text input via AI Assistant.',
              codeHash: 'N/A',
              chainOfThought: [
                `User input: "${(generateInvoiceTextMutation.variables as any)?.text || 'User text not captured'}"`,
                data.aiRationale || `AI generated structured data with ${data.confidence}% confidence.`
              ],
              impact: { currentBalance: 0, postActionBalance: 0 },
              logId: `text-gen-${uuidv4()}`,
              sourceType: 'ai_generated',
              sourceDetails: {
                name: 'AI Text Input',
                identifier: (generateInvoiceTextMutation.variables as any)?.text?.substring(0,50) || 'Text Input',
              },
              parsedInvoiceData: data,
              comments: [{
                 id: uuidv4(), 
                 text: aiMessage, 
                 userId: 'ai_assistant_id', 
                 authorName: 'AI Assistant', 
                 role: 'ai', 
                 timestamp: new Date().toISOString() 
              }],
              isAiSuggestionPending: false,
            };
            useInboxStore.getState().addCard(newCardFromText);
            addAiMessage("I've added this generated invoice to your inbox.");

        } else {
            addAiMessage('Sorry, I could not generate an invoice from that text.');
        }
    },
    onError: (error) => {
        setIsProcessing(false);
        addAiMessage(`Error generating invoice: ${error.message}`);
    }
  });

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    const userMessageText = inputText;
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    addAiMessage('Processing your request...');
    generateInvoiceTextMutation.mutate({ text: userMessageText });
  };

  const handleExtractFromSelectedEmail = () => {
    if (selectedEmailData && selectedEmailData.body) {
      addAiMessage(`Ok, I'll try to process the document from email: "${selectedEmailData.subject || selectedEmailData.emailId}"...`);
      processDocumentMutation.mutate({
        emailSubject: selectedEmailData.subject,
        emailBodyText: selectedEmailData.body,
      });
    } else {
      addAiMessage('Please select an email with content to process, or ensure it has a body.');
    }
  };

  useEffect(() => {
    setMessages([]);
    if (selectedEmailData) {
      addAiMessage(`Selected email: "${selectedEmailData.subject || selectedEmailData.emailId}". You can process its content or type a message to generate an invoice.`);
    } else {
      addAiMessage("Type a message to generate an invoice, or select an email from the list to process its details.");
    }
  }, [selectedEmailData]);

  function mapProcessedDocTypeToIcon(docType: AiProcessedDocument['documentType']): InboxCardType['icon'] {
      switch (docType) {
          case 'invoice': return 'invoice';
          case 'receipt': return 'receipt';
          case 'payment_reminder': return 'bell';
          case 'other_document': return 'file-text';
          default: return 'other';
      }
  }

  return (
    <div className="flex flex-col h-full border-l bg-slate-50 dark:bg-slate-900/50">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        {selectedEmailData && (
            <Button 
                size="sm" 
                variant="outline" 
                onClick={handleExtractFromSelectedEmail}
                disabled={isProcessing || processDocumentMutation.isPending}
            >
              {isProcessing || processDocumentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1"/> : <Sparkles className="h-4 w-4 mr-1"/>}
              Process Selected Email
            </Button>
        )}
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-2 flex flex-col space-y-1.5">
                  {msg.actions.map((action, index) => (
                    <Button 
                      key={index} 
                      size="sm" 
                      variant={action.type === 'button' ? 'secondary' : 'link'}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className="justify-start text-left h-auto py-1.5 px-2.5"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground/70 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground" title="Attach file (future feature)">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input 
            type="text" 
            placeholder="Type message or invoice details..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !generateInvoiceTextMutation.isPending && !processDocumentMutation.isPending && handleSendMessage()}
            className="flex-1"
            disabled={generateInvoiceTextMutation.isPending || processDocumentMutation.isPending || createInvoiceOnRNMutation.isPending || isProcessing}
          />
          <Button onClick={handleSendMessage} disabled={!inputText.trim() || generateInvoiceTextMutation.isPending || processDocumentMutation.isPending || createInvoiceOnRNMutation.isPending || isProcessing}>
            {(isProcessing && (generateInvoiceTextMutation.isPending || processDocumentMutation.isPending || createInvoiceOnRNMutation.isPending)) ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
} 