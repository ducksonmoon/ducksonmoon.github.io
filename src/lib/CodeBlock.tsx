"use client";

import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/solid";

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);
  const language = className?.replace("language-", "") || "";
  const codeString = String(children).replace(/\n$/, "");
  const lineCount = codeString.split("\n").length;
  
  // Determine if code block is long enough to need expansion toggle
  const needsExpansion = lineCount > 15;

  const handleCopy = () => {
    if (children) {
      navigator.clipboard.writeText(codeString).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const toggleLineNumbers = () => {
    setShowLineNumbers(!showLineNumbers);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    // Scroll to center of expanded code block when toggled
    if (isExpanded && codeRef.current) {
      codeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isExpanded]);

  if (inline) {
    return (
      <code className="bg-[#1a2233] text-white px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  // Create a language badge with appropriate color
  const getLanguageColor = () => {
    const colors: Record<string, string> = {
      javascript: "bg-yellow-600",
      typescript: "bg-blue-600",
      jsx: "bg-cyan-600",
      tsx: "bg-cyan-700",
      css: "bg-pink-600",
      html: "bg-orange-600",
      python: "bg-green-600",
      java: "bg-red-600",
      ruby: "bg-red-700",
      go: "bg-blue-500",
      rust: "bg-orange-700",
      php: "bg-purple-600",
      csharp: "bg-green-700",
      c: "bg-blue-800",
      cpp: "bg-blue-700",
      json: "bg-gray-600",
      markdown: "bg-gray-700",
      bash: "bg-gray-800",
      shell: "bg-gray-800",
      sql: "bg-blue-900",
    };
    
    return colors[language] || "bg-gray-700";
  };

  return (
    <div 
      ref={codeRef}
      className={`relative group my-8 rounded-xl overflow-hidden transition-all duration-300 border border-[#2a3038] shadow-lg`}
    >
      {/* Header with language label and controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1e24] border-b border-[#2a3038]">
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-md text-white ${getLanguageColor()}`}>
            {language || "code"}
          </span>
          <span className="text-xs text-gray-400">{lineCount} lines</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Toggle line numbers button */}
          <button 
            onClick={toggleLineNumbers} 
            className="text-xs bg-[#2a3038] hover:bg-[#343c4a] text-gray-300 px-2 py-1 rounded transition-colors duration-200"
            title={showLineNumbers ? "Hide line numbers" : "Show line numbers"}
          >
            {showLineNumbers ? "Hide #" : "Show #"}
          </button>
          
          {/* Expand/collapse button (only for longer code blocks) */}
          {needsExpansion && (
            <button 
              onClick={toggleExpand} 
              className="text-xs bg-[#2a3038] hover:bg-[#343c4a] text-gray-300 px-2 py-1 rounded transition-colors duration-200"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          )}
          
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs bg-[#2a3038] hover:bg-[#343c4a] text-gray-300 px-2 py-1 rounded transition-colors duration-200"
            title="Copy code"
          >
            {isCopied ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <ClipboardIcon className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Code container with gradient fade for long code blocks */}
      <div 
        className="relative"
        style={{
          maxHeight: needsExpansion && !isExpanded ? '400px' : 'none',
          overflow: needsExpansion && !isExpanded ? 'hidden' : 'visible'
        }}
      >
        <SyntaxHighlighter
          language={language}
          style={coldarkDark}
          customStyle={{
            margin: 0,
            padding: "16px",
            backgroundColor: "#141821",
            borderRadius: 0,
            fontSize: "0.9rem",
            fontFamily: 'monospace',
          }}
          showLineNumbers={showLineNumbers}
        >
          {codeString}
        </SyntaxHighlighter>
        
        {/* Gradient fade for long code blocks */}
        {needsExpansion && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#141821] to-transparent pointer-events-none"></div>
        )}
      </div>
      
      {/* Show "Show more" button for long code blocks */}
      {needsExpansion && !isExpanded && (
        <button 
          onClick={toggleExpand}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#2a3038] hover:bg-[#343c4a] text-white text-sm px-4 py-1 rounded-full transition-colors duration-200 shadow-md flex items-center space-x-1 z-10"
        >
          <span>Show more</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};
