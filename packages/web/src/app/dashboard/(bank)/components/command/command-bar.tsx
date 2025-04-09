'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowUpRight } from 'lucide-react';
import { processAgentCommand } from '../../lib/agent-service';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandBar() {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggestions for financial operations
  const suggestions = [
    "Find yield opportunities",
    "How do taxes work in Luxembourg?",
    "Analyze my spending",
    "Convert 1000 USDC to EUR"
  ];

  useEffect(() => {
    // Focus the input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      // In a real app, this would call an API to process the command
      await processAgentCommand(command);
      
      // Add command to recent commands
      setRecentCommands(prev => [command, ...prev].slice(0, 5));
      setCommand('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCommand(suggestion);
    // Focus the input after selecting a suggestion
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="p-4 bg-white border border-primary/20 rounded-lg shadow-sm mb-6">
      <div className="flex items-center mb-3">
        <Bot className="h-5 w-5 text-primary mr-2" />
        <span className="font-medium text-gray-800">Your Personal Financial Assistant</span>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Ask your financial assistant..."
          className="w-full p-3 pr-12 rounded-lg border border-primary/30 bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/30 placeholder:text-gray-400 text-gray-800"
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
        >
          {isProcessing ? (
            <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <ArrowUpRight className="h-5 w-5" />
          )}
        </button>
      </form>
      
      <AnimatePresence>
        {(isFocused || recentCommands.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
              
              {recentCommands.map((cmd, index) => (
                <button
                  key={`recent-${index}`}
                  onClick={() => setCommand(cmd)}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}