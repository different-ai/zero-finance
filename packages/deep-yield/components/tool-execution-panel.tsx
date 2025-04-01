import { UIMessage } from 'ai';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToolIndicator } from './tool-indicator';
import { cn } from '../lib/utils'; // Type for tracking tool execution progress
interface ToolExecution { toolName: string; toolCallId: string; state: 'partial-call' | 'call' | 'result'; startTime: number;
} interface ToolExecutionPanelProps { message?: UIMessage | null; isStreaming: boolean; className?: string;
} export function ToolExecutionPanel({ message, isStreaming, className,
}: ToolExecutionPanelProps): JSX.Element { 
  const [activeTools, setActiveTools] = useState<ToolExecution[]>([]); 
  const [isResearchMode, setIsResearchMode] = useState(false); 
  
  // This effect tracks tool executions whenever the message changes
  useEffect(() => { 
    if (!message || !message.parts) { 
      setActiveTools([]); 
      return; 
    } 
    
    // Extract tool invocations from the current message
    const currentTools: ToolExecution[] = []; 
    let foundPlanningTool = false; 
    
    message.parts.forEach(part => { 
      if (part.type !== 'tool-invocation') return; 
      const { toolInvocation } = part as any; 
      const { toolName, toolCallId, state } = toolInvocation; 
      
      // Only track tools that are still processing
      if (state === 'partial-call' || state === 'call') { 
        // Find existing tool in current activeTools state (to preserve startTime) 
        const existingTool = activeTools.find(tool => tool.toolCallId === toolCallId); 
        currentTools.push({ 
          toolName, 
          toolCallId, 
          state, 
          startTime: existingTool?.startTime || Date.now(), 
        }); 
        
        if (toolName === 'planYieldResearch') { 
          foundPlanningTool = true; 
        } 
      } 
    }); 
    
    if (foundPlanningTool) { 
      setIsResearchMode(true); 
    } 
    
    if (currentTools.length > 0) { 
      setActiveTools(currentTools); 
    } else if (!isStreaming) { 
      // Clear active tools when streaming stops and no tools are active
      setActiveTools([]); 
      // Reset research mode if streaming stops and no tools are running
      setIsResearchMode(false); 
    } 
    // Removed activeTools from the dependency array to prevent infinite renders
  }, [message, isStreaming, activeTools]); 
  
  // Don't show the panel if there are no active tools and we're not streaming
  if (activeTools.length === 0 && !isStreaming) { 
    return <div></div>; 
  } return ( <AnimatePresence> {(activeTools.length > 0 || isStreaming) && ( <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }} className={cn( "fixed bottom-20 md:bottom-28 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md", className )} > <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-4 py-3"> <h4 className="text-sm font-semibold text-gray-700 mb-2"> {isResearchMode ? "Research in progress..." : activeTools.length > 0 ? `Tools Running (${activeTools.length})` : "AI is thinking..."} </h4> <AnimatePresence> {activeTools.map(tool => ( <motion.div key={tool.toolCallId} layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mb-2 last:mb-0" > <ToolIndicator toolName={tool.toolName} state={tool.state} animate={false} /> {/* Simple progress bar */} <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden"> <motion.div className="h-full bg-blue-500 rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 10, ease: "linear" }} /> </div> </motion.div> ))} {activeTools.length === 0 && isStreaming && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-1" > <div className="flex space-x-1"> <div className="size-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} /> <div className="size-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} /> <div className="size-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} /> </div> </motion.div> )} </AnimatePresence> </div> </motion.div> )} </AnimatePresence> );
} 