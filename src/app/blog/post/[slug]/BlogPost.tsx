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
  
  useEffect(() => {
    setFormattedDate(format(new Date(post.date), "MMMM dd, yyyy"));
    
    // Calculate reading time (average reading speed: 200 words per minute)
    const wordCount = post.content?.split(/\s+/).length || 0;
    const readingTimeMinutes = Math.ceil(wordCount / 200);
    setReadingTime(`${readingTimeMinutes} min read`);
    
    // Add scroll event listener to show/hide the scroll button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.date, post.content]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
    <div className="min-h-screen bg-gradient-to-b from-[#0d1117] to-[#121820] text-white px-4 md:px-8 lg:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200 mb-8 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform duration-200">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Blog
        </Link>
        
        <article className="bg-[#121920] rounded-xl shadow-xl p-6 md:p-10 mb-12">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-400">
              <time dateTime={post.date}>{formattedDate}</time>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              <span>{readingTime}</span>
              
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Link 
                        key={tag} 
                        href={`/blog/tag/${tag}`}
                        className="inline-block px-2 py-1 bg-[#1c2835] rounded-md text-xs font-medium hover:bg-[#243040] transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>
          
          {/* Main content with responsive layout */}
          <div className="lg:flex lg:gap-8">
            {/* Table of contents - desktop sidebar */}
            {!hasTocPlaceholder && (
              <div className="hidden lg:block lg:w-1/4 lg:flex-shrink-0 sticky top-6 self-start">
                {tocComponent}
              </div>
            )}
            
            {/* Table of contents - mobile (at the top) */}
            {!hasTocPlaceholder && (
              <div className="lg:hidden mb-8">
                {tocComponent}
              </div>
            )}
            
            {/* Article content */}
            <div className={`markdown-content ${!hasTocPlaceholder ? 'lg:w-3/4' : 'w-full'}`}>
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
                                    return <code className="bg-[#1a2233] text-white px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>;
                                  }
                                  return <code className="text-red-500" {...props}>{children}</code>;
                                },
                                // Add anchor tags to headings
                                h1: ({ children, ...props }) => {
                                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                  return (
                                    <h1 id={id as string} className="group flex items-center" {...props}>
                                      {children}
                                      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-primary">#</span>
                                      </a>
                                    </h1>
                                  );
                                },
                                h2: ({ children, ...props }) => {
                                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                  return (
                                    <h2 id={id as string} className="group flex items-center" {...props}>
                                      {children}
                                      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-primary">#</span>
                                      </a>
                                    </h2>
                                  );
                                },
                                h3: ({ children, ...props }) => {
                                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                  return (
                                    <h3 id={id as string} className="group flex items-center" {...props}>
                                      {children}
                                      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-primary">#</span>
                                      </a>
                                    </h3>
                                  );
                                },
                                a: ({ children, href, ...props }) => (
                                  <a 
                                    href={href} 
                                    className="text-primary hover:text-primary/80 underline decoration-dotted underline-offset-2"
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
                          return <code className="bg-[#1a2233] text-white px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>;
                        }
                        return <code className="text-red-500" {...props}>{children}</code>;
                      },
                      // Add anchor tags to headings
                      h1: ({ children, ...props }) => {
                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return (
                          <h1 id={id as string} className="group flex items-center" {...props}>
                            {children}
                            <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-primary">#</span>
                            </a>
                          </h1>
                        );
                      },
                      h2: ({ children, ...props }) => {
                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return (
                          <h2 id={id as string} className="group flex items-center" {...props}>
                            {children}
                            <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-primary">#</span>
                            </a>
                          </h2>
                        );
                      },
                      h3: ({ children, ...props }) => {
                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return (
                          <h3 id={id as string} className="group flex items-center" {...props}>
                            {children}
                            <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-primary">#</span>
                            </a>
                          </h3>
                        );
                      },
                      a: ({ children, href, ...props }) => (
                        <a 
                          href={href} 
                          className="text-primary hover:text-primary/80 underline decoration-dotted underline-offset-2"
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
        
        {/* Post navigation for Previous/Next post (placeholder) */}
        <div className="border-t border-[#2a3441] mt-10 pt-8">
          <h3 className="text-xl font-bold mb-4">Continue Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/blog" 
              className="group p-4 rounded-lg bg-[#121920] border border-[#2a3441] hover:bg-[#1a2229] transition-colors"
            >
              <div className="flex items-center text-primary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform duration-200">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                <span className="text-sm">All Posts</span>
              </div>
              <p className="text-sm text-gray-300">Browse more articles</p>
            </Link>
            
            <Link 
              href="/blog" 
              className="group p-4 rounded-lg bg-[#121920] border border-[#2a3441] hover:bg-[#1a2229] transition-colors text-right"
            >
              <div className="flex items-center justify-end text-primary mb-2">
                <span className="text-sm">Featured Posts</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
              <p className="text-sm text-gray-300">Explore featured content</p>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-6 p-3 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all duration-300 z-50 ${
          showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    </div>
  );
} 