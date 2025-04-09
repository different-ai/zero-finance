'use client';

import { useState, useEffect } from 'react';
import { yieldOpportunities } from './mock-data';

// Define response types
export interface AgentResponse {
  id: string;
  content: string;
  type: 'text' | 'yield-opportunities' | 'tax-info' | 'error';
  data?: any;
  timestamp: Date;
}

// In-memory store for agent responses
// In a real app, this would be a more sophisticated state management solution
let responses: AgentResponse[] = [];
let listeners: (() => void)[] = [];

// Function to notify all listeners of state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Process commands and generate appropriate responses
export async function processAgentCommand(command: string): Promise<void> {
  // Create a unique ID for this response
  const responseId = crypto.randomUUID();
  
  try {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response: AgentResponse;
    
    if (command.toLowerCase().includes('yield') || command.toLowerCase().includes('investment')) {
      // Handle yield-related queries
      response = {
        id: responseId,
        content: 'I found several yield opportunities that match your criteria.',
        type: 'yield-opportunities',
        data: yieldOpportunities,
        timestamp: new Date()
      };
    } else if (command.toLowerCase().includes('tax') || command.toLowerCase().includes('regulation')) {
      // Handle tax regulation queries
      response = {
        id: responseId,
        content: 'Based on regulations in Luxembourg, here are the relevant tax considerations:',
        type: 'tax-info',
        data: {
          country: 'Luxembourg',
          corporateTaxRate: '24.94%',
          vatRate: '17%',
          witholdingTax: '15%',
          taxTreaties: ['Germany', 'France', 'Belgium', 'Netherlands'],
          notes: 'Luxembourg offers favorable tax treatment for holding companies and intellectual property.'
        },
        timestamp: new Date()
      };
    } else {
      // Default response for other commands
      response = {
        id: responseId,
        content: `I processed your request: "${command}". How else can I assist you today?`,
        type: 'text',
        timestamp: new Date()
      };
    }
    
    // Add response to our store
    responses = [...responses, response];
    
    // Notify listeners of the change
    notifyListeners();
    
  } catch (error) {
    // Handle errors
    const errorResponse: AgentResponse = {
      id: responseId,
      content: 'Sorry, I encountered an error processing your request.',
      type: 'error',
      timestamp: new Date()
    };
    
    responses = [...responses, errorResponse];
    notifyListeners();
  }
}

// Hook to subscribe to agent responses
export function useAgentResponses() {
  const [agentResponses, setAgentResponses] = useState<AgentResponse[]>(responses);
  
  useEffect(() => {
    // Update state when responses change
    const handleChange = () => {
      setAgentResponses([...responses]);
    };
    
    // Add listener
    listeners.push(handleChange);
    
    // Remove listener on cleanup
    return () => {
      listeners = listeners.filter(l => l !== handleChange);
    };
  }, []);
  
  return agentResponses;
}

// Clear all responses (useful for testing)
export function clearAgentResponses() {
  responses = [];
  notifyListeners();
}