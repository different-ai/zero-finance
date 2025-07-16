'use client';

import React from 'react';
import { MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

export function AICFODemo() {
  const questions = [
    "How much did I spend on software last quarter?",
    "What's my average invoice payment time?",
    "Should I increase my quarterly tax savings?",
    "Which clients are my most profitable?"
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 sm:p-8 h-[350px] sm:h-[400px] flex flex-col relative overflow-hidden">
      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
        Coming Soon
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Sparkles className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">AI CFO Assistant</h3>
          <p className="text-xs text-gray-600">Always one question away</p>
        </div>
      </div>
      
      <div className="flex-1 space-y-3">
        {questions.map((question, index) => (
          <div key={index} className="bg-white/80 backdrop-blur rounded-lg p-3 flex items-center gap-3 hover:bg-white transition-colors cursor-pointer group">
            <MessageCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-gray-700 flex-1">{question}</p>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-white/60 backdrop-blur rounded-lg border border-blue-200">
        <p className="text-xs text-center text-blue-800">
          Get instant answers about your finances with our AI-powered CFO
        </p>
      </div>
    </div>
  );
}