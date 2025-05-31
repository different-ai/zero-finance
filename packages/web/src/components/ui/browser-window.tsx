import React from 'react';

interface BrowserWindowProps {
  children: React.ReactNode;
  url?: string;
  title?: string;
  className?: string;
}

export function BrowserWindow({ 
  children, 
  url = "0.finance/dashboard", 
  title = "Zero Finance - AI Banking",
  className = ""
}: BrowserWindowProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden ${className}`}>
      {/* Browser Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        {/* Traffic Light Controls */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        
        {/* Address Bar */}
        <div className="flex items-center space-x-3">
          {/* Navigation arrows */}
          <div className="flex space-x-1">
            <button className="p-1 rounded hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-1 rounded hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="p-1 rounded hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          {/* URL Bar */}
          <div className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 text-green-500">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>https://{url}</span>
            </div>
          </div>
          
          {/* Browser menu */}
          <button className="p-1 rounded hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Browser Content */}
      <div className="bg-white min-h-[500px]">
        {children}
      </div>
    </div>
  );
} 