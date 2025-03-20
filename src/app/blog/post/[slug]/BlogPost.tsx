"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { format } from "date-fns";
import { CodeBlock } from "@/lib/CodeBlock";
import { Post } from "@/types/types";
import { useState, useEffect } from "react";
import React from "react";

// Separate code blocks from regular markdown content
function preprocessMarkdown(content: string) {
  // Split by code blocks (```code```)
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, i) => {
    // Check if this part is a code block
    if (part.startsWith('```') && part.endsWith('```')) {
      // Extract language and code
      const firstLineEnd = part.indexOf('\n');
      const language = part.substring(3, firstLineEnd).trim();
      const code = part.substring(firstLineEnd + 1, part.length - 3).trim();
      
      // Return a placeholder that we'll replace with our CodeBlock
      return { type: 'code', language, code, id: `code-block-${i}` };
    }
    
    // Return regular markdown content
    return { type: 'markdown', content: part, id: `markdown-${i}` };
  });
}

export default function BlogPost({ post }: { post: Post }) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  
  useEffect(() => {
    setFormattedDate(format(new Date(post.date), "MMMM dd, yyyy"));
  }, [post.date]);

  // Process markdown content to separate code blocks
  const contentParts = preprocessMarkdown(post.content || "");

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
          
          <div className="markdown-content">
            {contentParts.map((part) => {
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
              
              // Render regular markdown content
              return (
                <ReactMarkdown
                  key={part.id}
                  components={{
                    // Only handle inline code now, as code blocks are handled separately
                    code: ({ inline, children, ...props }: { inline?: boolean; children: React.ReactNode; className?: string }) => {
                      if (inline) {
                        return <code className="bg-gray-800 text-white px-1 rounded" {...props}>{children}</code>;
                      }
                      // This should never be reached with our pre-processing
                      return <code className="text-red-500" {...props}>{children}</code>;
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