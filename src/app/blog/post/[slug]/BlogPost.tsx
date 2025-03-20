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
  
  useEffect(() => {
    setFormattedDate(format(new Date(post.date), "MMMM dd, yyyy"));
  }, [post.date]);

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
    <div className="min-h-screen bg-[#0d1117] text-white px-6 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/blog"
          className="text-primary hover:underline text-lg mb-8 block"
        >
          ← Back to Blog
        </Link>
        <article>
          <h1 className="text-5xl font-extrabold mb-6">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-12">{formattedDate}</p>
          
          {/* Show TOC at the top if no placeholder exists */}
          {!hasTocPlaceholder && tocComponent}
          
          <div className="markdown-content">
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
                                  return <code className="bg-gray-800 text-white px-1 rounded" {...props}>{children}</code>;
                                }
                                return <code className="text-red-500" {...props}>{children}</code>;
                              },
                              // Add anchor tags to headings
                              h1: ({ children, ...props }) => {
                                const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                return (
                                  <h1 id={id as string} {...props}>{children}</h1>
                                );
                              },
                              h2: ({ children, ...props }) => {
                                const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                return (
                                  <h2 id={id as string} {...props}>{children}</h2>
                                );
                              },
                              h3: ({ children, ...props }) => {
                                const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                return (
                                  <h3 id={id as string} {...props}>{children}</h3>
                                );
                              }
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
                        return <code className="bg-gray-800 text-white px-1 rounded" {...props}>{children}</code>;
                      }
                      return <code className="text-red-500" {...props}>{children}</code>;
                    },
                    // Add anchor tags to headings
                    h1: ({ children, ...props }) => {
                      const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return (
                        <h1 id={id as string} {...props}>{children}</h1>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return (
                        <h2 id={id as string} {...props}>{children}</h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return (
                        <h3 id={id as string} {...props}>{children}</h3>
                      );
                    }
                  }}
                  remarkPlugins={[remarkGfm]}
                >
                  {part.content}
                </ReactMarkdown>
              );
            })}
          </div>
        </article>
      </div>
    </div>
  );
} 