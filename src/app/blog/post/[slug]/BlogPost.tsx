"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { format } from "date-fns";
import { CodeBlock } from "@/lib/CodeBlock";
import { Post } from "@/types/types";
import { useState, useEffect } from "react";
import React from "react";
import { TableOfContents, TOC_PLACEHOLDER } from "@/components/TableOfContents";

function preprocessMarkdown(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const firstLineEnd = part.indexOf('\n');
      const language = part.substring(3, firstLineEnd).trim();
      const code = part.substring(firstLineEnd + 1, part.length - 3).trim();
      
      return { type: 'code', language, code, id: `code-block-${i}` };
    }
    
    return { type: 'markdown', content: part, id: `markdown-${i}` };
  });
}

export default function BlogPost({ post }: { post: Post }) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [readingTime, setReadingTime] = useState<string>("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setFormattedDate(format(new Date(post.date), "MMMM dd, yyyy"));
    
    const wordCount = post.content?.split(/\s+/).length || 0;
    const readingTimeMinutes = Math.ceil(wordCount / 200);
    setReadingTime(`${readingTimeMinutes} min read`);
    
    const handleScroll = () => {
      if (window.scrollY > 300 !== showScrollButton) {
        setShowScrollButton(window.scrollY > 300);
      }
      
      if (progressBarRef.current) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          const progress = (window.scrollY / scrollHeight);
          progressBarRef.current.style.transform = `scaleX(${progress})`;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.date, post.content, showScrollButton]); // Added showScrollButton as dependency

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const tocComponent = <TableOfContents content={post.content || ""} />;
  
  const hasTocPlaceholder = post.content?.includes(TOC_PLACEHOLDER) || false;
  
  const processContent = (content: string) => {
    if (!content.includes(TOC_PLACEHOLDER)) return content;
    
    return content.replace(TOC_PLACEHOLDER, '');
  };
  
  const contentParts = preprocessMarkdown(post.content || "");
  
  const processedParts = contentParts.map(part => {
    if (part.type === 'markdown' && part.content.includes(TOC_PLACEHOLDER)) {
      const splitContent = part.content.split(TOC_PLACEHOLDER);
      return {
        ...part,
        content: processContent(part.content),
        tocPositions: splitContent.length - 1,
        splitContent
      };
    }
    return part;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-b from-[#0d1117] to-[#121820]' : 'bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/blog"
            className={`inline-flex items-center gap-2 font-medium transition-colors duration-200 group ${
              darkMode ? 'text-primary hover:text-primary/80' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform duration-200">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Blog
          </Link>
          
          <button 
            onClick={toggleDarkMode} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'} transition-colors duration-200 hover:${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>
        
        <article className={`${darkMode ? 'bg-[#121920] shadow-lg' : 'bg-white shadow-md'} rounded-xl p-6 md:p-10 mb-12 transition-colors duration-300`}>
          {/* Header */}
          <header className="mb-10 max-w-3xl mx-auto">
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 ${
              darkMode 
                ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300' 
                : 'text-gray-800'
            }`}>
              {post.title}
            </h1>
            
            <div className={`flex flex-wrap items-center gap-2 md:gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <time dateTime={post.date} className="font-medium">{formattedDate}</time>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></span>
              <span>{readingTime}</span>
              
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Link 
                        key={tag} 
                        href={`/blog/tag/${tag}`}
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                          darkMode 
                            ? 'bg-[#1c2835] hover:bg-[#243040] text-blue-300' 
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        }`}
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>
          
          {/* Reading Progress Bar */}
          <div className={`fixed top-0 left-0 w-full h-1 z-50 ${darkMode ? 'bg-gray-800/20' : 'bg-gray-200'}`}>
            <div 
              ref={progressBarRef}
              className="h-full bg-blue-500 origin-left"
              style={{ transform: 'scaleX(0)' }}
            ></div>
          </div>
          
          {/* Main content with responsive layout */}
          <div className="lg:flex lg:gap-8 relative">
            {/* Table of contents - desktop sidebar */}
            {!hasTocPlaceholder && (
              <div className="hidden lg:block lg:w-1/4 lg:flex-shrink-0 sticky top-6 self-start">
                <div className={`p-5 rounded-lg transition-all duration-300 shadow-md overflow-hidden ${
                  darkMode ? 'bg-[#141c28]/90 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
                }`}>
                  <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${
                    darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'
                  }`}>Contents</h3>
                  <div className={`max-h-[calc(100vh-220px)] overflow-y-auto pr-1 ${darkMode ? 'markdown-content' : 'markdown-content light-mode'}`}>
                    {tocComponent}
                  </div>
                </div>
              </div>
            )}
            
            {/* Table of contents - mobile (at the top) */}
            {!hasTocPlaceholder && (
              <div className="lg:hidden mb-8">
                <details className={`transition-all duration-300 rounded-lg overflow-hidden ${
                  darkMode ? 'bg-[#141c28]/90 text-white' : 'bg-white/95 text-gray-800'
                } shadow-md`}>
                  <summary className={`p-4 font-semibold text-lg cursor-pointer transition-colors ${
                    darkMode ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'
                  }`}>
                    Contents
                  </summary>
                  <div className={`px-4 pb-4 ${darkMode ? 'markdown-content' : 'markdown-content light-mode'}`}>
                    {tocComponent}
                  </div>
                </details>
              </div>
            )}
            
            {/* Article content */}
            <div className={`markdown-content ${!hasTocPlaceholder ? 'lg:w-3/4' : 'w-full'} ${!darkMode ? 'light-mode' : ''}`}>
              {processedParts.map((part) => {
                // Render code blocks with our custom component
                if (part.type === 'code') {
                  return (
                    <CodeBlock 
                      key={part.id} 
                      className={`language-${part.language}`}
                    >
                      {part.code}
                    </CodeBlock>
                  );
                }
                
                // Handle markdown parts that had TOC placeholders
                if (part.type === 'markdown' && 'splitContent' in part) {
                  return (
                    <React.Fragment key={part.id}>
                      {part.splitContent.map((content, index) => (
                        <React.Fragment key={`${part.id}-${index}`}>
                          {index > 0 && tocComponent}
                          {content && (
                            <ReactMarkdown
                              components={{
                                // Handle inline code
                                code: ({ inline, children, ...props }: { inline?: boolean; children: React.ReactNode; className?: string }) => {
                                  if (inline) {
                                    return <code className={`px-1.5 py-0.5 rounded text-sm ${darkMode ? 'bg-[#1a2233] text-white' : 'bg-gray-100 text-gray-800'}`} {...props}>{children}</code>;
                                  }
                                  return <code className="text-red-500" {...props}>{children}</code>;
                                },
                                // Add anchor tags to headings
                                h1: ({ children, ...props }) => {
                                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                  return (
                                    <h1 id={id as string} className="group flex items-start" {...props}>
                                      {children}
                                      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Link to ${children}`}>
                                        <span className="text-primary">#</span>
                                      </a>
                                    </h1>
                                  );
                                },
                                h2: ({ children, ...props }) => {
                                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                  return (
                                    <h2 id={id as string} className="group flex items-start" {...props}>
                                      {children}
                                      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Link to ${children}`}>
                                        <span className="text-primary">#</span>
                                      </a>
                                    </h2>
                                  );
                                },
                                h3: ({ children, ...props }) => {
                                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                  return (
                                    <h3 id={id as string} className="group flex items-start" {...props}>
                                      {children}
                                      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Link to ${children}`}>
                                        <span className="text-primary">#</span>
                                      </a>
                                    </h3>
                                  );
                                },
                                a: ({ children, href, ...props }) => (
                                  <a 
                                    href={href} 
                                    className={`underline-offset-2 ${darkMode ? 'text-primary hover:text-primary/80 decoration-dotted' : 'text-blue-600 hover:text-blue-800 decoration-dotted'}`}
                                    target={href?.startsWith('http') ? '_blank' : undefined}
                                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    {...props}
                                  >
                                    {children}
                                    {href?.startsWith('http') && (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                      </svg>
                                    )}
                                  </a>
                                ),
                              }}
                              remarkPlugins={[remarkGfm]}
                            >
                              {content}
                            </ReactMarkdown>
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  );
                }
                
                // Render regular markdown content
                return (
                  <ReactMarkdown
                    key={part.id}
                    components={{
                      // Handle inline code
                      code: ({ inline, children, ...props }: { inline?: boolean; children: React.ReactNode; className?: string }) => {
                        if (inline) {
                          return <code className={`px-1.5 py-0.5 rounded text-sm ${darkMode ? 'bg-[#1a2233] text-white' : 'bg-gray-100 text-gray-800'}`} {...props}>{children}</code>;
                        }
                        return <code className="text-red-500" {...props}>{children}</code>;
                      },
                      // Add anchor tags to headings
                      h1: ({ children, ...props }) => {
                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return (
                          <h1 id={id as string} className="group flex items-start" {...props}>
                            {children}
                            <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Link to ${children}`}>
                              <span className="text-primary">#</span>
                            </a>
                          </h1>
                        );
                      },
                      h2: ({ children, ...props }) => {
                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return (
                          <h2 id={id as string} className="group flex items-start" {...props}>
                            {children}
                            <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Link to ${children}`}>
                              <span className="text-primary">#</span>
                            </a>
                          </h2>
                        );
                      },
                      h3: ({ children, ...props }) => {
                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return (
                          <h3 id={id as string} className="group flex items-start" {...props}>
                            {children}
                            <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Link to ${children}`}>
                              <span className="text-primary">#</span>
                            </a>
                          </h3>
                        );
                      },
                      a: ({ children, href, ...props }) => (
                        <a 
                          href={href} 
                          className={`underline-offset-2 ${darkMode ? 'text-primary hover:text-primary/80 decoration-dotted' : 'text-blue-600 hover:text-blue-800 decoration-dotted'}`}
                          target={href?.startsWith('http') ? '_blank' : undefined}
                          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          {...props}
                        >
                          {children}
                          {href?.startsWith('http') && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          )}
                        </a>
                      ),
                    }}
                    remarkPlugins={[remarkGfm]}
                  >
                    {part.content}
                  </ReactMarkdown>
                );
              })}
            </div>
          </div>
        </article>
        
        {/* Author bio */}
        <div className={`max-w-3xl mx-auto ${darkMode ? 'bg-[#161f2c]' : 'bg-blue-50'} rounded-xl p-6 mt-8 transition-colors duration-300`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-blue-200'}`}>
              {/* Author Image */}
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                MB
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Mehrshad Baqerzadegan
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Sharing thoughts on technology and best practices.
              </p>
            </div>
          </div>
        </div>
        
        {/* Scroll to top button */}
        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-white hover:bg-gray-100 text-blue-600 border border-gray-300'
            }`}
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 